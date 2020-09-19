import { useRef, useState, useEffect } from 'react';
import { parseQuery } from 'utils/query';
import { WebsocketConnectionEvent } from 'websockets-api/client/types';
import { createWebsocketClient } from 'websockets-api/client/websocket-client';
import { websocketsApiConfig } from 'websockets-api/client/config';
import { DoodleDataWithScore } from './doodle';

type GameState = {
    client: {
        _query: { [key: string]: undefined | string };
        room: string;
        role: 'debug' | 'viewer' | 'player';

        clientPlayer: PlayerProfile;
    };
    players: PlayerProfile[];
    doodles: DoodleDataWithScore[];
};
type PlayerProfile = {
    clientKey: string;
    name: string;
    emoji: string;
    isReady: boolean;
    isUser?: boolean;
};

const createClientStorage = () => {
    type ClientStorageData = {
        clientPlayer: PlayerProfile;
    };
    const CLIENT_STORAGE_KEY = `_DoodleGameClient`;
    const clientStorage = {
        load: (): null | ClientStorageData => {
            try {
                return JSON.parse(localStorage.getItem(CLIENT_STORAGE_KEY) ?? `NULL!{}`) as unknown as ClientStorageData;
            } catch{
                return null;
            }
        },
        save: (value: ClientStorageData): void => {
            localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(value));
        },
    };
    return {
        clientStorage,
    };
};
const createDefaultGameState = (): GameState => {
    const query = parseQuery(window.location.search);
    const parseRoom = (value: undefined | string) => value ?? `UnknownRoom`;
    const parseRole = (value: undefined | string): GameState['client']['role'] => {
        switch (value) {
            case `debug`: return `debug`;
            case `viewer`: return `viewer`;
            default: return `player`;
        }
    };

    const gameState: GameState = {
        client: {
            _query: query,
            room: parseRoom(query.room),
            role: parseRole(query.role),

            clientPlayer: {
                clientKey: (`${Math.random()}`).substr(2),
                name: ``,
                emoji: `👤`,
                isReady: false,
            },
        },
        players: [],
        doodles: [],
    };

    return gameState;
};

type DoodlePartyMessage = {
    timestamp: number;
    clientKey: string;
} & ({
    kind: 'syncRequest';
} | {
    kind: 'syncResponse';
    requestedClientKey: string;
    gameState: {
        players: PlayerProfile[];
        doodles: DoodleDataWithScore[];
    };
} | {
    kind: 'setPlayer';
    clientPlayer: {
        clientKey: string;
        name: string;
        emoji: string;
        isReady: boolean;
    };
});
const createMessageHandler = (gameState: GameState, refresh: () => void, send: (message: DoodlePartyMessage) => void) => {
    let syncResponseId = setTimeout(() => { });
    const handleMessage = (message: DoodlePartyMessage) => {
        if (message.kind === `setPlayer`) {
            let p = gameState.players.find(x => x.clientKey === message.clientPlayer.clientKey);
            if (!p) {
                p = { ...message.clientPlayer };
                gameState.players.push(p);
            }
            p.isUser = p.clientKey === gameState.client.clientPlayer.clientKey;
            p.name = message.clientPlayer.name;
            p.emoji = message.clientPlayer.emoji;
            p.isReady = message.clientPlayer.isReady;
            refresh();
            return;
        }

        // Ignore own messages
        if (message.clientKey === gameState.client.clientPlayer.clientKey) { return; }

        if (message.kind === `syncRequest`) {
            clearTimeout(syncResponseId);
            syncResponseId = setTimeout(() => {
                send({
                    kind: `syncResponse`,
                    requestedClientKey: message.clientKey,
                    gameState: {
                        players: gameState.players,
                        doodles: gameState.doodles,
                    },
                    clientKey: gameState.client.clientPlayer.clientKey,
                    timestamp: Date.now(),
                });
            }, Math.random() * 1000);
        }
        if (message.kind === `syncResponse`) {
            clearTimeout(syncResponseId);
            if (message.requestedClientKey !== gameState.client.clientPlayer.clientKey) {
                // Verify no data is missing
                if (message.gameState.players.length < gameState.players.length
                    || message.gameState.doodles.length < gameState.doodles.length
                ) {
                    // The response is wrong - correct the sender (and the original)
                    send({
                        kind: `syncResponse`,
                        requestedClientKey: message.clientKey,
                        gameState: {
                            players: gameState.players,
                            doodles: gameState.doodles,
                        },
                        clientKey: gameState.client.clientPlayer.clientKey,
                        timestamp: Date.now(),
                    });
                    send({
                        kind: `syncResponse`,
                        requestedClientKey: message.requestedClientKey,
                        gameState: {
                            players: gameState.players,
                            doodles: gameState.doodles,
                        },
                        clientKey: gameState.client.clientPlayer.clientKey,
                        timestamp: Date.now(),
                    });
                }
                return;
            }

            gameState.players = message.gameState.players;
            gameState.players.forEach(x => { x.isUser = false; });
            const p = gameState.players.find(x => x.clientKey === gameState.client.clientPlayer.clientKey);
            if (p) { p.isUser = true; }
            gameState.doodles = message.gameState.doodles;
        }
    };

    return {
        handleMessage,
    };
};

export const useDoodlePartyController = () => {
    const gameStateRef = useRef(createDefaultGameState());
    const gameState = gameStateRef.current;

    const [loading, setLoading] = useState(true);
    const [renderId, setRenderId] = useState(0);
    const refresh = () => {
        setRenderId(s => s + 1);
    };

    const loadClientPlayerFromStorage = () => {
        // Load Client Player
        const { clientStorage } = createClientStorage();
        const s = clientStorage.load();
        if (s) {
            gameState.client.clientPlayer = {
                clientKey: s.clientPlayer.clientKey,
                name: s.clientPlayer.name,
                emoji: s.clientPlayer.emoji,
                isReady: false,
                isUser: true,
            };
        }
        refresh();
    };


    const [messages, setMessages] = useState([] as (DoodlePartyMessage & { receivedAtTimestamp: number })[]);
    const [events, setEvents] = useState([] as WebsocketConnectionEvent[]);
    const send = useRef(null as null | ((message: DoodlePartyMessage) => void));
    const messageHandler = useRef(createMessageHandler(gameState, refresh, (message) => send.current?.(message)));

    useEffect(() => {
        loadClientPlayerFromStorage();

        const connection = createWebsocketClient({ websocketsApiUrl: websocketsApiConfig.websocketsApiUrl })
            .connect<DoodlePartyMessage>({ key: gameState.client.room });

        const unsubMessages = connection.subscribeMessages(message => {
            messageHandler.current.handleMessage(message);
            setMessages(s => [...s, { ...message, receivedAtTimestamp: Date.now() }]);
        });
        const unsubEvents = connection.subscribeConnectionEvents(event => {
            send.current = connection.isConnected() ? connection.send : null;
            setEvents(s => [...s, event]);
        });

        setLoading(false);
        return () => {
            send.current = null;
            unsubMessages.unsubscribe();
            unsubEvents.unsubscribe();
        };
    }, []);

    // const [messageText, setMessageText] = useState(``);
    // const sendMessage = () => {
    //     if (!send.current) { return; }
    //     send.current?.({ text: messageText, timestamp: Date.now(), clientKey: gameState.client.clientPlayer.clientKey });
    //     setMessageText(``);
    // };

    const setClientPlayer = (value: { name: string, emoji: string, isReady: boolean }) => {
        console.log(`useDoodlePartyController.setClientPlayer`, { value, send: send.current });
        const { clientStorage } = createClientStorage();
        gameState.client.clientPlayer = { ...gameState.client.clientPlayer, ...value };
        clientStorage.save({
            clientPlayer: gameState.client.clientPlayer,
        });
        sendClientPlayer();
        refresh();
    };
    const sendClientPlayer = () => {
        // Send to web socket on change
        if (gameState.client.role !== `player`) { return; }

        send.current?.({
            kind: `setPlayer`,
            clientPlayer: gameState.client.clientPlayer,
            clientKey: gameState.client.clientPlayer.clientKey,
            timestamp: Date.now(),
        });
    };

    // Sync game state (on connect)
    useEffect(() => {
        if (!send.current) { return; }

        sendClientPlayer();

        // Sync
        send.current?.({
            kind: `syncRequest`,
            clientKey: gameState.client.clientPlayer.clientKey,
            timestamp: Date.now(),
        });

    }, [send.current]);

    return {
        loading,
        renderId,
        gameState,
        setClientPlayer,
        // sendMessage,
        _messages: messages,
        _events: events,
    };
};
export type DoodlePartyController = ReturnType<typeof useDoodlePartyController>;
