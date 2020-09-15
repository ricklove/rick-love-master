(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[31],{XFco:function(e,t,n){"use strict";n.r(t),n.d(t,"WebsocketClientTestView",(function(){return p}));n("yIC7"),n("p+GS"),n("dtAy"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9"),n("PN9k");var r=n("ERkP"),a=n.n(r),s=n("DTYs"),o=n("EsTT"),i=n("9DGK"),c="wss://p4w1a7ysk8.execute-api.us-east-1.amazonaws.com/prod";function u(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var f=""+Date.now()+Math.random(),p=function(e){var t=Object(r.useState)([]),n=t[0],l=t[1],p=Object(r.useState)([]),m=p[0],d=p[1],y=Object(r.useRef)(null);Object(r.useEffect)((function(){var e,t=(e={websocketsApiUrl:c},{connect:function(t){var n=t.key,r=Object(o.a)(),a=Object(o.a)(),s=function(){var t=new WebSocket(""+e.websocketsApiUrl);return t.addEventListener("open",(function(e){if(t===c){a.onStateChange({connectionStatus:"opened"});var r={message:null,key:n};t.send(JSON.stringify(r))}else t.close()})),t.addEventListener("close",(function(e){t===c?(a.onStateChange({connectionStatus:"closed"}),u()):t.close()})),t.addEventListener("error",(function(e){t===c?(a.onStateChange({connectionStatus:"error",error:{message:"Websocket Error",error:e}}),u()):t.close()})),t.addEventListener("message",(function(e){if(t===c){var a=JSON.parse(e.data);a.key===n&&a.message&&r.onStateChange(a.message)}else t.close()})),t},c=s(),u=function(){setTimeout((function(){c=s()}),50)};return{send:function(e){if(c.readyState!==WebSocket.OPEN)throw new i.b("Websocket is not open");var t={message:e,key:n};c.send(JSON.stringify(t))},subscribeMessages:r.subscribe,subscribeConnectionEvents:a.subscribe}}}).connect({key:"test"});y.current=t.send;var n=t.subscribeMessages((function(e){l((function(t){return[].concat(u(t),[Object.assign(Object.assign({},e),{},{receivedAtTimestamp:Date.now()})])}))})),r=t.subscribeConnectionEvents((function(e){d((function(t){return[].concat(u(t),[e])}))}));return function(){y.current=null,n.unsubscribe(),r.unsubscribe()}}),[]);var b=Object(r.useState)(""),S=b[0],g=b[1],w=function(){var e;y.current&&(null===(e=y.current)||void 0===e||e.call(y,{text:S,timestamp:Date.now(),senderKey:f}),g(""))};return a.a.createElement(s.h,{style:{padding:4}},a.a.createElement(s.h,{style:{padding:4}},a.a.createElement(s.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),m.map((function(e,t){return a.a.createElement(s.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),a.a.createElement(s.h,{style:{padding:4}},a.a.createElement(s.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),n.map((function(e,t){var n;return a.a.createElement(s.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.timestamp+" "+(e.receivedAtTimestamp-e.timestamp)+": "+(null!==(n=e.text)&&void 0!==n?n:JSON.stringify(e)))}))),a.a.createElement(s.h,{style:{padding:4}},a.a.createElement(s.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send Message"),a.a.createElement(s.h,{style:{flexDirection:"row",alignItems:"center"}},a.a.createElement(s.h,{style:{flex:1,paddingRight:4}},a.a.createElement(s.f,{style:{fontSize:16},value:S,onChange:g,keyboardType:"default",autoCompleteType:"off",onBlur:w,onSubmitEditing:w})),a.a.createElement(s.g,{onPress:w},a.a.createElement(s.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send")))))}}}]);
//# sourceMappingURL=31-ea74b9a906b2f295e262.js.map