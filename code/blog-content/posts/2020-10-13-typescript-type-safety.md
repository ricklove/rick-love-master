---
title: "Typescript 'any'"
date: "2020-10-13"
path: "/typescript-any"
author: "Rick Love"
excerpt: "In Typescript any is evil"
---

In Typescript, the `any` keyword is evil.

### Summary

`any` is typescript's rebelious 19 year old who was doing 80 on an icy mountain road, drove off a cliff, bounced down the side of the mountain in a giant fireball, thrown from the fireball car, landed in a frozen river, and was finally swept out to sea and eaten by sharks.

`any` is the implementation in typescript of the 'this is fine' meme. This gif is perfect:

![](2012-10-13-nothing-to-see-here.gif)

* from: https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that

### Theological Implications



### What is the right way

- Use the correct type (or at least the part of the type you actually care about).
- Use an Partial type of what you think it is.
- Use union types when it could be multiple types. Discriminated unions are great in typescript.
- Use `unknown` if you really have to. Then cast it to one of the above before you access it.

### Other Articles about the any

- https://thoughtbot.com/blog/typescript-stop-using-any-there-s-a-type-for-that
- https://codeburst.io/five-tips-i-wish-i-knew-when-i-started-with-typescript-c9e8609029db
