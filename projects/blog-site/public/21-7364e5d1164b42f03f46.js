(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[21],{"9GY0":function(e,t,n){"use strict";n.r(t),n.d(t,"EducationalGame_Doodle_Spelling",(function(){return K}));var r=n("a1TR"),a=n.n(r),o=(n("3yYM"),n("Ab9Y")),c=n("ERkP"),i=n.n(c),u=n("DTYs"),l=n("t8gp"),s=n("4cHy"),d=n("hsFx"),p=n("1U25"),f=n("X2o9"),m=n("+tC1"),w=n("MWkW"),g="doodle/drawings",b="doodle/votes",v=function(){try{var e;return JSON.parse(null!==(e=localStorage.getItem("doodleStorage"))&&void 0!==e?e:"NULL!{}")}catch(t){return null}},h=function(e){localStorage.setItem("doodleStorage",JSON.stringify(e))},y=function(){var e=Object(o.a)(a.a.mark((function e(){var t,n,r,c,i,u,y,x,k;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=Object(f.a)({getUploadUrl:function(){var e=Object(o.a)(a.a.mark((function e(){var t,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",null!==(t=null===(n=v())||void 0===n?void 0:n.doodleUploadUrl)&&void 0!==t?t:null);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),setUploadUrl:function(){var e=Object(o.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",h(Object.assign({},null!==(n=v())&&void 0!==n?n:{},{doodleUploadUrl:t})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),uploadApiUrl:p.a.uploadApiUrl,uploadUrlPrefix:g}),u=Object(f.a)({getUploadUrl:function(){var e=Object(o.a)(a.a.mark((function e(){var t,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",null!==(t=null===(n=v())||void 0===n?void 0:n.scoresUploadUrl)&&void 0!==t?t:null);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),setUploadUrl:function(){var e=Object(o.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",h(Object.assign({},null!==(n=v())&&void 0!==n?n:{},{scoresUploadUrl:t})));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),uploadApiUrl:p.a.uploadApiUrl,uploadUrlPrefix:b}),y={doodles:[],doodleScores:[],doodleVotes:[]},e.next=5,i.load();case 5:if(e.t2=n=e.sent,e.t1=null===e.t2,e.t1){e.next=9;break}e.t1=void 0===n;case 9:if(!e.t1){e.next=13;break}e.t3=void 0,e.next=14;break;case 13:e.t3=n.doodles.map((function(e){return{key:e.k,prompt:e.p,timestamp:e.t,drawing:e.d?Object(w.a)(e.d):e.drawing}}));case 14:if(e.t4=t=e.t3,e.t0=null!==e.t4,!e.t0){e.next=18;break}e.t0=void 0!==t;case 18:if(!e.t0){e.next=22;break}e.t5=t,e.next=23;break;case 22:e.t5=[];case 23:return y.doodles=e.t5,e.next=26,u.load();case 26:if(e.t8=c=e.sent,e.t7=null===e.t8,e.t7){e.next=30;break}e.t7=void 0===c;case 30:if(!e.t7){e.next=34;break}e.t9=void 0,e.next=35;break;case 34:e.t9=c.doodleVotes;case 35:if(e.t10=r=e.t9,e.t6=null!==e.t10,!e.t6){e.next=39;break}e.t6=void 0!==r;case 39:if(!e.t6){e.next=43;break}e.t11=r,e.next=44;break;case 43:e.t11=[];case 44:return y.doodleVotes=e.t11,x={},y.doodleVotes.forEach((function(e){var t;x[e.k]=(null!==(t=x[e.k])&&void 0!==t?t:0)+1})),y.doodleScores=Object(m.b)(x).map((function(e){return{doodleKey:e.key,score:e.value}})),k={saveDrawing:function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r={key:t.substr(0,8)+":"+Date.now()+":"+Math.floor(999999*Math.random()),drawing:n,prompt:t,timestamp:Date.now()},y.doodles.push(r),setTimeout(Object(o.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i.save({doodles:y.doodles.map((function(e){return{k:e.key,p:e.prompt,t:e.timestamp,d:Object(w.d)(e.drawing)}}))});case 2:case"end":return e.stop()}}),e)}))));case 3:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),saveBestDrawingSelection:function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:y.doodleVotes.push({k:t.key,t:Date.now()}),(r=y.doodleScores.find((function(e){return e.doodleKey===t.key})))||(r={doodleKey:t.key,score:0},y.doodleScores.push(r)),r.score=(null!==(n=r.score)&&void 0!==n?n:0)+1,setTimeout(Object(o.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u.save({doodleVotes:y.doodleVotes});case 2:case"end":return e.stop()}}),e)}))));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getDrawings:function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r,o,c,i,u,p,f,m,w;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=(r=null!=n?n:{}).includeOtherPrompts,c=void 0!==o&&o,i=r.maxCount,u=void 0===i?4:i,p=y.doodles.filter((function(e){return e.prompt===t})),f=c?y.doodles.filter((function(e){return e.prompt!==t})):[],m=c?[Object(s.b)(p)].concat(Object(l.a)(Object(d.e)(f).slice(0,u-1))):p,w=Object(d.e)(m).slice(0,u),e.abrupt("return",{doodles:w});case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()},e.abrupt("return",k);case 50:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),x=n("njmQ"),k=n("pAyS"),E=n("yxiS"),O=(n("xrQq"),n("kNg/"),{rows:[{keys:"qwertyuiop".split("")},{keys:" asdfghjkl".split("")},{keys:"  zxcvbnm ".split("")}]}),j={container:{},rowView:{flex:1,flexDirection:"row"},keyView:{margin:2,padding:2,width:20,height:20,backgroundColor:"#111111",justifyContent:"center",alignItems:"center"},keyView_disabled:{opacity:.5},keyText:{fontSize:16},keyText_wrong:{fontSize:16,color:"#FF0000"}},S=function(e){var t=e.expectedCharacter,n=e.showHints,r=e.onExpectedKeyPress,a=O,o=Object(c.useState)(null),s=o[0],p=o[1],f=Object(c.useState)([]),m=f[0],w=f[1];Object(c.useEffect)((function(){n||p(null);var e=[t].concat(Object(l.a)(Object(d.e)(a.rows.flatMap((function(e){return e.keys})).map((function(e){return e.trim()})).filter((function(e){return e}))).slice(0,3)));p(e),w([])}),[t,n]);return i.a.createElement(i.a.Fragment,null,i.a.createElement(u.h,{style:j.container},a.rows.map((function(e,a){return i.a.createElement(u.h,{style:j.rowView,key:""+a},e.keys.map((function(e,a){return i.a.createElement(u.g,{key:""+e+a,style:{outline:"none"},onPress:function(){var a;(a=e)!==t?n&&(p((function(e){return(null!=e?e:[]).filter((function(e){return e!==a}))})),w((function(e){return[].concat(Object(l.a)(e),[a])}))):r()}},i.a.createElement(u.h,{style:!s||s.includes(e)?{}:j.keyView_disabled},i.a.createElement(u.h,{style:j.keyView},i.a.createElement(u.e,{style:m.includes(e)?j.keyText_wrong:j.keyText},e))))})))}))))},F={container:{alignItems:"center"},drawing:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawingChoicesView:{maxWidth:332,flexDirection:"row",flexWrap:"wrap"},drawingChoiceWrapper:{padding:4},drawingChoice:{width:78,height:78,color:"#FFFFFF",backgroundColor:"#000000"},titleView:{justifyContent:"center",alignItems:"center"},titleText:{fontSize:20,color:"#FFFFFF"},promptView:{justifyContent:"center",alignItems:"center"},promptText:{fontSize:20,color:"#FFFF00"},buttonView:{padding:8,backgroundColor:"#111111"},buttonText:{fontSize:20,color:"#FFFF00"}},D=function(e){var t=Object(c.useState)(0),n=t[0],r=t[1];return i.a.createElement(i.a.Fragment,null,i.a.createElement(C,Object.assign({},e,{problemSourceKey:n})),i.a.createElement(E.a,{problemService:e.problemService,onOpen:function(){},onClose:function(){},onSubjectNavigation:function(){r((function(e){return e+1}))}}))},C=function(e){var t,n,r,u,l=Object(c.useState)(null),s=l[0],d=l[1],p=Object(c.useState)("type"),f=p[0],m=p[1],w=Object(c.useState)(null),g=w[0],b=w[1],v=Object(c.useRef)(null!==(t=null==s||null===(n=s.answers.find((function(e){return e.isCorrect})))||void 0===n?void 0:n.value)&&void 0!==t?t:"");v.current=null!==(r=null==s||null===(u=s.answers.find((function(e){return e.isCorrect})))||void 0===u?void 0:u.value)&&void 0!==r?r:"";var h=function(){var t,n=e.problemService.getNextProblem();n.question&&(d(n),setTimeout(E),null===(t=n.onQuestion)||void 0===t||t.call(n))};Object(c.useEffect)((function(){h()}),[e.problemSourceKey]);var y=Object(x.a)(),k=(y.loading,y.error,y.doWork),E=function(){k(function(){var t=Object(o.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(v.current);case 2:r=t.sent,b(r.doodles),m("type");case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},O=function(){m("drawPrompt")},j=function(){k(function(){var t=Object(o.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(v.current);case 2:if(r=t.sent,n(),!(r.doodles.length<=1)){t.next=7;break}return h(),t.abrupt("return");case 7:b(r.doodles),m("chooseBest");case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return s?"type"===f?i.a.createElement(i.a.Fragment,null,i.a.createElement(_,{prompt:v.current,drawings:null!=g?g:[],onDone:function(){k(function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:setTimeout(O);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}})):"chooseBest"===f&&g?i.a.createElement(i.a.Fragment,null,i.a.createElement(U,{prompt:v.current,drawings:g,onChooseBest:function(t){k(function(){var n=Object(o.a)(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.drawingStorage.saveBestDrawingSelection(t);case 2:r(),h();case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}})):i.a.createElement(i.a.Fragment,null,i.a.createElement(V,{prompt:v.current,onDone:function(t){k(function(){var n=Object(o.a)(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(t.segments.length>0)){n.next=3;break}return n.next=3,e.drawingStorage.saveDrawing(v.current,t);case 3:r(),setTimeout(j);case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}})):i.a.createElement(i.a.Fragment,null)},V=function(e){var t=Object(c.useState)(Object(w.b)()),n=t[0],r=t[1];return Object(c.useEffect)((function(){r(Object(w.b)())}),[e.prompt]),i.a.createElement(u.h,{style:F.container},i.a.createElement(u.h,{style:F.titleView},i.a.createElement(u.e,{style:F.titleText},"Draw")),i.a.createElement(k.DoodleDrawerView,{style:F.drawing,drawing:n,onChange:function(e){r(e)}}),i.a.createElement(u.h,{style:F.promptView},i.a.createElement(u.e,{style:F.promptText},e.prompt)),i.a.createElement(u.g,{onPress:function(){e.onDone(n)}},i.a.createElement(u.h,{style:F.buttonView},i.a.createElement(u.e,{style:F.buttonText},"Done"))))},U=function(e){return i.a.createElement(u.h,{style:F.container},i.a.createElement(u.h,{style:F.titleView},i.a.createElement(u.e,{style:F.titleText},"Choose Best")),i.a.createElement(u.h,{style:F.promptView},i.a.createElement(u.e,{style:F.promptText},e.prompt)),i.a.createElement(u.h,{style:F.drawingChoicesView},e.drawings.map((function(t){return i.a.createElement(u.g,{onPress:function(){return e.onChooseBest(t)}},i.a.createElement(u.h,{style:F.drawingChoiceWrapper},i.a.createElement(k.DoodleDisplayView,{style:F.drawingChoice,drawing:t.drawing})))}))))},T={completedText:{fontSize:16,color:"#FFFF00"}},_=function(e){var t,n=Object(c.useState)({completed:"",remaining:e.prompt}),r=n[0],a=n[1];Object(c.useEffect)((function(){a({completed:"",remaining:e.prompt})}),[e.prompt,e.drawings]);return i.a.createElement(u.h,{style:F.container},i.a.createElement(u.h,{style:F.titleView},i.a.createElement(u.e,{style:F.titleText},"Type Word")),i.a.createElement(u.h,{style:F.drawingChoicesView},e.drawings.map((function(e){return i.a.createElement(u.h,{style:F.drawingChoiceWrapper},i.a.createElement(k.DoodleDisplayView,{style:F.drawingChoice,drawing:e.drawing}))}))),i.a.createElement(u.h,null,i.a.createElement(u.e,{style:T.completedText},r.completed+(r.remaining.length>0?"_":""))),i.a.createElement(S,{expectedCharacter:null!==(t=r.remaining[0])&&void 0!==t?t:" ",showHints:!0,onExpectedKeyPress:function(){a((function(t){t.remaining.length<=1&&e.onDone();var n=t.remaining[0];return{completed:t.completed+n,remaining:t.remaining.substr(1)}}))}}))},A=n("aLR2"),P=n("9u8u"),z=n("oo7O"),W=n("DZ/V"),B=n("yyXn"),K=function(e){var t=Object(c.useRef)(Object(A.a)()),n=Object(c.useState)("web"!==u.c.OS),r=n[0],l=n[1],s=Object(x.a)(),d=s.loading,p=(s.error,s.doWork),f=Object(c.useRef)(null);if(Object(c.useEffect)((function(){p(function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y();case 2:f.current=e.sent;case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}),[]),!r){return i.a.createElement(u.h,null,i.a.createElement(W.a,{languange:"en",speechService:t.current}),i.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void l(!0)}},i.a.createElement(u.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},i.a.createElement(u.e,{style:{fontSize:36}},"Start"))))}return d||!f.current?i.a.createElement(i.a.Fragment,null,i.a.createElement(u.a,{size:"large",color:"#FFFF00"})):i.a.createElement(D,{problemService:Object(B.a)(Object(P.a)(Object(z.a)({speechService:t.current,sectionSize:8}),{}),"ProblemsSpellingDoodle"),drawingStorage:f.current})}}}]);
//# sourceMappingURL=21-7364e5d1164b42f03f46.js.map