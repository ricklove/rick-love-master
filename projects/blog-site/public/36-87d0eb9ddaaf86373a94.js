(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[36],{RYSq:function(e,t,n){"use strict";n.r(t),n.d(t,"WebsocketClientTestView",(function(){return o}));var a=n("fGyu"),r=n("ERkP"),c=n.n(r),i=n("DTYs"),s=n("LOFj"),l=n("xWie"),u=""+Date.now()+Math.random(),o=function(e){var t=Object(r.useState)([]),n=t[0],o=t[1],p=Object(r.useState)([]),f=p[0],m=p[1],d=Object(r.useRef)(null);Object(r.useEffect)((function(){var e=Object(s.a)({websocketsApiUrl:l.a.websocketsApiUrl}).connect({channelKey:"test"});d.current=e.send;var t=e.subscribeMessages((function(e){o((function(t){return[].concat(Object(a.a)(t),[Object.assign({},e,{receivedAtTimestamp:Date.now()})])}))})),n=e.subscribeConnectionEvents((function(e){m((function(t){return[].concat(Object(a.a)(t),[e])}))}));return function(){d.current=null,t.unsubscribe(),n.unsubscribe()}}),[]);var S=Object(r.useState)(""),w=S[0],y=S[1],E=function(){var e;d.current&&(null===(e=d.current)||void 0===e||e.call(d,{text:w,timestamp:Date.now(),senderKey:u}),y(""))};return c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),f.map((function(e,t){return c.a.createElement(i.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),n.map((function(e,t){var n;return c.a.createElement(i.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.timestamp+" "+(e.receivedAtTimestamp-e.timestamp)+": "+(null!==(n=e.text)&&void 0!==n?n:JSON.stringify(e)))}))),c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send Message"),c.a.createElement(i.h,{style:{flexDirection:"row",alignItems:"center"}},c.a.createElement(i.h,{style:{flex:1,paddingRight:4}},c.a.createElement(i.f,{style:{fontSize:16},value:w,onChange:y,keyboardType:"default",autoCompleteType:"off",onBlur:E,onSubmitEditing:E})),c.a.createElement(i.g,{onPress:E},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send")))))}}}]);
//# sourceMappingURL=36-87d0eb9ddaaf86373a94.js.map