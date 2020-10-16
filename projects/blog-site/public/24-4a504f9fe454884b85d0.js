(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[24],{TVBK:function(e,t,r){"use strict";r.r(t),r.d(t,"EducationalGame_MultiplesCountingWords",(function(){return d}));var n=r("t8gp"),o=r("ERkP"),a=r.n(o),i=r("DTYs"),l=r("hsFx"),c=function(e){switch(Math.floor(e%10)){case 9:return"nine";case 8:return"eight";case 7:return"seven";case 6:return"six";case 5:return"five";case 4:return"four";case 3:return"three";case 2:return"two";case 1:return"one";case 0:return"zero";default:return""}},s=function(e){if(e>999)throw new Error("Only Numbers 0-999 Supported");var t=Math.floor(e%10),r=Math.floor(e%100/10),n=Math.floor(e%1e3/100),o=n>0?c(n)+"-hundred":"";if(1===r)return(o+" "+function(e){switch(Math.floor(e%10)){case 9:return"nineteen";case 8:return"eighteen";case 7:return"seventeen";case 6:return"sixteen";case 5:return"fifteen";case 4:return"fourteen";case 3:return"thirteen";case 2:return"twelve";case 1:return"eleven";case 0:return"ten";default:return""}}(10*r+t)).trim();var a=function(e){switch(Math.floor(e%10)){case 9:return"ninety";case 8:return"eighty";case 7:return"seventy";case 6:return"sixty";case 5:return"fifty";case 4:return"fourty";case 3:return"thirty";case 2:return"twenty";case 1:return"ten";default:return""}}(r),i=t>0?c(t):"";return(o+" "+a+(a&&i?"-":"")+i).trim()},u=r("rTbz"),m=r("7h3R"),f=Object(u.a)({storageKey:"MultiplesCountingWordsLeaderboard",sortKey:function(e){return e.timeMs},sortDescending:!0,scoreColumns:[{name:"Time",getValue:function(e){return""+(e.timeMs/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})}},{name:"Mistakes",getValue:function(e){return""+e.mistakes}}]}),d=function(e){var t,r=Object(o.useState)({key:0,startTime:Date.now(),gameWonTime:void 0,mistakes:0}),n=r[0],l=r[1],c=Object(o.useState)(g()),s=c[0],u=c[1],d=Object(o.useState)(null),b=d[0],w=d[1],v=Object(o.useRef)(s),E=f.useLeaderboard({getScore:function(){var e;return{mistakes:n.mistakes,timeMs:(null!==(e=n.gameWonTime)&&void 0!==e?e:Date.now())-n.startTime}}}),T=function(){l((function(e){return Object.assign({},e,{gameWonTime:Date.now(),key:e.key+1})}))},F=function(e){m.ProgressGameService.onCorrect();var t=Object.assign({},v.current),r=t.columns.find((function(t){return t.multiple===e.multiple}));r&&(r.maxTimesCorrect=e.times),u(t),setTimeout((function(){k(t)}),100)},x=function(e){w((function(e){return Object.assign({},e)})),l((function(e){return Object.assign({},e,{mistakes:e.mistakes+1,key:e.key+1})}))},k=function(e){var t=y(e,T,F,x);w(t)};return Object(o.useEffect)((function(){k(s)}),[]),v.current=s,a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},a.a.createElement(i.h,{style:{width:292}},a.a.createElement(p,{gameScore:n}),a.a.createElement(h,{gameBoard:s,focus:null!==(t=null==b?void 0:b.focus)&&void 0!==t?t:{multiple:0,times:0}}),b&&!n.gameWonTime&&a.a.createElement(C,{gameInput:b}),a.a.createElement(E.LeaderboardArea,{gameOver:!!n.gameWonTime,onScoreSaved:function(){var e=g();l({key:0,startTime:Date.now(),gameWonTime:void 0,mistakes:0}),u(e),k(e)}}))))},g=function(){return{size:12,rows:Object(n.a)(new Array(12)).map((function(e,t){return{times:t+1}})),columns:Object(n.a)(new Array(12)).map((function(e,t){return{multiple:t+1,maxTimesCorrect:0}}))}},b={cellView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.75)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellView:{width:24,height:24,borderWidth:1,borderColor:"#66FF66",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12},cellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#333300"},focusCellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"}},h=function(e){var t=e.gameBoard,r=e.focus,n=Object(o.useState)(0),l=n[0],c=n[1];Object(o.useEffect)((function(){c(0);var e=setInterval((function(){c((function(e){return e+1}))}),1e3);return function(){return clearInterval(e)}}),[]);var s=function(){return l%5==0?"row":l%5==1?"col":"both"};return a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:{flexDirection:"row"}},a.a.createElement(i.h,{style:{flexDirection:"column-reverse"}},a.a.createElement(i.h,{style:b.focusCellHeaderView},a.a.createElement(i.e,{style:b.focusCellHeaderText},"x")),t.rows.map((function(e){return a.a.createElement(i.h,{key:e.times,style:r.times===e.times?b.focusCellHeaderView:b.cellHeaderView},a.a.createElement(i.e,{style:r.times===e.times?b.focusCellHeaderText:b.cellHeaderText},""+e.times))}))),t.columns.map((function(e){return a.a.createElement(i.h,{key:e.multiple,style:{flexDirection:"column-reverse"}},a.a.createElement(i.h,{style:r.multiple===e.multiple?b.focusCellHeaderView:b.cellHeaderView},a.a.createElement(i.e,{style:r.multiple===e.multiple?b.focusCellHeaderText:b.cellHeaderText},""+e.multiple)),t.rows.map((function(t){return a.a.createElement(i.h,{key:t.times,style:r.times>=t.times&&r.multiple>=e.multiple?[b.focusCellView,(l=s(),"both"===l?{borderLeftColor:b.focusCellView.borderColor,borderRightColor:b.focusCellView.borderColor,borderTopColor:b.focusCellView.borderColor,borderBottomColor:b.focusCellView.borderColor}:{borderLeftColor:l.includes("col")?"#000000":"rgba(0,0,0,0.15)",borderRightColor:l.includes("col")?"#000000":"rgba(0,0,0,0.15)",borderTopColor:l.includes("row")?"#000000":"rgba(0,0,0,0.15)",borderBottomColor:l.includes("row")?"#000000":"rgba(0,0,0,0.15)"})]:b.cellView},e.maxTimesCorrect>=t.times?a.a.createElement(i.e,{style:b.cellText},(n=e.multiple,o=t.times,"both"===s()?""+n*o:"")):a.a.createElement(i.e,{style:b.cellText}));var n,o,l})))}))))},y=function(e,t,r,o){var a=e.columns.filter((function(t){return t.maxTimesCorrect<e.size}))[0];if(!a)return t(),{key:"",focus:{multiple:0,times:0},buttons:[]};var i=a.multiple,c=a.maxTimesCorrect+1,u=i*c,m=Object(l.a)(Object(n.a)(new Array(100)).map((function(){return Math.round(i+1-2*Math.random())*Math.round(c+1-2*Math.random())+Math.round(2-4*Math.random())})).filter((function(e){return e!==u})).filter((function(e){return e>0}))).slice(0,2),f=Object(l.f)([u].concat(Object(n.a)(m))),d=f.map((function(e){return{value:e,text:""+s(e),onPress:function(){return function(e){if(e!==u){var t=d.find((function(t){return t.value===e}));t&&(t.wasAnsweredWrong=!0,o({multiple:i,times:c}))}else r({multiple:i,times:c})}(e)},wasAnsweredWrong:!1}}));return{key:i+"*"+c,focus:{multiple:i,times:c},buttons:d}},w={outerContainer:{height:150},container:{flexDirection:"column",margin:16},buttonView:{height:32,margin:8,borderWidth:2,borderColor:"#6666FF",borderStyle:"solid",justifyContent:"center",alignItems:"center"},buttonText:{fontFamily:"Verdana, Geneva, sans-serif",fontSize:16,fontWeight:"lighter",color:"#FFFFFF"},buttonText_wrong:{fontFamily:"Verdana, Geneva, sans-serif",fontSize:16,fontWeight:"lighter",color:"#FF6666"}},C=function(e){var t=e.gameInput;return a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:w.outerContainer},a.a.createElement(i.h,{style:w.container},t.buttons.map((function(e){return a.a.createElement(i.g,{key:e.text+t.key,onPress:e.wasAnsweredWrong?function(){}:e.onPress},a.a.createElement(i.h,{style:w.buttonView},a.a.createElement(i.e,{style:e.wasAnsweredWrong?w.buttonText_wrong:w.buttonText},e.text)))})))))},v={container:{flex:1,alignItems:"center",margin:16},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FFFF00"},mistakesText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FF6666"}},p=function(e){var t=e.gameScore,r=Object(o.useState)(""),n=r[0],l=r[1],c=Object(o.useState)(""),s=c[0],u=c[1];return Object(o.useEffect)((function(){var e=setInterval((function(){var e;if(u(t.mistakes?(null!==(e=t.mistakes)&&void 0!==e?e:0)+" Mistakes":""),t.gameWonTime){var r=t.gameWonTime-t.startTime;l((function(e){return(r/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}else{var n=Date.now()-t.startTime;l((function(e){return(n/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})+" seconds"}))}}),100);return function(){return clearInterval(e)}}),[t]),a.a.createElement(a.a.Fragment,null,a.a.createElement(i.h,{style:v.container},a.a.createElement(i.h,null,a.a.createElement(i.e,{style:v.text},n)),a.a.createElement(i.h,null,a.a.createElement(i.e,{style:v.mistakesText},s))))}}}]);
//# sourceMappingURL=24-4a504f9fe454884b85d0.js.map