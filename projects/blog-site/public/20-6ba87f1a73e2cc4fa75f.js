(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[20],{pAyS:function(t,n,e){"use strict";e.r(n),e.d(n,"DoodleView",(function(){return l}));e("yIC7"),e("p+GS"),e("dtAy"),e("4oWw"),e("nruA"),e("LnO1"),e("XjK0"),e("SCO9"),e("PN9k");var r=e("ERkP"),o=e.n(r);e("zpx+"),e("7dyJ"),e("T7D0");function i(t){return function(t){if(Array.isArray(t))return u(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,n){if(!t)return;if("string"==typeof t)return u(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);"Object"===e&&t.constructor&&(e=t.constructor.name);if("Map"===e||"Set"===e)return Array.from(t);if("Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return u(t,n)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}var l=function(t){var n=Object(r.useState)({width:104,height:104,segments:[]}),e=n[0],i=n[1];return o.a.createElement(o.a.Fragment,null,o.a.createElement(a,{style:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawing:e,onChange:function(t){i(t)}}))},c=function(t){return t.points.length<=0?"":1===t.points.length?"M"+t.points[0].x+" "+t.points[0].y+" L"+t.points[0].x+" "+t.points[0].y:"M"+t.points[0].x+" "+t.points[0].y+" L"+t.points.slice(1).map((function(t){return t.x+" "+t.y})).join(" ")},a=function(t){var n=t.style,e=t.drawing,u=t.onChange,l=n.width/e.width,a=Object(r.useState)(null),s=a[0],f=a[1],h=Object(r.useRef)(null),d=Object(r.useRef)(null),v=function(t){return t.preventDefault(),t.stopPropagation(),t.nativeEvent.cancelBubble=!0,t.nativeEvent.returnValue=!1,!1},p=function(t,n){var e,r,o,i,u=d.current;if(!u)return v(t);var c=u.getBoundingClientRect(),a={clientX:null!==(e=null!==(r=null==n?void 0:n.clientX)&&void 0!==r?r:t.clientX)&&void 0!==e?e:0,clientY:null!==(o=null!==(i=null==n?void 0:n.clientY)&&void 0!==i?i:t.clientY)&&void 0!==o?o:0};return h.current={clientX:a.clientX,clientY:a.clientY,x:Math.floor((a.clientX-c.x)/l),y:Math.floor((a.clientY-c.y)/l)},f({points:[{x:h.current.x,y:h.current.y}]}),v(t)},g=function(t){var n=s;return n?(u(Object.assign(Object.assign({},e),{},{segments:[].concat(i(e.segments),[n])})),f(null),h.current=null,v(t)):v(t)},y=function(t,n){var e,r,o,u;if(!h.current)return v(t);var c=null!==(e=null!==(r=null==n?void 0:n.clientX)&&void 0!==r?r:t.clientX)&&void 0!==e?e:0,a=null!==(o=null!==(u=null==n?void 0:n.clientY)&&void 0!==u?u:t.clientY)&&void 0!==o?o:0;return function(t){f((function(n){if(!n)return null;var e=n.points[n.points.length-1];return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)<=2?n:{points:[].concat(i(n.points),[t])}}))}({x:Math.floor((c-h.current.clientX)/l)+h.current.x,y:Math.floor((a-h.current.clientY)/l)+h.current.y}),v(t)};return Object(r.useEffect)((function(){var t=function(t){return!h.current||(t.preventDefault(),t.stopPropagation(),t.cancelBubble=!0,t.returnValue=!1,!1)};return document.addEventListener("touchmove",t,{passive:!1}),function(){document.removeEventListener("touchmove",t)}}),[]),o.a.createElement("div",{style:{position:"relative",width:n.width,height:n.height,backgroundColor:n.backgroundColor}},o.a.createElement("svg",{style:{width:n.width,height:n.height},viewBox:"0 0 "+e.width+" "+e.height,preserveAspectRatio:"none",xmlns:"http://www.w3.org/2000/svg"},e.segments.map((function(t,e){return o.a.createElement("path",{key:e,d:c(t),stroke:n.color,fill:"transparent"})})),s&&o.a.createElement("path",{d:c(s),stroke:n.color,fill:"transparent"})),o.a.createElement("div",{ref:d,style:{position:"absolute",left:0,right:0,top:0,bottom:0,zIndex:10},onMouseDown:p,onMouseUp:g,onMouseMove:y,onMouseLeave:g,onTouchStart:function(t){return p(t,t.touches[0])},onTouchEnd:g,onTouchCancel:g,onTouchMove:function(t){return y(t,t.touches[0])},onTouchEndCapture:g}," "))}}}]);
//# sourceMappingURL=20-6ba87f1a73e2cc4fa75f.js.map