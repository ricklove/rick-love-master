(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[27],{"9GY0":function(e,t,n){"use strict";n.r(t),n.d(t,"EducationalGame_Doodle_Spelling",(function(){return w}));var r=n("VtSi"),a=n.n(r),c=(n("3yYM"),n("QsI/")),o=n("ERkP"),u=n.n(o),i=n("DTYs"),s=n("6Ufa"),l=n("njmQ"),f=n("qVe0"),p=n("yxiS"),m=function(e){var t=Object(o.useState)(0),n=t[0],r=t[1],a=Object(o.useState)(!1),c=a[0],i=a[1];return u.a.createElement(u.a.Fragment,null,!c&&u.a.createElement(g,Object.assign({},e,{problemSourceKey:n})),u.a.createElement(p.a,{problemService:e.problemService,onOpen:function(){return i(!0)},onClose:function(){return i(!1)},onSubjectNavigation:function(){return r((function(e){return e+1}))}}))},g=function(e){var t,n,r=Object(o.useState)(null),i=r[0],s=r[1],p=Object(o.useState)("type"),m=p[0],g=p[1],v=Object(o.useState)(null),d=v[0],b=v[1],S=Object(o.useRef)(null!==(t=null==i?void 0:i.prompt)&&void 0!==t?t:"");S.current=null!==(n=null==i?void 0:i.prompt)&&void 0!==n?n:"";var O=function(){var t,n=e.problemService.getNextProblem();n&&(s(n),setTimeout(h),null===(t=n.speakPrompt)||void 0===t||t.call(n))};Object(o.useEffect)((function(){O()}),[e.problemSourceKey]);var w=Object(l.a)(),j=(w.loading,w.error,w.doWork),h=function(){j(function(){var t=Object(c.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(S.current,{maxCount:1,includeOtherPrompts:!1});case 2:r=t.sent,b(r.doodles),g("type");case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},E=function(){g("drawPrompt")},y=function(){j(function(){var t=Object(c.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.drawingStorage.getDrawings(S.current);case 2:if(r=t.sent,n(),!(r.doodles.length<=1)){t.next=7;break}return O(),t.abrupt("return");case 7:b(r.doodles),g("chooseBest");case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return i?"type"===m?u.a.createElement(u.a.Fragment,null,u.a.createElement(f.c,{prompt:S.current,drawings:null!=d?d:[],onDone:function(){j(function(){var e=Object(c.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:setTimeout(E);case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())},sayAgain:function(){var e;null==i||null===(e=i.speakPrompt)||void 0===e||e.call(i)}})):"chooseBest"===m&&d?u.a.createElement(u.a.Fragment,null,u.a.createElement(f.a,{prompt:S.current,drawings:d,onChooseBest:function(t){j(function(){var n=Object(c.a)(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.drawingStorage.saveBestDrawingSelection(t);case 2:r(),O();case 4:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())}})):u.a.createElement(u.a.Fragment,null,u.a.createElement(f.b,{prompt:S.current,hint:i.hint,onDone:function(t){j(function(){var n=Object(c.a)(a.a.mark((function n(r){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(t.segments.length>0)){n.next=3;break}return n.next=3,e.drawingStorage.saveDrawing(S.current,t);case 3:r(),setTimeout(y);case 5:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}())},onSkip:function(){setTimeout(y)}})):u.a.createElement(u.a.Fragment,null)},v=n("aLR2"),d=n("oo7O"),b=n("DZ/V"),S=n("yyXn"),O=n("7h3R"),w=function(e){var t=Object(o.useRef)(Object(v.a)()),n=Object(o.useState)("web"!==i.c.OS),r=n[0],f=n[1],p=Object(l.a)(),g=p.loading,w=(p.error,p.doWork),j=Object(o.useRef)(null),h=Object(o.useRef)(null);if(Object(o.useEffect)((function(){w(function(){var e=Object(c.a)(a.a.mark((function e(n){var r,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(s.a)();case 2:j.current=e.sent,n(),r=Object(O.createProgressGameProblemService)(Object(S.a)(Object(d.a)({speechService:t.current,sectionSize:8}),"ProblemsSpellingDoodle")),c=null,h.current={getSections:r.getSections,gotoSection:r.gotoSection,getNextProblem:function(){var e,t;c&&r.recordAnswer(c,c.answers.find((function(e){return e.isCorrect})));var n=r.getNextProblem();return n.question?(c=n,{prompt:null!==(e=null===(t=n.answers.find((function(e){return e.isCorrect})))||void 0===t?void 0:t.value)&&void 0!==e?e:"",speakPrompt:n.onQuestion}):null}};case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}),[]),!r){return u.a.createElement(i.h,null,u.a.createElement(b.a,{languange:"en",speechService:t.current}),u.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void f(!0)}},u.a.createElement(i.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},u.a.createElement(i.e,{style:{fontSize:36}},"Start"))))}return!g&&j.current&&h.current?u.a.createElement(m,{problemService:h.current,drawingStorage:j.current}):u.a.createElement(u.a.Fragment,null,u.a.createElement(i.a,{size:"large",color:"#FFFF00"}))}}}]);
//# sourceMappingURL=27-9a888fb5fa1a01312728.js.map