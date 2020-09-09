(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[14],{"9NqP":function(e,t,n){"use strict";var r=n("TPJk"),l=n("GU4h"),c=n("u2Rj"),a=n("EkxP"),o=n("2VH3")("isConcatSpreadable");e.exports=function e(t,n,i,s,u,m,f,y){for(var d,h,E=u,g=0,p=!!f&&a(f,y,3);g<s;){if(g in i){if(d=p?p(i[g],g,n):i[g],h=!1,l(d)&&(h=void 0!==(h=d[o])?!!h:r(d)),h&&m>0)E=e(t,n,d,c(d.length),E,m-1)-1;else{if(E>=9007199254740991)throw TypeError();t[E]=d}E++}g++}return E}},MMnB:function(e,t,n){"use strict";n.r(t),n.d(t,"EducationalGame_MultiplesLargeBoard",(function(){return x})),n.d(t,"ProblemView",(function(){return b}));n("yIC7"),n("p+GS"),n("dtAy"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9"),n("T3IU"),n("DZyD"),n("ZXCn"),n("PN9k");var r=n("ERkP"),l=n.n(r),c=n("DTYs"),a=n("4cHy"),o={container:{flex:1,flexDirection:"row",justifyContent:"space-between",alignItems:"center",padding:16},section:{justifyContent:"center",alignItems:"center",padding:16},row:{flexDirection:"row"},cellTouch:{outline:"none"},cellView:{margin:2,width:32,height:32,justifyContent:"center",alignItems:"center",borderWidth:1,borderStyle:"solid",outline:"none"},cellText:{userSelect:"none"},cellEmptyView:{margin:2,width:32,height:32}},i=function(e){var t=e.onMove,n=Object.assign(Object.assign({},o.cellView),e.style);return l.a.createElement(c.h,{style:o.container},l.a.createElement(c.h,{style:o.section},l.a.createElement(c.h,{style:o.row},l.a.createElement(c.h,{style:o.cellEmptyView}),l.a.createElement(c.g,{style:o.cellTouch,onPress:function(){return t({x:0,y:1})}},l.a.createElement(c.h,{style:n},l.a.createElement(c.e,{style:o.cellText},"⬆"))),l.a.createElement(c.h,{style:o.cellEmptyView})),l.a.createElement(c.h,{style:o.row},l.a.createElement(c.g,{style:o.cellTouch,onPress:function(){return t({x:-1,y:0})}},l.a.createElement(c.h,{style:n},l.a.createElement(c.e,{style:o.cellText},"⬅"))),l.a.createElement(c.h,{style:o.cellEmptyView}),l.a.createElement(c.g,{style:o.cellTouch,onPress:function(){return t({x:1,y:0})}},l.a.createElement(c.h,{style:n},l.a.createElement(c.e,{style:o.cellText},"➡")))),l.a.createElement(c.h,{style:o.row},l.a.createElement(c.h,{style:o.cellEmptyView}),l.a.createElement(c.g,{style:o.cellTouch,onPress:function(){return t({x:0,y:-1})}},l.a.createElement(c.h,{style:n},l.a.createElement(c.e,{style:o.cellText},"⬇"))),l.a.createElement(c.h,{style:o.cellEmptyView}))),l.a.createElement(c.h,{style:o.section},l.a.createElement(c.h,{style:o.row},e.buttons.map((function(e){return l.a.createElement(l.a.Fragment,{key:""+e.text},l.a.createElement(c.h,{style:o.cellEmptyView}),l.a.createElement(c.g,{style:o.cellTouch,onPress:e.onPress},l.a.createElement(c.h,{style:n},l.a.createElement(c.e,{style:o.cellText},e.text))))})))))},s=n("7h3R");function u(e){return function(e){if(Array.isArray(e))return m(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var f="#000000",y="#000000",d="transparent",h="#7777FF55",E="#333333",g="#000033",p={problemView:{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center",padding:16},problemText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:20,color:"#FFFF00"}},x=function(e){var t=Object(r.useState)(w()),n=t[0],o=t[1],i=Object(r.useRef)(n),u=Object(r.useState)(0),m=u[0],f=u[1],y=function(){var e=i.current.columns.flatMap((function(e){return e.cells})).filter((function(e){return!e.text}));if(0!==e.length){var t=e[Object(a.a)(e.length)];f(t.value)}else f(0)};return Object(r.useEffect)((function(){y()}),[]),i.current=n,l.a.createElement(l.a.Fragment,null,l.a.createElement(c.h,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},l.a.createElement(c.h,{style:{alignItems:"center"}},l.a.createElement(v,{gameBoard:n}),l.a.createElement(b,{problem:m}),l.a.createElement(T,{gameBoard:n,onChangeFocus:function(e){var t=e,n=i.current.size;t.i=t.i<0?0:t.i>n-1?n-1:t.i,t.j=t.j<0?0:t.j>n-1?n-1:t.j;var r=i.current;o(Object.assign(Object.assign({},r),{},{key:r.key+1,focus:t}))},buttons:[{text:"🔴",onPress:function(){var e=i.current,t=e.columns[e.focus.i].cells[e.focus.j];if(t.value===m)return s.ProgressGameService.onCorrect(),t.text=""+t.value,e.columns.forEach((function(e){return e.cells.forEach((function(e){"❌"===e.text&&(e.text="")}))})),void y();t.text="❌",o(Object.assign(Object.assign({},e),{},{key:e.key+1}))}}]}))))},b=function(e){return l.a.createElement(c.h,{style:p.problemView},l.a.createElement(c.e,{style:p.problemText},""+e.problem))},w=function(){var e=2+Object(a.a)(6),t=2+Object(a.a)(6);return{key:0,size:5,columns:u(new Array(5)).map((function(n,r){return{i:r,c:r+e,cells:u(new Array(5)).map((function(n,l){return{i:r,j:l,c:r+e,r:l+t,value:(r+e)*(l+t),text:"",bodyIndex:0,connected:{t:!1,b:!1,l:!1,r:!1}}}))}})),focus:{i:Math.floor(2.5),j:Math.floor(2.5)}}},j={cellView:{width:24,height:24,justifyContent:"center",alignItems:"center"},cellText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"},cellHeaderView:{},focusCellHeaderView:{},cellHeaderText:{},focusCellHeaderText:{}},v=function(e){var t=e.gameBoard,n=t.focus,r=function(e){var t=e.i,r=e.j,l=e.c,c=e.r,a=n.i===t&&n.j===r?"row col":n.i===t?"col":n.j===r?"row":"",o=a.includes("row")?y:f,i=a.includes("col")?y:f,s=a.includes("row")?h:d,u=a.includes("col")?h:d;return[j.cellView,{width:4*l,height:4*c,margin:2,borderWidth:0,background:"\n        repeating-linear-gradient("+o+" 0px, "+o+" 0.5px, "+s+" 0.5px, "+s+" 3.5px, "+o+" 3.5px, "+o+" 4px), \n        repeating-linear-gradient(0.25turn, "+i+" 0px, "+i+" 0.5px, "+u+" 0.5px, "+u+" 3.5px, "+i+" 3.5px, "+i+" 4px)\n        "}]},a=function(e){return e.c<2?[j.cellText,{fontSize:8}]:j.cellText};return l.a.createElement(l.a.Fragment,null,l.a.createElement(c.h,{style:{flexDirection:"row"}},l.a.createElement(c.h,{style:{flexDirection:"column-reverse"}},l.a.createElement(c.h,{style:[].concat(u(r(t.columns[0].cells[0])),[{background:void 0}])},l.a.createElement(c.e,{style:j.focusCellHeaderText}," ")),t.columns[0].cells.map((function(e){return l.a.createElement(c.h,{key:e.r,style:[].concat(u(r(e)),[{background:void 0}])},l.a.createElement(c.e,{style:n.j===e.j?j.focusCellHeaderText:j.cellHeaderText},""+e.r))}))),t.columns.map((function(e){return l.a.createElement(c.h,{key:e.c,style:{flexDirection:"column-reverse"}},l.a.createElement(c.h,{style:[].concat(u(r(e.cells[0])),[{background:void 0}])},l.a.createElement(c.e,{style:n.i===e.i?j.focusCellHeaderText:j.cellHeaderText},""+e.c)),e.cells.map((function(e){return l.a.createElement(c.h,{key:e.r,style:r(e)},l.a.createElement(c.e,{style:a(e)},function(e){return""+e.text}(e)))})))}))))},T=function(e){return l.a.createElement(i,{style:{backgroundColor:E,borderColor:g},onMove:function(t){return n=t.x,r=t.y,void e.onChangeFocus({i:e.gameBoard.focus.i+n,j:e.gameBoard.focus.j+r});var n,r},buttons:e.buttons})}},ZXCn:function(e,t,n){"use strict";var r=n("7zcn"),l=n("9NqP"),c=n("ecHh"),a=n("u2Rj"),o=n("09V9"),i=n("ao8i");r(r.P,"Array",{flatMap:function(e){var t,n,r=c(this);return o(e),t=a(r.length),n=i(r,0),l(n,r,r,t,0,1,e,arguments[1]),n}}),n("lrpY")("flatMap")}}]);
//# sourceMappingURL=14-d2b18aec0eeab61d97fe.js.map