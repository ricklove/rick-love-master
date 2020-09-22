export const createWebMeshClient = (channelKey: string) => {
    const clientKey = (`${Date.now()}-${Math.floor(Math.random() * 999999)}`);

    const sendMessage = (destination: { kind: 'broadcast' } | { kind: 'direct', clientKeys?: string[] }) => {

    };

    return {
        clientKey,
        sendMessage,
    };
};
