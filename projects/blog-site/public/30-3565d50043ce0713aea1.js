(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[30],{yGAw:function(e,t,o){"use strict";o.r(t),o.d(t,"EducationalGame_MultiplesMonster",(function(){return f}));var n=o("fGyu"),r=o("ERkP"),a=o.n(r),i=o("DTYs"),c=o("hsFx"),l=o("4cHy"),s=o("rTbz"),u=o("7h3R"),m=Object(s.a)({storageKey:"MultiplesMonsterLeaderboard",sortKey:function(e){return e.score},scoreColumns:[{name:"Time",getValue:function(e){return""+(e.timeMs/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})}},{name:"Score",getValue:function(e){return""+e.score}}]}),f=function(e){var t,o=Object(r.useState)({key:0,startTime:Date.now(),gameOverTime:void 0,score:0}),n=o[0],c=o[1],l=Object(r.useState)(d()),s=l[0],f=l[1],w=Object(r.useState)(null),y=w[0],b=w[1],v=Object(r.useRef)(s),F=m.useLeaderboard({getScore:function(){var e;return{score:n.score,timeMs:(null!==(e=n.gameOverTime)&&void 0!==e?e:Date.now())-n.startTime}}}),j=function(e){var t=Object.assign({},v.current);t.player.position=e;var o=t.columns[t.player.position.col].cells[t.player.position.row];if("blank"===o.state&&(u.ProgressGameService.onCorrect(),c((function(e){return Object.assign({},e,{score:e.score+o.value})}))),"house"===o.state){var n=d();return f(n),void C(n)}p(t),"monster"===(o=t.columns[t.player.position.col].cells[t.player.position.row]).state&&c((function(e){return Object.assign({},e,{gameOverTime:Date.now(),key:e.key+1})})),f(t),setTimeout((function(){C(t)}),100)},C=function(e){var t=h(e,j);b(t)};return Object(r.useEffect)((function(){C(s)}),[]),v.current=s,a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},a.a.createElement(i.h,{style:{width:292}},a.a.createElement(E,{gameScore:n}),a.a.createElement(g,{gameBoard:s,focus:null!==(t=s.player.position)&&void 0!==t?t:{col:0,row:0}}),y&&!n.gameOverTime&&a.a.createElement(O,{gameInput:y}),a.a.createElement(F.LeaderboardArea,{gameOver:!!n.gameOverTime,onScoreSaved:function(){var e=d();c({key:0,startTime:Date.now(),gameOverTime:void 0,score:0}),f(e),C(e)}}))))},d=function(){for(var e={key:0,maxTimes:12,columns:Object(n.a)(new Array(12)).map((function(e,t){return{col:t,cells:Object(n.a)(new Array(12)).map((function(e,o){return{col:t,row:o,value:(t+1)*(o+1),state:"blank"}}))}})),player:{position:{col:Object(l.a)(12),row:Object(l.a)(12)}},house:{position:{col:Object(l.a)(12),row:Object(l.a)(12)}},monsters:Object(n.a)(new Array(3)).map((function(e){return{position:{col:Object(l.a)(12),row:Object(l.a)(12)}}}))};e.house.position.row===e.player.position.row;)e.house.position={col:Object(l.a)(12),row:Object(l.a)(12)};return e.monsters.forEach((function(t){for(var o=t;o.position.row===e.player.position.row;)o.position={col:Object(l.a)(12),row:Object(l.a)(12)}})),w(e),e},p=function(e){w(e);var t=e.player;if(e.monsters.forEach((function(e){var o=e,n=t.position.col-o.position.col,r=t.position.row-o.position.row;Math.abs(n)>=Math.abs(r)?o.position=Object.assign({},o.position,{col:o.position.col+Math.sign(n)}):o.position=Object.assign({},o.position,{row:o.position.row+Math.sign(r)})})),Math.random()<.25){var o={position:{col:Object(l.a)(12),row:Object(l.a)(12)}};Math.random()<.5?Math.random()<.5?o.position.col=0:o.position.col=11:Math.random()<.5?o.position.row=0:o.position.row=11,e.monsters.push(o)}var r=e,a=Object(n.a)(e.monsters),i=a.filter((function(t){return"answer"===e.columns[t.position.col].cells[t.position.row].state})),c=a.filter((function(t){return"answer"!==e.columns[t.position.col].cells[t.position.row].state}));i.forEach((function(e){r.columns[e.position.col].cells[e.position.row].state="blank"})),r.monsters=c,w(r)},w=function(e){e.columns.forEach((function(e){return e.cells.forEach((function(e){var t=e;"monster"===t.state&&(t.state="blank"),"player"===t.state&&(t.state="answer")}))})),y(e,e.house.position,"house"),y(e,e.player.position,"player"),e.monsters.forEach((function(t){y(e,t.position,"monster")}))},y=function(e,t,o){var n=e;n.columns[t.col].cells[t.row].state=o,n.key+=1},b={cellView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.75)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellView:{width:24,height:24,borderWidth:1,borderColor:"#66FF66",borderLeftColor:"#FF66FF",borderRightColor:"#FF66FF",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12},cellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#333300"},focusCellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"}},g=function(e){var t=e.gameBoard,o=e.focus;return a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:{flexDirection:"row"}},a.a.createElement(i.h,{style:{flexDirection:"column-reverse"}},a.a.createElement(i.h,{style:b.focusCellHeaderView},a.a.createElement(i.e,{style:b.focusCellHeaderText},"x")),t.columns[0].cells.map((function(e){return a.a.createElement(i.h,{key:e.row,style:o.row===e.row?b.focusCellHeaderView:b.cellHeaderView},a.a.createElement(i.e,{style:o.row===e.row?b.focusCellHeaderText:b.cellHeaderText},""+(e.row+1)))}))),t.columns.map((function(e){return a.a.createElement(i.h,{key:e.col,style:{flexDirection:"column-reverse"}},a.a.createElement(i.h,{style:o.col===e.col?b.focusCellHeaderView:b.cellHeaderView},a.a.createElement(i.e,{style:o.col===e.col?b.focusCellHeaderText:b.cellHeaderText},""+(e.col+1))),e.cells.map((function(t){return a.a.createElement(i.h,{key:t.row,style:o.row>=t.row&&o.col>=e.col?b.focusCellView:b.cellView},a.a.createElement(i.e,{style:b.cellText},function(e){return"answer"===e.state?""+e.value:"player"===e.state?"😀":"monster"===e.state?"💀":"house"===e.state?"🏠":""}(t)))})))}))))},h=function(e,t){var o,n,r,a,i=e.player,l=[null===(o=e.columns[i.position.col+0])||void 0===o?void 0:o.cells[i.position.row+1],null===(n=e.columns[i.position.col+0])||void 0===n?void 0:n.cells[i.position.row-1],null===(r=e.columns[i.position.col+1])||void 0===r?void 0:r.cells[i.position.row+0],null===(a=e.columns[i.position.col-1])||void 0===a?void 0:a.cells[i.position.row+0]].filter((function(e){return e})),s=i.position.col===i.position.row,u=l.map((function(e){return{key:e.row+" "+e.col,text:e.value+(s&&i.position.col===e.col?"↕":s&&i.position.row===e.row?"↔":""),onPress:function(){return t(e)}}}));return{key:""+e.key,buttons:Object(c.f)(u)}},v={outerContainer:{height:150},container:{flexDirection:"row",justifyContent:"space-around",margin:16},buttonView:{width:48,height:48,borderWidth:2,borderColor:"#6666FF",borderStyle:"solid",justifyContent:"center",alignItems:"center"},buttonText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:24,color:"#FFFFFF"}},O=function(e){var t=e.gameInput,o=Object(r.useState)(0),n=o[0],c=o[1];return Object(r.useEffect)((function(){c(100);var e=setInterval((function(){c((function(e){return Math.max(0,e-1)}))}),50);return function(){return clearInterval(e)}}),[t.key]),console.log("GameInput",{gameInput:t}),a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:v.outerContainer},a.a.createElement(i.h,{style:[v.container,{transform:"translate(0px,"+n+"px)"}]},t.buttons.map((function(e){return a.a.createElement(i.g,{key:e.key,onPress:e.onPress},a.a.createElement(i.h,{style:v.buttonView},a.a.createElement(i.e,{style:v.buttonText},e.text)))})))))},F={container:{flex:1,alignItems:"center",margin:16},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FFFF00"},mistakesText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FF6666"}},E=function(e){var t=e.gameScore,o=Object(r.useState)(""),n=(o[0],o[1]),c=Object(r.useState)(""),l=c[0],s=c[1];return Object(r.useEffect)((function(){var e=setInterval((function(){if(s(""+t.score),t.gameOverTime){var e=t.gameOverTime-t.startTime;n((function(t){return(e/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}else{var o=Date.now()-t.startTime;n((function(e){return(o/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}}),100);return function(){return clearInterval(e)}}),[t]),a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:F.container},a.a.createElement(i.h,null,a.a.createElement(i.e,{style:F.text},l))))}}}]);
//# sourceMappingURL=30-3565d50043ce0713aea1.js.map