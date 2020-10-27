(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[27],{lqNZ:function(e,o,t){"use strict";t.r(o),t.d(o,"EducationalGame_MultiplesSnake",(function(){return d}));var n=t("t8gp"),r=t("ERkP"),i=t.n(r),l=t("DTYs"),a=t("hsFx"),c=t("4cHy"),s=t("rTbz"),u=t("7h3R"),m=Object(s.a)({storageKey:"MultiplesSnakeLeaderboard",sortKey:function(e){return e.score},scoreColumns:[{name:"Time",getValue:function(e){return""+(e.timeMs/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})}},{name:"Score",getValue:function(e){return""+e.score}}]}),d=function(e){var o,t=Object(r.useState)({key:0,startTime:Date.now(),gameOverTime:void 0,score:0}),n=t[0],a=t[1],c=Object(r.useState)(p()),s=c[0],d=c[1],v=Object(r.useState)(null),w=v[0],g=v[1],E=Object(r.useRef)(s),F=m.useLeaderboard({getScore:function(){var e;return{score:n.score,timeMs:(null!==(e=n.gameOverTime)&&void 0!==e?e:Date.now())-n.startTime}}}),S=function(){a((function(e){return Object.assign({},e,{gameOverTime:Date.now(),key:e.key+1})}))},T=function(e){var o=Object.assign({},E.current);o.body.push({position:o.player.position});var t=o.columns[o.player.position.col].cells[o.player.position.row];a((function(e){return Object.assign({},e,{score:e.score+t.value})})),o.player.position=e;var n=o.columns[o.player.position.col].cells[o.player.position.row];return"body"===n.state?(o.isGameOver=!0,b(o),d(o),void S()):(u.ProgressGameService.onCorrect(),y(o),o.body.length+1===f*f?(o.isGameWon=!0,a((function(e){return Object.assign({},e,{score:e.score+n.value})})),b(o),d(o),void S()):(d(o),void setTimeout((function(){j(o)}),100)))},j=function(e){var o=C(e,T);g(o)};return Object(r.useEffect)((function(){j(s)}),[]),E.current=s,i.a.createElement(i.a.Fragment,null,i.a.createElement(l.h,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},i.a.createElement(l.h,{style:{width:292}},i.a.createElement(x,{gameScore:n}),i.a.createElement(h,{gameBoard:s,focus:null!==(o=s.player.position)&&void 0!==o?o:{col:0,row:0}}),w&&!n.gameOverTime&&i.a.createElement(O,{gameInput:w}),i.a.createElement(F.LeaderboardArea,{gameOver:!!n.gameOverTime,onScoreSaved:function(){var e=p();a({key:0,startTime:Date.now(),gameOverTime:void 0,score:0}),d(e),j(e)}}))))},f=12,p=function(){var e={key:0,isGameOver:!1,isGameWon:!1,maxTimes:f,columns:Object(n.a)(new Array(f)).map((function(e,o){return{col:o,cells:Object(n.a)(new Array(f)).map((function(e,t){return{col:o,row:t,value:(o+1)*(t+1),state:"blank",bodyIndex:0,connected:{t:!1,b:!1,l:!1,r:!1}}}))}})),player:{position:{col:Object(c.a)(f),row:Object(c.a)(f)}},body:[]};return b(e),e},y=function(e){b(e),b(e)},b=function(e){var o=e;o.key+=1,o.columns.forEach((function(e){return e.cells.forEach((function(e){var o=e;"body"===o.state&&(o.state="blank"),"player"===o.state&&(o.state="body"),o.connected={t:!1,b:!1,l:!1,r:!1}}))}));var t=function(e,o,t){return{t:e.position.col===(null==o?void 0:o.position.col)&&e.position.row<(null==o?void 0:o.position.row)||e.position.col===(null==t?void 0:t.position.col)&&e.position.row<(null==t?void 0:t.position.row),b:e.position.col===(null==o?void 0:o.position.col)&&e.position.row>(null==o?void 0:o.position.row)||e.position.col===(null==t?void 0:t.position.col)&&e.position.row>(null==t?void 0:t.position.row),l:e.position.row===(null==o?void 0:o.position.row)&&e.position.col>(null==o?void 0:o.position.col)||e.position.row===(null==t?void 0:t.position.row)&&e.position.col>(null==t?void 0:t.position.col),r:e.position.row===(null==o?void 0:o.position.row)&&e.position.col<(null==o?void 0:o.position.col)||e.position.row===(null==t?void 0:t.position.row)&&e.position.col<(null==t?void 0:t.position.col)}};o.body.forEach((function(e,n){var r;v(o,e.position,"body",o.body.length-n,t(e,o.body[n-1],null!==(r=o.body[n+1])&&void 0!==r?r:o.player))})),v(o,o.player.position,"player",0,t(o.player,o.body[o.body.length-1],void 0))},v=function(e,o,t,n,r){var i=e;i.columns[o.col].cells[o.row].state=t,i.columns[o.col].cells[o.row].bodyIndex=n,i.columns[o.col].cells[o.row].connected=r,i.key+=1},w={cellView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.75)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellView:{width:24,height:24,borderWidth:1,borderColor:"#66FF66",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12},cellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#333300"},focusCellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"}},g=function(e,o,t){return{borderTopColor:o.connected.t?"transparent":w.focusCellView.borderColor,borderBottomColor:o.connected.b?"transparent":w.focusCellView.borderColor,borderLeftColor:o.connected.l?"transparent":w.focusCellView.borderColor,borderRightColor:o.connected.r?"transparent":w.focusCellView.borderColor,borderWidth:5*(.4+(e-o.bodyIndex)%10/10*.6)}},h=function(e){var o=e.gameBoard,t=e.focus,n=Object(r.useState)(0),a=n[0],c=n[1];return Object(r.useEffect)((function(){var e=setInterval((function(){c((function(e){return e+1}))}),500);return function(){return clearInterval(e)}}),[]),i.a.createElement(i.a.Fragment,null,i.a.createElement(l.h,{style:{flexDirection:"row"}},i.a.createElement(l.h,{style:{flexDirection:"column-reverse"}},i.a.createElement(l.h,{style:w.focusCellHeaderView},i.a.createElement(l.e,{style:w.focusCellHeaderText},"x")),o.columns[0].cells.map((function(e){return i.a.createElement(l.h,{key:e.row,style:t.row===e.row?w.focusCellHeaderView:w.cellHeaderView},i.a.createElement(l.e,{style:t.row===e.row?w.focusCellHeaderText:w.cellHeaderText},""+(e.row+1)))}))),o.columns.map((function(e){return i.a.createElement(l.h,{key:e.col,style:{flexDirection:"column-reverse"}},i.a.createElement(l.h,{style:t.col===e.col?w.focusCellHeaderView:w.cellHeaderView},i.a.createElement(l.e,{style:t.col===e.col?w.focusCellHeaderText:w.cellHeaderText},""+(e.col+1))),e.cells.map((function(e){return i.a.createElement(l.h,{key:e.row,style:"blank"!==e.state?[w.focusCellView,g(a,e,o.body.length)]:w.cellView},i.a.createElement(l.e,{style:w.cellText},function(e,o,t){return"body"===e.state?""+e.value:"player"===e.state&&t?"😎":"player"===e.state&&o?"💀":"player"===e.state?"😀":""}(e,o.isGameOver,o.isGameWon)))})))}))))},C=function(e,o){var t,n,r,i,l=e.player,c=[null===(t=e.columns[l.position.col+0])||void 0===t?void 0:t.cells[l.position.row+1],null===(n=e.columns[l.position.col+0])||void 0===n?void 0:n.cells[l.position.row-1],null===(r=e.columns[l.position.col+1])||void 0===r?void 0:r.cells[l.position.row+0],null===(i=e.columns[l.position.col-1])||void 0===i?void 0:i.cells[l.position.row+0]].filter((function(e){return e})),s=l.position.col===l.position.row,u=c.map((function(e){return{key:e.row+" "+e.col,text:e.value+(s&&l.position.col===e.col?"↕":s&&l.position.row===e.row?"↔":""),onPress:function(){return o(e)}}}));return{key:""+e.key,buttons:Object(a.f)(u)}},E={outerContainer:{height:150},container:{flexDirection:"row",justifyContent:"space-around",margin:16},buttonView:{width:48,height:48,borderWidth:2,borderColor:"#6666FF",borderStyle:"solid",justifyContent:"center",alignItems:"center"},buttonText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:24,color:"#FFFFFF"}},O=function(e){var o=e.gameInput,t=Object(r.useState)(0),n=t[0],a=t[1];return Object(r.useEffect)((function(){a(100);var e=setInterval((function(){a((function(e){return Math.max(0,e-1)}))}),50);return function(){return clearInterval(e)}}),[o.key]),console.log("GameInput",{gameInput:o}),i.a.createElement(i.a.Fragment,null,i.a.createElement(l.h,{style:E.outerContainer},i.a.createElement(l.h,{style:[E.container,{transform:"translate(0px,"+n+"px)"}]},o.buttons.map((function(e){return i.a.createElement(l.g,{key:e.key,onPress:e.onPress},i.a.createElement(l.h,{style:E.buttonView},i.a.createElement(l.e,{style:E.buttonText},e.text)))})))))},F={container:{flex:1,alignItems:"center",margin:16},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FFFF00"},mistakesText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FF6666"}},x=function(e){var o=e.gameScore,t=Object(r.useState)(""),n=(t[0],t[1]),a=Object(r.useState)(""),c=a[0],s=a[1];return Object(r.useEffect)((function(){var e=setInterval((function(){if(s(""+o.score),o.gameOverTime){var e=o.gameOverTime-o.startTime;n((function(o){return(e/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}else{var t=Date.now()-o.startTime;n((function(e){return(t/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}}),100);return function(){return clearInterval(e)}}),[o]),i.a.createElement(i.a.Fragment,null,i.a.createElement(l.h,{style:F.container},i.a.createElement(l.h,null,i.a.createElement(l.e,{style:F.text},c))))}}}]);
//# sourceMappingURL=27-aaac3f7379b3bb5d45da.js.map