---
title: "Complexity is the Real Enemy"
date: "2021-05-05"
path: "/complexity-is-the-enemy"
author: "Rick Love"
excerpt: "Keep your code as simple as possible"
tags: code, architecture
---


Code complexity is the enemy to productivity.

Tips to keep your typescript/node/react code simple:

- Minimize Dependencies
    - Eliminate as many dependencies as possible
- Minimize Imports
    - Especially watch for files imported from a great distance, the more complex the import path, the more likely it should be eliminated
- Minimize function input and output types
    - An inline type with only the required fields that are used in the function is the ideal input type definition since it only defines the minimal input interface
    - Never use type definitions that you don't control
    - Use implicit typing for return type when possible
    - Only declare the return type when you want to ensure type correctness of the function itself
- Minimize branching
    - Never use a nested if statement
    - Never use an else statement
    - Handle error cases first and throw an error or return early
    - Handle exceptional cases first and return early
    - Handle simple cases first and return early
    - As you handle the cases, the typescript type system will narrow the remaining type to it's remaining possibilities
- Remove everything possible - the bare minimal is always the goal
- Organize code by features not by structure
