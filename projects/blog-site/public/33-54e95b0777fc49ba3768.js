(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[33],{RYSq:function(e,t,n){"use strict";n.r(t),n.d(t,"WebsocketClientTestView",(function(){return u}));var a=n("t8gp"),r=n("ERkP"),c=n.n(r),i=n("DTYs"),s=n("LOFj"),l=n("xWie"),o=""+Date.now()+Math.random(),u=function(e){var t=Object(r.useState)([]),n=t[0],u=t[1],p=Object(r.useState)([]),f=p[0],m=p[1],d=Object(r.useRef)(null);Object(r.useEffect)((function(){var e=Object(s.a)({websocketsApiUrl:l.a.websocketsApiUrl}).connect({channelKey:"test"});d.current=e.send;var t=e.subscribeMessages((function(e){u((function(t){return[].concat(Object(a.a)(t),[Object.assign({},e,{receivedAtTimestamp:Date.now()})])}))})),n=e.subscribeConnectionEvents((function(e){m((function(t){return[].concat(Object(a.a)(t),[e])}))}));return function(){d.current=null,t.unsubscribe(),n.unsubscribe()}}),[]);var S=Object(r.useState)(""),w=S[0],E=S[1],b=function(){var e;d.current&&(null===(e=d.current)||void 0===e||e.call(d,{text:w,timestamp:Date.now(),senderKey:o}),E(""))};return c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),f.map((function(e,t){return c.a.createElement(i.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),n.map((function(e,t){var n;return c.a.createElement(i.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.timestamp+" "+(e.receivedAtTimestamp-e.timestamp)+": "+(null!==(n=e.text)&&void 0!==n?n:JSON.stringify(e)))}))),c.a.createElement(i.h,{style:{padding:4}},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send Message"),c.a.createElement(i.h,{style:{flexDirection:"row",alignItems:"center"}},c.a.createElement(i.h,{style:{flex:1,paddingRight:4}},c.a.createElement(i.f,{style:{fontSize:16},value:w,onChange:E,keyboardType:"default",autoCompleteType:"off",onBlur:b,onSubmitEditing:b})),c.a.createElement(i.g,{onPress:b},c.a.createElement(i.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send")))))}}}]);
//# sourceMappingURL=33-54e95b0777fc49ba3768.js.map