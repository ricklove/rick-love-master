(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[20],{"9GY0":function(e,t,n){"use strict";n.r(t),n.d(t,"EducationalGame_Doodle_Spelling",(function(){return H}));n("yKDW"),n("dtAy");var r=n("a1TR"),a=n.n(r),o=(n("3yYM"),n("ERkP")),c=n.n(o),i=n("DTYs"),u=(n("yIC7"),n("p+GS"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9"),n("KI7T"),n("PN9k"),n("4cHy")),s=n("hsFx"),l=n("Vgox"),f=n("1U25"),p=n("X2o9"),d=n("MWkW");function m(e){return function(e){if(Array.isArray(e))return g(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return g(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return g(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function w(e,t,n,r,a,o,c){try{var i=e[o](c),u=i.value}catch(s){return void n(s)}i.done?t(u):Promise.resolve(u).then(r,a)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function c(e){w(o,r,a,c,i,"next",e)}function i(e){w(o,r,a,c,i,"throw",e)}c(void 0)}))}}var y=function(){try{var e;return JSON.parse(null!==(e=localStorage.getItem("doodleStorage"))&&void 0!==e?e:"NULL!{}")}catch(t){return null}},h=function(e){localStorage.setItem("doodleStorage",JSON.stringify(e))},b=function(){var e,t,n,r=Object(l.a)(f.a),o=y(),c=null!==(e=null==o?void 0:o.uploadUrl)&&void 0!==e?e:null;return{load:(n=v(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c){e.next=2;break}return e.abrupt("return",{doodles:[]});case 2:return e.next=4,Object(p.b)(c.getUrl);case 4:return t=e.sent,e.abrupt("return",t);case 6:case"end":return e.stop()}}),e)}))),function(){return n.apply(this,arguments)}),save:(t=v(a.a.mark((function e(t){var n,o,i,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c){e.next=5;break}return e.next=3,r.createUploadUrl({prefix:"doodle"});case 3:c=e.sent.uploadUrl,h({uploadUrl:c});case 5:return e.prev=5,n=Object(p.a)(c),e.next=9,n.uploadData(t);case 9:e.next=20;break;case 11:return e.prev=11,e.t0=e.catch(5),e.next=15,r.renewUploadUrl({uploadUrl:c});case 15:return c=e.sent.uploadUrl,h({uploadUrl:c}),o=Object(p.a)(c),e.next=20,o.uploadData(t);case 20:return e.next=22,r.createUploadUrl({prefix:c.relativePath+"/backup"});case 22:return i=e.sent.uploadUrl,u=Object(p.a)(i),e.next=26,u.uploadData(t);case 26:case"end":return e.stop()}}),e,null,[[5,11]])}))),function(e){return t.apply(this,arguments)})}},x=function(){var e=v(a.a.mark((function e(){var t,n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=b(),n={doodles:[]},e.next=4,t.load();case 4:return n.doodles=e.sent.doodles.map((function(e){return Object.assign(Object.assign({},e),{},{drawing:e.drawingEncoded?Object(d.a)(e.drawingEncoded):e.drawing})})),r={saveDrawing:function(){var e=v(a.a.mark((function e(r,o){var c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c={key:r.substr(0,8)+":"+Date.now()+":"+Math.floor(999999*Math.random()),drawing:o,prompt:r},n.doodles.push(c),setTimeout(v(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.save({doodles:n.doodles.map((function(e){return Object.assign(Object.assign({},e),{},{drawing:void 0,drawingEncoded:Object(d.d)(e.drawing)})}))});case 2:case"end":return e.stop()}}),e)}))));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),saveBestDrawingSelection:function(){var e=v(a.a.mark((function e(r){var o,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(c=n.doodles.find((function(e){return e.key===r.key}))){e.next=3;break}return e.abrupt("return");case 3:c.score=(null!==(o=c.score)&&void 0!==o?o:0)+1,setTimeout(v(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.save({doodles:n.doodles.map((function(e){return Object.assign(Object.assign({},e),{},{drawing:void 0,drawingEncoded:Object(d.d)(e.drawing)})}))});case 2:case"end":return e.stop()}}),e)}))));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getDrawings:function(){var e=v(a.a.mark((function e(t,r){var o,c,i,l,f,p,d,g,w;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return c=(o=null!=r?r:{}).includeOtherPrompts,i=void 0!==c&&c,l=o.maxCount,f=void 0===l?4:l,p=n.doodles.filter((function(e){return e.prompt===t})),d=i?n.doodles.filter((function(e){return e.prompt!==t})):[],g=i?[Object(u.b)(p)].concat(m(Object(s.e)(d).slice(0,f-1))):p,w=Object(s.e)(g).slice(0,f),e.abrupt("return",{doodles:w});case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},e.abrupt("return",r);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),E=n("njmQ"),O=n("pAyS"),S=n("yxiS");n("T3IU"),n("DZyD"),n("3eMz"),n("ZXCn"),n("T7D0");function j(e){return function(e){if(Array.isArray(e))return k(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return k(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return k(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function k(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var D={rows:[{keys:"qwertyuiop".split("")},{keys:" asdfghjkl".split("")},{keys:"  zxcvbnm ".split("")}]},F={container:{},rowView:{flex:1,flexDirection:"row"},keyView:{margin:2,padding:2,width:20,height:20,backgroundColor:"#111111",justifyContent:"center",alignItems:"center"},keyView_disabled:{opacity:.5},keyText:{fontSize:16},keyText_wrong:{fontSize:16,color:"#FF0000"}},C=function(e){var t=e.expectedCharacter,n=e.showHints,r=e.onExpectedKeyPress,a=D,u=Object(o.useState)(null),l=u[0],f=u[1],p=Object(o.useState)([]),d=p[0],m=p[1];Object(o.useEffect)((function(){n||f(null);var e=[t].concat(j(Object(s.e)(a.rows.flatMap((function(e){return e.keys})).map((function(e){return e.trim()})).filter((function(e){return e}))).slice(0,3)));f(e),m([])}),[t,n]);return c.a.createElement(c.a.Fragment,null,c.a.createElement(i.h,{style:F.container},a.rows.map((function(e,a){return c.a.createElement(i.h,{style:F.rowView,key:""+a},e.keys.map((function(e,a){return c.a.createElement(i.g,{key:""+e+a,style:{outline:"none"},onPress:function(){var a;(a=e)!==t?n&&(f((function(e){return(null!=e?e:[]).filter((function(e){return e!==a}))})),m((function(e){return[].concat(j(e),[a])}))):r()}},c.a.createElement(i.h,{style:!l||l.includes(e)?{}:F.keyView_disabled},c.a.createElement(i.h,{style:F.keyView},c.a.createElement(i.e,{style:d.includes(e)?F.keyText_wrong:F.keyText},e))))})))}))))};function A(e,t,n,r,a,o,c){try{var i=e[o](c),u=i.value}catch(s){return void n(s)}i.done?t(u):Promise.resolve(u).then(r,a)}function T(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function c(e){A(o,r,a,c,i,"next",e)}function i(e){A(o,r,a,c,i,"throw",e)}c(void 0)}))}}var U={container:{alignItems:"center"},drawing:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawingChoicesView:{maxWidth:332,flexDirection:"row",flexWrap:"wrap"},drawingChoiceWrapper:{padding:4},drawingChoice:{width:78,height:78,color:"#FFFFFF",backgroundColor:"#000000"},promptView:{justifyContent:"center",alignItems:"center"},promptText:{fontSize:20},buttonView:{padding:8,backgroundColor:"#111111"},buttonText:{fontSize:20,color:"#FFFF00"}},V=function(e){var t=Object(o.useState)(0),n=t[0],r=t[1];return c.a.createElement(c.a.Fragment,null,c.a.createElement(_,Object.assign({},e,{problemSourceKey:n})),c.a.createElement(S.a,{problemService:e.problemService,onOpen:function(){},onClose:function(){},onSubjectNavigation:function(){r((function(e){return e+1}))}}))},_=function(e){var t,n,r,i,u=Object(o.useState)(null),s=u[0],l=u[1],f=Object(o.useState)("type"),p=f[0],d=f[1],m=Object(o.useState)(null),g=m[0],w=m[1],v=Object(o.useRef)(null!==(t=null==s||null===(n=s.answers.find((function(e){return e.isCorrect})))||void 0===n?void 0:n.value)&&void 0!==t?t:"");v.current=null!==(r=null==s||null===(i=s.answers.find((function(e){return e.isCorrect})))||void 0===i?void 0:i.value)&&void 0!==r?r:"";var y=function(){var t,n=e.problemService.getNextProblem();n.question&&(l(n),setTimeout(x),null===(t=n.onQuestion)||void 0===t||t.call(n))};Object(o.useEffect)((function(){y()}),[e.problemSourceKey]);var h=Object(E.a)(),b=(h.loading,h.error,h.doWork),x=function(){b(function(){var t=T(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(v.current);case 2:r=t.sent,w(r.doodles),d("type");case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},O=function(){d("drawPrompt")},S=function(){b(function(){var t=T(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(v.current);case 2:if(r=t.sent,n(),!(r.doodles.length<=1)){t.next=7;break}return y(),t.abrupt("return");case 7:w(r.doodles),d("chooseBest");case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return s?"type"===p?c.a.createElement(c.a.Fragment,null,c.a.createElement(z,{prompt:v.current,drawings:null!=g?g:[],onDone:function(){b(function(){var e=T(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:setTimeout(O);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}})):"chooseBest"===p&&g?c.a.createElement(c.a.Fragment,null,c.a.createElement(I,{prompt:v.current,drawings:g,onChooseBest:function(t){b(function(){var n=T(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.drawingStorage.saveBestDrawingSelection(t);case 2:r(),y();case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}})):c.a.createElement(c.a.Fragment,null,c.a.createElement(P,{prompt:v.current,onDone:function(t){b(function(){var n=T(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(t.segments.length>0)){n.next=3;break}return n.next=3,e.drawingStorage.saveDrawing(v.current,t);case 3:r(),setTimeout(S);case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}})):c.a.createElement(c.a.Fragment,null)},P=function(e){var t=Object(o.useState)(Object(d.b)()),n=t[0],r=t[1];return Object(o.useEffect)((function(){r(Object(d.b)())}),[e.prompt]),c.a.createElement(i.h,{style:U.container},c.a.createElement(O.DoodleDrawerView,{style:U.drawing,drawing:n,onChange:function(e){r(e)}}),c.a.createElement(i.h,{style:U.promptView},c.a.createElement(i.e,{style:U.promptText},e.prompt)),c.a.createElement(i.g,{onPress:function(){e.onDone(n)}},c.a.createElement(i.h,{style:U.buttonView},c.a.createElement(i.e,{style:U.buttonText},"Done"))))},I=function(e){return c.a.createElement(i.h,{style:U.container},c.a.createElement(i.h,{style:U.promptView},c.a.createElement(i.e,{style:U.promptText},e.prompt)),c.a.createElement(i.h,{style:U.drawingChoicesView},e.drawings.map((function(t){return c.a.createElement(i.g,{onPress:function(){return e.onChooseBest(t)}},c.a.createElement(i.h,{style:U.drawingChoiceWrapper},c.a.createElement(O.DoodleDisplayView,{style:U.drawingChoice,drawing:t.drawing})))}))))},W={completedText:{fontSize:16,color:"#FFFF00"}},z=function(e){var t,n=Object(o.useState)({completed:"",remaining:e.prompt}),r=n[0],a=n[1];Object(o.useEffect)((function(){a({completed:"",remaining:e.prompt})}),[e.prompt,e.drawings]);return c.a.createElement(i.h,{style:U.container},c.a.createElement(i.h,{style:U.drawingChoicesView},e.drawings.map((function(e){return c.a.createElement(i.h,{style:U.drawingChoiceWrapper},c.a.createElement(O.DoodleDisplayView,{style:U.drawingChoice,drawing:e.drawing}))}))),c.a.createElement(i.h,null,c.a.createElement(i.e,{style:W.completedText},r.completed+(r.remaining.length>0?"_":""))),c.a.createElement(C,{expectedCharacter:null!==(t=r.remaining[0])&&void 0!==t?t:" ",showHints:!0,onExpectedKeyPress:function(){a((function(t){t.remaining.length<=1&&e.onDone();var n=t.remaining[0];return{completed:t.completed+n,remaining:t.remaining.substr(1)}}))}}))},L=n("aLR2"),K=n("9u8u"),B=n("oo7O"),M=n("DZ/V"),N=n("yyXn");function R(e,t,n,r,a,o,c){try{var i=e[o](c),u=i.value}catch(s){return void n(s)}i.done?t(u):Promise.resolve(u).then(r,a)}var H=function(e){var t=Object(o.useRef)(Object(L.a)()),n=Object(o.useState)("web"!==i.c.OS),r=n[0],u=n[1],s=Object(E.a)(),l=s.loading,f=(s.error,s.doWork),p=Object(o.useRef)(null);if(Object(o.useEffect)((function(){f(function(){var e,t=(e=a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x();case 2:p.current=e.sent;case 3:case"end":return e.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function c(e){R(o,r,a,c,i,"next",e)}function i(e){R(o,r,a,c,i,"throw",e)}c(void 0)}))});return function(e){return t.apply(this,arguments)}}())}),[]),!r){return c.a.createElement(i.h,null,c.a.createElement(M.a,{languange:"en",speechService:t.current}),c.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void u(!0)}},c.a.createElement(i.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},c.a.createElement(i.e,{style:{fontSize:36}},"Start"))))}return l||!p.current?c.a.createElement(c.a.Fragment,null,c.a.createElement(i.a,{size:"large",color:"#FFFF00"})):c.a.createElement(V,{problemService:Object(N.a)(Object(K.a)(Object(B.a)({speechService:t.current,sectionSize:8}),{}),"ProblemsSpellingDoodle"),drawingStorage:p.current})}}}]);
//# sourceMappingURL=20-0671319a3633288e9e2a.js.map