(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[35],{VKAe:function(e,t,n){"use strict";n.r(t),n.d(t,"PaymentFullStackTesterHost",(function(){return M})),n.d(t,"PaymentFullStackTester",(function(){return F}));var r=n("a1TR"),a=n.n(r),o=(n("3yYM"),n("Ab9Y")),c=n("ERkP"),u=n.n(c),s=n("bQih"),i=n("+tC1"),l=n("eCSs"),p=n("V6ES"),m=n("uFyH"),f=function(e){function t(t,n,r){var a;return(a=e.call(this)||this).message=t,a.data=n,a.innerError=r,a}return Object(p.a)(t,e),t}(Object(m.a)(Error)),d=1e3,h=function(e,t){return{jsonrpc:"2.0",method:e,params:t,id:""+d++}},v=function(e){function t(t,n,r){var a;return(a=e.call(this)||this).message=t,a.data=n,a.innerError=r,a}return Object(p.a)(t,e),t}(Object(m.a)(Error)),b=function(e,t,n){void 0===n&&(n=15e3);var r=0,c=new Promise((function(a,o){r=setTimeout((function(){var n={isTimeout:!0,message:"Web Api Timeout",error:new v("Web Api Timeout"),details:{url:e,options:t}};o(n)}),n)})),u=Object(o.a)(a.a.mark((function n(){var o;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,fetch(e,t).catch((function(t){throw new v("Fetch Error",{url:e},t)}));case 2:return o=n.sent,clearTimeout(r),n.abrupt("return",o);case 5:case"end":return n.stop()}}),n)})))();return Promise.race([c,u])},y=function(){var e=Object(o.a)(a.a.mark((function e(t,n){var r,o,c,u,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=JSON.stringify(n),o={method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","Content-Length":""+r.length},body:r,credentials:"include",cache:"no-cache"},e.next=4,b(t,o).catch((function(e){throw new v("Request Failure",{url:t,data:n},e)}));case 4:if((c=e.sent).ok){e.next=23;break}return e.t0=v,e.next=9,c.json().catch((function(e){}));case 9:if(e.t2=u=e.sent,e.t1=null!==e.t2,!e.t1){e.next=13;break}e.t1=void 0!==u;case 13:if(!e.t1){e.next=17;break}e.t3=u,e.next=18;break;case 17:e.t3={};case 18:throw e.t4=e.t3,e.t5=c.status,e.t6={url:t,data:n},e.t7={data:e.t4,responseStatus:e.t5,request:e.t6},new e.t0("Api Error",e.t7);case 23:return e.next=25,c.json().catch((function(e){throw new v("Request Parse Failure",{url:t,data:n},e)}));case 25:return s=e.sent,e.abrupt("return",s);case 27:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();function w(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return g(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return g(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var x=function(e){var t,n={webRequest:(t=Object(o.a)(a.a.mark((function e(t,n){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y(t,n);case 2:return r=e.sent,e.abrupt("return",{responseBodyObj:r});case 4:case"end":return e.stop()}}),e)}))),function(e,n){return t.apply(this,arguments)})};return function(e){var t=Object.keys(e.apiMethodNames).map((function(t){return{method:t,execute:(n=Object(o.a)(a.a.mark((function n(r){var o,c,u;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return o=h(t,r),n.next=3,e.inner.request(o);case 3:if(c=n.sent,!(u=c).error){n.next=7;break}throw new f("JsonRpcClient Request Failed",{error:u.error});case 7:return n.abrupt("return",u.result);case 8:case"end":return n.stop()}}),n)}))),function(e){return n.apply(this,arguments)})};var n}));return Object(i.c)(t.map((function(e){return{key:e.method,value:e.execute}})))}({inner:function(e){var t,n=[];return{request:(t=Object(o.a)(a.a.mark((function t(r){var c,u,s,i,p,m,d;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return c={_resolve:null,_reject:null},u=new Promise((function(e,t){c._resolve=e,c._reject=t})),n.push({data:r,promiseState:{_resolve:c._resolve,_reject:c._reject}}),t.next=5,Object(l.a)(50);case 5:if(!(n.length<=0)){t.next=7;break}return t.abrupt("return",u);case 7:return s=n,n=[],t.next=11,Object(o.a)(a.a.mark((function t(){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.inner.batchRequest(s.map((function(e){return e.data})));case 3:return t.t0=t.sent,t.abrupt("return",{batchResponses:t.t0});case 7:return t.prev=7,t.t1=t.catch(0),t.abrupt("return",{error:t.t1});case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))();case 11:if(!(i=t.sent).error){t.next=15;break}return s.forEach((function(e){e.promiseState._reject(new f("Request Failed",{request:e.data,batchRequests:s}))})),t.abrupt("return",u);case 15:p=function(){var e=d.value,t=i.batchResponses,n=null==t?void 0:t.find((function(t){return t.id===e.data.id}));if(!n)return e.promiseState._reject(new f("Batch Response is Missing",{request:e.data,batchRequests:s,batchResponses:t})),"continue";e.promiseState._resolve(n)},m=w(s);case 17:if((d=m()).done){t.next=23;break}if("continue"!==p()){t.next=21;break}return t.abrupt("continue",21);case 21:t.next=17;break;case 23:return t.abrupt("return",u);case 24:case"end":return t.stop()}}),t)}))),function(e){return t.apply(this,arguments)})}}({inner:function(e){var t;return{batchRequest:(t=Object(o.a)(a.a.mark((function t(n){var r,o,c;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,null===(r=e.sessionTokenStorage)||void 0===r?void 0:r.getSessionToken();case 2:return o=t.sent,t.next=5,e.inner.sessionRequest({batchRequests:n,sessionToken:o});case 5:if(c=t.sent,!e.sessionTokenStorage){t.next=15;break}if("reset"!==c.newSessionToken){t.next=12;break}return t.next=10,e.sessionTokenStorage.resetSessionToken();case 10:t.next=15;break;case 12:if(!c.newSessionToken){t.next=15;break}return t.next=15,e.sessionTokenStorage.setSessionToken(c.newSessionToken);case 15:return t.abrupt("return",c.batchResponses);case 16:case"end":return t.stop()}}),t)}))),function(e){return t.apply(this,arguments)})}}({inner:function(e){var t;return{sessionRequest:(t=Object(o.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.inner.webRequest(e.serverUrl,n);case 2:return r=t.sent,t.abrupt("return",r.responseBodyObj);case 4:case"end":return t.stop()}}),t)}))),function(e){return t.apply(this,arguments)})}}({serverUrl:e.serverUrl,inner:n}),sessionTokenStorage:e.sessionTokenStorage})}),apiMethodNames:e.apiMethodNames})},E=n("gptL"),P=n("njmQ"),k=n("bnqU"),j=n("PQcI"),S=function(e){var t=function(e){var t=Object(j.a)(e);return{AppWrapperComponent:function(e){var n=e.children;return t.AppWrapperComponent?u.a.createElement(t.AppWrapperComponent,null,n):u.a.createElement(u.a.Fragment,null,n)},PaymentMethodEntryComponent:function(e){return u.a.createElement(t.PaymentMethodEntryComponent,e)}}}(e),n={PaymentMethodView:function(n){return u.a.createElement(O,{comp:t,serverAccess:e.serverAccess,title:"Payment Methods"})},PaymentHistoryView:function(n){return u.a.createElement(_,{comp:t,serverAccess:e.serverAccess,title:"Payment History"})}};return Object.assign({},t,n)},O=function(e){var t=Object(c.useState)({textPadding:4,elementPadding:4,buttonAlignment:"right",borderRadius:4,borderColor:E.c.colors.border,backgroundColor:E.c.colors.background_field,textColor:E.c.colors.text,buttonText:"Save"}),n=t[0],r=(t[1],Object(P.a)()),i=r.loading,l=r.error,p=r.doWork,m=Object(c.useState)(null),f=m[0],d=m[1],h=function(){return p(Object(o.a)(a.a.mark((function t(){var n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.getPaymentMethods();case 2:n=t.sent,d(n);case 4:case"end":return t.stop()}}),t)}))))},v=Object(c.useState)(null),b=v[0],y=v[1];return Object(c.useEffect)((function(){h()}),[]),u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.Text_FormTitle,null,e.title),u.a.createElement(s.a.Loading,{loading:i}),u.a.createElement(s.a.ErrorBox,{error:l}),f&&f.length>0&&u.a.createElement(s.a.View_FormFields,null,f.map((function(t){return u.a.createElement(s.a.View_FieldRow,{key:t.key},u.a.createElement(s.a.Text_FieldLabel,null,t.title),u.a.createElement(s.a.Text_FieldLabel,null,"Expires: "+(""+t.expiration.month).padStart(2,"0")+"/"+t.expiration.year),u.a.createElement(s.a.Button_FieldInline,{onPress:function(){return n=t.key,p(Object(o.a)(a.a.mark((function t(){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.deletePaymentMethod(n);case 2:h();case 3:case"end":return t.stop()}}),t)}))));var n}},"Remove"))}))),!b&&u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:function(){return p(function(){var t=Object(o.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.onSetupPayment();case 2:r=t.sent,n(),console.log("setupPayment",{result:r}),y(r);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},"Add Payment Method")),b&&u.a.createElement(e.comp.PaymentMethodEntryComponent,{style:n,paymentMethodSetupToken:b,onPaymentMethodReady:function(t){return p(Object(o.a)(a.a.mark((function n(){return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,e.serverAccess.onPaymentMethodReady(t);case 2:y(null),h();case 4:case"end":return n.stop()}}),n)}))))}})))},_=function(e){var t=Object(P.a)(),n=t.loading,r=t.error,i=t.doWork,l=Object(c.useState)(null),p=l[0],m=l[1];return Object(c.useEffect)((function(){i(function(){var t=Object(o.a)(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.getPayments();case 2:r=t.sent,n(),m(r);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}),[]),u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.Text_FormTitle,null,e.title),u.a.createElement(s.a.Loading,{loading:n}),u.a.createElement(s.a.ErrorBox,{error:r}),p&&p.length>0&&u.a.createElement(s.a.View_FormFields,null,p.map((function(e){return u.a.createElement(s.a.View_FieldRow,{key:""+e.created},u.a.createElement(s.a.Text_FieldLabel,null,"Created: "+Object(k.a)(e.created)),u.a.createElement(s.a.Text_FieldLabel,null,"$"+e.amount.usdCents/100))})))))},T=function(e){var t=Object(P.a)(),n=t.loading,r=t.error,i=t.doWork,l=Object(c.useState)(100),p=l[0],m=l[1];return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.Text_FormTitle,null,"Make Purchase"),u.a.createElement(s.a.Text_FormTitle,null,e.title),u.a.createElement(s.a.Loading,{loading:n}),u.a.createElement(s.a.ErrorBox,{error:r}),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Text_FieldLabel,null,"Amount $"),u.a.createElement(s.a.Input_Currency,{value:p,onChange:function(e){return m(e)}}),u.a.createElement(s.a.Button_FieldInline,{onPress:function(){return i(Object(o.a)(a.a.mark((function t(){var n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.onMakePurchase(p);case 2:null===(n=e.onPurchase)||void 0===n||n.call(e);case 3:case"end":return t.stop()}}),t)}))))}},"Purchase")))))},A=function(){var e=Object(o.a)(a.a.mark((function e(){var t,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.e(36).then(n.bind(null,"uUap"));case 2:if(e.t1=t=e.sent,e.t0=null===e.t1,e.t0){e.next=6;break}e.t0=void 0===t;case 6:if(!e.t0){e.next=10;break}e.t2=void 0,e.next=11;break;case 10:e.t2=t.fullStackTestConfig;case 11:if(r=e.t2){e.next=14;break}throw new Error("Create config file");case 14:return e.abrupt("return",r);case 15:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),M=function(e){var t=Object(c.useState)(null),n=t[0],r=t[1],s=Object(c.useState)(null),i=s[0],l=s[1];return Object(c.useEffect)((function(){Object(o.a)(a.a.mark((function e(){var t,n,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,A();case 2:t=e.sent,l(t),n=x({serverUrl:t.serverUrl,apiMethodNames:{setupSavedPaymentMethod:"setupSavedPaymentMethod",saveSavedPaymentMethod:"saveSavedPaymentMethod",getSavedPaymentMethods:"getSavedPaymentMethods",deleteSavedPaymentMethod:"deleteSavedPaymentMethod",debug_triggerPayment:"debug_triggerPayment",getPayments:"getPayments"}}),"stripe",c={onSetupPayment:function(){var e=Object(o.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("onSetupPayment START"),e.next=3,n.setupSavedPaymentMethod({providerName:"stripe"});case 3:return t=e.sent,console.log("onSetupPayment END",{result:t}),e.abrupt("return",t);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),onPaymentMethodReady:function(){var e=Object(o.a)(a.a.mark((function e(t){var r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("onPaymentMethodReady START"),e.next=3,n.saveSavedPaymentMethod({providerName:"stripe",paymentMethodClientToken:t});case 3:return r=e.sent,console.log("onPaymentMethodReady END",{result:r}),e.abrupt("return",r);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getPaymentMethods:function(){var e=Object(o.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("getPaymentMethods START"),e.next=3,n.getSavedPaymentMethods();case 3:return t=e.sent,console.log("getPaymentMethods END",{result:t}),e.abrupt("return",t);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),deletePaymentMethod:function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("deletePaymentMethod"),e.next=3,n.deleteSavedPaymentMethod({key:t});case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),getPayments:function(){var e=Object(o.a)(a.a.mark((function e(){var t;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("getPayments START"),e.next=3,n.getPayments();case 3:return t=e.sent,console.log("getPayments END",{result:t}),e.abrupt("return",t);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),onMakePurchase:function(){var e=Object(o.a)(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("onMakePurchase"),e.next=3,n.debug_triggerPayment({amount:{currency:"usd",usdCents:Math.floor(100*t)}});case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},r(c);case 8:case"end":return e.stop()}}),e)})))()}),[]),u.a.createElement("div",null,(!i||!n)&&u.a.createElement("div",null,"Loading..."),i&&n&&u.a.createElement(F,{config:i,serverAccess:n}))},F=function(e){var t,n,r,a,o=(n={stripePublicKey:e.config.stripePublicKey,serverAccess:e.serverAccess},r=S(n),a={PaymentDebugView:function(e){return u.a.createElement(T,{comp:r,serverAccess:n.serverAccess,title:"Payment Debug",onPurchase:e.onPurchase})}},Object.assign({},r,a)),i=null!==(t=o.AppWrapperComponent)&&void 0!==t?t:function(e){var t=e.children;return u.a.createElement(u.a.Fragment,null,t)},l=Object(c.useState)(0),p=(l[0],l[1]);return u.a.createElement(i,null,u.a.createElement(s.a.View_Panel,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.Text_FormTitle,null,"Page and Stuff...")),u.a.createElement(o.PaymentMethodView,null),u.a.createElement(o.PaymentHistoryView,null),u.a.createElement(o.PaymentDebugView,{onPurchase:function(){p((function(e){return e+1}))}})))}}}]);
//# sourceMappingURL=35-909dd06437c89b8f30cd.js.map