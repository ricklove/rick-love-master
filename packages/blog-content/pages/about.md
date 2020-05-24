---
title: "About"
date: "2020-05-11"
author: "Rick Love"
path: "/about"
---

## Hi there

My name is Rick:

```typescript
export const getAboutAuthor = () => {

    const favoriteLanguange = 'Typescript';
    const yearOfTypescriptRelease = 2012;

    const oldTypescriptRepoFile = 'https://github.com/ricklove/GreekBibleApp/blob/master/www/Scripts/ts/User/001_DisplayPassage.ts';

    const funTypescriptRepoFile = 'https://github.com/ricklove/GreekBibleApp/blob/master/www/Scripts/ts/User/001_DisplayPassage.ts';
    const funTypescriptPurpose = 'Transpile the Original 1977 Zork Source Code into Ideomatic Typescript';

    return `
My favorite languange is ${favoritLanguange} and I've been coding in it since Typescript 0.8 in ${yearOfTypescriptRelease}.

Here is an old repo of some old Typescript before they figured out ES Modules: ${oldTypescriptRepoFile}.

But I don't write code like that anymore that was ${new Date().getFullYear() - yearOfTypescriptRelease} years ago after all. 

So, here is some newer Typescript written for a fun little project where I was ${funTypescriptPurpose}: ${oldTypescriptRepoFile}.
    `;
};
```


```csharp

// But years before that I was writing in C#

namespace RickLove.Information 
{
    public class About 
    {
        // This is not the exact date, but sometime around here
        public DateTime BeganWritingCSharp = () => new DateTime(2003, 09, 15);

        public string ImportantPost = () => "https://www.hanselman.com/blog/ShouldIUseHTML5OrSilverlightOneMansOpinion.aspx";

        public string Summary = () => $@"
I began writing in C# after having learned C++ during an intro to programming university class in 2000. 

A fews years later, I tried to teach myself game development. I found a book on Game Dev in VB 6. 

But since I had access to the newest Visual Studio, I tried to use VB.Net. I had some success.

However, about a year later around ${BeganWritingCSharp}, I gave C# a try. Since I was taking a few classes in C++, C# was a great improvement.

Anyway, I've been coding in C# since then. I always hoped it would live up to becoming the universal languange.

However, Apple killed Silverlight and Microsoft's dreams of taking over the world with C#.

Quickly though, they bounced back with Typescript and haven't looked back since. 

This post helped me realize that it is best to use whatever tool works, rather than being stuck on a certain languange:

${ImportantPost}

Of course, C# is still the best languange for Cross Platform Game Development: i.e. Unity.

Anyway, enough of that.
            ";

        public string ToString()
        {
            return Summary;
        }
    }
}

```


```html

<html>
<head>
</head>
<body>
    <div>
        <p>
            <span>Of course, I was learning basic HTML as a teenager back in 1997</span>
            <span> - starting with Frontpage.</span>
        </p>
        <p>
            <span>Before Geocities and that junk. I had a custom website - with GIFs everywhere, a java applet, and the eternal "In Construction" GIF guy.</span>
            <span>I even got a free MSDN subscription before that was worth anything.</span>
        </p>
        <p>
            <span>For a fun fact, I was even ranked #1 on yahoo when searching for my high school.</span>
        </p>
    </div>

    <div>
        <span>I could do better than that, but who writes HTML anymore?</span>
        <span>Let's get some React going on...</span>
    </div>
</body>
</html>

```