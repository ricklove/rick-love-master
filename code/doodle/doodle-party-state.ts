import { useRef, useState, useEffect } from 'react';
import { parseQuery } from 'utils/query';
import { WebsocketConnectionEvent } from 'websockets-api/client/types';
import { createWebsocketClient } from 'websockets-api/client/websocket-client';
import { websocketsApiConfig } from 'websockets-api/client/config';
import { toKeyValueArray } from 'utils/objects';
import { randomIndex } from 'utils/random';
import { DoodleDataWithScore, DoodleData_Encoded, DoodleDrawingEncoded } from './doodle';

type GameState = {
    client: {
        _query: { [key: string]: undefined | string };
        room: string;
        role: 'debug' | 'viewer' | 'player';

        clientPlayer: PlayerState;
    };
    masterClientKey?: string;
    players: PlayerState[];
    history: GameHistory;
    // doodles: DoodleDataWithScore[];
};
export type Assignment = {
    kind: 'doodle' | 'describe';
    prompt?: string;
    doodle?: DoodleDrawingEncoded;
};
export type PlayerState = {
    clientKey: string;
    name: string;
    emoji: string;
    isReady: boolean;
    isUser?: boolean;

    assignment?: Assignment;
};
type GameRound = { completed: PlayerState[] };
type GameHistory = { rounds: GameRound[] };
type PlayerProfile = {
    clientKey: string;
    name: string;
    emoji: string;
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
        history: { rounds: [] },
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
        masterClientKey: string;
        players: PlayerState[];
        history: GameHistory;
    };
} | {
    kind: 'setPlayer';
    clientPlayer: {
        clientKey: string;
        name: string;
        emoji: string;
        isReady: boolean;
    };
} | {
    kind: 'aliveRequest';
    requestedClientKey: string;
} | {
    kind: 'aliveResponse';
} | {
    kind: 'dropPlayer';
    droppedClientKey: string;
} | {
    kind: 'assign';
    players: PlayerState[];
    lastRound: GameRound;
} | {
    kind: 'completeAssignment';
    playerAssignment: Assignment & { clientKey: string };
});
const createNewAssigment = (): Assignment => {
    return {
        kind: `doodle`,
        prompt: `Choose Your Own Word`,
    };
};
const createMessageHandler = (gameState: GameState, refresh: () => void, send: (message: DoodlePartyMessage) => void) => {
    console.log(`createMessageHandler`);
    const { clientKey } = gameState.client.clientPlayer;

    let syncResponseId = setTimeout(() => { });
    const sendGameState = (requestedClientKey: string) => {
        // Claim the master 
        gameState.masterClientKey = clientKey;
        send({
            kind: `syncResponse`,
            requestedClientKey,
            gameState: {
                masterClientKey: gameState.masterClientKey,
                players: gameState.players,
                history: gameState.history,
            },
            clientKey,
            timestamp: Date.now(),
        });
    };

    const masterState = {
        startTimestamp: Date.now(),
        clientStates: {} as { [clientKey: string]: { lastMessageTimestamp: number } },
    };

    const sendNewAssignmentsIfReady = () => {
        if (gameState.players.some(x => !x.isReady || (x.assignment && (!x.assignment.doodle || !x.assignment.prompt)))) { return; }

        // Save Round
        const lastRound = { completed: [...gameState.players.map(x => ({ ...x, assignment: x.assignment ? { ...x.assignment } : undefined }))] };
        gameState.history.rounds.push(lastRound);

        // Rotate next assignment
        const old = gameState.players.map(x => x.assignment);
        for (let i = 0; i < gameState.players.length; i++) {
            const iNext = i < gameState.players.length - 1 ? i + 1 : 0;

            const oldAssigment = old[i];
            if (!oldAssigment) {
                gameState.players[iNext].assignment = createNewAssigment();
                continue;
            }

            const newAssignment = { ...oldAssigment };
            // Switch assignment types
            if (newAssignment.kind === `doodle`) {
                newAssignment.kind = `describe`;
                newAssignment.prompt = undefined;
            } else {
                newAssignment.kind = `doodle`;
                newAssignment.doodle = undefined;
            }

            gameState.players[iNext].assignment = newAssignment;
        }

        send({
            kind: `assign`,
            players: gameState.players,
            lastRound,
            clientKey,
            timestamp: Date.now(),
        });
    };

    const aliveTimeout = 15;
    const deadTimeout = 30;

    setInterval(() => {
        const m = masterState.clientStates[gameState.masterClientKey ?? ``] ?? { lastMessageTimestamp: masterState.startTimestamp };
        // console.log(`createMessageHandler`, { m, masterState });

        // Clients - Detect Dead Master
        if (gameState.masterClientKey !== clientKey) {
            if (Date.now() > deadTimeout * 1000 + m.lastMessageTimestamp) {
                console.log(`createMessageHandler - Master not responsive!`, { m, masterState });
                // Master is not active, take over (send game state to self will work)
                sendGameState(clientKey);
            }
            return;
        }

        // Make sure assignments are out
        sendNewAssignmentsIfReady();

        // Keep Master Alive
        if (Date.now() > aliveTimeout * 1000 + m.lastMessageTimestamp) {
            // Master (self) is not being active - send a message before another client takes over
            send({ kind: `aliveResponse`, clientKey, timestamp: Date.now() });
        }

        // Drop unresponsive players
        toKeyValueArray(masterState.clientStates)
            .filter(x => x.key !== clientKey)
            .filter(x => Date.now() > aliveTimeout * 1000 + x.value.lastMessageTimestamp)
            .map(x => send({
                kind: `aliveRequest`,
                requestedClientKey: x.key,
                clientKey,
                timestamp: Date.now(),
            }));
        toKeyValueArray(masterState.clientStates)
            .filter(x => x.key !== clientKey)
            .filter(x => Date.now() > deadTimeout * 1000 + x.value.lastMessageTimestamp)
            .map(x => send({
                kind: `dropPlayer`,
                droppedClientKey: x.key,
                clientKey,
                timestamp: Date.now(),
            }));

    }, 3000 + randomIndex(3000));

    const handleMessage = (message: DoodlePartyMessage) => {
        masterState.clientStates[message.clientKey] = { lastMessageTimestamp: Date.now() };

        if (message.kind === `setPlayer`) {
            let p = gameState.players.find(x => x.clientKey === message.clientPlayer.clientKey);
            if (!p) {
                p = { ...message.clientPlayer };
                gameState.players.push(p);
            }
            p.isUser = p.clientKey === clientKey;
            p.name = message.clientPlayer.name;
            p.emoji = message.clientPlayer.emoji;
            p.isReady = message.clientPlayer.isReady;

            // If master
            if (clientKey === gameState.masterClientKey) {
                setTimeout(() => {
                    sendNewAssignmentsIfReady();
                }, 3000);
            }

            refresh();
            return;
        }

        if (message.kind === `dropPlayer`) {
            gameState.players = gameState.players.filter(x => x.clientKey !== message.droppedClientKey);
            console.log(`dropPlayer`, { players_after: [...gameState.players], message });
            refresh();
            return;
        }

        // Ignore own messages
        if (message.clientKey === clientKey) { return; }

        // Assigments
        if (message.kind === `assign`) {
            gameState.players = message.players;
            gameState.history.rounds.push(message.lastRound);
            refresh();
            return;
        }
        if (message.kind === `completeAssignment`) {
            // Add Doodle, Prompt
            const assigment = gameState.players.find(x => x.clientKey === message.clientKey)?.assignment;
            if (!assigment) { return; }
            assigment.prompt = message.playerAssignment.prompt;
            assigment.doodle = message.playerAssignment.doodle;

            // If master
            if (clientKey === gameState.masterClientKey) {
                sendNewAssignmentsIfReady();
            }

            refresh();
            return;
        }

        // Alive Request
        if (message.kind === `aliveRequest`) {
            if (message.requestedClientKey !== clientKey) { return; }
            send({ kind: `aliveResponse`, clientKey, timestamp: Date.now() });
            return;
        }

        // Sync
        if (message.kind === `syncRequest`) {
            if (gameState.masterClientKey === clientKey) {
                sendGameState(message.clientKey);
                return;
            }

            clearTimeout(syncResponseId);
            syncResponseId = setTimeout(() => {
                // Master has not responded in a timely manner - claim it
                sendGameState(message.clientKey);
            }, 1000 + randomIndex(3000));
        }
        if (message.kind === `syncResponse`) {
            clearTimeout(syncResponseId);

            if (message.requestedClientKey !== clientKey) {
                // Verify master is correct
                if (message.gameState.players.length < gameState.players.length
                    || message.gameState.history.rounds.length < gameState.history.rounds.length
                ) {
                    // The master is wrong - claim master and correct data
                    sendGameState(message.clientKey);
                    sendGameState(message.requestedClientKey);
                    return;
                }

                // The master is right - accept the master
                gameState.masterClientKey = message.gameState.masterClientKey;
            }

            // Use received state
            const clientState = gameState.client;
            Object.assign(gameState, message.gameState);
            gameState.client = clientState;
            gameState.players.forEach(x => { x.isUser = false; });
            const p = gameState.players.find(x => x.clientKey === clientState.clientPlayer.clientKey);
            if (p) { p.isUser = true; }
        }
    };


    return {
        handleMessage,
    };
};
type MessageHandler = ReturnType<typeof createMessageHandler>;

export const useDoodlePartyController = () => {
    const gameStateRef = useRef(createDefaultGameState());
    const gameState = gameStateRef.current;
    const { clientKey } = gameState.client.clientPlayer;

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
    const messageHandler = useRef(null as null | MessageHandler);

    useEffect(() => {
        loadClientPlayerFromStorage();

        const connection = createWebsocketClient({ websocketsApiUrl: websocketsApiConfig.websocketsApiUrl })
            .connect<DoodlePartyMessage>({ key: gameState.client.room });

        const unsubMessages = connection.subscribeMessages(message => {
            if (!messageHandler.current) { messageHandler.current = createMessageHandler(gameState, refresh, (x) => send.current?.(x)); }
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
    //     send.current?.({ text: messageText, timestamp: Date.now(), clientKey: clientKey });
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
            clientKey,
            timestamp: Date.now(),
        });
    };
    const sendAssignment = (assignment: Assignment) => {
        // Send to web socket on change
        if (gameState.client.role !== `player`) { return; }

        send.current?.({
            kind: `completeAssignment`,
            playerAssignment: { ...assignment, clientKey },
            clientKey,
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
            clientKey,
            timestamp: Date.now(),
        });

    }, [send.current]);

    return {
        loading,
        renderId,
        gameState,
        setClientPlayer,
        sendAssignment,
        _messages: messages,
        _events: events,
    };
};
export type DoodlePartyController = ReturnType<typeof useDoodlePartyController>;
