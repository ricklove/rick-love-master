---
title: "Typescript 'any' is evil"
date: "2020-10-13"
path: "/typescript-any-is-evil"
author: "Rick Love"
excerpt: "In Typescript any is evil"
---

tl;dr: In Typescript, the `any` keyword is evil - never use `any`


### `any`

`any` is typescript's rebelious 19 year old who was doing 80 on an icy mountain road, drove off a cliff, bounced down the side of the mountain in a giant fireball, was thrown from the fireball car, landed in a frozen river, and was finally swept out to sea and eaten by sharks.

`any` is the implementation in typescript of the 'this is fine' meme. This gif is perfect:

![](2020-10-13-nothing-to-see-here.gif)

* from: https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that

### `any` => bugs

Why would you want `any` bugs in your code?

The type flow checker in typescript is your first line of defense against bugs. It is your most important tool to ensure correctness of your code.

`any` disables all type checking of any code that touches that variable.

That should sound bad. It is.

### What is the right way

- Use the minimal type (the part of the type you actually care about) - Duck Typing.
- Use an Partial type of what you think it is.
- Use union types when it could be multiple types. Discriminated unions are great in typescript.
- Use `unknown` if you really have to. Then cast it to one of the above before you access it.

#### The Minimal Type - Duck Typing

Don't use the full type. Define only the fields you need to access in that scope.

For example, when you define a function, use a minimal definition for the argument types. Also, as a bonus that function is more generic and it is not coupled to a complex type. This simplifies your dependency graph and is one of the greatest advantages of Typescript over most other typed languanges: Typescript implements duck-typing.

```ts

export const getKey = (item: { id: string }) => {
    return item.id;
};

const complexObject = {
    id: `ABC-012345`,
    got: () => { },
    to: `go`,
    much: true,
    // Don't ever do this for real
    stuff: [1, 2, 3, 4, `42`, `false`, `0`, 0, ``, undefined, null, { undefined: true }],
    here: { latitude: 42, longitude: 42 },
    // Don't ever do this either
    maybe: null || undefined && null || 0 && true && `` && undefined == null && 42,
};
const key = getKey(complexObject);
console.log(`Here is the key`, { key, complexObject });

```

#### The Partial Type

In the case where an object should have a specific type, but it cannot be guaranteed, use partial typing.

Also in most cases, when the object fails to have the correct type, you can simply return `undefined` or `null`.

Here are a few patterns to do that depending on whether you prefer `undefined` over `null`:

```ts

// Return type: string | undefined
export const getKeyWithOptionalId = (item: { id?: string }) => {
    return item.id;
};

// Return type: string | null | undefined
export const getKeyWithNullableId = (item: { id?: null | string }) => {
    return item.id;
};

// Return type: string | undefined
export const getKeyWithNullableId2 = (item: { id?: null | string }) => {
    return item.id ?? undefined;
};

// Return type: string | undefined
export const getKeyWithNullableObject = (item: null | undefined | { id?: null | string }) => {
    return item?.id ?? undefined;
};

// Return type: string | undefined
export const getKeyWithOptionalArgument = (item?: null | { id?: null | string }) => {
    return item?.id ?? undefined;
};

```

##### Side Note: null vs undefined

On the difference between `undefined` and `null`. They should be treated the same logically in your code, but I do sometimes use them to distinguish intent in the code:

- `null` to indicate an empty value (especially when setting a non-optional value to default)
- `undefined` to indicate a missing optional value

The only place I have seen a logical difference between them is when updating an object in a storage system: `undefined` could mean ignore the field and `null` could mean reset that field.

#### Union Types

Now we are starting to actually use Typescript's power.

A union type is essentially the or `|` operator for types. It's a type that could has multiple posibilities.

Typescript handles union types like an expert. It understands all the runtime operations that could limit the type. For example, an if statement can be used to constrain the type to a specific one of the possibilities.

In the below example, keyOrObject could be a string, number, nullable, or an object with one of many possible id fields.

```ts

export const getStringKey = (
    keyOrObject?: null | string | number
        | { id?: null | string | number }
        | { uid?: null | string | number }
        | { guid?: null | string | number }
        | { uuid?: null | string | number }
        | { key?: null | string | number },
): undefined | string => {
    if (typeof keyOrObject === `string`) { return keyOrObject; }
    if (typeof keyOrObject === `number`) { return `${keyOrObject}`; }

    if (!keyOrObject) { return undefined; }
    if (`id` in keyOrObject) { return getStringKey(keyOrObject.id); }
    if (`uid` in keyOrObject) { return getStringKey(keyOrObject.uid); }
    if (`guid` in keyOrObject) { return getStringKey(keyOrObject.guid); }
    if (`uuid` in keyOrObject) { return getStringKey(keyOrObject.uuid); }
    if (`key` in keyOrObject) { return getStringKey(keyOrObject.key); }

    return undefined;
};


```

And here is the type when you hover over the object after being constrained by one of the if statements:

![](2020-10-13-typescript-union-type-constrained.png)


Also, often it can be cleaner to combine the object into a single partial object:

```ts

// Same as above
export const getStringKey = (
    keyOrObject?: null | string | number
        | {
            id?: null | string | number;
            uid?: null | string | number;
            guid?: null | string | number;
            uuid?: null | string | number;
            key?: null | string | number;
        },
): undefined | string => {
    if (typeof keyOrObject === `string`) { return keyOrObject; }
    if (typeof keyOrObject === `number`) { return `${keyOrObject}`; }

    return getStringKey(
        keyOrObject?.id
        ?? keyOrObject?.uid
        ?? keyOrObject?.guid
        ?? keyOrObject?.uuid
        ?? keyOrObject?.key,
    );
};

// Objects only (more common)
export const getStringKeyFromObject = (
    obj?: {
        id?: null | string | number;
        uid?: null | string | number;
        guid?: null | string | number;
        uuid?: null | string | number;
        key?: null | string | number;
    },
): undefined | string => {

    const value =
        obj?.id
        ?? obj?.uid
        ?? obj?.guid
        ?? obj?.uuid
        ?? obj?.key;

    if (typeof value === `string`) { return value; }
    if (typeof value === `number`) { return `${value}`; }
    return undefined;
};

```

#### Unknown

`unknown` is the little brother of `any`. Having grown up with the embodiment of a "Don't Do Drugs" campaign, `unknown` is not interested in the "freedom" of his evil brother.

`unknown` is safe. If you ask him to hold a baby, he won't drop kick it through a field goal or throw it into a lake.


![](2020-10-13-throw-baby.jpg)

(Bonus points if you have played Peasant's Quest - Note: the baby turns out ok.)

So when should you use `unknown`? Basically very rarely - in fact it is difficult to come up with a good example where one of the above won't work much better.

Probably the best use case is when you are using some untyped external library:


##### ExternalCarelesslyTypedLibrary.js

```ts


export const iDontCare = (callback: any) => {
    // ...
};

```

##### YourExcellentCode.ts

```ts

// Protect yourself from that which is outside your control
export const butYouShould = () => {

    // This will show up as an error:
    // (with 'noImplicitAny' correctly defined in tsconfig - make it so)
    iDontCare((whatever) => {

    });

    // But, you can mark this as unknown to be protected from the any defined externally
    iDontCare((whatever: unknown) => {

        if (typeof whatever === `object`) {
            // Cast it to a partial type to try to extract the desired value
            const probably = whatever as { value?: string };
            const { value } = probably;

            // Returns string | undefined
            return value;
        }

        return undefined;
    });
};


```

### Other Articles about any

- https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that
- https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db


#### Fun Side Note: Insanely Precise Typing

Typescript is the most precisely typed languange that exists and it gets more powerful constantly.

Some people have taken that to the level of insane:

![](2020-10-13-sql-typed-string.png)

Let me explain what is happening in that screen shot:

Typescript (4.1) is parsing a raw string and determining:

- An sql join calculation
- The fields returned by that query
- Dot operator object navigation of those fields
- Specific result values (as string constants) when that query is applied against an object literal

Let me emphasize this. Typescript doesn't have a single line of code that knows anything about SQL. This demo was made just to demonstrate that typescript can rip apart raw string constants and understand type information from the contents of that string. This is done with a combination of typescript's conditional typing and it's support for string literals soon coming in Typescript 4.1.

Here is the project: https://github.com/codemix/ts-sql

Typescript Typing Level: Insane

