(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[32],{fGVD:function(e,t,r){"use strict";r.r(t),r.d(t,"UploadTestView",(function(){return d}));var a=r("a1TR"),n=r.n(a),l=(r("3yYM"),r("Ab9Y")),u=r("ERkP"),o=r.n(u),c=r("DTYs"),p=r("1U25"),s=r("Vgox"),i=r("X2o9"),d=function(e){var t,r,a,d,w,v,U,m,h,E,f,y,b=Object(u.useRef)(Object(s.a)(p.a)),g=Object(u.useState)(null),S=g[0],x=g[1],P=Object(u.useState)(null),O=P[0],k=P[1],j=Object(u.useState)(null),D=j[0],_=j[1],T=Object(u.useState)(null),A=T[0],R=T[1],V=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.current.createUploadUrl({contentType:"text"});case 2:t=e.sent,x(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),K=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b.current.createUploadUrl({contentType:"text",shareablePath:!0});case 2:t=e.sent,x(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,b.current.renewUploadUrl({uploadUrl:S});case 4:t=e.sent,k(t.uploadUrl),console.log("UploadView onPress",{result:t,url:S});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),N=function(){var e=Object(l.a)(n.a.mark((function e(){var t;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,b.current.renewUploadUrl({uploadUrl:Object.assign({},S,{secretKey:"FAKE-KEY"})});case 5:t=e.sent,k(t.uploadUrl),console.log("UploadView onPress",{result:t,url:S}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),_(e.t0);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(){return e.apply(this,arguments)}}(),Y=function(){var e=Object(l.a)(n.a.mark((function e(){var t,r,a;return n.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(S){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,t={timestamp:new Date,ok:!0},r=Object(i.b)(S),e.next=7,r.uploadData(t);case 7:return e.next=9,r.downloadData();case 9:a=e.sent,R({upload:t,download:a}),console.log("UploadView onPress",{upload:t,download:a}),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),_(e.t0);case 17:case"end":return e.stop()}}),e,null,[[2,14]])})));return function(){return e.apply(this,arguments)}}();return o.a.createElement(c.h,null,o.a.createElement(c.g,{onPress:V},o.a.createElement(c.h,{style:{background:"#555555",padding:4}},o.a.createElement(c.e,null,"Get Upload Url"))),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(t=null==S?void 0:S.getUrl)&&void 0!==t?t:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(r=null==S?void 0:S.putUrl)&&void 0!==r?r:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(a=null==S?void 0:S.relativePath)&&void 0!==a?a:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(d=null==S?void 0:S.expirationTimestamp)&&void 0!==d?d:"")),o.a.createElement(c.g,{onPress:K},o.a.createElement(c.h,{style:{background:"#555555",padding:4}},o.a.createElement(c.e,null,"Get Upload Url - Human"))),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(w=null==S?void 0:S.getUrl)&&void 0!==w?w:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(v=null==S?void 0:S.putUrl)&&void 0!==v?v:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(U=null==S?void 0:S.relativePath)&&void 0!==U?U:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(m=null==S?void 0:S.expirationTimestamp)&&void 0!==m?m:"")),o.a.createElement(c.g,{onPress:L},o.a.createElement(c.h,{style:{background:"#555555",padding:4}},o.a.createElement(c.e,null,"Renew Upload Url"))),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(h=null==O?void 0:O.getUrl)&&void 0!==h?h:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(E=null==O?void 0:O.putUrl)&&void 0!==E?E:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(f=null==O?void 0:O.relativePath)&&void 0!==f?f:"")),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(y=null==O?void 0:O.expirationTimestamp)&&void 0!==y?y:"")),o.a.createElement(c.g,{onPress:N},o.a.createElement(c.h,{style:{background:"#555555",padding:4}},o.a.createElement(c.e,null,"Renew Upload Url - Invalid Key"))),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Error: "+JSON.stringify(D,null,2)),o.a.createElement(c.g,{onPress:Y},o.a.createElement(c.h,{style:{background:"#555555",padding:4}},o.a.createElement(c.e,null,"Upload and Download"))),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Uploaded : "+JSON.stringify(null==A?void 0:A.upload,null,2)),o.a.createElement(c.e,{style:{whiteSpace:"pre-wrap"}},"Downloded: "+JSON.stringify(null==A?void 0:A.download,null,2)))}}}]);
//# sourceMappingURL=32-b6e72dcde6bab50f06b1.js.map