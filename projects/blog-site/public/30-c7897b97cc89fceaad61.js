(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[30],{XFco:function(e,t,n){"use strict";n.r(t),n.d(t,"WebsocketClientTestView",(function(){return f}));n("yIC7"),n("p+GS"),n("dtAy"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9");var r=n("ERkP"),a=n.n(r),o=n("DTYs"),s=n("EsTT"),c=n("9DGK"),i="wss://p4w1a7ysk8.execute-api.us-east-1.amazonaws.com/prod";function u(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var f=function(e){var t=Object(r.useState)([]),n=t[0],l=t[1],f=Object(r.useState)([]),p=f[0],b=f[1],d=Object(r.useRef)(null);Object(r.useEffect)((function(){var e,t=(e={websocketsApiUrl:i},{connect:function(t){var n=t.key,r=Object(s.a)(),a=Object(s.a)(),o=new WebSocket(""+e.websocketsApiUrl);return o.addEventListener("open",(function(e){a.onStateChange({connectionStatus:"opened"});var t={message:null,key:n};o.send(JSON.stringify(t))})),o.addEventListener("close",(function(t){a.onStateChange({connectionStatus:"closed"}),setTimeout((function(){o=new WebSocket(e.websocketsApiUrl)}),50)})),o.addEventListener("error",(function(t){a.onStateChange({connectionStatus:"error",error:{message:"Websocket Error",error:t}}),setTimeout((function(){o=new WebSocket(e.websocketsApiUrl)}),50)})),o.addEventListener("message",(function(e){var t=JSON.parse(e.data);t.key===n&&t.message&&r.onStateChange(t.message)})),{send:function(e){if(o.readyState!==WebSocket.OPEN)throw new c.b("Websocket is not open");var t={message:e,key:n};o.send(JSON.stringify(t))},subscribeMessages:r.subscribe,subscribeConnectionEvents:a.subscribe}}}).connect({key:"test"});d.current=t.send;var n=t.subscribeMessages((function(e){l((function(t){return[].concat(u(t),[e])}))})),r=t.subscribeConnectionEvents((function(e){b((function(t){return[].concat(u(t),[e])}))}));return function(){d.current=null,n.unsubscribe(),r.unsubscribe()}}),[]);var y=Object(r.useState)(""),S=y[0],m=y[1];return a.a.createElement(o.h,{style:{padding:4}},a.a.createElement(o.h,{style:{padding:4}},a.a.createElement(o.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),p.map((function(e,t){return a.a.createElement(o.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),a.a.createElement(o.h,{style:{padding:4}},a.a.createElement(o.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),n.map((function(e,t){return a.a.createElement(o.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.text)}))),a.a.createElement(o.h,{style:{padding:4}},a.a.createElement(o.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send Message"),a.a.createElement(o.h,{style:{flexDirection:"row",alignItems:"center"}},a.a.createElement(o.h,{style:{flex:1,paddingRight:4}},a.a.createElement(o.f,{value:S,onChange:m,keyboardType:"default",autoCompleteType:"off"})),a.a.createElement(o.g,{onPress:function(){var e;d.current&&(null===(e=d.current)||void 0===e||e.call(d,{text:S}),m(""))}},a.a.createElement(o.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Send")))))}}}]);
//# sourceMappingURL=30-c7897b97cc89fceaad61.js.map