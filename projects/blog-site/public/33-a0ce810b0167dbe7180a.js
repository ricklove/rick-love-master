(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[33],{zdZc:function(e,t,n){"use strict";n.r(t),n.d(t,"HackerNewsPage_TopNews",(function(){return T}));var r=n("VtSi"),a=n.n(r),s=(n("3yYM"),n("QsI/")),o=n("ERkP"),c=n.n(o),i=n("H5jT"),l=n("olhD"),u=n("njmQ"),f=n("DTYs"),m=n("bnqU"),p=function(e){var t=e.posts;return c.a.createElement(c.a.Fragment,null,c.a.createElement(f.h,{style:x.container},t.map((function(e,t){return c.a.createElement(f.h,{key:""+e.id},c.a.createElement(y,{item:e,index:t}))}))))},x={container:{},numberText:{fontSize:12},titleText:{fontSize:14,fontWeight:"bold"},infoText:{fontSize:12},pointsText:{fontSize:10},authorsText:{fontSize:10},timeText:{fontSize:10},actionsText:{fontSize:10}},y=function(e){var t,n,r=e.item,a=e.index;return"story"===r.type||"job"===r.type?c.a.createElement(c.a.Fragment,null,c.a.createElement(f.h,{style:{display:"flex",flexDirection:"row",alignItems:"flex-start"}},c.a.createElement(f.h,{style:{display:"flex",flexDirection:"row",justifyContent:"center",width:32}},c.a.createElement(f.e,{style:x.numberText},a+1+".")),c.a.createElement(f.h,{style:{display:"flex",flexDirection:"column"}},c.a.createElement(f.h,{style:{display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-end"}},c.a.createElement(f.e,{style:x.titleText},r.title),c.a.createElement(f.e,{style:x.infoText}," "+((n=r.url)?"("+new URL(n).host+")":""))),c.a.createElement(f.h,{style:{display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-end"}},c.a.createElement(f.e,{style:x.pointsText},r.score+" points"),c.a.createElement(f.e,{style:x.authorsText}," by"),c.a.createElement(f.e,{style:x.authorsText}," "+r.by),c.a.createElement(f.e,{style:x.timeText}," "+(t=r.time,""+Object(m.b)(new Date(1e3*t)))),"story"===r.type&&c.a.createElement(c.a.Fragment,null,c.a.createElement(f.e,{style:x.timeText}," | "+r.descendants+" comments")))))):c.a.createElement(f.e,null,JSON.stringify(r,null,2))},E=n("9DGK"),d={top:"https://hacker-news.firebaseio.com/v0/topstories.json",new:"https://hacker-news.firebaseio.com/v0/newstories.json"},h=function(){var e=Object(s.a)(a.a.mark((function e(t){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t,{mode:"cors"});case 2:if((n=e.sent).ok){e.next=6;break}throw console.log("Failed to get data",{url:t,status:n.status,statusText:n.statusText,response:n}),new E.a("Failed to get data",{url:t,status:n.status,statusText:n.statusText});case 6:return e.next=8,n.json();case 8:return e.abrupt("return",e.sent);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),w=function(){var e=Object(s.a)(a.a.mark((function e(t){var n,r,o,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=d[t],e.next=3,h(n);case 3:return r=e.sent,o=r.slice(0,30),e.next=7,Promise.all(o.map(function(){var e=Object(s.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h("https://hacker-news.firebaseio.com/v0/item/"+t+".json");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 7:return c=e.sent,e.abrupt("return",c);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),b=function(e){var t=e.page,n=Object(u.a)(),r=n.loading,f=n.error,m=n.doWork,x=Object(o.useState)(null),y=x[0],E=x[1];return Object(o.useEffect)((function(){m(Object(s.a)(a.a.mark((function e(){var n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w(t);case 2:n=e.sent,E(n);case 4:case"end":return e.stop()}}),e)}))))}),[t]),c.a.createElement(c.a.Fragment,null,c.a.createElement(l.a,{loading:r}),c.a.createElement(i.a,{error:f}),y&&c.a.createElement(p,{posts:y}))},T=function(e){return c.a.createElement(b,{page:"top"})}}}]);
//# sourceMappingURL=33-a0ce810b0167dbe7180a.js.map