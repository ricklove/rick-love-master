(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[25],{"82LT":function(e,t,r){"use strict";r.r(t),r.d(t,"EducationalGame_StarBlastSideways_Spelling",(function(){return d}));var n=r("ERkP"),o=r.n(n),a=r("DTYs"),i=r("pzhj"),c=r("9u8u"),s=(r("yIC7"),r("p+GS"),r("dtAy"),r("4oWw"),r("nruA"),r("LnO1"),r("XjK0"),r("SCO9"),r("KI7T"),r("PN9k"),r("zpx+"),r("7dyJ"),r("T7D0"),r("hsFx")),u=r("4cHy"),l=r("Ti7Q");function f(e){return function(e){if(Array.isArray(e))return p(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return p(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return p(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var b=function(e){var t=e.speechService,r=e.maxAnswers,n=void 0===r?4:r,o=t,a=Object(l.a)(),i=Math.ceil(a.length/25),c=0;return{getSections:function(){return f(new Array(i)).map((function(e,t){return"Spelling "+(t+1)}))},gotoSection:function(e){var t=e.split(" "),r=t[t.length-1],n=Number.parseInt(r,10);c=25*(n-1)},getNextProblem:function(){c>=a.length&&(c=0);var e=c;c++;var t=a[e],r=t.word,i=n-1,u=Object(s.e)(Object(s.a)(t.mispellings)).slice(0,i);return{key:""+(e+1),question:"Word "+(e+1),onQuestion:function(){o.speak(r)},answers:Object(s.e)([].concat(f(u.map((function(e){return{value:""+e,isCorrect:!1}}))),[{value:""+r,isCorrect:!0}])).map((function(e){return Object.assign(Object.assign({},e),{},{key:e.value})}))}},recordAnswer:function(e,t){if(t.isCorrect){if(console.log("recordAnswer correct"),Math.random()>.1)return;o.speak(Object(u.b)(["Good job! Thank you for the alien skulls.","Great! That's a nice pile of bones."]))}else{var r,n;o.speak(Object(u.b)(["I've got a dog that spells better","That was horrible","What are you trying to do?","That is not a word","No, select the correct answer","Absolutely Incorrect","Completely Wrong","This is supposed to be English"])),o.speak(null!==(r=null===(n=e.answers.find((function(e){return e.isCorrect})))||void 0===n?void 0:n.value)&&void 0!==r?r:"")}}}},d=function(e){var t=Object(n.useRef)(function(){if("web"!==a.c.OS)return{speak:function(){}};var e=window.speechSynthesis;return{speak:function(t){try{var r=new SpeechSynthesisUtterance(t);e.speak(r)}catch(n){}}}}()),r=Object(n.useState)("web"!==a.c.OS),s=r[0],u=r[1];if(!s){return o.a.createElement("div",{onClick:function(){return t.current.speak("Start"),void u(!0)}},o.a.createElement(a.h,{style:{height:300,alignSelf:"center",alignItems:"center",justifyContent:"center"}},o.a.createElement(a.e,{style:{fontSize:36}},"Start")))}return o.a.createElement(i.EducationalGame_StarBlastSideways,{problemService:Object(c.a)(b({speechService:t.current}),{})})}}}]);
//# sourceMappingURL=25-7efb6aaf016187451ed9.js.map