import { siteMetadata } from './site';

// This is a module version that supports rollup 
// const config = {

// };


export const site = { siteMetadata };

export const methodExample = {
    getFuture: (seconds: number) => Date.now() + seconds * 1000,
};
