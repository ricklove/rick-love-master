import { useRef, useState, useEffect } from 'react';
import { parseQuery } from 'utils/query';
import { createUploader } from 'upload-api/client/uploader';
import { uploadApiConfig } from 'upload-api/client/config';
import { createUploadApiWebClient } from 'upload-api/client/web-client';
import { createWebMeshClient, WebMeshClientWebSocketHistory } from 'web-mesh/web-mesh-client';
import { distinct_key, groupItems, distinct } from 'utils/arrays';
import { toKeyValueArray } from 'utils/objects';
import { doodleStoragePaths } from './doodle-paths';
import { DoodleDrawingEncoded, decodeDoodleDrawing } from './doodle';


type ClientState = {
    client: {
        _query: { [key: string]: undefined | string };
        room: string;
        role: 'debug' | 'viewer' | 'player';

        clientPlayer: PlayerState;
    };
};
type MeshState = {
    hostClientKey: string;
    clients: { key: string, isActive: boolean }[];
    players: PlayerState[];
    history: GameHistory;
};
export type Assignment = {
    kind: 'doodle' | 'describe';
    chainKey: string;
    prompt?: string;
    doodle?: DoodleDrawingEncoded;
};
export type PlayerState = {
    isActive: boolean;
    clientKey: string;
    name: string;
    emoji: string;
    isReady: boolean;
    assignment?: Assignment;
};
type GameRound = {
    roundKey: string;
    completed: PlayerState[];
};
type GameHistory = { rounds: GameRound[] };
type PlayerProfile = {
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

const createClientState = (): ClientState => {
    const query = parseQuery(window.location.search);
    const parseRoom = (value: undefined | string) => value ?? `UnknownRoom`;
    const parseRole = (value: undefined | string): ClientState['client']['role'] => {
        switch (value) {
            case `debug`: return `debug`;
            case `viewer`: return `viewer`;
            default: return `player`;
        }
    };
    const clientState: ClientState = {
        client: {
            _query: query,
            room: parseRoom(query.room),
            role: parseRole(query.role),

            clientPlayer: {
                isActive: true,
                clientKey: ``,
                name: ``,
                emoji: `👤`,
                isReady: false,
            },
        },
    };

    return clientState;
};

type DoodlePartyMessage = {
    kind: 'start';
} | {
    kind: 'setHost';
    hostClientKey: string;
} | {
    kind: 'setPlayer';
    clientPlayer: {
        clientKey: string;
        name: string;
        emoji: string;
        isReady: boolean;
    };
} | {
    kind: 'assign';
    players: PlayerState[];
    lastRound?: GameRound;
} | {
    kind: 'completeAssignment';
    playerAssignment: Assignment & { clientKey: string };
};

const createPlayerAssignment = (meshState: MeshState, playerClientKey: string, previousAssigments: Assignment[]) => {
    const DEFAULT_PROMPT = `Choose Your Own Word`;
    const createNewAssigment = (): Assignment => {
        return {
            kind: `doodle`,
            prompt: DEFAULT_PROMPT,
            chainKey: `${Date.now()}-${Math.floor(Math.random() * 999999)}`,
        };
    };

    const p = meshState.players.find(x => x.clientKey === playerClientKey);
    if (!p) { return createNewAssigment(); }

    const playerRounds = meshState.history.rounds.flatMap(x => x.completed).filter(x => x.clientKey === p.clientKey);
    const lastPlayerRound = playerRounds[playerRounds.length - 1] ?? undefined;
    const lastKind = lastPlayerRound?.assignment?.kind ?? `doodle`;

    // const playerChains = new Set(meshState.history.rounds.flatMap(x => x.completed).filter(x => x.clientKey === p.clientKey).map(x => x.assignment?.chainKey ?? ``));
    const playerPrompts = new Set(meshState.history.rounds
        .flatMap(x => x.completed)
        .filter(x => x.clientKey === p.clientKey)
        .filter(x => x.assignment?.prompt !== DEFAULT_PROMPT)
        .map(x => x.assignment?.prompt?.toLowerCase().trim() ?? ``));

    const iRemaining = previousAssigments.findIndex(x =>
        // New prompt for player
        !playerPrompts.has(x.prompt?.toLowerCase().trim() ?? ``)
        // Same type as last round (so swap will be correct)
        && (x.kind === lastKind));

    if (iRemaining < 0) {
        return createNewAssigment();
    }

    const oldAssigment = previousAssigments.splice(iRemaining, 1)[0];
    const newAssignment = { ...oldAssigment };

    // Switch assignment types
    if (newAssignment.kind === `doodle`) {
        newAssignment.kind = `describe`;
        newAssignment.prompt = undefined;
    } else {
        newAssignment.kind = `doodle`;
        newAssignment.doodle = undefined;
    }

    return newAssignment;
};

const sendNewAssignmentsIfReady = (meshState: MeshState, send: (message: DoodlePartyMessage) => void) => {
    if (meshState.players.filter(x => x.isActive && x.isReady).length <= 0) { return; }

    // Assign Next Item in Chain
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const chains = toKeyValueArray(groupItems(meshState.history.rounds.flatMap(x => x.completed).map(x => x.assignment).filter(x => x).map(x => x!), x => x?.chainKey ?? ``));
    const previousAssigments = chains.map(x => x.value[x.value.length - 1]);

    // If some players aren't done yet
    if (meshState.players.some(x => x.isActive && x.isReady && x.assignment && (!x.assignment.doodle || !x.assignment.prompt))) {

        // Add new player assignments
        const missingAssignments = meshState.players.filter(x => !x.assignment);
        if (missingAssignments.length > 0) {
            missingAssignments.forEach(x => { x.assignment = createPlayerAssignment(meshState, x.clientKey, previousAssigments); });

            send({
                kind: `assign`,
                players: meshState.players,
                lastRound: undefined,
            });
            return;
        }
        return;
    }

    // Save Round (when all players are done)
    const completed = [...meshState.players
        .filter(x => x.assignment && x.assignment.doodle && x.assignment.prompt && decodeDoodleDrawing(x.assignment.doodle).segments.length > 0)
        .map(x => ({ ...x, assignment: x.assignment ? { ...x.assignment } : undefined }))];
    const lastRound = {
        roundKey: `${Date.now()}`,
        completed,
    };
    meshState.history.rounds.push(lastRound);


    // Assign Players to new chain
    for (let i = 0; i < meshState.players.length; i++) {
        meshState.players[i].assignment = createPlayerAssignment(meshState, meshState.players[i].clientKey, previousAssigments);
    }

    send({
        kind: `assign`,
        players: meshState.players,
        lastRound,
    });

    // Save to server (for data)
    setTimeout(async () => {
        const uploadApiWebClient = createUploadApiWebClient(uploadApiConfig);
        const backupUrl = (await uploadApiWebClient.createUploadUrl({ prefix: `${doodleStoragePaths.doodlePartyDrawingsPrefix}/${Date.now()}` })).uploadUrl;
        const backupUploader = createUploader(backupUrl);
        await backupUploader.uploadData({
            history: meshState.history,
        });
    });
};

const reduceState = (previousState: MeshState, message: DoodlePartyMessage): MeshState => {
    console.log(`reduceState`, { message });

    if (message.kind === `setHost`) {
        previousState.hostClientKey = message.hostClientKey;
        return previousState;
    }

    if (message.kind === `setPlayer`) {
        let p = previousState.players.find(x => x.clientKey === message.clientPlayer.clientKey);
        if (!p) {
            p = { ...message.clientPlayer, isActive: true };
            previousState.players.push(p);
        }
        p.name = message.clientPlayer.name;
        p.emoji = message.clientPlayer.emoji;
        p.isReady = message.clientPlayer.isReady;

        return previousState;
    }

    // Assigments
    if (message.kind === `assign`) {
        previousState.players = message.players;
        if (message.lastRound && message.lastRound.completed.length > 0) {
            if (!previousState.history.rounds.find(x => x.roundKey === message.lastRound?.roundKey)) {
                previousState.history.rounds.push(message.lastRound);
            }
        }
        return previousState;
    }

    if (message.kind === `completeAssignment`) {
        // Add Doodle, Prompt
        const assigment = previousState.players.find(x => x.clientKey === message.playerAssignment.clientKey)?.assignment;
        if (!assigment) { return previousState; }

        assigment.prompt = message.playerAssignment.prompt;
        assigment.doodle = message.playerAssignment.doodle;

        return previousState;
    }

    return previousState;
};

const reduceClientsState = (previousState: MeshState, clients: { key: string, lastActivityTimestamp: number }[]): MeshState => {
    console.log(`reduceClientsState`, { clients });

    previousState.players.forEach(x => {
        x.isActive = !!clients.find(c => c.key === x.clientKey);
    });
    previousState.clients = distinct([...previousState.clients, ...clients].map(x => x.key)).map(x => ({ key: x, isActive: !!clients.find(c => c.key === x) }));

    return previousState;
};


export const useDoodlePartyController = () => {
    const clientStateRef = useRef(createClientState());
    const clientState = clientStateRef.current;

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
            clientState.client.clientPlayer = {
                clientKey: ``,
                name: s.clientPlayer.name,
                emoji: s.clientPlayer.emoji,
                isReady: false,
                isActive: true,
            };
        }
        refresh();
    };

    const meshState = useRef(null as null | MeshState);
    const send = useRef(null as null | ((message: DoodlePartyMessage) => void));
    const webSocketHistory = useRef(null as null | { history: WebMeshClientWebSocketHistory });

    useEffect(() => {

        // Setup Web Mesh
        const webMeshClient = createWebMeshClient<MeshState, DoodlePartyMessage>({
            channelKey: `doodle_${clientState.client.room}`,
            initialState: {
                hostClientKey: ``,
                clients: [],
                players: [],
                history: { rounds: [] },
            },
            reduceState,
            reduceClientsState,
        });
        const sub = webMeshClient.subscribe((m) => {
            meshState.current = m;
            refresh();
        });

        webSocketHistory.current = ({ history: webMeshClient._webSocket.history });
        send.current = webMeshClient.sendMessage;

        // Setup Client State
        loadClientPlayerFromStorage();
        clientState.client.clientPlayer.clientKey = webMeshClient.clientKey;

        // Host
        const hostIntervalId = setInterval(() => {
            const mState = meshState.current;
            if (!mState) {
                // webMeshClient.sendMessage({
                //     kind: `start`,
                // });
                return;
            }

            const hasActiveHost = mState.clients.find(x => x.key === mState.hostClientKey)?.isActive;
            if (!hasActiveHost) {
                webMeshClient.sendMessage({
                    kind: `setHost`,
                    hostClientKey: webMeshClient.clientKey,
                });
                return;
            }

            if (mState.hostClientKey !== webMeshClient.clientKey) { return; }

            // Act as host
            sendNewAssignmentsIfReady(mState, webMeshClient.sendMessage);

        }, 3000 + Math.floor(3000 * Math.random()));


        setLoading(false);

        return () => {
            sub.unsubscribe();
            webMeshClient.close();
            clearInterval(hostIntervalId);
        };
    }, []);

    // Send Messages
    const sendClientPlayer = () => {
        // Send to web socket on change
        if (clientState.client.role !== `player`) { return; }

        send.current?.({
            kind: `setPlayer`,
            clientPlayer: clientState.client.clientPlayer,
        });
    };
    const setClientPlayer = (value: { name: string, emoji: string, isReady: boolean }) => {
        // console.log(`useDoodlePartyController.setClientPlayer`, { value, send: send.current });
        const { clientStorage } = createClientStorage();
        clientState.client.clientPlayer = { ...clientState.client.clientPlayer, ...value };
        clientStorage.save({
            clientPlayer: clientState.client.clientPlayer,
        });
        sendClientPlayer();
        refresh();
    };

    const sendAssignment = (assignment: Assignment) => {
        // Send to web socket on change
        if (clientState.client.role !== `player`) { return; }

        send.current?.({
            kind: `completeAssignment`,
            playerAssignment: { ...assignment, clientKey: clientState.client.clientPlayer.clientKey },
        });
    };

    return {
        loading,
        renderId,
        clientState,
        meshState: meshState.current,
        setClientPlayer,
        sendAssignment,
        _messages: webSocketHistory.current?.history.messages ?? [],
        _events: webSocketHistory.current?.history.events ?? [],
    };
};
export type DoodlePartyController = ReturnType<typeof useDoodlePartyController>;
