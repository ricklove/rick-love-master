(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[24],{WxTU:function(e,n,t){"use strict";t.r(n),t.d(n,"ConsoleSimulator",(function(){return c}));var r=t("VtSi"),o=t.n(r),a=(t("3yYM"),t("QsI/")),u=(t("zQlN"),t("ERkP")),i=t.n(u),l=t("zkcw"),c=function(e){var n,t=Object(u.useRef)(null),r=function(){var e;null===(e=t.current)||void 0===e||e.focus()};Object(u.useEffect)((function(){e.focusOnLoad&&r()}),[e.focusOnLoad]);var c=Object(u.useState)(!1),s=c[0],p=c[1],f=Object(u.useState)(""),m=f[0],d=f[1],E=Object(u.useState)({prompt:e.initialPrompt,lines:[],isExpanded:!1}),v=E[0],x=v.prompt,O=v.lines,b=v.isExpanded,C=E[1],w=function(n){var r,o=O;if(n.addDivider&&o.push({text:"---"}),null===(r=n.output)||void 0===r||r.split("\n").map((function(e){return e.trim()})).filter((function(e){return e})).forEach((function(e){return o.push({prefix:"",text:e})})),n.Component&&o.push({Component:n.Component}),n.quit)return d(""),void C((function(n){return{prompt:e.initialPrompt,lines:[],isExpanded:!1}}));C((function(e){var t;return Object.assign({},e,{prompt:null!==(t=n.prompt)&&void 0!==t?t:e.prompt,lines:o})})),setTimeout((function(){if(t.current){var e=t.current.getBoundingClientRect(),n=window.pageYOffset||document.documentElement.scrollTop,r=e.top+n-.5*window.innerHeight;r>0&&window.scrollTo({left:0,top:r,behavior:"smooth"})}}),50)},y=function(){var n=Object(a.a)(o.a.mark((function n(){var t,r;return o.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return(t=O).push({prefix:x+" ",text:m}),d(""),C((function(e){return Object.assign({},e,{prompt:"",lines:t,isExpanded:!0})})),n.next=6,Object(l.a)(100);case 6:return n.next=8,e.onCommand(m,w);case 8:r=n.sent,w(r);case 10:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}(),h=null!==(n=e.forceExpanded)&&void 0!==n?n:b;return i.a.createElement("div",{className:"console-simulator",style:{display:h?"block":"inline-block"},onClick:r},h&&i.a.createElement("span",null,"v1.1.0"),h&&O.map((function(e,n){return i.a.createElement("div",{key:n},i.a.createElement("span",null,e.prefix),i.a.createElement("span",null,e.text),e.Component&&i.a.createElement("span",null,i.a.createElement(e.Component,null)))})),i.a.createElement("div",{style:{display:h?"block":"inline-block"}},i.a.createElement("span",null,x," "),i.a.createElement("span",null,m),i.a.createElement("span",{className:"console-simulator-cursor",style:s?{}:{backgroundColor:"#000000"}}," "),i.a.createElement("input",{type:"text",ref:t,style:{opacity:0},autoCorrect:"off",autoCapitalize:"none",value:m,onFocus:function(){return p(!0)},onBlur:function(){return p(!1)},onChange:function(e){return d(e.target.value)},onKeyPress:function(e){return"Enter"===e.key&&y()}})))}}}]);
//# sourceMappingURL=24-00fd2ad558c49623b11d.js.map