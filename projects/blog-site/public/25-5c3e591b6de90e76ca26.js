(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[25],{"82LT":function(e,t,n){"use strict";n.r(t),n.d(t,"EducationalGame_StarBlastSideways_Spelling",(function(){return w}));var r=n("ERkP"),o=n.n(r),a=n("DTYs"),i=n("aLR2"),c=n("pzhj"),s=n("9u8u"),u=(n("yIC7"),n("p+GS"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9"),n("yKDW"),n("dtAy"),n("KI7T"),n("PN9k"),n("zpx+"),n("7dyJ"),n("T3IU"),n("DZyD"),n("a1TR")),l=n.n(u),f=(n("3yYM"),n("hsFx")),p=n("4cHy"),d=n("Ti7Q");function y(e){return function(e){if(Array.isArray(e))return h(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return h(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return h(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function m(e,t,n,r,o,a,i){try{var c=e[a](i),s=c.value}catch(u){return void n(u)}c.done?t(s):Promise.resolve(s).then(r,o)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function i(e){m(a,r,o,i,c,"next",e)}function c(e){m(a,r,o,i,c,"throw",e)}i(void 0)}))}}var b=function(e){var t,n,r=e.speechService,o=e.maxAnswers,a=void 0===o?4:o,i=r,c=Object(d.a)(),s=Math.ceil(c.length/25),u={nextIndex:0,completedSectionKeys:[]},h=function(e){return""+e};return{load:(n=v(l.a.mark((function e(t){var n;return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.load();case 2:(n=e.sent)&&(u=n);case 4:case"end":return e.stop()}}),e)}))),function(e){return n.apply(this,arguments)}),save:(t=v(l.a.mark((function e(t){return l.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.save(u);case 2:case"end":return e.stop()}}),e)}))),function(e){return t.apply(this,arguments)}),getSections:function(){return y(new Array(s)).map((function(e,t){return{key:h(t),name:(n=t,"Spelling "+(n+1)),isComplete:u.completedSectionKeys.includes(h(t))};var n}))},gotoSection:function(e){var t=e.key,n=Number.parseInt(t,10);u.nextIndex=25*(n-1)},getNextProblem:function(){u.nextIndex>=c.length&&(u.nextIndex=0);var e=u.nextIndex;u.nextIndex++;var t=c[e],n=t.word,r=a-1,o=Object(f.e)(Object(f.a)(t.mispellings)).slice(0,r),s=Object(f.e)([].concat(y(o.map((function(e){return{value:""+e,isCorrect:!1}}))),[{value:""+n,isCorrect:!0}])).map((function(e){return Object.assign(Object.assign({},e),{},{key:e.value})})),l=(e+1)%25==0,p=e===c.length-1;return{key:""+(e+1),question:"Word "+(e+1),onQuestion:function(){i.speak(n)},answers:s,sectionKey:h(Math.floor(e/25)),isLastOfSection:l,isLastOfSubject:p}},recordAnswer:function(e,t){if(t.isCorrect&&e.isLastOfSection&&u.completedSectionKeys.push(e.sectionKey),t.isCorrect){if(console.log("recordAnswer correct"),Math.random()>.1)return;i.speak(Object(p.b)(["Good job! Thank you for the alien skulls.","Great! That's a nice pile of bones."]))}else{var n,r;i.speak(Object(p.b)(["I've got a dog that spells better","That was horrible","What are you trying to do?","That is not a word","No, select the correct answer","Absolutely Incorrect","Completely Wrong","This is supposed to be English","What does the fox say?"])),i.speak(null!==(n=null===(r=e.answers.find((function(e){return e.isCorrect})))||void 0===r?void 0:r.value)&&void 0!==n?n:"")}}}},S=n("DGyM"),g=n("yyXn"),w=function(e){var t=Object(r.useRef)(Object(i.a)()),n=Object(r.useState)("web"!==a.c.OS),u=n[0],l=n[1];if(!u){return o.a.createElement(a.h,null,o.a.createElement(S.a,{languange:"en",speechService:t.current}),o.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void l(!0)}},o.a.createElement(a.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},o.a.createElement(a.e,{style:{fontSize:36}},"Start"))))}return o.a.createElement(c.EducationalGame_StarBlastSideways,{problemService:Object(g.a)(Object(s.a)(b({speechService:t.current}),{}),"ProblemsSpelling")})}}}]);
//# sourceMappingURL=25-5c3e591b6de90e76ca26.js.map