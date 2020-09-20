(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[20],{RTBV:function(e,t,n){"use strict";n.r(t),n.d(t,"DoodlePartyView",(function(){return I})),n.d(t,"DoodlePartyView_Inner",(function(){return M}));var r=n("ERkP"),a=n.n(r),l=n("DTYs"),i=(n("xrQq"),n("kNg/"),n("a1TR")),o=n.n(i),c=(n("3yYM"),n("Ab9Y")),s=n("t8gp");function u(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var y=n("hEsX"),d=n("C2Qu"),f=n("+tC1"),p=n("4cHy"),g=n("X2o9"),E=n("1U25"),v=n("Vgox"),h=n("Rzy9"),b=n("MWkW"),S=function(){return{clientStorage:{load:function(){try{var e;return JSON.parse(null!==(e=localStorage.getItem("_DoodleGameClient"))&&void 0!==e?e:"NULL!{}")}catch(t){return null}},save:function(e){localStorage.setItem("_DoodleGameClient",JSON.stringify(e))}}}},w=function(){var e,t=function(e){for(var t,n={},r=u(("?"===e[0]?e.substr(1):e).split("&"));!(t=r()).done;){var a=t.value.split("=");n[decodeURIComponent(a[0])]=decodeURIComponent(a[1]||"")}return n}(window.location.search);return{client:{_query:t,room:(e=t.room,null!=e?e:"UnknownRoom"),role:function(e){switch(e){case"debug":return"debug";case"viewer":return"viewer";default:return"player"}}(t.role),clientPlayer:{clientKey:(""+Math.random()).substr(2),name:"",emoji:"👤",isReady:!1}},players:[],history:{rounds:[]}}},F=function(){return{kind:"doodle",prompt:"Choose Your Own Word",chainKey:Date.now()+"-"+Math.floor(999999*Math.random())}},j=function(){var e=Object(r.useRef)(w()).current,t=e.client.clientPlayer.clientKey,n=Object(r.useState)(!0),a=n[0],l=n[1],i=Object(r.useState)(0),u=i[0],m=i[1],j=function(){m((function(e){return e+1}))},O=Object(r.useState)([]),K=O[0],D=O[1],k=Object(r.useState)([]),P=k[0],C=k[1],R=Object(r.useRef)(null),_=Object(r.useRef)(null);Object(r.useEffect)((function(){var t;(t=S().clientStorage.load())&&(e.client.clientPlayer={clientKey:t.clientPlayer.clientKey,name:t.clientPlayer.name,emoji:t.clientPlayer.emoji,isReady:!1,isUser:!0}),j();var n=Object(y.a)({websocketsApiUrl:d.a.websocketsApiUrl}).connect({key:e.client.room}),r=n.subscribeMessages((function(t){_.current||(_.current=function(e,t,n){console.log("createMessageHandler");var r=e.client.clientPlayer.clientKey,a=setTimeout((function(){})),l=function(t){e.masterClientKey=r,n({kind:"syncResponse",requestedClientKey:t,gameState:{masterClientKey:e.masterClientKey,players:e.players,history:e.history},clientKey:r,timestamp:Date.now()})},i={startTimestamp:Date.now(),clientStates:{}},u=function(){if(e.players.some((function(e){return!e.isReady||e.assignment&&(!e.assignment.doodle||!e.assignment.prompt)}))){var a=e.players.filter((function(e){return e.isReady&&!e.assignment}));return a.length>0?(a.forEach((function(e){e.assignment=F()})),n({kind:"assign",players:e.players,lastRound:void 0,clientKey:r,timestamp:Date.now()}),void t()):void 0}var l={completed:Object(s.a)(e.players.map((function(e){return Object.assign({},e,{assignment:e.assignment?Object.assign({},e.assignment):void 0})})))};e.history.rounds.push(l);var i=e.players.map((function(e){return e.assignment})),u=e.players.shift();if(u){e.players.push(u);for(var m=function(t){var n=e.players[t],r=i[t],a=null==r?void 0:r.doodle,l=null==r?void 0:r.prompt;if(!r||!l||!a||Object(b.a)(a).segments.length<=0||"describe"===r.kind&&e.history.rounds.flatMap((function(e){return e.completed})).find((function(e){var t;return e.clientKey===n.clientKey&&l===(null===(t=n.assignment)||void 0===t?void 0:t.prompt)})))return e.players[t].assignment=F(),"continue";var o=Object.assign({},r);"doodle"===o.kind?(o.kind="describe",o.prompt=void 0):(o.kind="doodle",o.doodle=void 0),e.players[t].assignment=o},y=0;y<e.players.length;y++)m(y);n({kind:"assign",players:e.players,lastRound:l,clientKey:r,timestamp:Date.now()}),setTimeout(Object(c.a)(o.a.mark((function t(){var n,r,a;return o.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=Object(v.a)(E.a),t.next=3,n.createUploadUrl({prefix:h.a.doodlePartyDrawingsPrefix+"/"+Date.now()});case 3:return r=t.sent.uploadUrl,a=Object(g.b)(r),t.next=7,a.uploadData({history:e.history});case 7:case"end":return t.stop()}}),t)}))))}};setInterval((function(){var t,a,o=null!==(t=i.clientStates[null!==(a=e.masterClientKey)&&void 0!==a?a:""])&&void 0!==t?t:{lastMessageTimestamp:i.startTimestamp};e.masterClientKey===r?(u(),Date.now()>15e3+o.lastMessageTimestamp&&n({kind:"aliveResponse",clientKey:r,timestamp:Date.now()}),Object(f.b)(i.clientStates).filter((function(e){return e.key!==r})).filter((function(e){return Date.now()>15e3+e.value.lastMessageTimestamp})).map((function(e){return n({kind:"aliveRequest",requestedClientKey:e.key,clientKey:r,timestamp:Date.now()})})),Object(f.b)(i.clientStates).filter((function(e){return e.key!==r})).filter((function(e){return Date.now()>3e4+e.value.lastMessageTimestamp})).map((function(e){return n({kind:"dropPlayer",droppedClientKey:e.key,clientKey:r,timestamp:Date.now()})}))):Date.now()>3e4+o.lastMessageTimestamp&&(console.log("createMessageHandler - Master not responsive!",{m:o,masterState:i}),l(r))}),3e3+Object(p.a)(3e3));return{handleMessage:function(o){if(i.clientStates[o.clientKey]={lastMessageTimestamp:Date.now()},"setPlayer"===o.kind){var c=e.players.find((function(e){return e.clientKey===o.clientPlayer.clientKey}));return c||(c=Object.assign({},o.clientPlayer),e.players.push(c)),c.isUser=c.clientKey===r,c.name=o.clientPlayer.name,c.emoji=o.clientPlayer.emoji,c.isReady=o.clientPlayer.isReady,r===e.masterClientKey&&setTimeout((function(){u()}),3e3),void t()}if("dropPlayer"===o.kind)return e.players=e.players.filter((function(e){return e.clientKey!==o.droppedClientKey})),console.log("dropPlayer",{players_after:Object(s.a)(e.players),message:o}),void t();if(o.clientKey!==r){if("assign"===o.kind)return e.players=o.players,o.lastRound&&e.history.rounds.push(o.lastRound),void t();if("completeAssignment"===o.kind){var m,y=null===(m=e.players.find((function(e){return e.clientKey===o.clientKey})))||void 0===m?void 0:m.assignment;if(!y)return;return y.prompt=o.playerAssignment.prompt,y.doodle=o.playerAssignment.doodle,r===e.masterClientKey&&u(),void t()}if("aliveRequest"!==o.kind){if("syncRequest"===o.kind){if(e.masterClientKey===r)return void l(o.clientKey);clearTimeout(a),a=setTimeout((function(){l(o.clientKey)}),1e3+Object(p.a)(3e3))}if("syncResponse"===o.kind){if(clearTimeout(a),o.requestedClientKey!==r){if(o.gameState.players.length<e.players.length||o.gameState.history.rounds.length<e.history.rounds.length)return l(o.clientKey),void l(o.requestedClientKey);e.masterClientKey=o.gameState.masterClientKey}var d=e.client;Object.assign(e,o.gameState),e.client=d,e.players.forEach((function(e){e.isUser=!1}));var f=e.players.find((function(e){return e.clientKey===d.clientPlayer.clientKey}));f&&(f.isUser=!0)}}else{if(o.requestedClientKey!==r)return;n({kind:"aliveResponse",clientKey:r,timestamp:Date.now()})}}}}}(e,j,(function(e){var t;return null===(t=R.current)||void 0===t?void 0:t.call(R,e)}))),_.current.handleMessage(t),D((function(e){return[].concat(Object(s.a)(e),[Object.assign({},t,{receivedAtTimestamp:Date.now()})])}))})),a=n.subscribeConnectionEvents((function(e){R.current=n.isConnected()?n.send:null,C((function(t){return[].concat(Object(s.a)(t),[e])}))}));return l(!1),function(){R.current=null,r.unsubscribe(),a.unsubscribe()}}),[]);var A=function(){var n;"player"===e.client.role&&(null===(n=R.current)||void 0===n||n.call(R,{kind:"setPlayer",clientPlayer:e.client.clientPlayer,clientKey:t,timestamp:Date.now()}))};return Object(r.useEffect)((function(){var e;R.current&&(A(),null===(e=R.current)||void 0===e||e.call(R,{kind:"syncRequest",clientKey:t,timestamp:Date.now()}))}),[R.current]),{loading:a,renderId:u,gameState:e,setClientPlayer:function(t){console.log("useDoodlePartyController.setClientPlayer",{value:t,send:R.current});var n=S().clientStorage;e.client.clientPlayer=Object.assign({},e.client.clientPlayer,t),n.save({clientPlayer:e.client.clientPlayer}),A(),j()},sendAssignment:function(n){var r;"player"===e.client.role&&(null===(r=R.current)||void 0===r||r.call(R,{kind:"completeAssignment",playerAssignment:Object.assign({},n,{clientKey:t}),clientKey:t,timestamp:Date.now()}))},_messages:K,_events:P}},O=n("bQih"),K=function(e){var t=e.controller.gameState.client.clientPlayer,n=Object(r.useState)(Object.assign({},t)),l=n[0],i=n[1],o=Object(r.useState)(e.controller.gameState.players.filter((function(e){return!e.isUser})).map((function(e){return e.emoji}))),c=o[0],s=o[1];return Object(r.useEffect)((function(){s(e.controller.gameState.players.filter((function(e){return!e.isUser})).map((function(e){return e.emoji})))}),[e.controller.renderId]),a.a.createElement(a.a.Fragment,null,a.a.createElement(O.a.View_Panel,null,a.a.createElement(O.a.Text_FormTitle,null,"User"),a.a.createElement(P,{userProfile:l,onUserProfileChange:function(t){i(t),e.controller.setClientPlayer(Object.assign({},t,{isReady:!1}))},usedEmojis:c}),a.a.createElement(O.a.View_FormActionRow,null,a.a.createElement(O.a.Button_FormAction,{onPress:function(){e.controller.setClientPlayer(Object.assign({},t,{isReady:!0})),e.onDone()}},"Ready"))),a.a.createElement(D,e))},D=function(e){return a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,null,e.controller.gameState.players.map((function(e){return a.a.createElement(l.h,{key:e.clientKey,style:{flexDirection:"row",alignItems:"center"}},a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:24}},(t=e).isReady?t.assignment&&t.assignment&&!t.assignment.doodle&&"doodle"===t.assignment.kind?"🎨":t.assignment&&t.assignment&&!t.assignment.prompt&&"describe"===t.assignment.kind?"✏":"✔":"◻")),a.a.createElement(l.h,{style:{width:48}},a.a.createElement(l.e,{style:{fontSize:32}},e.emoji)),a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:16}},e.name)));var t}))))},k="\n🐵 🐶 🐺 🐱 🦁 🐯 🦒 🦊 🦝 🐮 🐷 🐗 🐭 🐹 🐰 🐻 🐨 🐼 🐸 🦓 🐴 🦄 🐔 🐲 \n🤖 👽 👻 🍕 🍔 🌭 🥓 🌮 🍖 🥩 🍦 🍩 🍰 🧁 🥝 🥥 🍒 🍓 🍄 🥦 🥑 🥕 \n🚗 🚑 🚒 🚜 🦼 🚲 🚂 🛩 🚀 🛸 🛰 🪐 🧯 🧷  🪑 🛎 ☂ ⛄\n".replace(/\n/g,"").split(" ").map((function(e){return e.trim()})).filter((function(e){return e})),P=function(e){var t=e.userProfile,n=e.onUserProfileChange,i=e.usedEmojis,o=Object(r.useState)(k),c=o[0],s=o[1],u=Object(r.useState)(!1),m=u[0],y=u[1];return Object(r.useEffect)((function(){s(k.filter((function(e){return!i.includes(e)})))}),[i]),m?a.a.createElement(a.a.Fragment,null,a.a.createElement(O.a.View_Form,null,a.a.createElement(l.h,{style:{flexDirection:"row",flexWrap:"wrap"}},c.map((function(e){return a.a.createElement(l.g,{key:e,onPress:function(){return r=e,y(!1),void n(Object.assign({},t,{emoji:r}));var r}},a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:32}},e)))}))))):a.a.createElement(a.a.Fragment,null,a.a.createElement(O.a.View_Form,null,a.a.createElement(O.a.View_FieldRow,null,a.a.createElement(l.g,{onPress:function(){return y(!0)}},a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:32}},t.emoji))),a.a.createElement(C,{userProfile:t,onNameChange:function(e){return n(Object.assign({},t,{name:e}))}}))))},C=function(e){var t=e.userProfile,n=e.onNameChange,l=Object(r.useState)(t.name||"Player"),i=l[0],o=l[1],c=Object(r.useState)(!1),s=c[0],u=c[1],m=function(){n(i),u(!1)};return a.a.createElement(a.a.Fragment,null,a.a.createElement(O.a.Input_Text,{value:i,onChange:o,onSubmit:m,onFocus:function(){o(""),u(!0)}}),s&&a.a.createElement(O.a.Button_FieldInline,{onPress:m},"Set Name"))},R=n("hsFx"),_=n("DufX"),A=n("pAyS"),T=function(e){var t=e.controller.gameState,n=t.client,r=n.clientPlayer,i=n.role;return a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,{key:r.clientKey,style:{padding:4,flexDirection:"row",alignItems:"center"}},"player"===i&&r?a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,{style:{width:36}},a.a.createElement(l.e,{style:{fontSize:24}},r.emoji)),a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:16}},r.name))):a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:16}},i))),a.a.createElement(l.h,{style:{flex:1}}),a.a.createElement(l.h,null,a.a.createElement(l.e,{style:{fontSize:16}},t.masterClientKey===t.client.clientPlayer.clientKey?"🟢":""))))},z=function(e){var t=e.controller.gameState.history.rounds.flatMap((function(e,t){return e.completed.map((function(e){var n;return{iRound:t,item:e,chainKey:null===(n=e.assignment)||void 0===n?void 0:n.chainKey}}))})),n=Object(f.b)(Object(R.c)(t,(function(e){var t;return null!==(t=e.chainKey)&&void 0!==t?t:""}))).map((function(e){return{chain:e.key,items:e.value.sort((function(e,t){return e.iRound-t.iRound}))}}));return a.a.createElement(l.h,null,a.a.createElement(l.e,null,"Players"),a.a.createElement(D,{controller:e.controller}),a.a.createElement(l.e,null,"Rounds"),a.a.createElement(l.e,null,""+e.controller.gameState.history.rounds.length),a.a.createElement(l.e,null,"Chains"),a.a.createElement(l.h,{style:{margin:4,padding:4,background:"#444444"}},n.map((function(e,t){return a.a.createElement(l.h,{key:""+t,style:{flexDirection:"row",alignItems:"center"}},e.items.map((function(e){return a.a.createElement(U,{key:e.item.clientKey,player:e.item})})))}))))},U=function(e){var t,n,r=e.player,i=e.player.assignment;return a.a.createElement(l.h,{style:{flexDirection:"column",alignItems:"center"}},a.a.createElement(l.e,null,r.name),a.a.createElement(l.e,null,r.emoji),"doodle"===(null==i?void 0:i.kind)&&a.a.createElement(l.e,{style:{color:"#FFFF00",whiteSpace:"pre-wrap"}},null!==(t=null==i?void 0:i.prompt)&&void 0!==t?t:""),!!(null==i?void 0:i.doodle)&&a.a.createElement(A.DoodleDisplayView,{style:{width:104,height:104,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(b.a)(i.doodle),shouldAnimate:!0,enableRedraw:!0}),"describe"===(null==i?void 0:i.kind)&&a.a.createElement(l.e,{style:{color:"#FFFF00",whiteSpace:"pre-wrap"}},null!==(n=null==i?void 0:i.prompt)&&void 0!==n?n:""))},x=function(e){var t,n,i=e.controller.gameState,o=i.client.clientPlayer.clientKey,c=null===(t=i.players.find((function(e){return e.clientKey===o})))||void 0===t?void 0:t.assignment,s=Object(r.useState)(""),u=s[0],m=s[1];if(Object(r.useEffect)((function(){m("")}),[c]),!c)return a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,{style:{padding:8}},a.a.createElement(l.e,null,"Please Wait Until Next Round")),a.a.createElement(z,{controller:e.controller}));if("describe"===c.kind&&c.doodle){var y=function(){c.prompt=u,e.controller.sendAssignment(c)};return a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,{style:{flexDirection:"column",alignItems:"center"}},a.a.createElement(l.e,{style:{fontSize:20,margin:8}},"Describe"),a.a.createElement(A.DoodleDisplayView,{style:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(b.a)(c.doodle),shouldAnimate:!0,enableRedraw:!0}),!c.prompt&&a.a.createElement(a.a.Fragment,null,a.a.createElement(l.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},"What is this?"),a.a.createElement(O.a.Input_Text,{value:u,onChange:m,onSubmit:y}),a.a.createElement(O.a.Button_FieldInline,{onPress:y},"Done")),c.prompt&&a.a.createElement(l.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},c.prompt)))}return c.doodle?a.a.createElement(a.a.Fragment,null,a.a.createElement(l.h,{style:{flexDirection:"column",alignItems:"center"}},a.a.createElement(l.e,{style:{fontSize:20,margin:8}},"Draw"),a.a.createElement(A.DoodleDisplayView,{style:{width:312,height:312,color:"#FFFFFF",backgroundColor:"#000000"},drawing:Object(b.a)(c.doodle),shouldAnimate:!0,enableRedraw:!0}),a.a.createElement(l.e,{style:{fontSize:20,margin:8,color:"#FFFF00"}},"Waiting for other players"),a.a.createElement(l.a,{size:"large",color:"#FFFF00"}))):a.a.createElement(a.a.Fragment,null,a.a.createElement(l.e,{style:{fontSize:20,margin:8}},"Draw"),a.a.createElement(_.b,{prompt:null!==(n=c.prompt)&&void 0!==n?n:"",onDone:function(t){c.doodle=Object(b.d)(t),e.controller.sendAssignment(c)}}))},I=function(){var e=j();return a.a.createElement(a.a.Fragment,null,a.a.createElement(T,{controller:e}),a.a.createElement(M,{controller:e}))},M=function(e){var t=e.controller,n=Object(r.useState)("profile"),i=n[0],o=n[1];return t.loading?a.a.createElement(l.a,{size:"large",color:"#FFFF00"}):"debug"===t.gameState.client.role?a.a.createElement(N,{controller:t}):"viewer"===t.gameState.client.role?a.a.createElement(z,{controller:t}):"profile"===i?a.a.createElement(K,{controller:t,onDone:function(){o("play")}}):a.a.createElement(x,{controller:t})},N=function(e){var t=e.controller,n=t.gameState,r=t._messages,i=t._events;return a.a.createElement(a.a.Fragment,null,a.a.createElement(z,{controller:e.controller}),a.a.createElement(l.h,{style:{marginTop:64,background:"#555555"}},a.a.createElement(l.e,{style:{fontSize:20}},"Debug"),a.a.createElement(l.h,null,a.a.createElement(l.e,null,"Query: "+JSON.stringify(n.client._query)),a.a.createElement(l.e,null,"Room: "+n.client.room),a.a.createElement(l.e,null,"Role: "+n.client.role)),a.a.createElement(l.e,{style:{fontSize:20}},"Web Sockets"),a.a.createElement(l.h,null,a.a.createElement(l.h,{style:{padding:4}},a.a.createElement(l.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Events"),i.map((function(e,t){return a.a.createElement(l.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},JSON.stringify(e))}))),a.a.createElement(l.h,{style:{padding:4}},a.a.createElement(l.e,{style:{whiteSpace:"pre-wrap",fontSize:18}},"Messages"),r.map((function(e,t){return a.a.createElement(l.e,{key:t,style:{whiteSpace:"pre-wrap",fontSize:14}},e.timestamp+" "+(e.receivedAtTimestamp-e.timestamp)+": "+JSON.stringify(e))}))))))}}}]);
//# sourceMappingURL=20-7fe17f11e42d142436a6.js.map