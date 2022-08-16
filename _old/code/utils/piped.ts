export function piped<T>(obj: T) {
    return {
        pipe: <TOut>(callback: (value: T) => TOut) => { return piped(callback(obj)); },
        then: <TOut>(callback: (value: T) => Promise<TOut>) => { return pipedPromise(callback(obj)); },
        out: () => obj,
    };
}

export function pipedPromise<T>(obj: Promise<T>) {
    return obj;
    // return {
    //     then: async <TOut>(callback: ((value: T) => TOut | Promise<TOut>)): Promise<TOut> => {
    //         const val = await obj;
    //         const conv = callback(val);
    //         return pipedPromise(Promise.resolve(conv));
    //     }
    // };
}

// Demo
// const api = null as any as { search: (name: string) => Promise<{ userId: string, displayName: string }> };
// const contact = { firstName: 'Rick', lastName: 'Love' };
// const getValue = async () => await piped(contact)
//     .pipe(x => ({ ...x, fullName: `${x.firstName} ${x.lastName}` }))
//     .pipe(x => ({ ...x, nameCount: x.fullName.replace(/\s/g, ' ').split(' ').filter(x => x).length }))
//     .pipe(x => ({ ...x, hasMiddleNames: x.nameCount > 2 }))
//     .then(x => api.search(x.fullName))
//     .then(x => x.displayName)
//     .then(x => x.split(' ').map(x => `${x[0].toUpperCase()}${x.substr(1)}`).join(' '))
//     .then(x => x
//         .split(' ')
//         .map(x => `${x[0].toUpperCase()}${x.substr(1)}`)
//         .join(' ')
//         .replace('Rick', 'Mr.')
//         .length
//     )
//     .then(x => piped(x)
//         .pipe(x => x + 42)
//         .pipe(x => x / 7)
//         .pipe(x => `${x}`)
//     )
//     .then(x => x.length)
//     .then(x => x.toFixed(45))
//     .then(x => x.length);
