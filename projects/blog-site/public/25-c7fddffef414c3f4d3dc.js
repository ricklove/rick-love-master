(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[25],{acMI:function(e,t,n){"use strict";n.r(t),n.d(t,"DoodlePartyView",(function(){return N})),n.d(t,"DoodlePartyView_Inner",(function(){return U}));var r=n("ERkP"),l=n.n(r),a=n("DTYs"),i=(n("xrQq"),n("kNg/"),n("VtSi")),o=n.n(i),c=(n("3yYM"),n("QsI/")),s=n("fGyu");function u(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var d=n("GJ35"),y=n("B8BD"),f=n("aEBB"),p=n("2wDJ"),g=n("hsFx"),v=n("+tC1"),h=n("Yh9R"),E=n("PyWT"),S=function(){return{clientStorage:{load:function(){try{var e;return JSON.parse(null!==(e=localStorage.getItem("_DoodleGameClient"))&&void 0!==e?e:"NULL!{}")}catch(t){return null}},save:function(e){localStorage.setItem("_DoodleGameClient",JSON.stringify(e))}}}},b=function(){var e,t=function(e){for(var t,n={},r=u(("?"===e[0]?e.substr(1):e).split("&"));!(t=r()).done;){var l=t.value.split("=");n[decodeURIComponent(l[0])]=decodeURIComponent(l[1]||"")}return n}(window.location.search);return{client:{_query:t,room:(e=t.room,null!=e?e:"UnknownRoom"),role:function(e){switch(e){case"debug":return"debug";case"viewer":return"viewer";default:return"player"}}(t.role),clientPlayer:{isActive:!0,clientKey:"",name:"",emoji:"👤",isReady:!1}}}},F=function(e,t,n){var r,l,a,i=function(){return{kind:"doodle",prompt:"Choose Your Own Word",chainKey:Date.now()+"-"+Math.floor(999999*Math.random())}},o=e.players.find((function(e){return e.clientKey===t}));if(!o)return i();var c=e.history.rounds.flatMap((function(e){return e.completed})).filter((function(e){return e.clientKey===o.clientKey})),s=null!==(r=c[c.length-1])&&void 0!==r?r:void 0,u=null!==(l=null==s||null===(a=s.assignment)||void 0===a?void 0:a.kind)&&void 0!==l?l:"doodle",m=new Set(e.history.rounds.flatMap((function(e){return e.completed})).filter((function(e){return e.clientKey===o.clientKey})).filter((function(e){var t;return"Choose Your Own Word"!==(null===(t=e.assignment)||void 0===t?void 0:t.prompt)})).map((function(e){var t,n,r;return null!==(t=null===(n=e.assignment)||void 0===n||null===(r=n.prompt)||void 0===r?void 0:r.toLowerCase().trim())&&void 0!==t?t:""}))),d=n.findIndex((function(e){var t,n;return!m.has(null!==(t=null===(n=e.prompt)||void 0===n?void 0:n.toLowerCase().trim())&&void 0!==t?t:"")&&e.kind===u}));if(d<0)return i();var y=n.splice(d,1)[0],f=Object.assign({},y);return"doodle"===f.kind?(f.kind="describe",f.prompt=void 0):(f.kind="doodle",f.doodle=void 0),f},w=function(e,t){if(console.log("reduceState",{message:t}),"setHost"===t.kind)return e.hostClientKey=t.hostClientKey,e;if("setPlayer"===t.kind){var n=e.players.find((function(e){return e.clientKey===t.clientPlayer.clientKey}));return n||(n=Object.assign({},t.clientPlayer,{isActive:!0}),e.players.push(n)),n.name=t.clientPlayer.name,n.emoji=t.clientPlayer.emoji,n.isReady=t.clientPlayer.isReady,e}if("assign"===t.kind)return e.players=t.players,t.lastRound&&t.lastRound.completed.length>0&&(e.history.rounds.find((function(e){var n;return e.roundKey===(null===(n=t.lastRound)||void 0===n?void 0:n.roundKey)}))||e.history.rounds.push(t.lastRound)),e;if("completeAssignment"===t.kind){var r,l=null===(r=e.players.find((function(e){return e.clientKey===t.playerAssignment.clientKey})))||void 0===r?void 0:r.assignment;return l?(l.prompt=t.playerAssignment.prompt,l.doodle=t.playerAssignment.doodle,e):e}return e},j=function(e,t){return console.log("reduceClientsState",{clients:t}),e.players.forEach((function(e){e.isActive=!!t.find((function(t){return t.key===e.clientKey}))})),e.clients=Object(g.a)([].concat(Object(s.a)(e.clients),Object(s.a)(t)).map((function(e){return e.key}))).map((function(e){return{key:e,isActive:!!t.find((function(t){return t.key===e}))}})),e},O=function(){var e,t,n,l,a=Object(r.useRef)(b()).current,i=Object(r.useState)(!0),u=i[0],m=i[1],O=Object(r.useState)(0),K=O[0],P=O[1],k=function(){P((function(e){return e+1}))},D=Object(r.useRef)(null),R=Object(r.useRef)(null),A=Object(r.useRef)(null);Object(r.useEffect)((function(){var e,t=Object(p.a)({channelKey:"doodle_"+a.client.room,initialState:{hostClientKey:"",clients:[],players:[],history:{rounds:[]}},reduceState:w,reduceClientsState:j}),n=t.subscribe((function(e){D.current=e,k()}));A.current={history:t._webSocket.history},R.current=t.sendMessage,(e=S().clientStorage.load())&&(a.client.clientPlayer={clientKey:"",name:e.clientPlayer.name,emoji:e.clientPlayer.emoji,isReady:!1,isActive:!0}),k(),a.client.clientPlayer.clientKey=t.clientKey;var r=setInterval((function(){var e,n=D.current;n&&((null===(e=n.clients.find((function(e){return e.key===n.hostClientKey})))||void 0===e?void 0:e.isActive)?n.hostClientKey===t.clientKey&&function(e,t){if(!(e.players.filter((function(e){return e.isActive&&e.isReady})).length<=0)){var n=Object(v.b)(Object(g.c)(e.history.rounds.flatMap((function(e){return e.completed})).map((function(e){return e.assignment})).filter((function(e){return e})).map((function(e){return e})),(function(e){var t;return null!==(t=null==e?void 0:e.chainKey)&&void 0!==t?t:""}))).map((function(e){return e.value[e.value.length-1]}));if(e.players.some((function(e){return e.isActive&&e.isReady&&e.assignment&&(!e.assignment.doodle||!e.assignment.prompt)}))){var r=e.players.filter((function(e){return!e.assignment}));return r.length>0?(r.forEach((function(t){t.assignment=F(e,t.clientKey,n)})),void t({kind:"assign",players:e.players,lastRound:void 0})):void 0}var l=Object(s.a)(e.players.filter((function(e){return e.assignment&&e.assignment.doodle&&e.assignment.prompt&&Object(E.a)(e.assignment.doodle).segments.length>0})).map((function(e){return Object.assign({},e,{assignment:e.assignment?Object.assign({},e.assignment):void 0})}))),a={roundKey:""+Date.now(),completed:l};e.history.rounds.push(a);for(var i=0;i<e.players.length;i++)e.players[i].assignment=F(e,e.players[i].clientKey,n);t({kind:"assign",players:e.players,lastRound:a}),setTimeout(Object(c.a)(o.a.mark((function t(){var n,r,l;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(f.a)(y.a),t.next=3,n.createUploadUrl({prefix:h.a.doodlePartyDrawingsPrefix+"/"+Date.now()});case 3:return r=t.sent.uploadUrl,l=Object(d.b)(r),t.next=7,l.uploadData({history:e.history});case 7:case"end":return t.stop()}}),t)}))))}}(n,t.sendMessage):t.sendMessage({kind:"setHost",hostClientKey:t.clientKey}))}),3e3+Math.floor(3e3*Math.random()));return m(!1),function(){n.unsubscribe(),t.close(),clearInterval(r)}}),[]);return{loading:u,renderId:K,clientState:a,meshState:D.current,setClientPlayer:function(e){var t,n=S().clientStorage;a.client.clientPlayer=Object.assign({},a.client.clientPlayer,e),n.save({clientPlayer:a.client.clientPlayer}),"player"===a.client.role&&(null===(t=R.current)||void 0===t||t.call(R,{kind:"setPlayer",clientPlayer:a.client.clientPlayer})),k()},sendAssignment:function(e){var t;"player"===a.client.role&&(null===(t=R.current)||void 0===t||t.call(R,{kind:"completeAssignment",playerAssignment:Object.assign({},e,{clientKey:a.client.clientPlayer.clientKey})}))},_messages:null!==(e=null===(t=A.current)||void 0===t?void 0:t.history.messages)&&void 0!==e?e:[],_events:null!==(n=null===(l=A.current)||void 0===l?void 0:l.history.events)&&void 0!==n?n:[]}},K=n("bQih"),P=function(e){var t,n,a=e.controller.clientState.client.clientPlayer,i=Object(r.useState)(Object.assign({},a)),o=i[0],c=i[1],s=Object(r.useState)(null!==(t=null===(n=e.controller.meshState)||void 0===n?void 0:n.players.filter((function(e){return e.clientKey!==a.clientKey})).map((function(e){return e.emoji})))&&void 0!==t?t:[]),u=s[0],m=s[1];return Object(r.useEffect)((function(){var t,n;m(null!==(t=null===(n=e.controller.meshState)||void 0===n?void 0:n.players.filter((function(e){return e.clientKey!==a.clientKey})).map((function(e){return e.emoji})))&&void 0!==t?t:[])}),[e.controller.renderId]),l.a.createElement(l.a.Fragment,null,l.a.createElement(K.a.View_Panel,null,l.a.createElement(K.a.Text_FormTitle,null,"User"),l.a.createElement(R,{userProfile:o,onUserProfileChange:function(t){c(t),e.controller.setClientPlayer(Object.assign({},t,{isReady:!1}))},usedEmojis:u}),l.a.createElement(K.a.View_FormActionRow,null,l.a.createElement(K.a.Button_FormAction,{onPress:function(){e.controller.setClientPlayer(Object.assign({},a,{isReady:!0})),e.onDone()}},"Ready"))),l.a.createElement(k,e))},k=function(e){var t;return l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,null,null===(t=e.controller.meshState)||void 0===t?void 0:t.players.filter((function(t){return!e.hideInactive||t.isActive})).map((function(e){return l.a.createElement(a.h,{key:e.clientKey,style:{flexDirection:"row",alignItems:"center"}},l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:24}},(t=e).isActive?t.isReady?t.assignment&&t.assignment&&!t.assignment.doodle&&"doodle"===t.assignment.kind?"🎨":t.assignment&&t.assignment&&!t.assignment.prompt&&"describe"===t.assignment.kind?"✏":"✔":"◻":"❌")),l.a.createElement(a.h,{style:{width:48}},l.a.createElement(a.e,{style:{fontSize:32}},e.emoji)),l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:16}},e.name)));var t}))))},D="\n🐵 🐶 🐺 🐱 🦁 🐯 🦒 🦊 🦝 🐮 🐷 🐗 🐭 🐹 🐰 🐻 🐨 🐼 🐸 🦓 🐴 🦄 🐔 🐲 \n🤖 👽 👻 🍕 🍔 🌭 🥓 🌮 🍖 🥩 🍦 🍩 🍰 🧁 🥝 🥥 🍒 🍓 🍄 🥦 🥑 🥕 \n🚗 🚑 🚒 🚜 🦼 🚲 🚂 🛩 🚀 🛸 🛰 🪐 🧯 🧷  🪑 🛎 ☂ ⛄\n".replace(/\n/g,"").split(" ").map((function(e){return e.trim()})).filter((function(e){return e})),R=function(e){var t=e.userProfile,n=e.onUserProfileChange,i=e.usedEmojis,o=Object(r.useState)(D),c=o[0],s=o[1],u=Object(r.useState)(!1),m=u[0],d=u[1];return Object(r.useEffect)((function(){s(D.filter((function(e){return!i.includes(e)})))}),[i]),m?l.a.createElement(l.a.Fragment,null,l.a.createElement(K.a.View_Form,null,l.a.createElement(a.h,{style:{flexDirection:"row",flexWrap:"wrap"}},c.map((function(e){return l.a.createElement(a.g,{key:e,onPress:function(){return r=e,d(!1),void n(Object.assign({},t,{emoji:r}));var r}},l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:32}},e)))}))))):l.a.createElement(l.a.Fragment,null,l.a.createElement(K.a.View_Form,null,l.a.createElement(K.a.View_FieldRow,null,l.a.createElement(a.g,{onPress:function(){return d(!0)}},l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:32}},t.emoji))),l.a.createElement(A,{userProfile:t,onNameChange:function(e){return n(Object.assign({},t,{name:e}))}}))))},A=function(e){var t=e.userProfile,n=e.onNameChange,a=Object(r.useState)(t.name||"Player"),i=a[0],o=a[1],c=Object(r.useState)(!1),s=c[0],u=c[1],m=function(){n(i),u(!1)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(K.a.Input_Text,{value:i,onChange:o,onSubmit:m,onFocus:function(){o(""),u(!0)}}),s&&l.a.createElement(K.a.Button_FieldInline,{onPress:m},"Set Name"))},C=n("qVe0"),_=n("Ig+6"),I=function(e){var t=e.controller,n=t.clientState,r=t.meshState,i=n.client,o=i.clientPlayer,c=i.role;return l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,{key:o.clientKey,style:{padding:4,flexDirection:"row",alignItems:"center"}},"player"===c&&o?l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,{style:{width:36}},l.a.createElement(a.e,{style:{fontSize:24}},o.emoji)),l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:16}},o.name))):l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:16}},c))),l.a.createElement(a.h,{style:{flex:1}}),l.a.createElement(a.h,null,l.a.createElement(a.e,{style:{fontSize:16}},(null==r?void 0:r.hostClientKey)===n.client.clientPlayer.clientKey?"🟢":""))))},z=function(e){var t,n,r,i,o=null!==(t=null===(n=e.controller.meshState)||void 0===n?void 0:n.history.rounds.flatMap((function(e,t){return e.completed.map((function(e){var n;return{iRound:t,item:e,chainKey:null===(n=e.assignment)||void 0===n?void 0:n.chainKey}}))})))&&void 0!==t?t:[],c=Object(v.b)(Object(g.c)(o,(function(e){var t;return null!==(t=e.chainKey)&&void 0!==t?t:""}))).map((function(e){return{chain:e.key,items:e.value.sort((function(e,t){return e.iRound-t.iRound}))}}));return l.a.createElement(a.h,null,l.a.createElement(a.e,null,"Players"),l.a.createElement(k,{controller:e.controller}),l.a.createElement(a.e,null,"Rounds"),l.a.createElement(a.e,null,""+(null!==(r=null===(i=e.controller.meshState)||void 0===i?void 0:i.history.rounds.length)&&void 0!==r?r:0)),l.a.createElement(a.e,null,"Chains"),l.a.createElement(a.h,null,c.map((function(e,t){return l.a.createElement(a.h,{style:{margin:4,padding:4,background:"#444444"}},l.a.createElement(a.h,{key:""+t,style:{flexDirection:"row",alignItems:"center",flexWrap:"wrap"}},e.items.map((function(e){return l.a.createElement(a.h,{style:{padding:4}},l.a.createElement(x,{key:e.item.clientKey,player:e.item}))}))))}))))},x=function(e){var t,n,r=e.player,i=e.player.assignment;return l.a.createElement(a.h,{style:{flexDirection:"column",alignItems:"center",width:104}},l.a.createElement(a.e,null,r.name),l.a.createElement(a.e,null,r.emoji),l.a.createElement(a.e,{style:{color:"#FFFF00",whiteSpace:"pre-wrap"}},"doodle"===(null==i?void 0:i.kind)&&null!==(t=null==i?void 0:i.prompt)&&void 0!==t?t:""),!(null==i||!i.doodle)&&l.a.createElement(_.DoodleDisplayView,{style:{width:104,height:104,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(E.a)(i.doodle),shouldAnimate:!0,enableRedraw:!0}),l.a.createElement(a.e,{style:{color:"#FFFF00",whiteSpace:"pre-wrap"}},"describe"===(null==i?void 0:i.kind)&&null!==(n=null==i?void 0:i.prompt)&&void 0!==n?n:""))},M=function(e){var t,n,i=e.controller,o=i.clientState,c=i.meshState,s=o.client.clientPlayer.clientKey,u=null==c||null===(t=c.players.find((function(e){return e.clientKey===s})))||void 0===t?void 0:t.assignment,m=Object(r.useState)(""),d=m[0],y=m[1];if(Object(r.useEffect)((function(){y("")}),[u]),!u)return l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,{style:{padding:8}},l.a.createElement(a.e,null,"Please Wait Until Next Round")),l.a.createElement(z,{controller:e.controller}));if("describe"===u.kind&&u.doodle){var f=function(){u.prompt=d,e.controller.sendAssignment(u)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,{style:{flexDirection:"column",alignItems:"center"}},l.a.createElement(a.e,{style:{fontSize:20,margin:8}},"Describe"),l.a.createElement(_.DoodleDisplayView,{style:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(E.a)(u.doodle),shouldAnimate:!0,enableRedraw:!0}),!u.prompt&&l.a.createElement(l.a.Fragment,null,l.a.createElement(a.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},"What is this?"),l.a.createElement(K.a.Input_Text,{value:d,onChange:y,onSubmit:f}),l.a.createElement(K.a.Button_FieldInline,{onPress:f},"Done")),u.prompt&&l.a.createElement(l.a.Fragment,null,l.a.createElement(a.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},u.prompt),l.a.createElement(a.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},"Waiting for other players"),l.a.createElement(k,{controller:e.controller,hideInactive:!0}),l.a.createElement(a.h,{style:{padding:8}},l.a.createElement(a.a,{size:"large",color:"#FFFF00"})))))}return u.doodle?l.a.createElement(l.a.Fragment,null,l.a.createElement(a.h,{style:{flexDirection:"column",alignItems:"center"}},l.a.createElement(a.e,{style:{fontSize:20,margin:8}},"Draw"),l.a.createElement(_.DoodleDisplayView,{style:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(E.a)(u.doodle),shouldAnimate:!0,enableRedraw:!0}),l.a.createElement(a.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},"Waiting for other players"),l.a.createElement(k,{controller:e.controller,hideInactive:!0}),l.a.createElement(a.h,{style:{padding:8}},l.a.createElement(a.a,{size:"large",color:"#FFFF00"})))):l.a.createElement(l.a.Fragment,null,l.a.createElement(a.e,{style:{fontSize:20,margin:8}},"Draw"),l.a.createElement(C.b,{prompt:null!==(n=u.prompt)&&void 0!==n?n:"",onDone:function(t){u.doodle=Object(E.d)(t),e.controller.sendAssignment(u)}}))},N=function(){var e=O();return l.a.createElement(l.a.Fragment,null,l.a.createElement(I,{controller:e}),l.a.createElement(U,{controller:e}))},U=function(e){var t=e.controller,n=Object(r.useState)("profile"),i=n[0],o=n[1];return t.loading?l.a.createElement(a.a,{size:"large",color:"#FFFF00"}):"debug"===t.clientState.client.role?l.a.createElement(V,{controller:t}):"viewer"===t.clientState.client.role?l.a.createElement(z,{controller:t}):"profile"===i?l.a.createElement(P,{controller:t,onDone:function(){o("play")}}):l.a.createElement(M,{controller:t})},V=function(e){var t,n=e.controller,i=n.clientState,o=n.meshState,c=n._events,s=n._messages,u=Object(r.useState)(0),m=(u[0],u[1]);return Object(r.useEffect)((function(){var e=setInterval((function(){m((function(e){return e+1}))}),1e3);return function(){clearInterval(e)}}),[]),l.a.createElement(l.a.Fragment,null,l.a.createElement(z,{controller:e.controller}),l.a.createElement(a.h,{style:{marginTop:64,background:"#555555"}},l.a.createElement(a.e,{style:{fontSize:20}},"Debug"),l.a.createElement(a.h,null,l.a.createElement(a.e,null,"Query: "+JSON.stringify(i.client._query)),l.a.createElement(a.e,null,"Room: "+i.client.room),l.a.createElement(a.e,null,"Role: "+i.client.role)),l.a.createElement(a.h,{style:{padding:4}},l.a.createElement(a.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Host"),l.a.createElement(a.e,{style:{whiteSpace:"pre-wrap",fontSize:14}},"'"+(null!==(t=null==o?void 0:o.hostClientKey)&&void 0!==t?t:"")+"'"),l.a.createElement(a.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Players"),null==o?void 0:o.players.map((function(e,t){return l.a.createElement(a.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),l.a.createElement(a.e,{style:{fontSize:20}},"Web Sockets"),l.a.createElement(a.h,null,l.a.createElement(a.h,{style:{padding:4}},l.a.createElement(a.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),c.map((function(e,t){return l.a.createElement(a.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),l.a.createElement(a.h,{style:{padding:4}},l.a.createElement(a.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),s.map((function(e,t){return l.a.createElement(a.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.t+" "+(e._r-e.t)+": "+JSON.stringify(e))}))))))}}}]);
//# sourceMappingURL=25-c7fddffef414c3f4d3dc.js.map