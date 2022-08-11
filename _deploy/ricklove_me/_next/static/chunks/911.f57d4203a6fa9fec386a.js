"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[911],{1569:function(e,t,r){r.d(t,{R:function(){return a}});var o=r(1738),n=r(6135);const a=e=>{const t={saveScore:(r,o)=>{const n=t.loadScore();n.push({name:r,score:o}),n.sort(((t,r)=>e.sortKey(t.score)<e.sortKey(r.score)?-1:1)),localStorage.setItem(e.storageKey,JSON.stringify(n))},loadScore:()=>{const t=localStorage.getItem(e.storageKey);if(!t)return[];const r=JSON.parse(t);return r.sort(((t,r)=>(e.sortKey(t.score)>e.sortKey(r.score)?-1:1)*(e.sortDescending?-1:1))),r}},r={container:{flex:1,alignItems:"center",margin:16},textInput:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:16,color:"#0000FF"},buttonView:{margin:4,padding:4,borderColor:"#FFFF00",borderStyle:"solid",borderWidth:1,borderRadius:4},buttonText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:16,color:"#FFFF00"}},a=e=>{const[t,a]=(0,o.useState)("");return o.createElement(n.G7,{style:r.container},o.createElement(n.oi,{style:r.textInput,value:t,onChange:a,placeholder:"Name",keyboardType:"default",autoCompleteType:"off"}),o.createElement(n.Au,{onPress:()=>!!t&&e.onSubmit(t),style:t?{}:{opacity:.5}},o.createElement(n.G7,{style:r.buttonView},o.createElement(n.xv,{style:r.buttonText},"Save Score"))))},s={container:{marginTop:16,borderColor:"#FFFFFF",borderStyle:"solid",borderWidth:1,borderRadius:0},scoreView:{flexDirection:"row",justifyContent:"space-around",padding:4,borderColor:"#FFFFFF",borderStyle:"solid",borderWidth:1,borderRadius:0},nameText:{flex:2,fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFFFF",overflow:"hidden"},scoreText:{flex:1,textAlign:"right",fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"}},l=t=>o.createElement(n.G7,{style:s.container},o.createElement(n.G7,{style:s.scoreView},o.createElement(n.xv,{style:s.nameText},"Leaderboard"),e.scoreColumns.map((e=>o.createElement(n.xv,{key:e.name,style:s.scoreText})))),o.createElement(n.G7,{style:s.scoreView},o.createElement(n.xv,{style:s.nameText},"Name"),e.scoreColumns.map((e=>o.createElement(n.xv,{key:e.name,style:s.scoreText},e.name)))),t.scores.map((t=>o.createElement(n.G7,{style:s.scoreView},o.createElement(n.xv,{style:s.nameText},t.name),e.scoreColumns.map((e=>o.createElement(n.xv,{key:t.name,style:s.scoreText},e.getValue(t.score))))))));return{useLeaderboard:({getScore:e})=>{const[r,n]=(0,o.useState)({scores:t.loadScore()});return{LeaderboardArea:s=>o.createElement(o.Fragment,null,!!s.gameOver&&o.createElement(a,{onSubmit:r=>{t.saveScore(r,e()),n({scores:t.loadScore()}),s.onScoreSaved()}}),o.createElement(l,{scores:r.scores}))}}}}},2405:function(e,t,r){r.r(t),r.d(t,{EducationalGame_MultiplesCountingWords:function(){return u}});var o=r(1738),n=r(6135),a=r(5950);const s=e=>{switch(Math.floor(e%10)){case 9:return"nine";case 8:return"eight";case 7:return"seven";case 6:return"six";case 5:return"five";case 4:return"four";case 3:return"three";case 2:return"two";case 1:return"one";case 0:return"zero";default:return""}},l=e=>{if(e>999)throw new Error("Only Numbers 0-999 Supported");const t=Math.floor(e%10),r=Math.floor(e%100/10),o=Math.floor(e%1e3/100),n=o>0?`${s(o)}-hundred`:"";if(1===r)return`${n} ${(e=>{switch(Math.floor(e%10)){case 9:return"nineteen";case 8:return"eighteen";case 7:return"seventeen";case 6:return"sixteen";case 5:return"fifteen";case 4:return"fourteen";case 3:return"thirteen";case 2:return"twelve";case 1:return"eleven";case 0:return"ten";default:return""}})(10*r+t)}`.trim();const a=(e=>{switch(Math.floor(e%10)){case 9:return"ninety";case 8:return"eighty";case 7:return"seventy";case 6:return"sixty";case 5:return"fifty";case 4:return"fourty";case 3:return"thirty";case 2:return"twenty";case 1:return"ten";default:return""}})(r),l=t>0?s(t):"";return`${n} ${a}${a&&l?"-":""}${l}`.trim()};var i=r(1569),c=r(6548);const m=(0,i.R)({storageKey:"MultiplesCountingWordsLeaderboard",sortKey:e=>e.timeMs,sortDescending:!0,scoreColumns:[{name:"Time",getValue:e=>`${(e.timeMs/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})}`},{name:"Mistakes",getValue:e=>`${e.mistakes}`}]}),u=e=>{var t;const[r,a]=(0,o.useState)({key:0,startTime:Date.now(),gameWonTime:void 0,mistakes:0}),[s,l]=(0,o.useState)(d()),[i,u]=(0,o.useState)(null),f=(0,o.useRef)(s),b=m.useLeaderboard({getScore:()=>{var e;return{mistakes:r.mistakes,timeMs:(null!==(e=r.gameWonTime)&&void 0!==e?e:Date.now())-r.startTime}}}),x=()=>{a((e=>Object.assign(Object.assign({},e),{gameWonTime:Date.now(),key:e.key+1})))},h=e=>{c.ProgressGameService.onCorrect();const t=Object.assign({},f.current),r=t.columns.find((t=>t.multiple===e.multiple));r&&(r.maxTimesCorrect=e.times),l(t),setTimeout((()=>{w(t)}),100)},p=e=>{u((e=>Object.assign({},e))),a((e=>Object.assign(Object.assign({},e),{mistakes:e.mistakes+1,key:e.key+1})))},w=e=>{const t=y(e,x,h,p);u(t)};return(0,o.useEffect)((()=>{w(s)}),[]),f.current=s,o.createElement(o.Fragment,null,o.createElement(n.G7,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},o.createElement(n.G7,{style:{width:292}},o.createElement(C,{gameScore:r}),o.createElement(g,{gameBoard:s,focus:null!==(t=null===i||void 0===i?void 0:i.focus)&&void 0!==t?t:{multiple:0,times:0}}),i&&!r.gameWonTime&&o.createElement(F,{gameInput:i}),o.createElement(b.LeaderboardArea,{gameOver:!!r.gameWonTime,onScoreSaved:()=>{const e=d();a({key:0,startTime:Date.now(),gameWonTime:void 0,mistakes:0}),l(e),w(e)}}))))},d=()=>({size:12,rows:[...new Array(12)].map(((e,t)=>({times:t+1}))),columns:[...new Array(12)].map(((e,t)=>({multiple:t+1,maxTimesCorrect:0})))}),f={cellView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.75)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellView:{width:24,height:24,borderWidth:1,borderColor:"#66FF66",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},focusCellHeaderView:{width:24,height:24,backgroundColor:"rgba(0,0,0,0.5)",borderWidth:1,borderColor:"#111133",borderStyle:"solid",justifyContent:"center",alignItems:"center"},cellText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12},cellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#333300"},focusCellHeaderText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:12,color:"#FFFF00"}},g=({gameBoard:e,focus:t})=>{const[r,a]=(0,o.useState)(0);(0,o.useEffect)((()=>{a(0);const e=setInterval((()=>{a((e=>e+1))}),1e3);return()=>clearInterval(e)}),[]);const s=()=>r%5===0?"row":r%5===1?"col":"both",l=()=>{const e=s();return"both"===e?{borderLeftColor:f.focusCellView.borderColor,borderRightColor:f.focusCellView.borderColor,borderTopColor:f.focusCellView.borderColor,borderBottomColor:f.focusCellView.borderColor}:{borderLeftColor:e.includes("col")?"#000000":"rgba(0,0,0,0.15)",borderRightColor:e.includes("col")?"#000000":"rgba(0,0,0,0.15)",borderTopColor:e.includes("row")?"#000000":"rgba(0,0,0,0.15)",borderBottomColor:e.includes("row")?"#000000":"rgba(0,0,0,0.15)"}};return o.createElement(o.Fragment,null,o.createElement(n.G7,{style:{flexDirection:"row"}},o.createElement(n.G7,{style:{flexDirection:"column-reverse"}},o.createElement(n.G7,{style:f.focusCellHeaderView},o.createElement(n.xv,{style:f.focusCellHeaderText},"x")),e.rows.map((e=>o.createElement(n.G7,{key:e.times,style:t.times===e.times?f.focusCellHeaderView:f.cellHeaderView},o.createElement(n.xv,{style:t.times===e.times?f.focusCellHeaderText:f.cellHeaderText},`${e.times}`))))),e.columns.map((r=>o.createElement(n.G7,{key:r.multiple,style:{flexDirection:"column-reverse"}},o.createElement(n.G7,{style:t.multiple===r.multiple?f.focusCellHeaderView:f.cellHeaderView},o.createElement(n.xv,{style:t.multiple===r.multiple?f.focusCellHeaderText:f.cellHeaderText},`${r.multiple}`)),e.rows.map((e=>{return o.createElement(n.G7,{key:e.times,style:t.times>=e.times&&t.multiple>=r.multiple?[f.focusCellView,l()]:f.cellView},r.maxTimesCorrect>=e.times?o.createElement(n.xv,{style:f.cellText},""+(a=r.multiple,i=e.times,"both"===s()?""+a*i:"")):o.createElement(n.xv,{style:f.cellText}));var a,i})))))))},y=(e,t,r,o)=>{const n=e.columns.filter((t=>t.maxTimesCorrect<e.size))[0];if(!n)return t(),{key:"",focus:{multiple:0,times:0},buttons:[]};const s=n.multiple,i=n.maxTimesCorrect+1,c=s*i,m=(0,a.EB)([...new Array(100)].map((()=>Math.round(s+1-2*Math.random())*Math.round(i+1-2*Math.random())+Math.round(2-4*Math.random()))).filter((e=>e!==c)).filter((e=>e>0))).slice(0,2),u=(0,a.TV)([c,...m]),d=u.map((e=>({value:e,text:`${l(e)}`,onPress:()=>(e=>{if(e===c)return void r({multiple:s,times:i});const t=d.find((t=>t.value===e));t&&(t.wasAnsweredWrong=!0,o({multiple:s,times:i}))})(e),wasAnsweredWrong:!1})));return{key:`${s}*${i}`,focus:{multiple:s,times:i},buttons:d}},b={outerContainer:{height:150},container:{flexDirection:"column",margin:16},buttonView:{height:32,margin:8,borderWidth:2,borderColor:"#6666FF",borderStyle:"solid",justifyContent:"center",alignItems:"center"},buttonText:{fontFamily:"Verdana, Geneva, sans-serif",fontSize:16,fontWeight:"lighter",color:"#FFFFFF"},buttonText_wrong:{fontFamily:"Verdana, Geneva, sans-serif",fontSize:16,fontWeight:"lighter",color:"#FF6666"}},F=({gameInput:e})=>o.createElement(o.Fragment,null,o.createElement(n.G7,{style:b.outerContainer},o.createElement(n.G7,{style:b.container},e.buttons.map((t=>o.createElement(n.Au,{key:t.text+e.key,onPress:t.wasAnsweredWrong?()=>{}:t.onPress},o.createElement(n.G7,{style:b.buttonView},o.createElement(n.xv,{style:t.wasAnsweredWrong?b.buttonText_wrong:b.buttonText},t.text)))))))),x={container:{flex:1,alignItems:"center",margin:16},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FFFF00"},mistakesText:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:14,color:"#FF6666"}},C=({gameScore:e})=>{const[t,r]=(0,o.useState)(""),[a,s]=(0,o.useState)("");return(0,o.useEffect)((()=>{const t=setInterval((()=>{var t;if(s(e.mistakes?`${null!==(t=e.mistakes)&&void 0!==t?t:0} Mistakes`:""),e.gameWonTime){const t=e.gameWonTime-e.startTime;return void r((e=>`${(t/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})} seconds`))}const o=Date.now()-e.startTime;r((e=>`${(o/1e3).toLocaleString(void 0,{minimumFractionDigits:1,maximumFractionDigits:1})} seconds`))}),100);return()=>clearInterval(t)}),[e]),o.createElement(o.Fragment,null,o.createElement(n.G7,{style:x.container},o.createElement(n.G7,null,o.createElement(n.xv,{style:x.text},t)),o.createElement(n.G7,null,o.createElement(n.xv,{style:x.mistakesText},a))))}}}]);