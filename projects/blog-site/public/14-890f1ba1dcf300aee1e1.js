(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[14],{"jvf+":function(e,t,n){"use strict";n.r(t),n.d(t,"AuthComponent",(function(){return $}));n("yKDW"),n("dtAy"),n("PN9k");var r=n("VtSi"),a=n.n(r),o=(n("3yYM"),n("ERkP")),u=n.n(o),s=n("bQih"),c=n("njmQ"),i=n("O6JU"),l=n("7vau");function m(e,t,n,r,a,o,u){try{var s=e[o](u),c=s.value}catch(i){return void n(i)}s.done?t(c):Promise.resolve(c).then(r,a)}function f(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function u(e){m(o,r,a,u,s,"next",e)}function s(e){m(o,r,a,u,s,"throw",e)}u(void 0)}))}}var h=function(e){var t={state:{status:null},serverAccess:e.serverAccess,config:e.config};return{AuthenticationView:function(e){return u.a.createElement(d,Object.assign({},t,e))}}},d=function(e){var t=e.state,n=e.serverAccess,r=e.config,i=e.onAuthChange,l=Object(c.a)(),m=l.loading,h=l.error,d=l.doWork;Object(o.useEffect)((function(){t.status||d(function(){var e=f(a.a.mark((function e(r){var o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=t,e.next=3,n.refreshStatus();case 3:o.status=e.sent.result;case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}),[]);var v=Object(o.useState)(0),E=(v[0],v[1]),w=function(e){console.log("onAuthChangeInner",{status:e}),t.status=e,null==i||i(e),E((function(e){return e+1}))};return t.status?t.status.isAuthenticated?t.status.requiresPasswordReset?u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(A,{serverAccess:n,config:r,onAuthChange:w,label:"Reset Password"})):t.status.requiresVerifiedPhone?u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(_,{serverAccess:n,onAuthChange:w})):t.status.requiresVerifiedEmail?u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(F,{serverAccess:n,onAuthChange:w})):u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(g,{serverAccess:n,config:r,status:t.status,onAuthChange:w})):u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(p,{serverAccess:n,config:r,onAuthChange:w})):u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}))},p=function(e){var t=e.serverAccess,n=e.config,r=e.onAuthChange,a=Object(o.useState)("login"),s=a[0],c=a[1];return"create-account"===s?u.a.createElement(E,{serverAccess:t,config:n,onAuthChange:r,onNavigate:function(e){return c(e)}}):"forgot-password"===s?u.a.createElement(C,{serverAccess:t,onAuthChange:r,onNavigate:function(e){return c(e)}}):u.a.createElement(v,{serverAccess:t,onAuthChange:r,onNavigate:function(e){return c(e)}})},g=function(e){var t=e.serverAccess,n=e.config,r=e.status,a=e.onAuthChange,s=Object(o.useState)("logout"),c=s[0],i=s[1];return"change-username"===c?u.a.createElement(w,{serverAccess:t,onAuthChange:a,onDone:function(){return i("logout")},navButtons:[{label:"Cancel",action:function(){return i("logout")}}]}):"change-password"===c?u.a.createElement(A,{serverAccess:t,config:n,onAuthChange:a,onDone:function(){return i("logout")},navButtons:[{label:"Cancel",action:function(){return i("logout")}}]}):"change-phone"===c?u.a.createElement(P,{serverAccess:t,onAuthChange:a,onDone:function(){return i("logout")}}):"change-email"===c?u.a.createElement(y,{serverAccess:t,onAuthChange:a,onDone:function(){return i("logout")}}):u.a.createElement(O,{serverAccess:t,status:r,onAuthChange:a,onNavigate:function(e){return i(e)}})},v=function(e){var t=Object(o.useState)(""),n=t[0],r=t[1],i=Object(o.useState)(""),l=i[0],m=i[1],h=Object(o.useState)(!1),d=h[0],p=h[1],g=Object(c.a)(),v=g.loading,E=g.error,w=g.doWork,A=function(){w(function(){var t=f(a.a.mark((function t(r){var o;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return p(!1),t.next=3,e.serverAccess.login(n,l);case 3:if(o=t.sent,r(),o.result.isAuthenticated){t.next=8;break}return p(!0),t.abrupt("return");case 8:e.onAuthChange(o.result);case 9:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{styleAlt:!0,onPress:function(){return e.onNavigate("create-account")}},"Create Account")),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,"Login"),u.a.createElement(s.a.Loading,{loading:v}),u.a.createElement(s.a.ErrorBox,{error:E}),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Username,{placeholder:"Username",value:n,onChange:r,onSubmit:A})),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Password,{placeholder:"Password",value:l,onChange:m,onSubmit:A}),u.a.createElement(s.a.Button_FieldInline,{styleAlt:!0,onPress:function(){return e.onNavigate("forgot-password")}},"Forgot Password")),d&&u.a.createElement(s.a.ErrorMessage,null,"Incorrect username or password")),u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:A},"Login"))))},E=function(e){var t=Object(o.useState)(""),n=t[0],r=t[1],i=Object(o.useState)(""),l=i[0],m=i[1],h=Object(c.a)(),d=h.loading,p=h.error,g=h.doWork,v=function(){n&&l&&g(function(){var t=f(a.a.mark((function t(r){var o;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.createAccount(n,l);case 2:o=t.sent,r(),e.onAuthChange(o.result);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{styleAlt:!0,onPress:function(){return e.onNavigate("login")}}," Login")),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,"Create Account"),u.a.createElement(s.a.Loading,{loading:d}),u.a.createElement(s.a.ErrorBox,{error:p}),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Username,{placeholder:"Username",value:n,onChange:r,onSubmit:v})),u.a.createElement(b,{password:l,minPasswordLength:e.config.minPasswordLength,onPasswordChange:m,onSubmit:v})),u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:v},"Create Account"))))},w=function(e){var t,n=Object(o.useState)(""),r=n[0],i=n[1],l=Object(c.a)(),m=l.loading,h=l.error,d=l.doWork,p=function(){r&&d(function(){var t=f(a.a.mark((function t(n){var o,u;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.changeUsername(r);case 2:u=t.sent,n(),e.onAuthChange(u.result),null===(o=e.onDone)||void 0===o||o.call(e);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())};return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormActionRow,null,null===(t=e.navButtons)||void 0===t?void 0:t.map((function(e){return u.a.createElement(s.a.Button_FormAction,{key:e.label,styleAlt:!0,onPress:e.action},e.label)}))),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,"Change Username"),u.a.createElement(s.a.Loading,{loading:m}),u.a.createElement(s.a.ErrorBox,{error:h}),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Username,{placeholder:"Username",value:r,onChange:i,onSubmit:p}))),u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:p},"Change Username"))))},A=function(e){var t,n,r,i=Object(o.useState)(""),l=i[0],m=i[1],h=Object(c.a)(),d=h.loading,p=h.error,g=h.doWork,v=function(){var t=f(a.a.mark((function t(){var n;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=l){t.next=3;break}return t.abrupt("return");case 3:g(function(){var t=f(a.a.mark((function t(r){var o,u;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.changePassword(n);case 2:u=t.sent,r(),e.onAuthChange(u.result),null===(o=e.onDone)||void 0===o||o.call(e);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());case 4:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormActionRow,null,null===(t=e.navButtons)||void 0===t?void 0:t.map((function(e){return u.a.createElement(s.a.Button_FormAction,{key:e.label,styleAlt:!0,onPress:e.action},e.label)}))),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,null!==(n=e.label)&&void 0!==n?n:"Change Password"),u.a.createElement(s.a.Loading,{loading:d}),u.a.createElement(s.a.ErrorBox,{error:p}),u.a.createElement(b,{password:l,minPasswordLength:e.config.minPasswordLength,onPasswordChange:function(e){e&&m(e)},onSubmit:v})),u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:v},null!==(r=e.label)&&void 0!==r?r:"Change Password"))))},b=function(e){var t=Object(o.useState)(e.password),n=t[0],r=t[1],a=Object(o.useState)(""),c=a[0],i=a[1],l=Object(o.useState)(null),m=l[0],f=l[1],h=function(){n!==n.trim()&&r(n.trim()),c!==c.trim()&&i(c.trim()),n?n.length<e.minPasswordLength?f("short"):c&&(n===c?(f(null),n!==e.password&&e.onPasswordChange(n)):f("must-match")):f("missing")},d=function(){h(),e.onSubmit()};return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Password,{placeholder:"Password",value:n,onChange:r,onSubmit:d,onBlur:h})),"missing"===m&&u.a.createElement(s.a.ErrorMessage,null,"Please Enter a Password"),"short"===m&&u.a.createElement(s.a.ErrorMessage,null,"The Password is too Short: ("+e.minPasswordLength+")"),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Password,{placeholder:"Confirm Password",value:c,onChange:i,onSubmit:d,onBlur:h})),"must-match"===m&&u.a.createElement(s.a.ErrorMessage,null,"Passwords Must Match"))},C=function(e){return u.a.createElement(x,{requestCode:e.serverAccess.requestPhoneLoginCode,verifyCode:e.serverAccess.loginWithPhoneCode,onAuthChange:e.onAuthChange,label:"Forgot Password",navButtons:[{label:"Login",action:function(){return e.onNavigate("login")}}],defaultValue:Object(i.b)(""),InputComponent:function(e){return u.a.createElement(s.a.Input_Phone,Object.assign({placeholder:"Phone Number"},e))}})},_=function(e){return u.a.createElement(x,{requestCode:e.serverAccess.registerPhoneAndSendVerification,verifyCode:e.serverAccess.verifyPhone,onAuthChange:e.onAuthChange,label:"Register Phone",defaultValue:Object(i.b)(""),InputComponent:function(e){return u.a.createElement(s.a.Input_Phone,Object.assign({placeholder:"Phone Number"},e))}})},P=function(e){return u.a.createElement(x,{requestCode:e.serverAccess.registerPhoneAndSendVerification,verifyCode:e.serverAccess.verifyPhone,onAuthChange:e.onAuthChange,onDone:e.onDone,label:"Change Phone",navButtons:[{label:"Cancel",action:e.onDone}],defaultValue:Object(i.b)(""),InputComponent:function(e){return u.a.createElement(s.a.Input_Phone,Object.assign({placeholder:"Phone Number"},e))}})},F=function(e){return u.a.createElement(x,{requestCode:e.serverAccess.registerEmailAndSendVerification,verifyCode:e.serverAccess.verifyEmail,onAuthChange:e.onAuthChange,label:"Register Email",defaultValue:Object(l.a)(""),InputComponent:function(e){return u.a.createElement(s.a.Input_Email,Object.assign({placeholder:"Email"},e))}})},y=function(e){return u.a.createElement(x,{requestCode:e.serverAccess.registerEmailAndSendVerification,verifyCode:e.serverAccess.verifyEmail,onAuthChange:e.onAuthChange,onDone:e.onDone,label:"Change Email",navButtons:[{label:"Cancel",action:e.onDone}],defaultValue:Object(l.a)(""),InputComponent:function(e){return u.a.createElement(s.a.Input_Email,Object.assign({placeholder:"Email"},e))}})},x=function(e){var t,n,r,i=Object(o.useState)(e.defaultValue),l=i[0],m=i[1],h=Object(o.useState)(!1),d=h[0],p=h[1],g=Object(o.useState)(""),v=g[0],E=g[1],w=Object(o.useState)(null),A=w[0],b=w[1],C=Object(c.a)(),_=C.loading,P=C.error,F=C.doWork,y=function(){F(function(){var t=f(a.a.mark((function t(n){return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.requestCode(l);case 2:n(),p(!0);case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())},x=function(){F(function(){var t=f(a.a.mark((function t(n){var r,o;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,b(null),t.next=4,e.verifyCode(l,v);case 4:o=t.sent,n(),e.onAuthChange(o.result),null===(r=e.onDone)||void 0===r||r.call(e),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),b(t.t0);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(e){return t.apply(this,arguments)}}())};return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormActionRow,null,null===(t=e.navButtons)||void 0===t?void 0:t.map((function(e){return u.a.createElement(s.a.Button_FormAction,{key:e.label,styleAlt:!0,onPress:e.action},e.label)}))),u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,null!==(n=e.label)&&void 0!==n?n:"Change Phone"),u.a.createElement(s.a.Loading,{loading:_}),u.a.createElement(s.a.ErrorBox,{error:P}),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(e.InputComponent,{editable:!d,value:l,onChange:m,onSubmit:y})),d&&u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Text,{placeholder:"Verification Code",value:v,onChange:E,onSubmit:x})),A&&u.a.createElement(s.a.ErrorMessage,null,null!==(r=A.message)&&void 0!==r?r:"Invalid Code")),u.a.createElement(s.a.View_FormActionRow,null,!d&&u.a.createElement(s.a.Button_FormAction,{onPress:y},"Send Verification Code"),d&&u.a.createElement(s.a.Button_FormAction,{onPress:x},"Verify"))))},O=function(e){var t,n,r,o=Object(c.a)(),l=o.loading,m=o.error,h=o.doWork;return u.a.createElement(u.a.Fragment,null,u.a.createElement(s.a.View_Form,null,u.a.createElement(s.a.View_FormFields,null,u.a.createElement(s.a.Text_FormTitle,null,"User Account"),u.a.createElement(s.a.Loading,{loading:l}),u.a.createElement(s.a.ErrorBox,{error:m}),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Text,{editable:!1,value:null!==(t=e.status.username)&&void 0!==t?t:"",onChange:function(){}}),u.a.createElement(s.a.Button_FieldInline,{styleAlt:!0,onPress:function(){return e.onNavigate("change-username")}},"Change Username"),u.a.createElement(s.a.Button_FieldInline,{styleAlt:!0,onPress:function(){return e.onNavigate("change-password")}},"Change Password")),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Phone,{editable:!1,value:null!==(n=e.status.phone)&&void 0!==n?n:Object(i.b)(""),onChange:function(){}}),u.a.createElement(s.a.Button_FieldInline,{styleAlt:!0,onPress:function(){return e.onNavigate("change-phone")}},"Change Phone")),u.a.createElement(s.a.View_FieldRow,null,u.a.createElement(s.a.Input_Text,{editable:!1,value:null!==(r=e.status.email)&&void 0!==r?r:"",onChange:function(){}}),u.a.createElement(s.a.Button_FieldInline,{styleAlt:!0,onPress:function(){return e.onNavigate("change-email")}},"Change Email"))),u.a.createElement(s.a.View_FormActionRow,null,u.a.createElement(s.a.Button_FormAction,{onPress:function(){h(function(){var t=f(a.a.mark((function t(n){var r;return a.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.serverAccess.logout();case 2:r=t.sent,n(),e.onAuthChange(r.result);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},"Log Out"))))};n("LnO1"),n("3eMz"),n("4oWw"),n("PRJl"),n("/1As"),n("p+GS");function V(e){var t="function"==typeof Map?new Map:void 0;return(V=function(e){if(null===e||(n=e,-1===Function.toString.call(n).indexOf("[native code]")))return e;var n;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,r)}function r(){return j(e,arguments,B(this).constructor)}return r.prototype=Object.create(e.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}),k(r,e)})(e)}function j(e,t,n){return(j=S()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var a=new(Function.bind.apply(e,r));return n&&k(a,n.prototype),a}).apply(null,arguments)}function S(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function k(e,t){return(k=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function B(e){return(B=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var L=function(e){var t,n;function r(t,n){var r;return(r=e.call(this)||this).message=t,r.data=n,r}return n=e,(t=r).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n,r}(V(Error));function R(e,t,n,r,a,o,u){try{var s=e[o](u),c=s.value}catch(i){return void n(i)}s.done?t(c):Promise.resolve(c).then(r,a)}function I(e){return function(){var t=this,n=arguments;return new Promise((function(r,a){var o=e.apply(t,n);function u(e){R(o,r,a,u,s,"next",e)}function s(e){R(o,r,a,u,s,"throw",e)}u(void 0)}))}}var D,q,M,N,T,U,W,K,H,J,Q,z,G,Y,X={username:"rick",password:"42",phone:"",phoneCode:"",email:"",emailCode:"",status:{isAuthenticated:!1}},Z=h({serverAccess:{refreshStatus:(Y=I(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",{result:X.status});case 1:case"end":return e.stop()}}),e)}))),function(){return Y.apply(this,arguments)}),logout:(G=I(a.a.mark((function e(){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.status={isAuthenticated:!1},e.abrupt("return",{result:X.status});case 2:case"end":return e.stop()}}),e)}))),function(){return G.apply(this,arguments)}),createAccount:(z=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.username=t,X.password=n,X.status={isAuthenticated:!0,requiresVerifiedPhone:!0,username:t},e.abrupt("return",{result:X.status});case 4:case"end":return e.stop()}}),e)}))),function(e,t){return z.apply(this,arguments)}),login:(Q=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t===X.username&&n===X.password){e.next=3;break}return X.status={isAuthenticated:!1},e.abrupt("return",{result:X.status});case 3:return X.status={isAuthenticated:!0,requiresVerifiedPhone:!0,username:t},e.abrupt("return",{result:X.status});case 5:case"end":return e.stop()}}),e)}))),function(e,t){return Q.apply(this,arguments)}),changeUsername:(J=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.username=t,X.status=Object.assign(Object.assign({},X.status),{},{username:t}),e.abrupt("return",{result:X.status});case 3:case"end":return e.stop()}}),e)}))),function(e){return J.apply(this,arguments)}),changePassword:(H=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.password=t,X.status=Object.assign(Object.assign({},X.status),{},{requiresPasswordReset:!1}),e.abrupt("return",{result:X.status});case 3:case"end":return e.stop()}}),e)}))),function(e){return H.apply(this,arguments)}),requestPhoneLoginCode:(K=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:X.phoneCode=""+Math.floor(1e5+899999*Math.random()),console.log("phoneCode",{phoneCode:X.phoneCode});case 2:case"end":return e.stop()}}),e)}))),function(e){return K.apply(this,arguments)}),loginWithPhoneCode:(W=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(X.phoneCode===n){e.next=2;break}throw new L("Invalid Login Code");case 2:return X.phone=t,X.status={isAuthenticated:!0,requiresPasswordReset:!0,username:X.username,phone:t},e.abrupt("return",{result:X.status});case 5:case"end":return e.stop()}}),e)}))),function(e,t){return W.apply(this,arguments)}),registerPhoneAndSendVerification:(U=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.phoneCode=""+Math.floor(1e5+899999*Math.random()),console.log("phoneCode",{phoneCode:X.phoneCode}),e.abrupt("return",{result:X.status});case 3:case"end":return e.stop()}}),e)}))),function(e){return U.apply(this,arguments)}),verifyPhone:(T=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(X.phoneCode===n){e.next=2;break}throw new L("Invalid Verification Code");case 2:return X.phone=t,X.status=Object.assign(Object.assign({},X.status),{},{phone:t,requiresVerifiedPhone:!1}),e.abrupt("return",{result:X.status});case 5:case"end":return e.stop()}}),e)}))),function(e,t){return T.apply(this,arguments)}),requestEmailLoginCode:(N=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:X.emailCode=""+Math.floor(1e5+899999*Math.random()),console.log("emailCode",{emailCode:X.emailCode});case 2:case"end":return e.stop()}}),e)}))),function(e){return N.apply(this,arguments)}),loginWithEmailCode:(M=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(X.emailCode===n){e.next=2;break}throw new L("Invalid Login Code");case 2:return X.email=t,X.status={isAuthenticated:!0,requiresPasswordReset:!0,username:X.username,email:t},e.abrupt("return",{result:X.status});case 5:case"end":return e.stop()}}),e)}))),function(e,t){return M.apply(this,arguments)}),registerEmailAndSendVerification:(q=I(a.a.mark((function e(t){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return X.emailCode=""+Math.floor(1e5+899999*Math.random()),console.log("emailCode",{emailCode:X.emailCode}),e.abrupt("return",{result:X.status});case 3:case"end":return e.stop()}}),e)}))),function(e){return q.apply(this,arguments)}),verifyEmail:(D=I(a.a.mark((function e(t,n){return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(X.emailCode===n){e.next=2;break}throw new L("Invalid Verification Code");case 2:return X.email=t,X.status=Object.assign(Object.assign({},X.status),{},{email:t,requiresVerifiedEmail:!1}),e.abrupt("return",{result:X.status});case 5:case"end":return e.stop()}}),e)}))),function(e,t){return D.apply(this,arguments)})},config:{minPasswordLength:8}}),$=function(){return u.a.createElement(s.a.View_Panel,null,u.a.createElement(Z.AuthenticationView,null))}}}]);
//# sourceMappingURL=14-890f1ba1dcf300aee1e1.js.map