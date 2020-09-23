(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[29],{aJyO:function(e,t,r){"use strict";r.r(t),r.d(t,"UploadTestView",(function(){return d}));var a=r("a1TR"),n=r.n(a),l=(r("3yYM"),r("Ab9Y")),u=r("ERkP"),c=r.n(u),o=r("DTYs"),p=r("B8BD"),s=r("aEBB"),i=r("GJ35"),d=function(e){var t,r,a,d,w,v,U,m,h,E,f,y,b=Object(u.useRef)(Object(s.a)(p.a)),g=Object(u.useState)(null),S=g[0],x=g[1],O=Object(u.useState)(null),P=O[0],k=O[1],j=Object(u.useState)(null),D=j[0],_=j[1],T=Object(u.useState)(null),A=T[0],R=T[1],B=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.current.createUploadUrl({contentType:"text"});case 2:t=e.sent,x(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),K=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.current.createUploadUrl({contentType:"text",shareablePath:!0});case 2:t=e.sent,x(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,b.current.renewUploadUrl({uploadUrl:S});case 4:t=e.sent,k(t.uploadUrl),console.log("UploadView onPress",{result:t,url:S});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),V=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,b.current.renewUploadUrl({uploadUrl:Object.assign({},S,{secretKey:"FAKE-KEY"})});case 5:t=e.sent,k(t.uploadUrl),console.log("UploadView onPress",{result:t,url:S}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),_(e.t0);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(){return e.apply(this,arguments)}}(),J=function(){var e=Object(l.a)(n.a.mark((function e(){var t,r,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,t={timestamp:new Date,ok:!0},r=Object(i.b)(S),e.next=7,r.uploadData(t);case 7:return e.next=9,r.downloadData();case 9:a=e.sent,R({upload:t,download:a}),console.log("UploadView onPress",{upload:t,download:a}),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),_(e.t0);case 17:case"end":return e.stop()}}),e,null,[[2,14]])})));return function(){return e.apply(this,arguments)}}();return c.a.createElement(o.h,null,c.a.createElement(o.g,{onPress:B},c.a.createElement(o.h,{style:{background:"#555555",padding:4}},c.a.createElement(o.e,null,"Get Upload Url"))),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(t=null==S?void 0:S.getUrl)&&void 0!==t?t:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(r=null==S?void 0:S.putUrl)&&void 0!==r?r:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(a=null==S?void 0:S.relativePath)&&void 0!==a?a:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(d=null==S?void 0:S.expirationTimestamp)&&void 0!==d?d:"")),c.a.createElement(o.g,{onPress:K},c.a.createElement(o.h,{style:{background:"#555555",padding:4}},c.a.createElement(o.e,null,"Get Upload Url - Human"))),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(w=null==S?void 0:S.getUrl)&&void 0!==w?w:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(v=null==S?void 0:S.putUrl)&&void 0!==v?v:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(U=null==S?void 0:S.relativePath)&&void 0!==U?U:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(m=null==S?void 0:S.expirationTimestamp)&&void 0!==m?m:"")),c.a.createElement(o.g,{onPress:L},c.a.createElement(o.h,{style:{background:"#555555",padding:4}},c.a.createElement(o.e,null,"Renew Upload Url"))),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(h=null==P?void 0:P.getUrl)&&void 0!==h?h:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(E=null==P?void 0:P.putUrl)&&void 0!==E?E:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(f=null==P?void 0:P.relativePath)&&void 0!==f?f:"")),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(y=null==P?void 0:P.expirationTimestamp)&&void 0!==y?y:"")),c.a.createElement(o.g,{onPress:V},c.a.createElement(o.h,{style:{background:"#555555",padding:4}},c.a.createElement(o.e,null,"Renew Upload Url - Invalid Key"))),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Error: "+JSON.stringify(D,null,2)),c.a.createElement(o.g,{onPress:J},c.a.createElement(o.h,{style:{background:"#555555",padding:4}},c.a.createElement(o.e,null,"Upload and Download"))),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Uploaded : "+JSON.stringify(null==A?void 0:A.upload,null,2)),c.a.createElement(o.e,{style:{whiteSpace:"pre-wrap"}},"Downloded: "+JSON.stringify(null==A?void 0:A.download,null,2)))}}}]);
//# sourceMappingURL=29-af73445d1adc0eb419cd.js.map