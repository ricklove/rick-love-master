(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[26],{w73Y:function(e,t,o){"use strict";o.r(t),o.d(t,"art_nftAdventure_nftTextAdventure",(function(){return s}));var n=o("VtSi"),i=o.n(n),r=(o("3yYM"),o("QsI/")),a=o("la2L"),l={key:"nft-text-adventure",name:"NFT Text Adventure",description:"NFT Text Adventure is a game where actions are chosen by the NFT community",author:"Rick Love & the NFT Community"},d='\n.........()-,.......................\n.......(),...}:.....................\n.........."}:==::>..................\n.....()::}:-==:::::>................\n..........,==:::::::::}.............\n.....():"}..:::::::::::::::.........\n.............:::-...<::::::::::.....\n...........():..........::::::::::..\n..........................-::::::::.\n.........oooSS:.............-::::::.\n......:SSOOOoo::...........:::::::-.\n......oOoo:o::..:.........::::::::..\n.....:OOo:...:::::........::::::::..\n......oOS:::::::::........o::::::...\n......-oOo::::...::..:ooooooo:::....\n..........::::--::::oooooooooo:.....\n...........:::::::oooooooooooo:.....\n....-:oooo:ooooooooooooooooooo:.....\n'.trim().replace(/\./g," "),c={metadata:l,items:[{key:"torch",name:"Torch",description:"This torch will be your light when all other lights go out..."},{key:"torch_lit",name:"Lit Torch",description:"This torch it lit!"},{key:"rope",name:"Knife",description:"That's not a knife... This is a knife!"}],story:[{title:"Cold",asciiArt:d,description:"\n\nCold, damp, wet... you wake up shivering. \n\nWhen you open your eyes, everything is still dark.\n\nYou can't see anything, but you can feel that you are lying on a cold hard surface...",glitch:{ratio:.07,messages:["HELP ME!","Who are you?","What are you?","How are you?","Where are you?","Why are you?","I'm cold","I'm alone","I'm afraid"]},inventory:[],actions:[{name:"search the ground",description:"?"},{name:"call for help",description:"?"},{name:"listen",description:"?"}]}]},s={key:"nft-text-adventure",title:c.metadata.name,description:c.metadata.description,artist:c.metadata.author,canSetSeed:!1,getTokenDescription:function(e){var t,o,n,i=e.split(":").map((function(e){return parseInt(e,10)})),r=i[0],a=i[1],l=c.story[r],d=null==l?void 0:l.actions[a];return d?r+":"+a+" - "+(null!==(t=null==l?void 0:l.title)&&void 0!==t?t:"")+" > "+(null!==(o=null==d?void 0:d.name)&&void 0!==o?o:""):r+" - "+(null!==(n=null==l?void 0:l.title)&&void 0!==n?n:"")},renderArt:function(e,t,o,n){void 0===t&&(t="This is my hash!");Object(a.a)(t).random;var l=(window.innerWidth>300&&window.innerHeight,300),d=null,s=Date.now(),u=!1,h=!1,m=t.split(":").map((function(e){return parseInt(e,10)})),g=m[0],f=m[1];return n((function(e){e.setup=function(){console.log("renderArt:createP5:s.setup");var t=e.createCanvas(l,l),o=""+Math.random();t.id(o),d=document.getElementById(o)},e.draw=function(){var n;if(console.log("renderArt:createP5:s.draw"),null!=o&&o.isRecording()&&!u&&(s=o.timeProvider.now(),h=!1),u=null!==(n=null==o?void 0:o.isRecording())&&void 0!==n&&n,!h){var m=o?o.timeProvider.now()-s:Date.now()-s;(function(e){var t,o,n=e.step,i=e.actionIndex,r=(e.gameData,e.s),l=e.timeMs,d=e.frame,c=e.seed;if(!n)return{done:!0};var s=Object(a.a)(""+c+n+Math.floor(l/250)).random,u=Object(a.a)(""+c+n+Math.floor(l/50)).random,h=n.glitch&&s()>1-n.glitch.ratio,m=Math.floor(l/1e3*30);r.background(r.color(25-25*Math.cos(2*Math.PI*l/1e3/10),0,0)),r.fill(r.color(255,255,255)),r.textFont("monospace"),r.textAlign("left"),r.textSize(14);var g=n.actions.length,f=function(e){r.text(e,4,-8+d.height-40,-8+d.width,-4+d.height)},v=function(e,t,o,n,i){return void 0===i&&(i=1),r.fill(o),r.textSize(n),m*i<e.length?(t(e.substr(0,m*i)),{done:!1}):(t(e),m-=Math.floor(e.length/i),{done:!0})},p=function(e,t,o,n,i,a){var l=e/1e3*30;if(m<l){var d=t?o?m/30*1e3%1e3<500?t:o:t:"";return i&&r.fill(i),a&&r.textSize(a),d&&n&&n(d),{done:!1}}return m-=l,{done:!0}};if(n.glitch&&h&&(r.rotate(.25*u()),r.scale(1-.25*u(),1),r.background(r.color(0,150*u(),0)),s()>.25)){r.fill(r.color(255,255,255)),r.textAlign("center"),r.textSize(12);var w=n.glitch.messages;return r.text(w[Math.floor(u()*w.length)],4,104,-8+d.width,-8+d.height),{done:!1}}m+=n.title.trim().length,r.textAlign("center");var y=r.color(255,255,255);return v(n.title.trim(),(function(e){r.text(e,4,4,-8+d.width,44)}),y,14).done&&p(5e3,n.asciiArt,n.asciiArt,(function(e){r.text(e,4,47,-8+d.width,-4+d.height)}),y,10).done?(r.textAlign("left"),v(n.description.trim(),(function(e){r.text(e,4,47,-8+d.width,-24+d.height-20*(g+2))}),r.color(255,255,255),12).done&&p(1e3).done&&v(""+n.actions.map((function(e){return"    - "+e.name+"\n"})).join(""),(function(e){r.text(e,4,-16+d.height-20*(g+2),-8+d.width,-12+d.height-40)}),r.color(255,255,100),12).done&&p(3e3,">","> |",f,r.color(100,255,100),12).done&&v("> "+(null!==(t=null===(o=n.actions[null!=i?i:-1])||void 0===o?void 0:o.name)&&void 0!==t?t:""),f,r.color(100,255,100),14).done&&p(1e3).done?{done:!0}:{done:!1}):{done:!1}})({frame:{width:l,height:l},s:e,gameData:c,step:c.story[g],actionIndex:f,timeMs:m,seed:t}).done&&(h=!0),null!=o&&o.isWaitingForFrame()&&d&&(console.log("game.update waitingForFrame - addFrame",{}),Object(r.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getRecorder().addFrame(d);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})))())}}}),e)}}}}]);
//# sourceMappingURL=26-2b7f2f3839f91bd8778e.js.map