// eslint-disable-next-line import/no-mutable-exports
declare let ga: (send: 'send', event: 'event', name: string, message: string) => void;
if (!ga) { ga = () => { }; }
export { ga };
