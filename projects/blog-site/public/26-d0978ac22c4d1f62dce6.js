(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[26],{"82LT":function(e,t,r){"use strict";r.r(t),r.d(t,"EducationalGame_StarBlastSideways_Spelling",(function(){return h}));var n=r("ERkP"),a=r.n(n),o=r("DTYs"),i=r("aLR2"),c=r("pzhj"),s=r("9u8u"),u=(r("yIC7"),r("p+GS"),r("dtAy"),r("4oWw"),r("nruA"),r("LnO1"),r("XjK0"),r("SCO9"),r("KI7T"),r("PN9k"),r("zpx+"),r("7dyJ"),r("T7D0"),r("hsFx")),l=r("4cHy"),f=r("Ti7Q");function p(e){return function(e){if(Array.isArray(e))return b(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return b(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var d=function(e){var t=e.speechService,r=e.maxAnswers,n=void 0===r?4:r,a=t,o=Object(f.a)(),i=Math.ceil(o.length/25),c=0;return{getSections:function(){return p(new Array(i)).map((function(e,t){return"Spelling "+(t+1)}))},gotoSection:function(e){var t=e.split(" "),r=t[t.length-1],n=Number.parseInt(r,10);c=25*(n-1)},getNextProblem:function(){c>=o.length&&(c=0);var e=c;c++;var t=o[e],r=t.word,i=n-1,s=Object(u.e)(Object(u.a)(t.mispellings)).slice(0,i);return{key:""+(e+1),question:"Word "+(e+1),onQuestion:function(){a.speak(r)},answers:Object(u.e)([].concat(p(s.map((function(e){return{value:""+e,isCorrect:!1}}))),[{value:""+r,isCorrect:!0}])).map((function(e){return Object.assign(Object.assign({},e),{},{key:e.value})}))}},recordAnswer:function(e,t){if(t.isCorrect){if(console.log("recordAnswer correct"),Math.random()>.1)return;a.speak(Object(l.b)(["Good job! Thank you for the alien skulls.","Great! That's a nice pile of bones."]))}else{var r,n;a.speak(Object(l.b)(["I've got a dog that spells better","That was horrible","What are you trying to do?","That is not a word","No, select the correct answer","Absolutely Incorrect","Completely Wrong","This is supposed to be English"])),a.speak(null!==(r=null===(n=e.answers.find((function(e){return e.isCorrect})))||void 0===n?void 0:n.value)&&void 0!==r?r:"")}}}},y=r("DGyM"),h=function(e){var t=Object(n.useRef)(Object(i.a)()),r=Object(n.useState)("web"!==o.c.OS),u=r[0],l=r[1];if(!u){return a.a.createElement(o.h,null,a.a.createElement(y.a,{languange:"en",speechService:t.current}),a.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void l(!0)}},a.a.createElement(o.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},a.a.createElement(o.e,{style:{fontSize:36}},"Start"))))}return a.a.createElement(c.EducationalGame_StarBlastSideways,{problemService:Object(s.a)(d({speechService:t.current}),{})})}}}]);
//# sourceMappingURL=26-d0978ac22c4d1f62dce6.js.map