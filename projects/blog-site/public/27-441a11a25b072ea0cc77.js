(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[27],{PLwz:function(e,t,r){"use strict";r.r(t),r.d(t,"EducationalGame_StarBlast_Multiples",(function(){return p})),r.d(t,"EducationalGame_StarBlast",(function(){return f}));r("yIC7"),r("p+GS"),r("dtAy"),r("4oWw"),r("nruA"),r("LnO1"),r("XjK0"),r("SCO9"),r("KI7T"),r("PN9k");var n=r("ERkP"),i=r.n(n),o=r("DTYs"),a=r("hGZ4"),s=r("DZdA"),c=r("LRjP"),l=r("9u8u");function u(e){return function(e){if(Array.isArray(e))return m(e)}(e)||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(e)||function(e,t){if(!e)return;if("string"==typeof e)return m(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return m(e,t)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var p=function(e){return i.a.createElement(f,{problemService:Object(l.a)(Object(a.a)({min:1,max:12}),{})})},f=function(e){var t=Object(n.useState)({moveDirection:{x:0,y:0},buttons:[]}),r=t[0],a=t[1];return i.a.createElement(i.a.Fragment,null,i.a.createElement(o.h,{style:{position:"relative"}},i.a.createElement(o.h,{style:{marginTop:50,marginBottom:150,padding:2,alignItems:"center"}},i.a.createElement(o.h,{style:{alignItems:"center"}},i.a.createElement(x,{pressState:r,problemService:e.problemService}),i.a.createElement(o.d,{style:{position:"absolute",top:0,bottom:0,left:0,right:0,opacity:0},onPressIn:function(){},onPressOut:function(){}}),i.a.createElement(o.h,{style:{zIndex:10,flex:1,alignSelf:"stretch"}},i.a.createElement(s.a,{style:d.gamepad,onPressStateChange:function(e){a(e)},buttons:[{key:"A",text:"🔥"}]}))))))},d={gamepad:{backgroundColor:"#333333",borderColor:"#000033"},viewscreen:{borderColor:"#000033",backgroundColor:"#000000"}},v={viewscreenView:{height:300,width:300,backgroundColor:d.viewscreen.backgroundColor,borderColor:d.viewscreen.borderColor,borderWidth:1,borderStyle:"solid"},sprite:{viewSize:{width:32,height:32},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:32,textAlign:"center"}},question:{view:{flex:1,justifyContent:"center",padding:4},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:24}},gameOver:{view:{flex:1,justifyContent:"center",padding:4},text:{fontFamily:'"Lucida Console", Monaco, monospace',fontSize:24,textAlign:"center"}}},x=function(e){var t,r,a,s,c,l=Object(n.useRef)(e.pressState);l.current=e.pressState;var m=Object(n.useRef)({lives:3,gameStartTimeMs:Date.now()}),p=function(){return{gameTime:(Date.now()-m.current.gameStartTimeMs)/1e3}},f=Object(n.useRef)({x:.5*v.viewscreenView.width,y:.85*v.viewscreenView.height,rotation:0}),d=Object(n.useRef)({lastShotTime:0,shots:[],debris:[]}),x=Object(n.useRef)({enemies:[]}),S=Object(n.useRef)(null),T=Object(n.useState)(0),O=(T[0],T[1]);Object(n.useEffect)((function(){!function t(){var r=e.problemService.getNextProblem();if(console.log("gotoNextProblem",{p:r}),r.question){var n=v.viewscreenView.width/r.answers.length,i={problemTime:p().gameTime,question:r.question,answers:r.answers.map((function(e,t){return Object.assign(Object.assign({},e),{},{key:r.question+" "+e.value,pos:{x:n*(.5+t),y:.5*v.sprite.viewSize.height,rotation:0},isAnsweredWrong:!1})}))},o={enemies:i.answers.map((function(i,o){return{key:r.question+" "+i.value,answer:i,pos:{x:n*(.5+o),y:1.5*v.sprite.viewSize.height,rotation:0},vel:{x:0,y:5},onHit:function(){setTimeout((function(){console.log("onHit",{ans:i}),e.problemService.recordAnswer(r,i),i.isCorrect?(d.current.shots.forEach((function(e){e.ignore=!0})),t()):i.isAnsweredWrong=!0}))},destroyed:!1}}))};S.current=i,x.current=o,O((function(e){return e+1}))}}();var t=Date.now();requestAnimationFrame((function e(){var r,n=p().gameTime,i=Math.min(.1,(Date.now()-t)/1e3);t=Date.now();var o=function(){return{gameTime:n,gameDeltaTime:i,gameState:m.current,pressState:l.current,playerPosition:f.current,projectilesState:d.current,enemiesState:x.current,onLoseLife:function(){d.current.debris.push({key:"player"+n,kind:"player-character",pos:Object.assign({},f.current),vel:{x:0,y:0}}),f.current={x:.5*v.viewscreenView.width,y:.85*v.viewscreenView.height,rotation:0},m.current.lives<=1?m.current=Object.assign(Object.assign({},m.current),{},{lives:0,gameOverTime:p().gameTime}):m.current=Object.assign(Object.assign({},m.current),{},{lives:m.current.lives-1,deadTime:n})}}},a=g(o());if(m.current=a,m.current.gameOverTime)p().gameTime>1+m.current.gameOverTime&&(null===(r=l.current.buttons[0])||void 0===r?void 0:r.isDown)&&setTimeout((function(){m.current={gameStartTimeMs:m.current.gameStartTimeMs,lives:3}}),250);else{var s=h(o());f.current=s.playerPosition}var c=w(o());d.current=c;var u=y(o());x.current=u,requestAnimationFrame(e),O((function(e){return e+1}))}))}),[]);var E=p().gameTime-(null!==(t=null===(r=S.current)||void 0===r?void 0:r.problemTime)&&void 0!==t?t:0);return i.a.createElement(i.a.Fragment,null,i.a.createElement(o.h,{style:v.viewscreenView},u(new Array(m.current.lives)).map((function(e,t){return i.a.createElement(b,{key:"life"+t,kind:"life",position:{x:v.viewscreenView.width-v.sprite.viewSize.width*(1+t),y:-.8*v.sprite.viewSize.height,rotation:0}})})),d.current.debris.map((function(e){return i.a.createElement(b,{key:e.key,kind:e.hasHitGround?e.kind+"-splat":e.kind,position:e.pos})})),null===(a=x.current)||void 0===a?void 0:a.enemies.filter((function(e){return!e.destroyed})).map((function(e){return i.a.createElement(i.a.Fragment,{key:e.key},!e.answer.isAnsweredWrong&&i.a.createElement(b,{kind:"answer",position:{x:e.pos.x,y:e.pos.y-v.sprite.viewSize.height,rotation:0},text:e.answer.value}),e.answer.isAnsweredWrong&&i.a.createElement(b,{kind:"answer-wrong",position:{x:e.pos.x,y:e.pos.y-v.sprite.viewSize.height,rotation:0}}))})),null===(s=x.current)||void 0===s?void 0:s.enemies.filter((function(e){return!e.destroyed})).map((function(e){return i.a.createElement(i.a.Fragment,{key:e.key},i.a.createElement(b,{kind:e.explodeTime?"enemy-explode":"enemy",position:e.pos}))})),!m.current.gameOverTime&&!m.current.deadTime&&i.a.createElement(b,{kind:"player",position:f.current}),d.current.shots.map((function(e){return i.a.createElement(b,{key:e.key,kind:e.explodeTime?"shot-explode":"shot",position:e.pos})})),m.current.gameOverTime&&i.a.createElement(o.h,null,i.a.createElement(o.h,{style:{position:"absolute",top:.5*v.viewscreenView.height,width:v.viewscreenView.width}},i.a.createElement(o.e,{style:v.gameOver.text},"Game Over"),p().gameTime>1+m.current.gameOverTime&&i.a.createElement(o.e,{style:v.gameOver.text},"Continue?")))),i.a.createElement(o.h,{style:[v.question.view,{transform:"translate(0px,"+-Math.max(0,.5*v.viewscreenView.height-125*E)+"px)"}]},i.a.createElement(o.e,{style:v.question.text},null===(c=S.current)||void 0===c?void 0:c.question)))},g=function(e){var t=e.gameTime,r=(e.gameDeltaTime,e.pressState,e.playerPosition,e.gameState);return r.deadTime&&t>3+r.deadTime?Object.assign(Object.assign({},r),{},{deadTime:void 0}):r},h=function(e){e.gameTime;var t=e.gameDeltaTime,r=e.pressState,n=e.playerPosition;if(e.gameState.deadTime)return{playerPosition:n};var i=.05*r.moveDirection.x,o={x:n.x+r.moveDirection.x*t*250,y:n.y-r.moveDirection.y*t*250,rotation:.9*n.rotation+.1*i},a=v.viewscreenView.width,s=.5*v.sprite.viewSize.width,c=v.viewscreenView.height,l=.5*v.sprite.viewSize.height;return o.x=o.x<s?s:o.x>a-s?a-s:o.x,o.y=o.y<l?l:o.y>c-l?c-l:o.y,{playerPosition:o}},w=function(e){var t,r=e.gameTime,n=e.gameDeltaTime,i=e.pressState,o=e.playerPosition,a=e.projectilesState,s=e.gameState,c=e.onLoseLife,l=a.shots,u=a.debris,m=a.lastShotTime,p=!s.deadTime&&!s.gameOverTime&&r>.25+m&&(null===(t=i.buttons.find((function(e){return"A"===e.key})))||void 0===t?void 0:t.isDown);p&&l.push({key:""+m,pos:Object.assign({},o)}),l.forEach((function(e){e.explodeTime||(e.pos.y+=-250*n)})),u.forEach((function(e){if(!e.hasHitGround){e.vel.y+=100*n,e.pos.y+=e.vel.y*n,e.pos.x+=e.vel.x*n;var t=.5*v.sprite.viewSize.width,r=v.viewscreenView.width;e.pos.x<t&&(e.pos.x=t,e.vel.x=-e.vel.x),e.pos.x>r-t&&(e.pos.x=r-t,e.vel.x=-e.vel.x);var i=.8*v.sprite.viewSize.width,o=v.viewscreenView.height;e.pos.y>o-i+10*Math.random()&&(e.hasHitGround=!0,"kitten"===e.kind&&c())}}));var f=l.filter((function(e){return e.pos.y>0})).filter((function(e){return!e.explodeTime||r<1+e.explodeTime}));return Object.assign(Object.assign({},a),{},{lastShotTime:p?r:m,shots:f})},y=function(e){var t=e.gameTime,r=e.gameDeltaTime,n=e.projectilesState,i=e.enemiesState,o=e.gameState,a=e.playerPosition,s=e.onLoseLife,l=i.enemies,u=n.shots,m=.75*v.sprite.viewSize.width,p=m*m;l.forEach((function(e){return u.forEach((function(r){e.explodeTime||r.explodeTime||r.ignore||Object(c.a)(e.pos,r.pos)<p&&(console.log("Exploded!",{e:e,s:r}),e.explodeTime=t,r.explodeTime=t,e.onHit(),e.answer.isCorrect?n.debris.push({key:e.key+" "+t,kind:"alien",pos:Object.assign({},e.pos),vel:Object.assign({},e.vel)}):n.debris.push({key:e.key+" "+t,kind:"kitten",pos:Object.assign({},e.pos),vel:Object.assign({},e.vel)}))}))}));var f=m*m*1.5*1.5;l.forEach((function(e,t){return l.forEach((function(n,i){if(!(t>=i)&&!e.explodeTime&&!n.explodeTime&&Object(c.a)(e.pos,n.pos)<f){var o=e.vel.x;e.vel.x=.95*n.vel.x,n.vel.x=.95*o;var a=e.pos.x<n.pos.x?e:n,s=e.pos.x<n.pos.x?n:e;a.pos.x-=10*r,s.pos.x+=10*r,a.vel.x-=10*r,s.vel.x+=10*r}}))}));var d=m*m*.8*.8;l.forEach((function(e,r){e.explodeTime||o.deadTime||o.gameOverTime||Object(c.a)(e.pos,a)<d&&(s(),e.explodeTime=t,e.onHit())})),l.forEach((function(e){if(!e.explodeTime){e.vel.x+=250*(2*Math.random()-1)*r,e.vel.y+=1*r,e.pos.x+=e.vel.x*r,e.pos.y+=e.vel.y*r;var t=.5*v.sprite.viewSize.width,n=v.viewscreenView.width;e.pos.x<t&&(e.pos.x=t,e.vel.x=-e.vel.x),e.pos.x>n-t&&(e.pos.x=n-t,e.vel.x=-e.vel.x);var i=1.5*v.sprite.viewSize.width,o=v.viewscreenView.height;e.pos.y>o-i&&(e.pos.y=o-i)}}));var x=l;return x.filter((function(e){return e.explodeTime&&t>1+e.explodeTime})).forEach((function(e){e.destroyed=!0})),{enemies:x}},b=function(e){var t,r,n,a,s,c=e.kind,l=e.position,u=e.text,m=function(e){switch(e){case"player":return{text:"🚀",rotation:-.125,offsetX:-.25,offsetY:0};case"player-character":return{text:"😭"};case"player-character-splat":return{text:"😫",rotation:.15};case"shot":return{text:"🔥",rotation:.5};case"shot-explode":return{text:"✨",rotation:0,scale:.5};case"enemy":return{text:"🛸",offsetX:-.125,offsetY:-.125};case"enemy-explode":return{text:"💥",offsetX:-.125,offsetY:-.125};case"answer":return{text:"",offsetX:0,offsetY:-.125};case"answer-wrong":return{text:"❌",offsetX:-.125,offsetY:-.125};case"alien":return{text:"👽",offsetX:0,offsetY:0};case"kitten":return{text:"🙀",offsetX:0,offsetY:0};case"alien-splat":return{text:"💀",offsetX:0,offsetY:0};case"kitten-splat":return{text:"🥩",offsetX:0,offsetY:0};case"super-kitten":return{text:"🐱‍🏍",offsetX:0,offsetY:0};case"life":return{text:"🚀",scale:.5};default:return{text:"😀"}}}(c),p=v.sprite.viewSize,f=v.sprite.text.fontSize,d=Object.assign(Object.assign({position:"absolute"},p),{},{transform:"translate("+l.x+"px, "+l.y+"px) rotate("+(null!==(t=l.rotation)&&void 0!==t?t:0)+"turn)",pointerEvents:"none"}),x=Object.assign(Object.assign({},p),{},{transform:"translate( "+(-.5*p.width+Math.floor((null!==(r=m.offsetX)&&void 0!==r?r:0)*f))+"px, "+(-.5*p.height+Math.floor((null!==(n=m.offsetY)&&void 0!==n?n:0)*f))+"px) rotate("+(null!==(a=m.rotation)&&void 0!==a?a:0)+"turn) scale("+(null!==(s=m.scale)&&void 0!==s?s:1)+")"});return i.a.createElement(o.h,{style:d},i.a.createElement(o.h,{style:x},i.a.createElement(o.e,{style:v.sprite.text},null!=u?u:m.text)))}}}]);
//# sourceMappingURL=27-441a11a25b072ea0cc77.js.map