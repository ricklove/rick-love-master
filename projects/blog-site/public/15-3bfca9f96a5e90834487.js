(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[15],{hXWr:function(e,t,n){"use strict";n.r(t),n.d(t,"createConsoleCommands",(function(){return L}));var r,a,o,i,u,s=n("VtSi"),c=n.n(s),p=(n("3yYM"),n("QsI/")),l=n("zkcw"),h=n("ERkP"),d=n.n(h),m=n("fGyu"),f=n("eCSs"),b=n("4cHy"),g=n("+tC1"),k=n("hsFx"),v=function(e){var t,n,r=Object(h.useState)(10),a=r[0],o=r[1];Object(h.useEffect)((function(){var t=Date.now(),n=setInterval((function(){var r=(1e3*e.time-(Date.now()-t))/1e3;o((function(e){return r})),r<=0&&(o((function(e){return 0})),clearInterval(n),e.onTimeElapsed())}),10);return function(){return clearInterval(n)}}),[]);var i=new Date(1e3*a).toISOString().slice(14,23);return d.a.createElement(d.a.Fragment,null,d.a.createElement("div",null,d.a.createElement("div",{style:{display:"inline-block",backgroundColor:"#555555",borderRadius:4,padding:8}},d.a.createElement("div",{style:{display:"inline-block",backgroundColor:"#111111",padding:4}},d.a.createElement("span",{style:{color:null!==(t=e.color)&&void 0!==t?t:"#FF0000"}},a>0?i:null!==(n=e.messageAfterTime)&&void 0!==n?n:i)))))},y=function(){var e=Object(p.a)(c.a.mark((function e(t,n,r,a,o){var i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i="danger"===a?"#FF0000":"warning"===a?"#FFFF00":"#7777FF",e.next=3,new Promise((function(e){t(Object.assign({output:""},n,{Component:function(){return d.a.createElement(v,{time:r,color:i,onTimeElapsed:Object(p.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=e,t.t1=Object,t.t2={output:""},t.next=5,o();case 5:t.t3=t.sent,t.t4={addDivider:!0},t.t5=t.t1.assign.call(t.t1,t.t2,t.t3,t.t4),(0,t.t0)(t.t5);case 9:case"end":return t.stop()}}),t)})))})}}))}));case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})));return function(t,n,r,a,o){return e.apply(this,arguments)}}(),x={art:"\n|--------------------------------------|\n|                       @@@@@@@        |\n|                     @@@@@@@@@@@@     |\n|------,-|          @@@@@@@@@@@@@@@    |\n|    ,','|           |C>   @@ )@@@@@   |\n|--,','  |          /    @@ ,'@@@@@@   |\n|  ||##  |         (,    @@   @@@@@    |\n|  ||##  |          O'  @@@@@@@'''|    |\n|  ||##  |______     @@@@@@@     _|    |\n|  ||##  |     ,|     @@@@@|____/ |    |\n|  ||# ,'    ,' |         _/_____/ |   |\n|  ||,'    ,'   |        /          |  |\n|__|/    ,'  *  |       |         |  | |\n|______,'  *   ,',_    /           | | |\n|      | *   ,',' FFF--|      |    | | |\n|      |   ,','    ____|_____/    /  | |\n|      | ,','  __/ |             /   | |\n|______|','   FFF_/-------------/    ; |\n|       |===========,'  '=||=====||=/  |\n|--------------------------------------|\n",autoAnimate:{fps:5,replacements:[].concat(Object(m.a)(",.;:'\"[]{}()<>!@~&|".split("").map((function(e){return{find:"#",replace:e,ratio:.01}}))),[{find:"#",replace:" ",ratio:1},{find:"\\*",replace:".",ratio:.5},{find:"\\*",replace:" ",ratio:1},{find:"F",replace:"|",ratio:.3},{find:"F",replace:"/",ratio:1},{find:"C",replace:"-",ratio:.2},{find:"O",replace:">",ratio:.2},{find:"O",replace:"}",ratio:1}])}},w=(a=(r="\n|--------------------------------------|\n|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|\n|^^^^^^^.----------------.^^^^^^^^^^^^^|\n|^^^^^^^|  You have died |^^^^^^^^^^^^^|\n|^^^^^^^'----------------'^^^^^^^^^^^^^|\n|^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|\n|^^^^^^^^^^^^__----__^^^^^^^^^^^^^^^^^^|\n|^^^^^^^^_--''******''--_^^^^^^^^^^^^^^|\n|^^^^^^^|****************|^^^^^^^^^^^^^|\n|^^^^^^^|****************|^^^^^_---_^^^|\n|^^^^^^^|****  DORK  ****|^^^^'^^|{)'^^|\n|^^^^^^^|****************|^^^^^^^|/|^^^|\n|^^^^^^^|****************|^^^^^^^^^|^^^|\n|_______|****************|_________|___|\n|.......|****************|......../|...|\n|.......|****************|.............|\n|.......|****************|.............|\n|.......|----------------|.............|\n|......................................|\n|--------------------------------------|\n").trim().split("\n")[0].length+1,o=[],i=.01,u=!0,{art:r,animate:{fps:5,draw:function(){u?i*=1.05:i/=1.1,i<.01?u=!0:i>.5&&(u=!1),o.unshift.apply(o,Object(m.a)(Object(m.a)(new Array(a)).map((function(e){return Math.random()<i?"'":" "})))),o.length>10*r.length&&o.splice(r.length);for(var e=w.art.split(""),t=0;t<e.length;t++)"^"===e[t]&&(e[t]="'"===o[t]?"'":" "),"_"===e[t]&&(e[t]="'"===o[t]?"v":"_");return e.join("")}}});function O(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return _(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function _(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var j=function(e){var t=Object(h.useState)(e.artwork.art),n=t[0],r=t[1],a=e.artwork,o=a.animate,i=a.autoAnimate;return Object(h.useEffect)((function(){var t,n=null!=o?o:i?{fps:null!==(t=i.fps)&&void 0!==t?t:100,draw:function(t){for(var n,r=e.artwork.art,a=function(){var e=n.value;r=r.replace(new RegExp(e.find,"g"),(function(t){return Math.random()<e.ratio?e.replace:t}))},o=O(i.replacements);!(n=o()).done;)a();return r}}:null;if(n){var a=Date.now(),u=function(){r(n.draw(Date.now()-a))},s=setInterval(u,1e3/n.fps);return u(),function(){return clearInterval(s)}}}),[]),d.a.createElement("div",null,d.a.createElement("span",{style:{fontFamily:"monospace",whiteSpace:"pre"}},n))},A=(n("m4Nh"),function(e){return d.a.createElement("div",null,d.a.createElement("div",{className:"achievement",style:{display:"flex"}},d.a.createElement("div",{style:{flex:1}}),d.a.createElement("div",{className:"achievement-label",style:{fontFamily:"monospace",color:"#CCCC style={{flex:1}}CC",fontSize:"0.8rem"}},"New Achievement! "),d.a.createElement("div",{className:"achievement-name",style:{fontFamily:"monospace"}},e.name)))}),C=function(e){var t,n,r,a,o,i=e.triggerGameOver,u=e.inventory,s=e.removeFromInventory,l=e.createGameObject,h=e.createGameObjectTitle,f=e.isMatch,b=e.utils,g=e.components,k=b.randomItem,v=b.randomIndex,y=b.getValuesAsItems,x=b.moveItem,w=g.triggerTimedMessage,O=g.CountDownTimer,_={litterBox:l("Self Cleaning Litter Box","Cause 18 years is great even if you have to deal with a little crap sometimes. Keep it clean and happy!",{}),towelHooks:l("Set of Bathroom Towel Hooks","Stop dripping all over the floor!",{}),squishyToy:l("Pink Flamingo Squishy Toy","It's head is tearing off. Maybe if can be sewn.",{}),strandLights:l("Strand of Fairy Lights - 66ft","Make the room look cool. Girls only though!",{}),squirrel:l("Squirrel Stuffed Animal with Nuts","It looks like you should be careful not to touch it's nuts!",{execute:(r=Object(p.a)(c.a.mark((function t(n){var r,a,o;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n.command,a=n.target,o=n.onMessage,"touch"!==r||!a.includes("nuts")){t.next=6;break}return e.achievements.addAchievement("🐿️ Don't Be Touchin My Nutz!"),t.next=5,w(o,{output:k(["The squirrel goes nuts and begins to chew off your arm.","The squirel had more than just nuts with him.","Despite the warnings, you decide to touch the squirrel's nuts anyway.","Everyone told you to keep your hands to yourself."])},5,"danger",Object(p.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,i(o,"Don't be touchin my nutz!");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)}))));case 5:return t.abrupt("return",t.sent);case 6:return t.abrupt("return",null);case 7:case"end":return t.stop()}}),t)}))),function(e){return r.apply(this,arguments)})}),tickingPackage:l("Ticking Package","Ummmm... it's ticking",{execute:(n=Object(p.a)(c.a.mark((function t(n){var r,a;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n.command,a=n.onMessage,"open"!==r){t.next=6;break}return e.achievements.addAchievement("💣 Your Head Explode!"),t.next=5,i(a,k(["You have Exploded!","You're head acksplod!","You no longer hear ticking... probably because your head is gone."]));case 5:return t.abrupt("return",t.sent);case 6:return t.abrupt("return",null);case 7:case"end":return t.stop()}}),t)}))),function(e){return n.apply(this,arguments)})}),limeCoconut:l("Lime & Coconut","It seems like I have heard about this before.",{execute:(t=Object(p.a)(c.a.mark((function t(n){var r,a,o;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n.command,a=n.target,o=n.onMessage,"put"!==r||!a.includes("lime")||!a.includes("coco")){t.next=6;break}return e.achievements.addAchievement("🥥 Put the Lime in the Coconut!"),t.next=5,i(o,"\n                    You put the lime in the coconut, you drank 'em bot' up\n                    Put the lime in the coconut, you drank 'em bot' up\n                    Put the lime in the coconut, you drank 'em bot'up\n                    Put the lime in the coconut, you call your doctor, woke 'I'm up\n                    Said \"doctor, ain't there nothing' I can take?\"\n                    I said, \"doctor, to relieve this belly ache\"\n                    I said \"doctor, ain't there nothin' I can take?'\n                    I said, \"doctor, to relieve this belly ache\"");case 5:return t.abrupt("return",t.sent);case 6:return t.abrupt("return",null);case 7:case"end":return t.stop()}}),t)}))),function(e){return t.apply(this,arguments)})})},j={snake:l("Snake","It's a brown snake. Let's keep it! I have a small aquarium in my room.",{execute:(o=Object(p.a)(c.a.mark((function e(t){var n,r;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.command,r=t.target,"put"!==n||!r.includes("mailbox")){e.next=8;break}if(I.isOpen=!0,!I.package){e.next=5;break}return e.abrupt("return",{output:"The mailbox has something in it already."});case 5:return s(j.snake),I.package=j.snake,e.abrupt("return",{output:"You put the snake in the mailbox. He looks at you with his sad little snake eyes..."});case 8:return e.abrupt("return",null);case 9:case"end":return e.stop()}}),e)}))),function(e){return o.apply(this,arguments)})}),dog:l("Dog","It's a white dog. It was trying to bite you... not anymore...",{execute:(a=Object(p.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.command,t.target,e.abrupt("return",null);case 2:case"end":return e.stop()}}),e)}))),function(e){return a.apply(this,arguments)})})},A=Object.assign({},h("Grass Yard"),{description:function(){return A.contents.includes(j.snake)?"This is a large yard. A snake is sunning itself on a rock in the grass.":A.contents.includes(j.dog)?"You look at the large yard and can't help but notice a small white dog that looks like it wants to rip your face off.":"This is a large grass yard in front of a house. \n            Only the center of the yard is mowed and it looks like it might be in the shape of a heart."},contents:y(j)}),C=Object.assign({},h("Crashed Pickup Truck"),{description:function(){return"The crashed pickup truck is smoking. \n        The front end looks like it is hugging that tree. Clearly it is not familiar with social distancing.\n        As you get near, you wonder if the driver had his own personal accident when he wrecked.\n\n        In the bed of the truck are "+["some spent shotgun shells","a few full trash bags"].concat(Object(m.a)(C.contents.map((function(e){return e.titleWithA})))).join(", ")+", and... "+k(["a bunch of beer cans","some empty cigarette packages","an old tire"])+".\n        "},hasCrashed:!1,contents:y(_)}),I=Object.assign({},h("Mailbox"),{description:function(){return"There is "+(I.isOpen?"an open":"a small closed")+" mailbox nearby. \n            "+(I.isOpen&&I.package?"There is a "+I.package.title+" inside.":"")},isOpen:!1,isDelivering:!1,deliveryCount:0,package:null}),T=function(){var e=v(C.contents.length);I.deliveryCount>=1&&C.contents.find((function(e){return e===_.tickingPackage}))&&(e=C.contents.indexOf(_.tickingPackage)),I.deliveryCount++;var t=C.contents[e];C.contents.splice(e,1),I.package=t,I.isOpen=!1};T();var S=_.tickingPackage,Y=j.snake,D=j.dog,E=function(){var t=Object(p.a)(c.a.mark((function t(n){var r;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(I.isDelivering=!1,I.package!==Y){t.next=6;break}return e.achievements.addAchievement("😡 He's Got Angry Eyes"),t.next=5,i(n.onMessage,"\n                You see "+k(["a UPS truck","an Amazon truck","an ambulance","a cop car","the van from down by the river","the ice cream truck"])+" drive up.\n                The driver waves at you while carrying a package to the mailbox.\n\n                As he opens the mailbox, your little pal jumps out and bites him in the face.\n                At first you think this is funny, but then the driver rips the snake off and throws him into the trees.\n\n                The driver looks up and sees you laughing.\n                You see a look of rage in his eyes as he gets back in, revs the engine, and speeds towards you...\n                ");case 5:return t.abrupt("return",t.sent);case 6:if(!I.package){t.next=20;break}if(r=I.package,C.contents.push(r),I.isOpen=!0,r!==S){t.next=17;break}return I.package=null,e.destroyedObjects.push(S),C.hasCrashed=!0,C.contents.splice(C.contents.indexOf(S),1),e.achievements.addAchievement("🏴‍☠️ Take That, Porch Pirates!!"),t.abrupt("return",{output:"\n                    You see a package-thief drive up in an old beat up pickup truck.\n                    He drives right up to the mailbox, grabs the package, and starts off.\n\n                    Immediately, you hear a loud pop and see colored smoke fill the cab.\n                    \n                    The truck swerves wildly and crashes into a large oak tree.\n\n                    After a minute, the driver jumps out, covered in glitter. \n                    \n                    He runs into the trees screaming about a horrible smell...\n                    "});case 17:return T(),e.achievements.addAchievement("📮 Return to Sender"),t.abrupt("return",{output:"\n                You see "+k(["a UPS truck","an Amazon truck","the ice cream truck"])+" drive up and a driver wearing a trench coat get out.\n                \n                He carries a package to the mail box, but when he opens it, he looks suprised.\n\n                He looks around suspiciously... and then puts the "+r.title+" under his trenchcoat as he slips the new package into the mailbox.\n\n                He nervously looks around again, then rushes back to the truck and quickly drives off."});case 20:return T(),e.achievements.addAchievement("🚚 Same Day Delivery!"),t.abrupt("return",{output:"\n            You see "+k(["a UPS truck","an Amazon truck","an ambulance","a cop car","the van from down by the river","the ice cream truck"])+" drive up, and the driver puts a package in the mailbox.\n            He is wearing a "+k(["football helmet","Santa hat","bow tie","hazmat suit","clown uniform","bearskin rug"])+'.\n            As he drives away, he shouts, "'+k(["Watch out for the monkeys!","Merry Christmas!","Ducks... ducks... ducks everywhere...","That squirrel is nuts!"])+'"'});case 23:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),F=function(){var t=Object(p.a)(c.a.mark((function t(n){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(I.package!==Y){t.next=7;break}if(!I.isDelivering){t.next=3;break}return t.abrupt("return",{output:"You close the mailbox with your little friend inside..."});case 3:return I.isDelivering=!0,t.next=6,w(n.onMessage,{output:"\n                You close the mailbox with your little friend inside...\n                Deep down, you feel like you are making bad life choices...\n                We'll give you some time to think about it..."},20,"warning",(function(){return E(n)}));case 6:return t.abrupt("return",t.sent);case 7:if(!(C.contents.length<=0||I.package)){t.next=9;break}return t.abrupt("return",{output:"You close the mailbox. "+(I.package?"There is still something inside it though.":"Thanks!")});case 9:if(!I.isDelivering){t.next=11;break}return t.abrupt("return",{output:"You close the mailbox."});case 11:return I.isDelivering=!0,e.achievements.addAchievement("📪 These Kids Keep Stealing My Mail!"),t.abrupt("return",w(n.onMessage,{output:"You close the mailbox."},10,"normal",(function(){return E(n)})));case 14:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return{introduction:"# The Mailbox\n        You are standing in a large grass yard near a small mailbox.\n        ",execute:function(){var t=Object(p.a)(c.a.mark((function t(n){var r,a,o,l,h,m,b,g,k;return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n.command,a=n.target,o=n.onMessage,"open"!==r||"mailbox"!==a){t.next=7;break}if(!I.isOpen){t.next=4;break}return t.abrupt("return",{output:"Really? The mailbox is already open!"});case 4:return I.isOpen=!0,e.achievements.addAchievement("📭 You've Got Mail!"),t.abrupt("return",{output:I.package?"You see a "+I.package.title+" in the mailbox.":"There is nothing in the mailbox."});case 7:if("close"!==r||"mailbox"!==a){t.next=14;break}if(I.isOpen){t.next=10;break}return t.abrupt("return",{output:"It's already closed."});case 10:return I.isOpen=!1,t.next=13,F(n);case 13:return t.abrupt("return",t.sent);case 14:if("take"!==r||!I.package||!f(I.package,a)){t.next=24;break}if(l=I.package,u.push(l),I.package=null,h=I.isOpen,I.isOpen=!0,l!==S){t.next=23;break}return e.achievements.addAchievement("📦 Umm... It's ticking"),t.abrupt("return",{Component:function(){return u.includes(S)&&d.a.createElement(O,{time:180,color:"#FF0000",onTimeElapsed:Object(p.a)(c.a.mark((function t(){return c.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(u.includes(S)){t.next=2;break}return t.abrupt("return");case 2:return e.achievements.addAchievement("⏰ Is it Bad that It's Ticking?"),t.t0=o,t.next=6,i(o,"You obviously need to watch more TV. A ticking package is generally bad news.");case 6:t.t1=t.sent,(0,t.t0)(t.t1);case 8:case"end":return t.stop()}}),t)})))})||d.a.createElement("span",null)},output:(h?"You":"You open the mailbox and")+" take the "+l.title+". As you place it carefully in your backpack, you notice the ticking is getting louder."});case 23:return t.abrupt("return",{output:(h?"You":"You open the mailbox and")+" take the "+l.title+" and put it in your backpack."});case 24:if("take"!==r||!A.contents.includes(Y)||!f(Y,a)){t.next=29;break}return x(m=Y,A.contents,u),e.achievements.addAchievement("🐍 You Would do Well in Slitherin"),t.abrupt("return",{output:"You take the "+m.title+" and put it in your backpack. \n                \n                Just then a little white dog starts chasing you and tries to bite you. You run back to the mailbox and the dog goes back to it's own yard, but it keeps barking."});case 29:if(!("throw"===r&&u.includes(Y)&&A.contents.includes(D)&&f(D,a)&&f(Y,a))){t.next=34;break}return x(D,A.contents,u),e.achievements.addAchievement("🦴 Throw the dog a bone... or snake."),t.abrupt("return",{output:"You throw the snake at the dog and it latches onto his face.\n                \n                The dog shakes violently until the snake goes flying into the trees. \n                \n                Then the dog runs around the yard three times, yipping the whole way. On the third lap, the dog seems to remember you and starts running directly at you.\n\n                Right before the dog reaches you, it leaps at your face barring its jagged teeth.\n\n                As you look into his vicious eyes, they suddenly go blank. The dog hits you limply and falls to the ground. \n                \n                It's not moving anymore now. You decide to put it in your backpack before the neighbors see you standing above their dead dog."});case 34:if("take"!==r||!C.hasCrashed){t.next=40;break}if(!(b=C.contents.find((function(e){return f(e,a)})))){t.next=40;break}return x(b,C.contents,u),e.achievements.addAchievement("♻️ Another Man's Trash"),t.abrupt("return",{output:"You take the "+b.title+" from the back of the truck."});case 40:if("put"!==r){t.next=54;break}if(!a.includes("mailbox")){t.next=54;break}if(I.isOpen=!0,!I.package){t.next=45;break}return t.abrupt("return",{output:"There is already something in the mailbox."});case 45:if(!(g=u.find((function(e){return f(e,a)})))){t.next=54;break}return s(g),I.package=g,k=I.isOpen,I.isOpen=!1,t.next=53,w(n.onMessage,{output:(k?"You":"You open the mailbox and")+" put the "+g.title+" in the mailbox "+(k?"and close it.":"and close it again.")},10,"normal",(function(){return E(n)}));case 53:return t.abrupt("return",t.sent);case 54:return t.abrupt("return",null);case 55:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),getLookItems:function(){return[I,A,C.hasCrashed?C:null]}}};function I(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return T(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return T(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function T(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var S,Y="*** DORK! *** v1.4.2 - Copyright "+(new Date).getFullYear()+" Rick Love",D=function(e){var t=function(e){var t=[],n=function(){return t},r=function(n){t.includes(n)||(setTimeout((function(){e({output:"",Component:function(){return d.a.createElement(A,{name:n})}})}),1e3),t.push(n))},a=!1,o=function(){var e=Object(p.a)(c.a.mark((function e(t,n){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({output:n}),a=!0,r("⚰️ You Dead!"),e.next=5,Object(f.a)(3e3);case 5:return e.abrupt("return",{isGameOver:!0,output:"",Component:function(){return d.a.createElement(j,{artwork:w})}});case 6:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),i=[],u=[],s=[],l="the a an at in of by".split(" ").filter((function(e){return e})),h=Object(m.a)(l),x=function(e){var t=e.toLowerCase()[0];return"a"===t||"e"===t||"i"===t||"o"===t||"u"===t?"an "+e:"a "+e},O=function(e){var t={title:e,titleWithA:x(e),matches:e.toLowerCase().split(" "),lower:e.toLowerCase()};return u.push(t),h.push.apply(h,Object(m.a)(t.matches.filter((function(e){return s.includes(e)})))),s.push.apply(s,Object(m.a)(t.matches)),t},_=Object.assign({},O("Achievements"),{matches:["achieve","ach","achievements"],description:function(){return n().join("\n")},lower:""});i.push(_);var C={randomItem:b.b,randomIndex:b.a,getValuesAsItems:g.a,moveItem:k.d};return{achievements:{loadAchievements:function(e){t.splice.apply(t,[0,t.length].concat(Object(m.a)(e)))},getAchievements:n,addAchievement:r},isGameOver:function(){return a},triggerGameOver:o,triggerQuit:function(){return a=!0,r("🔥 You're Fired!"),{output:"****  You can't quit you're fired!  ****",isGameOver:!0}},inventory:i,destroyedObjects:[],allGameObjects:u,allWords:s,commonWords:l,ignoreWords:h,removeFromInventory:function(e){var t=i.indexOf(e);return!(t<0)&&(i.splice(t,1),!0)},createGameObject:function(e,t,n){var r=Object.assign({title:e,titleWithA:x(e),description:t,matches:e.toLowerCase().split(" "),lower:e.toLowerCase()},n);return u.push(r),h.push.apply(h,Object(m.a)(r.matches.filter((function(e){return s.includes(e)})))),s.push.apply(s,Object(m.a)(r.matches)),r},createGameObjectTitle:O,isMatch:function(e,t){return!!t&&!!t.split(" ").map((function(e){return e.trim()})).filter((function(e){return e})).filter((function(e){return!h.includes(e)})).find((function(t){return null==e?void 0:e.matches.includes(t)}))},utils:C,components:{triggerTimedMessage:y,CountDownTimer:v}}}(e),n=t.isGameOver,r=t.inventory,a=t.isMatch,o=["What are you talking about?","That doesn't make any sense.","I've seen butter knives sharper than you!","You are playing the correct game!","What exactly do you think that would accomplish?","This is a family game!"],i=[C(t)],u=null,s=function(){var e=Object(p.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u=t,e.abrupt("return",{output:u.introduction});case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=Object(p.a)(c.a.mark((function e(i){var s,p,l,h,d,m,f,g,k,v,y,x,w,O;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s=i.command,p=i.target,l=i.onMessage,h=function(e){n()||l(e)},d="take"===(d="look"===(d=s)||"see"===d||"view"===d||"observer"===d?"look":d)||"get"===d||"obtain"===d?"take":d,m=Object.assign({},i,{command:d,onMessage:h}),!t.isGameOver()){e.next=8;break}return e.abrupt("return",{output:"",isGameOver:!0});case 8:if(u){e.next=10;break}throw new Error("Scene not loaded - Start Game First");case 10:if(t.achievements.addAchievement("⌨ I Can Type!"),"look"!==d){e.next=21;break}if(t.achievements.addAchievement("👀 Looking Good!"),!(f=r.find((function(e){return a(e,p)})))){e.next=16;break}return e.abrupt("return",{output:"function"==typeof f.description?f.description():f.description});case 16:if(g=u.getLookItems(),!(k=g.find((function(e){return e&&a(e,p)})))){e.next=20;break}return e.abrupt("return",{output:"function"==typeof k.description?k.description():k.description});case 20:return e.abrupt("return",{output:"You see "+g.filter((function(e){return e})).map((function(e){return null==e?void 0:e.titleWithA})).join(", ")+", and "+Object(b.b)(["a dork... oh that's you.","... your reflection off of the screen.","a heard of zombies... Wait nevermind.","... so many ducks.","... a tech support scammer."])});case 21:v=I(r);case 22:if((y=v()).done){e.next=35;break}if((x=y.value).execute){e.next=26;break}return e.abrupt("continue",33);case 26:if(a(x,p)){e.next=28;break}return e.abrupt("continue",33);case 28:return e.next=30,x.execute(m);case 30:if(!(w=e.sent)){e.next=33;break}return e.abrupt("return",w);case 33:e.next=22;break;case 35:return e.next=37,u.execute(m);case 37:if(!(O=e.sent)){e.next=40;break}return e.abrupt("return",O);case 40:if("inv"!==d&&"inventory"!==d&&"bag"!==d&&"backpack"!==d&&"pack"!==d){e.next=43;break}return t.achievements.addAchievement("🎒 Checkin on My Stuff"),e.abrupt("return",{output:r.map((function(e){return e.title})).join("\n")});case 43:if("help"!==d){e.next=46;break}return t.achievements.addAchievement("🦮 Hold My Hand Please"),e.abrupt("return",{output:"\n                    Example Commands: \n                    help\n                    inventory\n                    look at mirror\n                    take frog\n                    open box\n                    close trunk\n                    put cat in submarine\n                    go to house\n                    throw snake at lady\n                    send gif to grandma\n                    post status on dorkbook\n                    wear mask\n                    "});case 46:if("map"!==d){e.next=49;break}return t.achievements.addAchievement("🗺️ I'm a map!"),e.abrupt("return",{output:"\n|--------------------------------------|\n|      ,_  . ._ _                      |\n|    , -|,'|~~       ;-'  _-'   ;_  ~  |\n|/-|'~'-'|~~|',  ,  /  /~|_|_~/   -~~-_|\n|~'~     '-,|'| ' ,|/'~         /  _ / |\n|~  |      ''|~|  _|    ,_ ,       /   |\n|   '|      /~    |_~||,,~ |      ,    |\n|     |  _-|        _ ~|| |_     /     |\n|.     | , ~_    '/      |_' | /|~     |\n|      ~_'       |       -,  |'/       |\n|       '|_,'|    | ,    /'     ~ ,.   |\n|         /  |_    ~|   /       , ~| ' |\n|        |    ,      | |'|/     |   |  |\n|        ,   ,/      | /         --/   |\n|         | ,'        '                |\n|         /,'                          |\n|         '| ~                         |\n|          ~'                          |\n|                                      |\n|--------------------------------------|\n"});case 49:if("die"!==d){e.next=52;break}return t.achievements.addAchievement("💀 You Asked for It!"),e.abrupt("return",t.triggerGameOver(h,"You asked for it!"));case 52:if("dork"!==d){e.next=55;break}return t.achievements.addAchievement("🤓 Actually... I'm a Nerd"),e.abrupt("return",{output:Object(b.b)(["Yes, you must be!","I prefer the term nerd."])});case 55:if("jump"!==d){e.next=58;break}return t.achievements.addAchievement("🦘 Jump! Jump!"),e.abrupt("return",{output:Object(b.b)(["How high?","Good job!","Maybe if you type harder!"])});case 58:return e.abrupt("return",{output:Object(b.b)(o)});case 59:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return{title:Y,start:function(){var e=Object(p.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t({output:"Reading Floppy Disk..."}),e.next=3,Object(f.a)(1e3);case 3:return t({output:Y}),t({output:"",Component:function(){return d.a.createElement(j,{artwork:x})}}),e.next=7,Object(f.a)(3e3);case 7:return t({output:"",addDivider:!0}),t({output:"Type simple commands\n                Examples:"}),e.next=11,Object(f.a)(1e3);case 11:return t({output:"\n                - inventory\n                - look at mirror\n                - take frog\n                - open box\n                - close trunk\n                - put cat in submarine\n                - help\n                - look at achievements \n                "}),e.next=14,Object(f.a)(3e3);case 14:return t({output:"",addDivider:!0}),e.t0=t,e.next=18,s(i[0]);case 18:e.t1=e.sent,(0,e.t0)(e.t1);case 20:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),execute:l,onQuit:function(){return t.triggerQuit()},onQuitNot:function(){return t.achievements.addAchievement("🧻 Never gonna give you up!"),{output:"That was close"}},achievements:{setValue:function(e){t.achievements.loadAchievements(e)},getValue:function(){return t.achievements.getAchievements()}}}},E=function(){var e=localStorage.getItem("DorkGameStorage");if(!e)return null;try{return JSON.parse(e)}catch(t){return null}},F=function(e){localStorage.setItem("DorkGameStorage",JSON.stringify(e))},M={session:"user",path:"/",name:"dork",content:""+Object(l.b)(256)+Y+Object(l.b)(512),execute:(S=Object(p.a)(c.a.mark((function e(t){var n,r,a,o;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=D(n=function(e){t({output:null==e?void 0:e.output,Component:null==e?void 0:e.Component,addDivider:null==e?void 0:e.addDivider})}),a={prompt:">",respond:function(){var e=Object(p.a)(c.a.mark((function e(t){var o,i;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("quit"!==t.command){e.next=2;break}return e.abrupt("return",{query:{prompt:"Are you sure you want to quit?",respond:function(){var e=Object(p.a)(c.a.mark((function e(t){var n;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.command.startsWith("y")){e.next=4;break}return n=r.onQuit(),F({achievements:r.achievements.getValue()}),e.abrupt("return",n);case 4:return e.abrupt("return",Object.assign({},r.onQuitNot(),{query:a}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()}});case 2:return o=Object.assign({},t,{onMessage:n}),e.next=5,r.execute(o);case 5:return i=e.sent,F({achievements:r.achievements.getValue()}),e.abrupt("return",Object.assign({},i,{query:null!=i&&i.isGameOver?void 0:a}));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},(o=E())&&r.achievements.setValue(o.achievements),e.next=7,r.start(n);case 7:return e.abrupt("return",{output:"",query:a});case 8:case"end":return e.stop()}}),e)}))),function(e){return S.apply(this,arguments)})},q={session:"user",path:"/",name:"zork",content:Object(l.b)(256)+"West of House\nYou are standing in an open field west of a white house, with a boarded front door.\nThere is a small mailbox here."+Object(l.b)(512),execute:function(){var e=Object(p.a)(c.a.mark((function e(){var t;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t={prompt:">",respond:function(){var e=Object(p.a)(c.a.mark((function e(n){var r,a;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=n.command,a=n.target,"zork"!==r){e.next=3;break}return e.abrupt("return",{output:"At your service",query:t});case 3:if("jump"!==r){e.next=5;break}return e.abrupt("return",{output:Math.random()<.5?"Are you enjoying yourself?":"Very good! Now you can go to the second grade.",query:t});case 5:if("scream"!==r){e.next=7;break}return e.abrupt("return",{output:"Aaaarrrrgggghhhh!",query:t});case 7:if("look"!==r){e.next=10;break}if("house"!==a){e.next=10;break}return e.abrupt("return",{output:"You are standing in an open field west of a white house, with a boarded front door.",query:t});case 10:if("open"!==r){e.next=13;break}if("mailbox"!==a){e.next=13;break}return e.abrupt("return",{output:"Opening the small mailbox reveals a leaflet",query:t});case 13:return e.abrupt("return",{output:Object(l.b)(512)+"\n                    ****  You have died  ****\n                    ...bzzz...\n                    The magnetic tape drive is smoking...\n                    Maybe I should play >>> DORK <<<\n                "});case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},e.abrupt("return",{output:"West of House\n        You are standing in an open field west of a white house, with a boarded front door.\n        There is a small mailbox here.",query:t});case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},L=function(e){var t={user:{machineName:""+e},admin:{machineName:"admin@vm"}},n={parent:void 0,session:"user",directory:"/",activeAction:void 0},r=[{session:"user",path:"/",name:"Readme.md",content:"\n                Yes, this is cool!\n                Look, I created my own blog!\n                ## Hidden Stuff\n                I'm going to store some things here so I don't forget."},{session:"user",path:"/",name:"passwords.txt",content:"\n                123456\n                test1\n                chucknorris\n                password\n                buddy\n                hunter2\n                Z10N0101\n                qwerty\n                tiger\n                1234567890\n                CPE1704TKS\n                admin\n                friend\n                iaccepttherisk\n                test1234\n                ncc1701\n                00000000\n                pennygetyourownwifi\n                p@55w0rd\n                xyzzy\n                correcthousebatterystaple"},{session:"user",path:"/",name:"admin.sh",content:"ssh admin@192.168.0.1",execute:function(){var e=Object(p.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{output:"Please Enter Password",query:{prompt:"doors@durin>",respond:function(){var e=Object(p.a)(c.a.mark((function e(r){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("friend"!==r.command){e.next=4;break}return a="admin",void 0===(o=void 0)&&(o=!0),n={parent:Object.assign({},n,{activeAction:o?null:n.activeAction}),session:a,directory:"/",activeAction:null},e.abrupt("return",{output:"Logging into "+t.admin.machineName});case 4:return e.abrupt("return",{output:"Incorrect Password"});case 5:case"end":return e.stop()}var a,o}),e)})));return function(t){return e.apply(this,arguments)}}()}});case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{session:"admin",path:"/",name:"bitcoin_wallet_backup.dat",content:"E9873D79C6D87DC0FB6A57786389F4453213303DA61F20BD67FC233AA33262"},{session:"admin",path:"/",name:"keepass.kdb",content:""+Object(l.b)(1024)},q,M],a=function(){return{prompt:""+t[n.session].machineName+n.directory.replace(/\/$/g,"")+">"}},o=function(){var e=Object(p.a)(c.a.mark((function e(t){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=3;break}return n=Object.assign({},n,{activeAction:null}),e.abrupt("return",a());case 3:if(!t.query){e.next=6;break}return n=Object.assign({},n,{activeAction:t}),e.abrupt("return",Object.assign({},t,{prompt:t.query.prompt}));case 6:return n=Object.assign({},n,{activeAction:null}),e.abrupt("return",Object.assign({},a(),t));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return{onCommand:function(){var e=Object(p.a)(c.a.mark((function e(t,i){var u,s,p,l,h,d,m,f,b,g,k;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(u=t.toLowerCase().trim(),s=u.indexOf(" "),p=s>=0?u.slice(0,s).trim():u.trim(),l=s>=0?u.slice(s).trim():"",h={raw:t,lower:u,command:p,target:l,onMessage:i},!n.activeAction){e.next=14;break}if(!(d=n.activeAction).query){e.next=14;break}return e.next=10,d.query.respond(h);case 10:return m=e.sent,e.next=13,o(m);case 13:return e.abrupt("return",e.sent);case 14:if("exit"!==p){e.next=18;break}if(!n.parent||!(n=n.parent)){e.next=17;break}return e.abrupt("return",a());case 17:return e.abrupt("return",{quit:!0});case 18:if(f=r.filter((function(e){return e.session===n.session&&e.path===n.directory})),"dir"!==p&&"ls"!==p){e.next=21;break}return e.abrupt("return",Object.assign({},a(),{output:f.map((function(e){return e.name})).join("\n")}));case 21:if(!(p.startsWith("open")||p.startsWith("read")||p.startsWith("cat")||p.startsWith("echo"))){e.next=26;break}if(!(b=l&&f.find((function(e){return e.name.toLowerCase().startsWith(l)})))){e.next=25;break}return e.abrupt("return",Object.assign({},a(),{output:b.content}));case 25:return e.abrupt("return",Object.assign({},a(),{output:p+": "+l+": No such file or directory"}));case 26:if(!(g=f.find((function(e){return e.name.toLowerCase()===p})))||!g.execute){e.next=32;break}return e.next=30,g.execute(i);case 30:return k=e.sent,e.abrupt("return",o(k));case 32:return e.abrupt("return",Object.assign({},a(),{output:p+": command not found"}));case 33:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}()}}},m4Nh:function(e,t,n){}}]);
//# sourceMappingURL=15-3bfca9f96a5e90834487.js.map