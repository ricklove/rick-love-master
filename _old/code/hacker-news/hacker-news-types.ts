type StoryId = number & { __type: 'StoryId' };
type CommentId = number & { __type: 'CommentId' };
type AskId = number & { __type: 'AskId' };
type JobId = number & { __type: 'JobId' };
type PollId = number & { __type: 'PollId' };
type PollPartId = number & { __type: 'PollPartId' };
export type Timestamp = number & { __type: 'Timestamp' };

// story: https://hacker-news.firebaseio.com/v0/item/8863.json?print=pretty
const sampleStory = {
    "by": `dhouston`,
    "descendants": 71,
    "id": 8863 as StoryId,
    "kids": [8952, 9224, 8917, 8884, 8887, 8943, 8869, 8958, 9005, 9671, 8940, 9067, 8908, 9055, 8865, 8881, 8872, 8873, 8955, 10403, 8903, 8928, 9125, 8998, 8901, 8902, 8907, 8894, 8878, 8870, 8980, 8934, 8876] as CommentId[],
    "score": 111,
    "time": 1175714200 as Timestamp,
    "title": `My YC app: Dropbox - Throw away your USB drive`,
    "type": `story` as const,
    "url": `http://www.getdropbox.com/u/2/screencast.html`,
};
export type HackerNewsStoryItem = typeof sampleStory;

// comment: https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty
const sampleComment = {
    "by": `norvig`,
    "id": 2921983 as CommentId,
    "kids": [2922097, 2922429, 2924562, 2922709, 2922573, 2922140, 2922141] as CommentId[],
    "parent": 2921506 as CommentId | StoryId,
    "text": `Aw shucks, guys ... you make me blush with your compliments.<p>Tell you what, Ill make a deal: I'll keep writing if you keep reading. K?`,
    "time": 1314211127 as Timestamp,
    "type": `comment` as const,
};
export type HackerNewsCommentItem = typeof sampleComment;

// ask: https://hacker-news.firebaseio.com/v0/item/121003.json?print=pretty
const sampleAsk = {
    "by": `tel`,
    "descendants": 16,
    "id": 121003 as AskId,
    "kids": [121016, 121109, 121168] as CommentId[],
    "score": 25,
    "text": `<i>or</i> HN: the Next Iteration<p>I get the impression that with Arc being released a lot of people who never had time for HN before are suddenly dropping in more often. (PG: what are the numbers on this? I'm envisioning a spike.)<p>Not to say that isn't great, but I'm wary of Diggification. Between links comparing programming to sex and a flurry of gratuitous, ostentatious  adjectives in the headlines it's a bit concerning.<p>80% of the stuff that makes the front page is still pretty awesome, but what's in place to keep the signal/noise ratio high? Does the HN model still work as the community scales? What's in store for (++ HN)?`,
    "time": 1203647620 as Timestamp,
    "title": `Ask HN: The Arc Effect`,
    "type": `story` as const,
    "url": `` as undefined | string,
};
export type HackerNewsAskItem = typeof sampleAsk;

// job: https://hacker-news.firebaseio.com/v0/item/192327.json?print=pretty
const sampleJob = {
    "by": `justin`,
    "id": 192327 as JobId,
    "score": 6,
    "text": `Justin.tv is the biggest live video site online. We serve hundreds of thousands of video streams a day, and have supported up to 50k live concurrent viewers. Our site is growing every week, and we just added a 10 gbps line to our colo. Our unique visitors are up 900% since January.<p>There are a lot of pieces that fit together to make Justin.tv work: our video cluster, IRC server, our web app, and our monitoring and search services, to name a few. A lot of our website is dependent on Flash, and we're looking for talented Flash Engineers who know AS2 and AS3 very well who want to be leaders in the development of our Flash.<p>Responsibilities<p><pre><code>    * Contribute to product design and implementation discussions\n    * Implement projects from the idea phase to production\n    * Test and iterate code before and after production release \n</code></pre>\nQualifications<p><pre><code>    * You should know AS2, AS3, and maybe a little be of Flex.\n    * Experience building web applications.\n    * A strong desire to work on website with passionate users and ideas for how to improve it.\n    * Experience hacking video streams, python, Twisted or rails all a plus.\n</code></pre>\nWhile we're growing rapidly, Justin.tv is still a small, technology focused company, built by hackers for hackers. Seven of our ten person team are engineers or designers. We believe in rapid development, and push out new code releases every week. We're based in a beautiful office in the SOMA district of SF, one block from the caltrain station. If you want a fun job hacking on code that will touch a lot of people, JTV is for you.<p>Note: You must be physically present in SF to work for JTV. Completing the technical problem at <a href="http://www.justin.tv/problems/bml" rel="nofollow">http://www.justin.tv/problems/bml</a> will go a long way with us. Cheers!`,
    "time": 1210981217 as Timestamp,
    "title": `Justin.tv is looking for a Lead Flash Engineer!`,
    "type": `job` as const,
    "url": ``,
};
export type HackerNewsJobItem = typeof sampleJob;

// poll: https://hacker-news.firebaseio.com/v0/item/126809.json?print=pretty
const samplePoll = {
    "by": `pg`,
    "descendants": 54,
    "id": 126809 as PollId,
    "kids": [126822, 126823, 126993, 126824, 126934, 127411, 126888, 127681, 126818, 126816, 126854, 127095, 126861, 127313, 127299, 126859, 126852, 126882, 126832, 127072, 127217, 126889, 127535, 126917, 126875] as CommentId[],
    "parts": [126810, 126811, 126812] as PollPartId[],
    "score": 46,
    "text": ``,
    "time": 1204403652 as Timestamp,
    "title": `Poll: What would happen if News.YC had explicit support for polls?`,
    "type": `poll` as const,
};
export type HackerNewsPollItem = typeof samplePoll;

// and one of its parts: https://hacker-news.firebaseio.com/v0/item/160705.json?print=pretty
const samplePollPart = {
    "by": `pg`,
    "id": 160705 as PollPartId,
    "poll": 160704 as PollId,
    "score": 335,
    "text": `Yes, ban them; I'm tired of seeing Valleywag stories on News.YC.`,
    "time": 1207886576 as Timestamp,
    "type": `pollopt` as const,
};
export type HackerNewsPollPartItem = typeof samplePollPart;

export type HackerNewsItem = HackerNewsStoryItem | HackerNewsCommentItem | HackerNewsAskItem | HackerNewsJobItem | HackerNewsPollItem | HackerNewsPollPartItem;
export type HackerNewsItemId = HackerNewsItem['id'];
