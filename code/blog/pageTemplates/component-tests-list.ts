export const componentTestList = [
    { name: `stripe`, load: async () => (await import(`payments/providers/stripe/client-test/stripe-example`)).StripeExamplePage },
    { name: `payment`, load: async () => (await import(`payments/test/full-stack-test-client`)).PaymentFullStackTesterHost },
    { name: `code-space`, load: async () => (await import(`code-space-views/code-space-component`)).CodeSpaceComponent },
    { name: `auth`, load: async () => (await import(`auth/test/auth-client`)).AuthComponent },
    { name: `midi-test`, load: async () => (await import(`audio/midi-test`)).MidiTestComponent },
    { name: `timing-perception-test`, load: async () => (await import(`perception/timing-perception-test`)).TimingPerceptionTestComponent },
    { name: `multiples-counting`, load: async () => (await import(`educational-games/multiples-counting`)).EducationalGame_MultiplesCounting },
    { name: `uploads`, load: async () => (await import(`upload-api/client/upload-test-view`)).UploadTestView },
    { name: `user-profiles-manager`, load: async () => (await import(`user-data-service/user-profile-manager-view`)).UserProfileManagerView },
    { name: `websocket-client-test-view`, load: async () => (await import(`websockets-api/client/websocket-client-test-view`)).WebsocketClientTestView },
    { name: `web-mesh-client-test-view`, load: async () => (await import(`web-mesh/web-mesh-client-test`)).WebMeshClientTestView },
    { name: `doodle-view`, load: async () => (await import(`doodle/doodle-view`)).DoodleTestView },
    { name: `hacker-news`, load: async () => (await import(`hacker-news/hacker-news-page`)).HackerNewsPage_TopNews },

    // { name: `theme`, load: async () => (await import(`themes/theme-example`)).ThemeExample },
];
