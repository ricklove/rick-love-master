(this["webpackJsonpcra-template"]=this["webpackJsonpcra-template"]||[]).push([[4],{18:function(e,t,n){"use strict";n.r(t),n.d(t,"App",(function(){return O}));var r=n(0),a=n.n(r),c=n(29),u=n(28),o=n(1),i=n.n(o),l=n(3),s=n(4),f=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise((function(t){setTimeout(t,e)}))},p=function(){var e=Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(250);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),b={loadData:function(){var e=Object(l.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p();case 2:if(e.prev=2,t=localStorage.getItem("todo")){e.next=6;break}return e.abrupt("return",null);case 6:return e.abrupt("return",JSON.parse(t));case 9:return e.prev=9,e.t0=e.catch(2),e.abrupt("return",null);case 12:case"end":return e.stop()}}),e,null,[[2,9]])})));return function(){return e.apply(this,arguments)}}(),saveData:function(){var e=Object(l.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p();case 2:localStorage.setItem("todo",JSON.stringify(t));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},m={container:{padding:4,backgroundColor:"#000000",color:"#FFFFFF"},itemContainer:{margin:4,padding:4,backgroundColor:"#333333",color:"#FFFFFF"},row:{display:"flex",flex:1,flexDirection:"row",alignItems:"center"},flex1:{display:"flex",flex:1},button:{margin:4,padding:8,backgroundColor:"#111111"}},d=function(){return{key:"".concat(Date.now(),":").concat(Math.random()),text:"New Task",isDone:!1}},v=function(e){var t=Object(r.useState)([]),n=Object(s.a)(t,2),c=n[0],o=n[1],f=Object(r.useState)(!0),p=Object(s.a)(f,2),v=p[0],O=p[1],j=Object(r.useState)(null),E=Object(s.a)(j,2),w=E[0],k=E[1],g=Object(r.useRef)(!0);Object(r.useEffect)((function(){return Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x();case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))(),function(){g.current=!1}}),[]);var x=function(){var e=Object(l.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return O(!0),e.prev=1,e.next=4,b.loadData();case 4:if(n=e.sent,g.current){e.next=7;break}return e.abrupt("return");case 7:o(null!==(t=null===n||void 0===n?void 0:n.items)&&void 0!==t?t:[d()]),O(!1),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(1),k({message:"Failed to load data"});case 14:case"end":return e.stop()}}),e,null,[[1,11]])})));return function(){return e.apply(this,arguments)}}(),h=function(){var e=Object(l.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c){e.next=2;break}return e.abrupt("return");case 2:return O(!0),e.prev=3,e.next=6,b.saveData({items:c});case 6:if(g.current){e.next=8;break}return e.abrupt("return");case 8:O(!1),e.next=14;break;case 11:e.prev=11,e.t0=e.catch(3),k({message:"Failed to load data"});case 14:case"end":return e.stop()}}),e,null,[[3,11]])})));return function(){return e.apply(this,arguments)}}(),D=function(e){o((function(t){return t.map((function(t){return t.key===e.key?e:t}))}))},C=function(e){o((function(t){return t.filter((function(t){return t.key!==e.key}))}))};return w?a.a.createElement("div",{style:m.container},a.a.createElement("div",{style:m.row},a.a.createElement("span",null,"\u2757 ".concat(w.message)))):a.a.createElement("div",{style:m.container},v&&a.a.createElement("div",{style:m.row},a.a.createElement("span",null,"\ud83d\udd52 Loading")),a.a.createElement("div",{style:m.row},a.a.createElement("div",{style:m.flex1}),a.a.createElement("div",{style:m.button,onClick:x},a.a.createElement("span",null,"\ud83d\udcbd Reload")),a.a.createElement("div",{style:m.button,onClick:h},a.a.createElement("span",null,"\ud83d\udcbe Save"))),c.map((function(e){return a.a.createElement(y,{key:e.key,item:e,onChange:D,onDelete:C})})),a.a.createElement("div",{style:m.row},a.a.createElement("div",{style:m.button,onClick:function(){o((function(e){return[].concat(Object(u.a)(e),[d()])}))}},a.a.createElement("span",null,"\u2795 Add"))))},y=function(e){var t=Object(r.useState)(!1),n=Object(s.a)(t,2),u=n[0],o=n[1],i=Object(r.useState)(e.item.text),l=Object(s.a)(i,2),f=l[0],p=l[1],b=function(){o(!1),e.onChange(Object(c.a)({},e.item,{text:f}))};return a.a.createElement("div",{style:m.itemContainer},!u&&a.a.createElement("div",{style:m.row,onClick:function(){e.onChange(Object(c.a)({},e.item,{isDone:!e.item.isDone}))}},a.a.createElement("div",null,a.a.createElement("span",null,e.item.isDone?"\u2714 \ud83d\udc31\u200d\ud83c\udfcd ":"\u25fb \ud83d\ude3e ")),a.a.createElement("div",{style:m.flex1},a.a.createElement("span",null,f)),a.a.createElement("div",{style:m.button,onClick:function(e){e.preventDefault(),o(!0)}},a.a.createElement("span",null,"\u270f Edit")),a.a.createElement("div",{style:m.button,onClick:function(t){t.preventDefault(),e.onDelete(e.item)}},a.a.createElement("span",null,"\u274c Delete"))),u&&a.a.createElement("div",{style:m.row},a.a.createElement("input",{style:m.flex1,type:"text",value:f,autoFocus:!0,onChange:function(e){return p(e.target.value)},onBlur:function(e){e.preventDefault(),b()},onKeyDown:function(e){"Enter"===e.key&&(e.preventDefault(),b())}}),a.a.createElement("div",{style:m.button,onClick:b},a.a.createElement("span",null,"\u2714 Done"))))},O=function(e){return a.a.createElement(v,null)}},28:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n(2);var a=n(5);function c(e){return function(e){if(Array.isArray(e))return Object(r.a)(e)}(e)||function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||Object(a.a)(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},29:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}n.d(t,"a",(function(){return c}))}}]);
//# sourceMappingURL=4.f87f572a.chunk.js.map