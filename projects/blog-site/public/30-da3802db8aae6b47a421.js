(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[30],{fGVD:function(e,t,r){"use strict";r.r(t),r.d(t,"UploadTestView",(function(){return w}));r("yKDW"),r("dtAy"),r("PN9k");var n=r("a1TR"),a=r.n(n),l=(r("3yYM"),r("ERkP")),o=r.n(l),u=r("DTYs"),c=r("1U25"),i=r("Vgox"),p=r("X2o9");function s(e,t,r,n,a,l,o){try{var u=e[l](o),c=u.value}catch(i){return void r(i)}u.done?t(c):Promise.resolve(c).then(n,a)}function d(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var l=e.apply(t,r);function o(e){s(l,n,a,o,u,"next",e)}function u(e){s(l,n,a,o,u,"throw",e)}o(void 0)}))}}var w=function(e){var t,r,n,s,w,v,U,m,h,f,E,y,g=Object(l.useRef)(Object(i.a)(c.a)),b=Object(l.useState)(null),P=b[0],S=b[1],x=Object(l.useState)(null),k=x[0],O=x[1],D=Object(l.useState)(null),_=D[0],T=D[1],j=Object(l.useState)(null),A=j[0],R=j[1],V=function(){var e=d(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.current.createUploadUrl({contentType:"text"});case 2:t=e.sent,S(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),K=function(){var e=d(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,g.current.createUploadUrl({contentType:"text",shareablePath:!0});case 2:t=e.sent,S(t.uploadUrl),console.log("UploadView onPress",{result:t});case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),L=function(){var e=d(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(P){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,g.current.renewUploadUrl({uploadUrl:P});case 4:t=e.sent,O(t.uploadUrl),console.log("UploadView onPress",{result:t,url:P});case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),N=function(){var e=d(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(P){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,e.next=5,g.current.renewUploadUrl({uploadUrl:Object.assign(Object.assign({},P),{},{secretKey:"FAKE-KEY"})});case 5:t=e.sent,O(t.uploadUrl),console.log("UploadView onPress",{result:t,url:P}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),T(e.t0);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(){return e.apply(this,arguments)}}(),G=function(){var e=d(a.a.mark((function e(){var t,r,n;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(P){e.next=2;break}return e.abrupt("return");case 2:return e.prev=2,t={timestamp:new Date,ok:!0},r=Object(p.b)(P),e.next=7,r.uploadData(t);case 7:return e.next=9,r.downloadData();case 9:n=e.sent,R({upload:t,download:n}),console.log("UploadView onPress",{upload:t,download:n}),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(2),T(e.t0);case 17:case"end":return e.stop()}}),e,null,[[2,14]])})));return function(){return e.apply(this,arguments)}}();return o.a.createElement(u.h,null,o.a.createElement(u.g,{onPress:V},o.a.createElement(u.h,{style:{background:"#555555",padding:4}},o.a.createElement(u.e,null,"Get Upload Url"))),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(t=null==P?void 0:P.getUrl)&&void 0!==t?t:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(r=null==P?void 0:P.putUrl)&&void 0!==r?r:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(n=null==P?void 0:P.relativePath)&&void 0!==n?n:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(s=null==P?void 0:P.expirationTimestamp)&&void 0!==s?s:"")),o.a.createElement(u.g,{onPress:K},o.a.createElement(u.h,{style:{background:"#555555",padding:4}},o.a.createElement(u.e,null,"Get Upload Url - Human"))),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(w=null==P?void 0:P.getUrl)&&void 0!==w?w:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(v=null==P?void 0:P.putUrl)&&void 0!==v?v:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(U=null==P?void 0:P.relativePath)&&void 0!==U?U:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(m=null==P?void 0:P.expirationTimestamp)&&void 0!==m?m:"")),o.a.createElement(u.g,{onPress:L},o.a.createElement(u.h,{style:{background:"#555555",padding:4}},o.a.createElement(u.e,null,"Renew Upload Url"))),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Read: "+(null!==(h=null==k?void 0:k.getUrl)&&void 0!==h?h:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Put : "+(null!==(f=null==k?void 0:k.putUrl)&&void 0!==f?f:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Path: "+(null!==(E=null==k?void 0:k.relativePath)&&void 0!==E?E:"")),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Url Time: "+(null!==(y=null==k?void 0:k.expirationTimestamp)&&void 0!==y?y:"")),o.a.createElement(u.g,{onPress:N},o.a.createElement(u.h,{style:{background:"#555555",padding:4}},o.a.createElement(u.e,null,"Renew Upload Url - Invalid Key"))),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Error: "+JSON.stringify(_,null,2)),o.a.createElement(u.g,{onPress:G},o.a.createElement(u.h,{style:{background:"#555555",padding:4}},o.a.createElement(u.e,null,"Upload and Download"))),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Uploaded : "+JSON.stringify(null==A?void 0:A.upload,null,2)),o.a.createElement(u.e,{style:{whiteSpace:"pre-wrap"}},"Downloded: "+JSON.stringify(null==A?void 0:A.download,null,2)))}}}]);
//# sourceMappingURL=30-da3802db8aae6b47a421.js.map