(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[27],{ZJU3:function(e,t,n){"use strict";n.r(t),n.d(t,"StripeExamplePage",(function(){return u})),n.d(t,"TestControls",(function(){return i}));var r=n("ERkP"),l=n.n(r),a=n("gptL"),o=n("PQcI"),c=n("QZUc"),u=function(e){var t,n=Object(o.a)({stripePublicKey:"spkey_12345"}),u=Object(c.b)({clientSecret:"I like pizza",customerBillingDetails:{phone:"987-555-1234"}}),d=null!==(t=n.AppWrapperComponent)&&void 0!==t?t:function(e){var t=e.children;return l.a.createElement(l.a.Fragment,null,t)},m=Object(r.useState)({textPadding:4,elementPadding:4,buttonAlignment:"right",borderRadius:4,borderColor:a.c.colors.border,backgroundColor:a.c.colors.background_field,textColor:a.c.colors.text}),s=m[0],g=m[1];return l.a.createElement(d,null,l.a.createElement("div",{style:{padding:16,background:a.c.colors.background,color:a.c.colors.text}},l.a.createElement("div",null,"Page and Stuff..."),l.a.createElement("hr",null),l.a.createElement("div",null,"Show me the Money!"),l.a.createElement("div",null," ",l.a.createElement(n.PaymentMethodEntryComponent,{style:s,paymentMethodSetupToken:u,onPaymentMethodReady:function(e){console.log("onPaymentMethodReady",e)}})," ")),l.a.createElement(i,{key:"STATIC",style:s,onChangeStyle:g}))},i=function(e){var t=e.style,n=e.onChangeStyle,a=Object(r.useState)(JSON.stringify(t,null,2)),o=a[0],c=a[1],u=Object(r.useState)(null),i=u[0],d=u[1];return l.a.createElement("div",null,l.a.createElement("div",null,"Test Controls"),l.a.createElement("div",null,"Style"),l.a.createElement("div",null,l.a.createElement("textarea",{value:o,onChange:function(e){return c(e.target.value)}})),l.a.createElement("button",{type:"button",onClick:function(e){e.preventDefault(),function(){try{i&&d(null);var e=JSON.parse(o);n(e)}catch(t){d({message:"style error",error:t})}}()}},"Set Style"),l.a.createElement("pre",null,"\nPaymentComponentStyle = {\n    borderColor?: string;\n    backgroundColor?: string;\n    textColor?: string;\n    textColor_invalid?: string;\n    fontSize?: number;\n    fontFamily?: string;\n\n    textPadding?: number;\n    elementPadding?: number;\n    buttonAlignment?: 'left' | 'right' | 'center';\n\n    // Content\n    buttonText?: string;\n}\n                "),i&&l.a.createElement("div",{style:{color:"#FFCCCC"}},l.a.createElement("span",null,i.message),l.a.createElement("pre",null,JSON.stringify(i.error,null,2))))}}}]);
//# sourceMappingURL=27-ed5cf6daf1206cf3564f.js.map