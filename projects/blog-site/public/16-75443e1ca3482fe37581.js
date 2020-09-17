(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[16],{yYAt:function(t,e,n){"use strict";n.r(e),n.d(e,"MidiTestComponent",(function(){return E}));n("yIC7"),n("p+GS"),n("4oWw"),n("nruA"),n("LnO1"),n("XjK0"),n("SCO9"),n("yKDW"),n("dtAy");var r=n("a1TR"),o=n.n(r),a=(n("3yYM"),n("ERkP")),i=n.n(a),u=n("bQih"),c=n("njmQ");n("PRJl"),n("/1As"),n("3eMz");function f(t){var e=0;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=function(t,e){if(!t)return;if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return l(t,e)}(t)))return function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}};throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(e=t[Symbol.iterator]()).next.bind(e)}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e,n,r,o,a,i){try{var u=t[a](i),c=u.value}catch(f){return void n(f)}u.done?e(c):Promise.resolve(c).then(r,o)}function p(t){var e="function"==typeof Map?new Map:void 0;return(p=function(t){if(null===t||(n=t,-1===Function.toString.call(n).indexOf("[native code]")))return t;var n;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,r)}function r(){return y(t,arguments,v(this).constructor)}return r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),m(r,t)})(t)}function y(t,e,n){return(y=d()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&m(o,n.prototype),o}).apply(null,arguments)}function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function v(t){return(v=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var b,h=function(t){var e,n;function r(e,n){var r;return(r=t.call(this)||this).message=e,r.data=n,r}return n=t,(e=r).prototype=Object.create(n.prototype),e.prototype.constructor=e,e.__proto__=n,r}(p(Error));!function(t){t[t.NoteOff=128]="NoteOff",t[t.NoteOn=144]="NoteOn"}(b||(b={}));var w=function(){var t,e=(t=o.a.mark((function t(e){var n,r,a,i,u;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=e.onMidiMessage,navigator.requestMIDIAccess){t.next=3;break}throw new h("WebMIDI is not supported");case 3:return t.next=5,navigator.requestMIDIAccess();case 5:for(r=t.sent,a=r.inputs.values(),i=f(a);!(u=i()).done;)u.value.onmidimessage=function(t){var e=t.data,r=e[0],o=e[1],a=e[2];n({command:r,note:o,velocity:a,event:t})};case 8:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){s(a,r,o,i,u,"next",t)}function u(t){s(a,r,o,i,u,"throw",t)}i(void 0)}))});return function(t){return e.apply(this,arguments)}}();function _(t){return function(t){if(Array.isArray(t))return O(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return O(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return O(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function O(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function g(t,e,n,r,o,a,i){try{var u=t[a](i),c=u.value}catch(f){return void n(f)}u.done?e(c):Promise.resolve(c).then(r,o)}function A(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){g(a,r,o,i,u,"next",t)}function u(t){g(a,r,o,i,u,"throw",t)}i(void 0)}))}}var E=function(t){var e=Object(c.a)(),n=e.loading,r=e.error,f=e.doWork,l=Object(a.useState)([]),s=l[0],p=l[1];return i.a.createElement(i.a.Fragment,null,i.a.createElement(u.a.View_Panel,null,i.a.createElement(u.a.Loading,{loading:n}),i.a.createElement(u.a.ErrorBox,{error:r}),i.a.createElement(u.a.View_Form,null,i.a.createElement(u.a.View_FieldRow,null,i.a.createElement(u.a.Button_FieldInline,{onPress:function(){return f(A(o.a.mark((function t(){return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w({onMidiMessage:function(t){p((function(e){return[JSON.stringify(t)].concat(_(e))}))}});case 2:case"end":return t.stop()}}),t)}))))}},"Enable Midi")),s.map((function(t,e){return i.a.createElement(u.a.View_FieldRow,{key:""+(e-1+1)},i.a.createElement(u.a.Text_FieldLabel,null,t))})))))}}}]);
//# sourceMappingURL=16-75443e1ca3482fe37581.js.map