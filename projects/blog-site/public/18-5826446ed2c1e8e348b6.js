(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[18],{yYAt:function(e,t,n){"use strict";n.r(t),n.d(t,"MidiTestComponent",(function(){return w}));var r=n("VtSi"),a=n.n(r),o=n("fGyu"),i=(n("3yYM"),n("QsI/")),u=n("ERkP"),c=n.n(u),l=n("bQih"),s=n("njmQ"),f=n("BFfR"),m=n("+lMt");function d(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return b(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var p,v=function(e){function t(t,n){var r;return(r=e.call(this)||this).message=t,r.data=n,r}return Object(f.a)(t,e),t}(Object(m.a)(Error));!function(e){e[e.NoteOff=128]="NoteOff",e[e.NoteOn=144]="NoteOn"}(p||(p={}));var y=function(){var e=Object(i.a)(a.a.mark((function e(t){var n,r,o,i,u;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.onMidiMessage,navigator.requestMIDIAccess){e.next=3;break}throw new v("WebMIDI is not supported");case 3:return e.next=5,navigator.requestMIDIAccess();case 5:for(r=e.sent,o=r.inputs.values(),i=d(o);!(u=i()).done;)u.value.onmidimessage=function(e){var t=e.data,r=t[0],a=t[1],o=t[2];n({command:r,note:a,velocity:o,event:e})};case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),w=function(e){var t=Object(s.a)(),n=t.loading,r=t.error,f=t.doWork,m=Object(u.useState)([]),d=m[0],b=m[1];return c.a.createElement(c.a.Fragment,null,c.a.createElement(l.a.View_Panel,null,c.a.createElement(l.a.Loading,{loading:n}),c.a.createElement(l.a.ErrorBox,{error:r}),c.a.createElement(l.a.View_Form,null,c.a.createElement(l.a.View_FieldRow,null,c.a.createElement(l.a.Button_FieldInline,{onPress:function(){return f(Object(i.a)(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y({onMidiMessage:function(e){b((function(t){return[JSON.stringify(e)].concat(Object(o.a)(t))}))}});case 2:case"end":return e.stop()}}),e)}))))}},"Enable Midi")),d.map((function(e,t){return c.a.createElement(l.a.View_FieldRow,{key:""+(t-1+1)},c.a.createElement(l.a.Text_FieldLabel,null,e))})))))}}}]);
//# sourceMappingURL=18-5826446ed2c1e8e348b6.js.map