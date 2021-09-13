"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[22],{5022:function(e,t,n){n.r(t),n.d(t,{EducationalGame_Doodle_Spelling:function(){return v}});var r=n(1738),o=n(1412),a=n(6135),l=n(3880),c=n(4641);const s=e=>{const[t,n]=(0,r.useState)(0),[o,a]=(0,r.useState)(!1);return r.createElement(r.Fragment,null,!o&&r.createElement(i,Object.assign({},e,{problemSourceKey:t})),r.createElement(c._,{problemService:e.problemService,onOpen:()=>a(!0),onClose:()=>a(!1),onSubjectNavigation:()=>n((e=>e+1))}))},i=e=>{var t,n;const[a,c]=(0,r.useState)(null),[s,i]=(0,r.useState)("type"),[u,m]=(0,r.useState)(null),g=(0,r.useRef)(null!==(t=null===a||void 0===a?void 0:a.prompt)&&void 0!==t?t:"");g.current=null!==(n=null===a||void 0===a?void 0:a.prompt)&&void 0!==n?n:"";const d=()=>{var t;const n=e.problemService.getNextProblem();n&&(c(n),setTimeout(w),null===(t=n.speakPrompt)||void 0===t||t.call(n))};(0,r.useEffect)((()=>{d()}),[e.problemSourceKey]);const{loading:S,error:v,doWork:p}=(0,l.VL)(),w=()=>{p((async t=>{const n=await e.drawingStorage.getDrawings(g.current,{maxCount:1,includeOtherPrompts:!1});m(n.doodles),i("type")}))},E=()=>{p((async e=>{setTimeout(f)}))},y=()=>{var e;null===(e=null===a||void 0===a?void 0:a.speakPrompt)||void 0===e||e.call(a)},f=()=>{i("drawPrompt")},b=()=>{p((async t=>{const n=await e.drawingStorage.getDrawings(g.current);t(),n.doodles.length<=1?d():(m(n.doodles),i("chooseBest"))}))},h=t=>{p((async n=>{await e.drawingStorage.saveBestDrawingSelection(t),n(),d()}))};return a?"type"===s?r.createElement(r.Fragment,null,r.createElement(o.DoodleGameView_TypeExpected,{prompt:g.current,drawings:null!==u&&void 0!==u?u:[],onDone:E,sayAgain:y})):"chooseBest"===s&&u?r.createElement(r.Fragment,null,r.createElement(o.DoodleGameView_ChooseBest,{prompt:g.current,drawings:u,onChooseBest:h})):r.createElement(r.Fragment,null,r.createElement(o.DoodleGameView_DrawWord,{prompt:g.current,hint:a.hint,onDone:t=>{p((async n=>{t.segments.length>0&&await e.drawingStorage.saveDrawing(g.current,t),n(),setTimeout(b)}))},onSkip:()=>{setTimeout(b)}})):r.createElement(r.Fragment,null)};var u=n(3782),m=n(6834),g=n(6548),d=n(2968),S=n(3884);const v=({config:e})=>{const t=(0,r.useRef)((0,d.a)()),[n,c]=(0,r.useState)("web"!==a.t4.OS),{loading:i,error:v,doWork:p}=(0,l.VL)(),w=(0,r.useRef)(null),E=(0,r.useRef)(null);if((0,r.useEffect)((()=>{p((async n=>{w.current=await(0,o.createDoodleDrawingStorageService)(e),n();const r=(0,g.createProgressGameProblemService)((0,u.b)((0,m.O)({speechService:t.current,sectionSize:8}),"ProblemsSpellingDoodle"));let a=null;E.current={getSections:r.getSections,gotoSection:r.gotoSection,getNextProblem:()=>{var e,t;a&&r.recordAnswer(a,a.answers.find((e=>e.isCorrect)));const n=r.getNextProblem();return n.question?(a=n,{prompt:null!==(t=null===(e=n.answers.find((e=>e.isCorrect)))||void 0===e?void 0:e.value)&&void 0!==t?t:"",speakPrompt:n.onQuestion}):null}}}))}),[]),!n){const e=()=>{t.current.speak("Start"),c(!0)};return r.createElement(a.G7,null,r.createElement(S.A,{languange:"en",speechService:t.current}),r.createElement("div",{onClick:()=>e()},r.createElement(a.G7,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},r.createElement(a.xv,{style:{fontSize:36}},"Start"))))}return!i&&w.current&&E.current?r.createElement(s,{problemService:E.current,drawingStorage:w.current}):r.createElement(r.Fragment,null,r.createElement(a.P2,{size:"large",color:"#FFFF00"}))}},3782:function(e,t,n){n.d(t,{b:function(){return r}});const r=(e,t)=>{const n=(e=>({load:async()=>{var t;try{return JSON.parse(null!==(t=localStorage.getItem(e))&&void 0!==t?t:"error - NOT FOUND")}catch(n){return null}},save:async t=>{localStorage.setItem(e,JSON.stringify(t))}}))(t);return(async()=>{await e.load(n)})(),Object.assign(Object.assign({},e),{recordAnswer:(t,r)=>{e.recordAnswer(t,r),t.isLastOfSection&&(async()=>{await e.save(n)})()}})}},4641:function(e,t,n){n.d(t,{_:function(){return l}});var r=n(1738),o=n(6135);const a={container:{margin:16},header:{view:{margin:4},text:{fontSize:16}},section:{view:{margin:4,flexDirection:"row"},text:{fontSize:16}}},l=e=>{const[t,n]=(0,r.useState)(!1);return r.createElement(o.G7,{style:a.container},r.createElement(o.Au,{onPress:()=>{t||e.onOpen(),t&&e.onClose(),n((e=>!e))}},r.createElement(o.G7,{style:a.header.view},r.createElement(o.xv,{style:a.header.text},"Sections"))),t&&r.createElement(o.G7,null,e.problemService.getSections().map((t=>r.createElement(o.Au,{key:t.key,onPress:()=>{console.log("SubjectNavigator onSection",{s:t}),e.problemService.gotoSection(t),e.onSubjectNavigation(),e.onClose(),n(!1),"web"===o.t4.OS&&window.scrollTo(0,0)}},r.createElement(o.G7,{style:a.section.view},r.createElement(o.xv,{style:a.section.text},t.isComplete?"\u2705":"\u2b1c"),r.createElement(o.xv,{style:a.section.text},t.name)))))))}}}]);