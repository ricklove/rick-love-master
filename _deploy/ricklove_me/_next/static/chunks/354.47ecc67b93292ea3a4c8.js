"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[354],{9354:function(e,t,n){n.r(t),n.d(t,{LessonModuleNavigator:function(){return Q},LessonModulePlayer:function(){return q},LessonModulePlayerLoader:function(){return Z}});var o=n(1738),l=n(8281),a=n(5950);const{DiffComputer:s}=l,i=e=>{const t=e.map((e=>`${e.content}:${e.path}:${e.language}::`)).join("");return`${(0,a.un)(t)}`};var r=n(6135),c=n(796),d=(n(8541),n(7479),n(1134),n(6637));const u=d.iv`
  pre[class*='language-'],
  code[class*='language-'] {
    color: #d4d4d4;
    font-size: 13px;
    text-shadow: none;
    font-family: Menlo, Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', 'Courier New', monospace;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    line-height: 1.5;
    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;
    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  pre[class*='language-']::selection,
  code[class*='language-']::selection,
  pre[class*='language-'] *::selection,
  code[class*='language-'] *::selection {
    text-shadow: none;
    background: #75a7ca;
  }

  @media print {
    pre[class*='language-'],
    code[class*='language-'] {
      text-shadow: none;
    }
  }

  pre[class*='language-'] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    background: #1e1e1e;
  }

  :not(pre) > code[class*='language-'] {
    padding: 0.1em 0.3em;
    border-radius: 0.3em;
    color: #db4c69;
    background: #f9f2f4;
  }
  /*********************************************************
* Tokens
*/
  .namespace {
    opacity: 0.7;
  }

  .token.doctype .token.doctype-tag {
    color: #569cd6;
  }

  .token.doctype .token.name {
    color: #9cdcfe;
  }

  .token.comment,
  .token.prolog {
    color: #6a9955;
  }

  .token.punctuation,
  .language-html .language-css .token.punctuation,
  .language-html .language-javascript .token.punctuation {
    color: #d4d4d4;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.inserted,
  .token.unit {
    color: #b5cea8;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.deleted {
    color: #ce9178;
  }

  .language-css .token.string.url {
    text-decoration: underline;
  }

  .token.operator,
  .token.entity {
    color: #d4d4d4;
  }

  .token.operator.arrow {
    color: #569cd6;
  }

  .token.atrule {
    color: #ce9178;
  }

  .token.atrule .token.rule {
    color: #c586c0;
  }

  .token.atrule .token.url {
    color: #9cdcfe;
  }

  .token.atrule .token.url .token.function {
    color: #dcdcaa;
  }

  .token.atrule .token.url .token.punctuation {
    color: #d4d4d4;
  }

  .token.keyword {
    color: #569cd6;
  }

  .token.keyword.module,
  .token.keyword.control-flow {
    color: #c586c0;
  }

  .token.function,
  .token.function .token.maybe-class-name {
    color: #dcdcaa;
  }

  .token.regex {
    color: #d16969;
  }

  .token.important {
    color: #569cd6;
  }

  .token.italic {
    font-style: italic;
  }

  .token.constant {
    color: #9cdcfe;
  }

  .token.class-name,
  .token.maybe-class-name {
    color: #4ec9b0;
  }

  .token.console {
    color: #9cdcfe;
  }

  .token.parameter {
    color: #9cdcfe;
  }

  .token.interpolation {
    color: #9cdcfe;
  }

  .token.punctuation.interpolation-punctuation {
    color: #569cd6;
  }

  .token.boolean {
    color: #569cd6;
  }

  .token.property,
  .token.variable,
  .token.imports .token.maybe-class-name,
  .token.exports .token.maybe-class-name {
    color: #9cdcfe;
  }

  .token.selector {
    color: #d7ba7d;
  }

  .token.escape {
    color: #d7ba7d;
  }

  .token.tag {
    color: #569cd6;
  }

  .token.tag .token.punctuation {
    color: #808080;
  }

  .token.cdata {
    color: #808080;
  }

  .token.attr-name {
    color: #9cdcfe;
  }

  .token.attr-value,
  .token.attr-value .token.punctuation {
    color: #ce9178;
  }

  .token.attr-value .token.punctuation.attr-equals {
    color: #d4d4d4;
  }

  .token.entity {
    color: #569cd6;
  }

  .token.namespace {
    color: #4ec9b0;
  }
  /*********************************************************
* Language Specific
*/

  pre[class*='language-javascript'],
  code[class*='language-javascript'],
  pre[class*='language-jsx'],
  code[class*='language-jsx'],
  pre[class*='language-typescript'],
  code[class*='language-typescript'],
  pre[class*='language-tsx'],
  code[class*='language-tsx'] {
    color: #9cdcfe;
  }

  pre[class*='language-css'],
  code[class*='language-css'] {
    color: #ce9178;
  }

  pre[class*='language-html'],
  code[class*='language-html'] {
    color: #d4d4d4;
  }

  .language-regex .token.anchor {
    color: #dcdcaa;
  }

  .language-html .token.punctuation {
    color: #808080;
  }
  /*********************************************************
* Line highlighting
*/
  pre[data-line] {
    position: relative;
  }

  pre[class*='language-'] > code[class*='language-'] {
    position: relative;
    z-index: 1;
  }

  .line-highlight {
    position: absolute;
    left: 0;
    right: 0;
    padding: inherit 0;
    margin-top: 1em;
    background: #f7ebc6;
    box-shadow: inset 5px 0 0 #f7d87c;
    z-index: 0;
    pointer-events: none;
    line-height: inherit;
    white-space: pre;
  }
`,m=()=>o.createElement(d.xB,{styles:u}),g=(e,t,n)=>{const o=(e=>{const t=new a.pI(e,0,e.length).splitOnRegExp(/<[^>]*>/g).filter((e=>e.length>0)).map((e=>{const t=e.indexOf(">");if(t<0)return{raw:e,tag:e,code:e};const n=t-e.start+1;return{raw:e,tag:e.newRange(e.start,n),code:e.newRange(t+1,e.length-n)}})),n=[],o=t.map((e=>(e.tag.startsWith("</")?n.pop():e.tag.startsWith("<")&&n.push(e.tag),Object.assign(Object.assign({},e),{context:[...n]})))).map((e=>{const t=e.context.map((e=>{const t=e.splitOnRegExp(/class=('|")/g);if(t.length<=1)return{raw:e,cParts:t};const n=t[1].splitOnRegExp(/('|")/g),o=n[1].trimStart(['"',"'"]);return o?{raw:e,cParts:t,classContentParts:n,classContent:o.toText(),classes:o.toText().split(" ").filter((e=>e)).map((e=>e))}:{raw:e,cParts:t,classContentParts:n}}));return Object.assign(Object.assign({},e),{classInfos:t,classes:(0,a.EB)(t.flatMap((e=>{var t;return null!==(t=e.classes)&&void 0!==t?t:[]})))})})),l=o.map((e=>({code:e.code.toText().replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&"),classes:e.classes}))).filter((e=>e.code));return console.log("parseHighlightedSpans",{codeWithClasses:l,tagsWithClasses:o,summary:l.map((e=>`<span class='${e.classes.join(" ")}'>${e.code}</span>`)).join("")}),l})((0,c.highlight)(e,c.languages[t],t));let l=0;const s=o.map((t=>{const n={code:t.code,classes:t.classes,index:l,length:t.code.length,indexAfterEnd:l+t.code.length,_rawCode:e.substr(l,t.code.length)};return l+=t.code.length,n}));s.some((e=>e.code!==e._rawCode))&&console.error("getCodeParts FAILED",{codeParts:o,codePartsFailed:s.filter((e=>e.code!==e._rawCode))});const i=null!==n&&void 0!==n?n:{index:0,length:e.length},r=p(s.map((e=>Object.assign(Object.assign({},e),{isInSelection:!0,indexAfterEnd:e.index+e.length}))),i,((e,t)=>Object.assign(Object.assign({},e),{isInSelection:t})));console.log("getCodeParts",{codePartsAll:r,code:e,selection:n}),r.some((t=>t.code!==e.substr(t.index,t.length)))&&console.error("getCodeParts FAILED",{codeParts:o,codePartsFailed:s.filter((e=>e.code!==e._rawCode))});return{codeFocus:e.substr(i.index,i.length),codeParts:r,selection:n}},p=(e,t,n)=>{const o=Object.assign(Object.assign({},t),{indexAfterEnd:t.index+t.length}),l=[];for(const a of e){if(a.indexAfterEnd<o.index){l.push(n(a,!1));continue}if(a.index>o.indexAfterEnd){l.push(n(a,!1));continue}if(a.index>=o.index&&a.indexAfterEnd<=o.indexAfterEnd){l.push(n(a,!0));continue}const e=a.index<o.index,t=a.indexAfterEnd>o.indexAfterEnd,s=e?o.index-a.index:0,i=t?o.indexAfterEnd-a.index:a.length,r=a.code.substr(0,s),c=a.code.substr(s,i-s),d=a.code.substr(i,a.length-i);l.push(...[n(Object.assign(Object.assign({},a),{code:r,index:a.index,length:s}),!1),n(Object.assign(Object.assign({},a),{code:c,index:a.index+s,length:i-s}),!0),n(Object.assign(Object.assign({},a),{code:d,index:a.index+i,length:a.length-i}),!1)].filter((e=>e.length>0)))}return l},f=({codeParts:e,selection:t},n)=>{var o,l;if(!t||null==n||t.length===n.length)return null;const s=e.findIndex((e=>e.index>t.index+n.length)),i=s<0?e.length:s,r=null===(o=e[i-1])||void 0===o?void 0:o.code,c=null===(l=e[i-1])||void 0===l?void 0:l.index;if(!(null===r||void 0===r?void 0:r.trim()))return null;const d=n.length+t.index-c,u=r.substr(0,d),m=(0,a.EB)(e.filter((e=>{return!!u&&e.code.startsWith(u)||!u&&(t=e.code,n=r,!(!/^\d+$/g.test(t)||!/^\d+$/g.test(n))||!(!/^\w+$/g.test(t)||!/^\w+$/g.test(n))||!(!/^\W+$/g.test(t)||!/^\W+$/g.test(n)));var t,n})).map((e=>e.code)).filter((e=>e!==r)).filter((e=>!!e.trim()))),g=[r,...(0,a.TV)(m).slice(0,3)].map((e=>({textCompleted:e.substr(0,d),text:e.substr(d)})));return console.log("updateAutoComplete",{iDone:c,activePartText:r,codeFocusCompleted:n,codeParts:e,activePartTextCompleted:u,matchWords:m,choices:g}),{choices:(0,a.TV)(g).map(((e,t)=>Object.assign(Object.assign({},e),{isSelected:0===t,isWrong:!1}))),activeIndex:c}},h=({codeParts:e,language:t,inputOptions:n})=>{const l=(0,o.useMemo)((()=>{var e;return o.createElement(v,{isActive:null!==(e=null===n||void 0===n?void 0:n.isActive)&&void 0!==e&&e})}),[null===n||void 0===n?void 0:n.isActive]);return console.log("CodeDisplay",{inputOptions:n,codeParts:e}),o.createElement(r.G7,null,o.createElement(m,null),o.createElement("pre",{style:{margin:0,paddingBottom:n?100:0},className:`language-${t}`},o.createElement("code",{className:`language-${t}`},o.createElement(x,{key:"-1",code:{code:"\n",index:-1,indexAfterEnd:0,length:1,classes:[],isInSelection:!1},Cursor:l,inputOptions:null!==n&&void 0!==n?n:{}}),e.map((e=>o.createElement(x,{key:`${e.code}:${e.index}:${e.code.length}`,code:e,Cursor:l,inputOptions:null!==n&&void 0!==n?n:{}}))))))},x=({code:e,Cursor:t,inputOptions:n})=>{const{cursorIndex:l,activeIndex:a=n.cursorIndex,promptIndex:s}=n,i=!!(null!=l&&l>=e.index&&l<e.index+e.code.length),c=!!(null!=a&&a>=e.index&&a<e.index+e.code.length),d=!!(null!=s&&s>=e.index&&s<e.index+e.code.length);return o.createElement(o.Fragment,null,i&&t,c&&o.createElement(o.Fragment,null,o.createElement(b,{inputOptions:n})),d&&o.createElement(o.Fragment,null,o.createElement(k,{inputOptions:n})),!e.onPress&&o.createElement("span",{className:e.classes.join(" "),style:e.isInSelection?{}:{opacity:.5}},`${e.code}`),e.onPress&&o.createElement(r.Au,{style:{display:"inline"},onPress:()=>{var t;return null===(t=e.onPress)||void 0===t?void 0:t.call(e,e)}},o.createElement("span",{className:e.classes.join(" "),style:e.isInSelection?{}:{opacity:.5}},`${e.code}`)))},v=({isActive:e})=>{const[t,n]=(0,o.useState)(!0);return(0,o.useEffect)((()=>{const e=setInterval((()=>{n((e=>!e))}),500);return()=>{clearInterval(e)}}),[]),o.createElement("span",{style:{display:"inline-block",width:0,margin:0,position:"relative",left:-4,opacity:e?1:.5}},t?" ":"|")},E={wrapper:{display:"inline-block",position:"relative",top:4,width:0},inner:{display:"block",position:"absolute",zIndex:100,background:"#000000",border:"solid 1 #CCCCFF"},item:{display:"block",padding:4,color:"#FFFFFF"},item_selected:{display:"block",padding:4,color:"#CCCCFF",background:"#111133",minWidth:60},textCompleted:{color:"#CCCCFF",opacity:.5},textNew:{color:"#CCCCFF"}},b=({inputOptions:e})=>{const{autoComplete:t}=e;if(!t)return o.createElement(o.Fragment,null);const n=E;return console.log("AutoCompleteComponent",{autoComplete:t}),o.createElement(o.Fragment,null,o.createElement("span",{style:n.wrapper},o.createElement("span",{style:n.inner},t.map((t=>o.createElement(r.Au,{key:t.text,onPress:()=>{var n;null===(n=e.onAutocomplete)||void 0===n||n.call(e,t.text)}},o.createElement("span",{style:t.isSelected?n.item_selected:n.item},o.createElement("span",{style:n.textCompleted},t.isWrong?"\u274c ":"",t.textCompleted),o.createElement("span",{style:n.textNew},t.text))))))))},y={wrapper:{position:"relative",background:"#111111",margin:4,padding:4,marginLeft:20,borderRadius:4,border:"1px solid #555555",marginBottom:-16},text:{whiteSpace:"pre-wrap"},text_positive:{whiteSpace:"pre-wrap",color:"#88FF88"},text_negative:{whiteSpace:"pre-wrap",color:"#FF8888"},emoji:{position:"absolute",fontSize:20,left:-24,top:0}},k=({inputOptions:e})=>{const{prompt:t,feedback:n}=e,[l,a]=(0,o.useState)(!0);(0,o.useEffect)((()=>{var e;a(!1);const t=setTimeout((()=>{a(!0)}),null!==(e=null===n||void 0===n?void 0:n.timeoutMs)&&void 0!==e?e:3e3);return()=>{clearTimeout(t)}}),[n]);const s=n&&!l,i=y,r=s&&n?n.isNegative?i.text_negative:i.text_positive:i.text,c=s?n:t;return c?o.createElement(o.Fragment,null,o.createElement("div",{style:i.wrapper},o.createElement("div",{style:i.emoji},c.emoji),o.createElement("span",{style:r},c.message))):o.createElement(o.Fragment,null)},w="\ud83d\ude0e \ud83d\ude01 \ud83d\ude06 \ud83e\udd13 \ud83d\udc31\u200d\ud83c\udfcd \ud83d\udc31\u200d\ud83d\udc09 \ud83d\udc31\u200d\ud83d\ude80 \ud83d\udc31\u200d\ud83d\udc64".split(" "),F="\ud83d\ude25 \ud83d\ude2a \ud83d\ude2b \ud83d\ude1d \ud83d\ude32 \ud83d\ude40 \ud83d\ude3e \ud83d\ude3f".split(" "),C=({code:e,language:t,selection:n,onDone:l,lessonData:s})=>{var i;const[c,d]=(0,o.useState)(null),u=(0,o.useRef)(null);(0,o.useEffect)((()=>{const o=g(e,t,n);d(o),C(null);const l=setTimeout((()=>{var e;null===(e=u.current)||void 0===e||e.focus()}),250);return()=>{clearTimeout(l)}}),[e]);const[m,x]=(0,o.useState)(""),[v,E]=(0,o.useState)(!1),[b,y]=(0,o.useState)(null),[k,C]=(0,o.useState)(null);(0,o.useEffect)((()=>{const e=setTimeout((()=>{const e=null===c||void 0===c?void 0:c.codeFocus.substr(m.length).trim()[0];e&&y((t=>({message:`\u2b07 Type: ${e}`,emoji:"\ud83d\ude00",timestamp:Date.now(),timeoutMs:5e3})))}),5e3);return()=>{clearTimeout(e)}}),[c,m]);const S=e=>{var t,n;if(!c)return;const{codeFocus:o}=c,s=e.substr(m.length),i=e.length<m.length,r=e.endsWith("\t"),d=e.endsWith("\n"),g=e.endsWith("."),p=e.endsWith(" "),h=o.substr(m.length),v=h.trimStart()!==h,b=o.startsWith(e),S=k&&!b&&(r||d||g||p),j=null===k||void 0===k?void 0:k.choices.find((e=>e.isSelected)),T=b?e:S?m+(null!==(t=null===j||void 0===j?void 0:j.text)&&void 0!==t?t:""):(d||r||p)&&v?o.substr(0,o.length-h.trimStart().length):e,P=h.trimStart().startsWith(s),I=P?o.substr(0,o.length-h.trimStart().length+s.length):T,D=o.startsWith(I);if(console.log("changeInputText",{wasBackspace:i,wasTab:r,wasReturn:d,wasPeriod:g,wasSpace:p,wasCorrectRaw:b,wasAutoComplete:S,activeAutoComplete:j,value:I,value2:T,valueRaw:e,codeFocus:o,remaining:h,isWhitespace:v,wasCorrect:D,wasCorrect_ignoreWhitespace:P}),o===m)return void y({emoji:(0,a.TF)(w),message:"\u2714 You're already done.",timestamp:Date.now()});if(i)return void y({isNegative:!0,emoji:(0,a.TF)(F),message:"\u274c You're right so far, no need to backspace.",timestamp:Date.now()});if(!D){if(S&&j&&(j.isWrong=!0),!j){const e=f(c,m);C(e)}return void y({isNegative:!0,emoji:(0,a.TF)(F),message:`\u274c ${(0,a.TF)(["Wrong","Incorrect","No","Try Again"])}`,timestamp:Date.now()})}const O=o===I;O&&l(),E(!0),x(I),y(O?{emoji:(0,a.TF)(w),message:"\u2714",timestamp:Date.now()}:null);const _=f(c,I);C(_),null===(n=u.current)||void 0===n||n.focus()};if(!c||!e)return o.createElement(o.Fragment,null);const j=null!==n&&void 0!==n?n:{index:0,length:e.length},T=j.index+m.length,P=null!==(i=null===k||void 0===k?void 0:k.activeIndex)&&void 0!==i?i:T,I=e.lastIndexOf("\n",e.lastIndexOf("\n",j.index)-1),D=((e,t,n)=>{const o=p(e,t,((e,t)=>Object.assign(Object.assign({},e),{isIncomplete:t})));return(null===n||void 0===n?void 0:n.showBlank)?o.map((e=>Object.assign(Object.assign({},e),{code:e.isIncomplete?e.code.replace(/./g," "):e.code}))):o.filter((e=>!e.isIncomplete))})(c.codeParts,{index:T,length:c.codeFocus.length-m.length},{showBlank:!0}),O=e.substr(T,1),_={emoji:"\ud83d\udc68\u200d\ud83d\udcbb",message:s.task,timestamp:Date.now()};return console.log("CodeEditor_TypeSelection",{nextChar:O,inputText:m,codeParts:c,activeCodeParts:D,isActive:v,cursorIndex:T,activeIndex:P,feedback:b,autoComplete:null===k||void 0===k?void 0:k.choices}),o.createElement(o.Fragment,null,o.createElement(r.Au,{onPress:()=>{var e;return null===(e=u.current)||void 0===e?void 0:e.focus()}},o.createElement(r.G7,{style:{position:"relative"}},o.createElement(r.G7,null,o.createElement(h,{codeParts:D,language:t,inputOptions:{isActive:v,cursorIndex:T,activeIndex:P,promptIndex:I,feedback:null!==b&&void 0!==b?b:void 0,prompt:null!==_&&void 0!==_?_:void 0,autoComplete:null===k||void 0===k?void 0:k.choices,onAutocomplete:e=>{if(!k)return;k.choices.forEach((e=>{e.isSelected=!1}));const t=k.choices.find((t=>t.text===e));t&&(t.isSelected=!0,S(m+e))}}})),o.createElement(r.G7,{style:{position:"absolute",top:0,left:0,right:0,bottom:0,opacity:0}},o.createElement("textarea",{style:{width:"100%",height:"100%",background:"#FF0000"},value:m,onChange:e=>S(e.target.value),onFocus:()=>E(!0),onBlur:()=>E(!1),onKeyDown:e=>(e=>9===e.keyCode?(e.preventDefault(),e.stopPropagation(),S(`${m}\t`),!1):13===e.keyCode?(e.preventDefault(),e.stopPropagation(),S(`${m}\n`),!1):(38===e.keyCode&&C((e=>{if(!e)return null;const t=e.choices.findIndex((e=>e.isSelected)),n=Math.max(0,t-1);return Object.assign(Object.assign({},e),{choices:[...e.choices.map(((e,t)=>Object.assign(Object.assign({},e),{isSelected:n===t})))]})})),40===e.keyCode&&C((e=>{if(!e)return null;const t=e.choices.findIndex((e=>e.isSelected)),n=Math.min(e.choices.length-1,t+1);return Object.assign(Object.assign({},e),{choices:[...e.choices.map(((e,t)=>Object.assign(Object.assign({},e),{isSelected:n===t})))]})})),!0))(e),ref:u})))))},S=({code:e,language:t,selection:n,onDone:l,lessonData:s})=>{const[i,c]=(0,o.useState)(null),[d,u]=(0,o.useState)(null),[m,p]=(0,o.useState)(null),[f,x]=(0,o.useState)(null);(0,o.useEffect)((()=>{var o;const l=g(e,t,n);c(l);const a=s.descriptions.map((e=>{let t=e;return l.codeParts.filter((e=>e.isInSelection)).map((e=>e.code.trim())).filter((e=>!!e)).forEach((e=>{t=t.replace(` ${e} `," ___ ")})),console.log("LessonFileContentEditor_UnderstandCode - create fill in blank",{parts:l,d:t,x:e}),{textWithBlanks:t,textWithoutBlanks:e}}));u(a),p(null!==(o=a[0])&&void 0!==o?o:null)}),[e]);const v=e=>{var t;if(!m||!d)return;const n=m.textWithBlanks.indexOf("___"),o=m.textWithBlanks.replace("___",e.code.trim()),s=o.startsWith(m.textWithoutBlanks.substr(0,n+e.length));if(console.log("onPressCodePart",{part:e,iBlank:n,withoutBlank:o,isCorrect:s,fillInBlank:m}),s){if(x({emoji:(0,a.TF)(w),message:`${o}\r\n\r\n\u2714`,timestamp:Date.now(),timeoutMs:1e3}),!o.includes("___")){const e=d.filter((e=>e.textWithoutBlanks!==m.textWithoutBlanks));return u(e),p(null!==(t=e[0])&&void 0!==t?t:null),void(e.length<=0&&l())}p({textWithoutBlanks:m.textWithoutBlanks,textWithBlanks:o})}else x({isNegative:!0,emoji:(0,a.TF)(F),message:`\u274c ${(0,a.TF)(["Wrong","Incorrect","No","Try Again"])}`,timestamp:Date.now()})};if(!i)return o.createElement(o.Fragment,null);const E=null!==n&&void 0!==n?n:{index:0,length:e.length},b=e.lastIndexOf("\n",e.lastIndexOf("\n",E.index)-1),y=i.codeParts.map((e=>Object.assign(Object.assign({},e),{onPress:v}))),k={emoji:m?"\ud83e\udd14":(0,a.TF)(w),message:m?`${m.textWithBlanks}\r\n\r\n\ud83d\udd0e Select the correct word below`:`${s.descriptions.map((e=>`\u2705 ${e}`)).join("\r\n")}`,timestamp:Date.now()};return console.log("LessonFileContentEditor_UnderstandCode render",{fillInBlank:m,activePrompt:k}),o.createElement(o.Fragment,null,o.createElement(r.G7,{style:{position:"relative"}},o.createElement(r.G7,null,o.createElement(h,{codeParts:y,language:t,inputOptions:{prompt:k,promptIndex:b,feedback:null!==f&&void 0!==f?f:void 0}}))))},j={mainView:{flexDirection:"row",flexWrap:"wrap",alignItems:"center"},mainView_column:{flexDirection:"column"},tabView:{flexDirection:"row",alignItems:"center",background:"#1e1e1e",padding:4,marginRight:1},tabView_selected:{flexDirection:"row",alignItems:"center",background:"#292a2d",padding:4,marginRight:1},tabText:{fontSize:14},tabText_selected:{fontSize:14,color:"#FFFF88"},headerTabView:{flexDirection:"row",alignItems:"center",padding:4,marginRight:1},headerTabText:{fontSize:14},moveButtonView:{minWidth:24,justifyContents:"center",alignItems:"center"}},T=({items:e,onChange:t,getLabel:n,getKey:l,selected:a,onSelect:s,onCreateNewItem:i,header:r,style:c})=>{if(!t)return o.createElement(P,{items:e,getLabel:n,getKey:l,selected:a,onSelect:s,header:r,style:c});return o.createElement(P,{items:e,getLabel:n,getKey:l,selected:a,onSelect:s,onMove:(n,o,l)=>{if(l<0||l>e.length-1)return;const a=[...e];a.splice(o,1),a.splice(l,0,n),t(a)},onAdd:()=>{const n=i();t([...e,n]),s(n)},onDelete:()=>{const n=[...e.filter((e=>e!==a))];t(n),n.length>0&&s(n[0])},header:r,style:c})},P=({items:e,getLabel:t,getKey:n,selected:l,onSelect:a,onMove:s,onAdd:i,onDelete:c,header:d,style:u})=>{const[m,g]=(0,o.useState)("row");return o.createElement(r.G7,{style:"row"===m?j.mainView:j.mainView_column},!!d&&o.createElement(r.Au,{onPress:()=>g((e=>"row"===e?"column":"row"))},o.createElement(r.G7,{style:j.headerTabView},o.createElement(r.xv,{style:j.tabText},""+("row"===m?"\u2194 ":"\u2195 ")),o.createElement(r.xv,{style:j.headerTabText},`${d}`))),e.map(((i,c)=>o.createElement(r.G7,{key:n(i,c),style:i===l?j.tabView_selected:j.tabView},"column"===m&&s&&o.createElement(o.Fragment,null,o.createElement(r.Au,{onPress:()=>s(i,c,c-1)},o.createElement(r.G7,{style:j.moveButtonView},o.createElement(r.xv,{style:j.tabText},""+(c<=0?" ":"\u2b06")))),o.createElement(r.Au,{onPress:()=>s(i,c,c+1)},o.createElement(r.G7,{style:j.moveButtonView},o.createElement(r.xv,{style:j.tabText},""+(c>=e.length-1?" ":"\u2b07"))))),o.createElement(r.Au,{style:{flex:1},onPress:()=>a(i)},o.createElement(r.G7,null,o.createElement(r.xv,{style:i===l?Object.assign(Object.assign({},j.tabText_selected),null===u||void 0===u?void 0:u.selectedTabText):Object.assign({},j.tabText)},`${t(i)}`)))))),o.createElement(r.G7,{style:{flex:1,flexDirection:"row"}},i&&o.createElement(o.Fragment,null,o.createElement(r.Au,{onPress:()=>i()},o.createElement(r.G7,{style:j.tabView},o.createElement(r.xv,{style:j.tabText},"\u2795 Add")))),o.createElement(r.G7,{style:{flex:1}}),c&&o.createElement(r.Au,{onPress:()=>c()},o.createElement(r.G7,{style:j.tabView},o.createElement(r.xv,{style:j.tabText},"\u274c Delete")))))},I=({projectData:e,projectEditorMode:t,fileEditorMode_focus:n,fileEditorMode_noFocus:l,onProjectDataChange:a=(()=>{}),onTaskDone:s=(()=>{}),lessonData:r})=>{var c,d;const{projectState:u,focus:m}=e,[g,p]=(0,o.useState)(m.filePath),f=(0,o.useRef)(null);(0,o.useEffect)((()=>{var e,t,n,o,l;const s=u.files.find((e=>e.path===m.filePath));if(u.files.length>0&&(!s||m.length<=0||m.index>=(null!==(e=null===s||void 0===s?void 0:s.content.length)&&void 0!==e?e:0))&&f.current!==m){const e=null!==(t=u.files.find((e=>e.path===m.filePath)))&&void 0!==t?t:u.files[0],n={filePath:e.path,index:0,length:e.content.length};return f.current=n,void a({focus:n})}const i=null!==(l=null!==(n=null===s||void 0===s?void 0:s.path)&&void 0!==n?n:null===(o=u.files[0])||void 0===o?void 0:o.path)&&void 0!==l?l:void 0;p(i)}),[u,m]);console.log("ProjectCodeEditor",{activeFilePath:g,focus:m,projectState:u});const h=null!==(d=null!==(c=u.files.find((e=>e.path===g)))&&void 0!==c?c:u.files[0])&&void 0!==d?d:void 0;return o.createElement(o.Fragment,null,o.createElement(T,{header:"Files",items:u.files,onChange:"edit"!==t?void 0:e=>a({projectState:{files:e,filesHashCode:i(e)}}),getKey:e=>e.path,getLabel:e=>m.filePath===e.path?`\ud83d\udcdd ${e.path}`:e.path,selected:h,onSelect:e=>p(e.path),onCreateNewItem:()=>{let e="new.ts",t=1;for(;u.files.some((t=>t.path===e));)e=`new${t}.ts`,t++;return{path:e,content:"",language:"tsx"}}}),h&&o.createElement(D,{key:h.path,projectEditorMode:t,file:h,selection:m.filePath===h.path?m:void 0,fileEditorMode:m.filePath===h.path?n:l,onChange:e=>{const t=u.files.map((t=>t.path===e.path?e:t));a({projectState:{files:t,filesHashCode:i(t)}})},onSelectionChange:e=>{const t=u.files.find((e=>e.path===g));if(!t)return;console.log("changeSelection",Object.assign({},e));const n=t;a({focus:Object.assign({filePath:n.path},e)})},onTaskDone:s,lessonData:r}))},D=({projectEditorMode:e,fileEditorMode:t,file:n,onChange:l,selection:a,onSelectionChange:s,onTaskDone:i,lessonData:c})=>{const[d,u]=(0,o.useState)(n.path);return o.createElement(o.Fragment,null,"edit"===e&&o.createElement(r.G7,{style:{flexDirection:"row"}},o.createElement(r.oi,{style:{padding:4,fontSize:12,color:"#FFFFFF",background:"#000000"},value:d,onChange:u,onBlur:()=>{n.path=d,l(Object.assign(Object.assign({},n),{path:d}))},autoCompleteType:"off",keyboardType:"default"})),o.createElement(O,{file:n,onCodeChange:e=>l(Object.assign(Object.assign({},n),{content:e})),mode:t,selection:a,onSelectionChange:s,onTaskDone:i,lessonData:c}))},O=({file:e,selection:t,mode:n,onCodeChange:l,onSelectionChange:a,onTaskDone:s,lessonData:i})=>o.createElement(r.G7,{style:{}},o.createElement(r.G7,{style:{padding:0}},"display"===n&&o.createElement(_,{code:e.content,language:e.language,selection:t}),"edit"===n&&o.createElement($,{code:e.content,language:e.language,selection:t,onCodeChange:l,onSelectionChange:a}),"construct-code"===n&&o.createElement(C,{code:e.content,language:e.language,selection:t,onDone:s,lessonData:i}),"understand-code"===n&&o.createElement(S,{code:e.content,language:e.language,selection:t,onDone:s,lessonData:i}))),_=({code:e,language:t,selection:n})=>{const l=g(e,t,n);return o.createElement(h,{codeParts:l.codeParts,language:t})},$=({code:e,language:t,selection:n,onCodeChange:l,onSelectionChange:a})=>{const[s,i]=(0,o.useState)(e),[c,d]=(0,o.useState)(null);return(0,o.useEffect)((()=>{const o=g(e,t,n);d(o)}),[e,n]),o.createElement(r.G7,null,o.createElement(r.G7,{style:{}},o.createElement(r.oi,{style:{padding:4,fontSize:12,color:"#FFFFFF",background:"#000000"},value:s,onChange:o=>{i(o);const l=g(e,t,n);d(l)},onBlur:()=>{i(s);const o=g(e,t,n);d(o),l(s)},autoCompleteType:"off",keyboardType:"default",multiline:!0,numberOfLines:16,onSelectionChange:e=>a({index:e.start,length:e.end-e.start})})),o.createElement(r.G7,null,c&&o.createElement(h,{codeParts:c.codeParts,language:t})))};var V=n(6766),G=n(3880);const A={container:{},iFrame:{width:"100%",height:300,border:"solid 4px #888888",background:"#FFFFFF"}},M=e=>{const t=(0,o.useRef)(null),n=(0,o.useRef)(""),l=(0,o.useRef)(""),a=(0,o.useRef)(setInterval((()=>{}),1e5)),s=e=>{var o,a;if(t.current)try{const s=4,i=t.current.clientWidth-2*s+"px",r=`${(null!==(a=null===(o=e.contentWindow)||void 0===o?void 0:o.document.body.scrollHeight)&&void 0!==a?a:300)+2*s}px`;r===l.current&&i===n.current||(n.current=i,l.current=r,e.style.width=i,e.style.height=r,e.style.border=`solid ${s}px #888888`)}catch(s){}};return(0,o.useEffect)((()=>(l.current="",clearInterval(a.current),a.current=setInterval((()=>{}),1e5),()=>{clearInterval(a.current)})),[e.iFrameUrl]),o.createElement(o.Fragment,null,o.createElement("div",{style:A.container,ref:t},o.createElement("iframe",{style:A.iFrame,src:e.iFrameUrl,title:"Preview",onLoad:e=>{var t;t=e.target,s(t),clearInterval(a.current),a.current=setInterval((()=>s(t)),100)}})))},W=({projectState:e,setProjectState:t})=>{const{loading:n,error:l,doWork:a}=(0,G.VL)(),[s,i]=(0,o.useState)(null);return(0,o.useEffect)((()=>{a((async n=>{const o=await t(e);n(),i(o.iFrameUrl)}))}),[e]),o.createElement(o.Fragment,null,o.createElement(V.C.Loading,{loading:n}),!n&&s&&o.createElement(M,{iFrameUrl:s}))},R={sectionHeaderText:{margin:8,fontSize:18,color:"#FFFF88",whiteSpace:"pre-wrap"},sectionHeader2Text:{margin:8,fontSize:16,color:"#FFFF88",whiteSpace:"pre-wrap"},infoText:{margin:8,fontSize:12,whiteSpace:"pre-wrap"},buttonView:{margin:8,padding:4,border:"solid 1px #888888"},buttonText:{color:"#88FF88"}},L=({data:e,onDone:t,setProjectState:n})=>{const[l,a]=(0,o.useState)(!1);return o.createElement(o.Fragment,null,o.createElement(r.xv,{style:R.sectionHeaderText},`${e.title} - Preview the Result ${l?"\u2705":"\ud83d\udd33"}`),o.createElement(r.G7,{style:{flexDirection:"row",alignItems:"center"}},o.createElement(r.xv,{style:R.infoText},"\ud83d\udd0e Preview the result below"),o.createElement(r.G7,{style:{flex:1}}),t&&o.createElement(r.Au,{onPress:()=>null===t||void 0===t?void 0:t()},o.createElement(r.G7,{style:R.buttonView},o.createElement(r.xv,{style:R.buttonText},"Done")))),o.createElement(r.xv,{style:R.sectionHeader2Text},"Preview"),o.createElement(W,{projectState:e.projectState,setProjectState:n}),o.createElement(r.xv,{style:R.sectionHeader2Text},"Code"),o.createElement(I,{projectData:{projectState:e.projectState,focus:e.focus},fileEditorMode_focus:"display",fileEditorMode_noFocus:"display",projectEditorMode:"display",onTaskDone:()=>{a(!0),null===t||void 0===t||t()},lessonData:e}))},B=({data:e,onDone:t})=>{const[n,l]=(0,o.useState)(!1);return o.createElement(o.Fragment,null,o.createElement(r.xv,{style:R.sectionHeaderText},`${e.title} - Construct the Code ${n?"\u2705":"\ud83d\udd33"}`),o.createElement(r.xv,{style:R.infoText},`\ud83c\udfaf ${e.objective}`),o.createElement(r.xv,{style:R.infoText},`\ud83d\udca1 ${e.explanation}`),o.createElement(r.xv,{style:R.infoText},`${n?"\u2705":"\ud83d\udd33"} ${e.task}`),o.createElement(I,{projectData:{projectState:e.projectState,focus:e.focus},fileEditorMode_focus:"construct-code",fileEditorMode_noFocus:"display",projectEditorMode:"display",onTaskDone:()=>{l(!0),null===t||void 0===t||t()},lessonData:e}))},z=({data:e,onDone:t})=>{const[n,l]=(0,o.useState)(!1);return o.createElement(o.Fragment,null,o.createElement(r.xv,{style:R.sectionHeaderText},`${e.title} - Understand the Code ${n?"\u2705":"\ud83d\udd33"}`),o.createElement(r.G7,{style:{flexDirection:"row",alignItems:"center"}},o.createElement(r.xv,{style:R.infoText},"\ud83d\udd0e Preview the result below"),o.createElement(r.G7,{style:{flex:1}}),n&&o.createElement(r.Au,{onPress:()=>null===t||void 0===t?void 0:t()},o.createElement(r.G7,{style:R.buttonView},o.createElement(r.xv,{style:R.buttonText},"Done")))),o.createElement(I,{projectData:{projectState:e.projectState,focus:e.focus},fileEditorMode_focus:"understand-code",fileEditorMode_noFocus:"display",projectEditorMode:"display",onTaskDone:()=>l(!0),lessonData:e}))},N={instructionsText:{marginLeft:16,fontSize:16,color:"#88FF88"},experimentView:{padding:16,justifyContent:"flex-start"},experimentItemRow:{flexDirection:"row",alignItems:"center"},experimentItemView:{padding:4},experimentItemView_active:{padding:4,border:"solid 1px #FFFF88",borderLeft:"solid 4px #FFFF88"},experimentItemText:{color:"#FFFF88",whiteSpace:"pre-wrap"}},H=({data:e,onDone:t,setProjectState:n})=>{const[l,a]=(0,o.useState)(e.projectState),[s,c]=(0,o.useState)(null),[d,u]=(0,o.useState)(e.focus),m=t=>{if(c(t),!t)return a(e.projectState),void u(e.focus);a((n=>((e,t)=>{const n=e.files.map((e=>{const n=Object.assign({},e);return t.filter((t=>t.selection.filePath===e.path)).sort(((e,t)=>-(e.selection.index-t.selection.index))).forEach((e=>{n.content=`${n.content.substr(0,e.selection.index)}${e.content}${n.content.substr(e.selection.index+e.selection.length)}`})),n}));return{files:n,filesHashCode:i(n)}})(e.projectState,t.replacements)));const n=t.replacements.filter((t=>t.selection.filePath===e.focus.filePath)),o=Math.min(...n.map((e=>e.selection.index))),l=Math.max(...n.map((e=>e.selection.index+e.selection.length))),s=n.map((e=>-e.selection.length+e.content.length)),r=s.reduce(((e,t)=>e+=t),0);console.log("LessonView_ExperimentCode",{minIndex:o,maxEndIndex:l,lengthDeltas:s,lengthDelta:r,focusReplacements:n}),u(Object.assign(Object.assign({},e.focus),{index:o,length:l-o+r}))};return(0,o.useEffect)((()=>{m(null)}),[e.projectState]),o.createElement(o.Fragment,null,o.createElement(r.xv,{style:R.sectionHeaderText},`${e.title} - Experiment with the Code`),o.createElement(r.xv,{style:N.instructionsText},"Select an experiment below and view the result"),o.createElement(r.G7,{style:N.experimentView},o.createElement(r.Au,{onPress:()=>m(null)},o.createElement(r.G7,{style:N.experimentItemRow},o.createElement(r.G7,{style:R.buttonView},o.createElement(r.xv,{style:R.buttonText},"View")),o.createElement(r.G7,{style:null===s?N.experimentItemView_active:N.experimentItemView},o.createElement(r.xv,{style:N.experimentItemText},"Completed Code")))),e.experiments.map(((e,t)=>{var n;return o.createElement(r.Au,{key:`${t}`,onPress:()=>m(e)},o.createElement(r.G7,{style:N.experimentItemRow},o.createElement(r.G7,{style:R.buttonView},o.createElement(r.xv,{style:R.buttonText},"View")),o.createElement(r.G7,{style:e===s?N.experimentItemView_active:N.experimentItemView},o.createElement(r.xv,{style:N.experimentItemText},`\ud83d\udd2c ${null!==(n=e.comment)&&void 0!==n?n:`Experiment ${t}`}`))))})),t&&o.createElement(r.Au,{onPress:()=>null===t||void 0===t?void 0:t()},o.createElement(r.G7,{style:N.experimentItemRow},o.createElement(r.G7,{style:R.buttonView},o.createElement(r.xv,{style:R.buttonText},"Done")),o.createElement(r.G7,{style:N.experimentItemView},o.createElement(r.xv,{style:N.experimentItemText},"\u25b6 Go to next step"))))),o.createElement(I,{key:l.filesHashCode,projectData:{projectState:l,focus:d},fileEditorMode_focus:"display",fileEditorMode_noFocus:"display",projectEditorMode:"display",onTaskDone:()=>{},lessonData:e}),o.createElement(W,{projectState:l,setProjectState:n}))};var U=n(7612);const K={container:{background:"#111111"},containerPanel:{background:"#292a2d"},editorModeTabRowView:{flexDirection:"row",paddingLeft:16},editorModeTabView:{background:"#1e1e1e",alignSelf:"flex-start",padding:8,marginRight:1},editorModeTabView_selected:{background:"#292a2d",alignSelf:"flex-start",padding:8,marginRight:1},editorModeTabText:{fontSize:14,color:"#FFFFFFF"},editorModeTabText_selected:{fontSize:14,color:"#FFFF88"},buttonView:{background:"#1e1e1e",alignSelf:"flex-start",padding:8,margin:1},buttonText:{fontSize:14,color:"#FFFFFFF"},sectionHeaderText:{margin:8,fontSize:18,color:"#FFFF88"},infoView:{},infoText:{margin:8,fontSize:12,wrap:"wrap"},lessonFieldView:{flexDirection:"row"},lessonFieldLabelText:{minWidth:80,padding:4,fontSize:12},lessonFieldText:{flex:1,padding:4,fontSize:12,wrap:"wrap"},jsonText:{padding:4,fontSize:12,color:"#FFFFFF",background:"#000000"}},Y=e=>{var t;const n=e.lessons.flatMap(((e,t)=>[{kind:"lesson",lesson:e,label:`${t+1}. ${e.title}`},{kind:"preview",lesson:e,label:"  \ud83d\udd0e Preview the Result"},{kind:"construct",lesson:e,label:"  \ud83d\udcdd Construct the Code"},{kind:"understand",lesson:e,label:"  \ud83d\udca1 Understand the Code"},{kind:"experiment",lesson:e,label:"  \ud83d\udd2c Experiment with the Code"}])),o=e.lessons[e.lessons.length-1];if(o){const e=o.projectState.files.find((e=>e.path===o.focus.filePath));n.unshift({kind:"preview",lesson:Object.assign(Object.assign({},o),{key:"lesson-",focus:Object.assign(Object.assign({},o.focus),{index:0,length:null!==(t=null===e||void 0===e?void 0:e.content.length)&&void 0!==t?t:0})}),label:"\ud83c\udfaf Lesson Objective"})}return n.map((e=>Object.assign(Object.assign({},e),{key:e.lesson.key+e.kind})))},q=e=>{const[t,n]=(0,o.useState)(Y(e.module)),[l,a]=(0,o.useState)(null);(0,o.useEffect)((()=>{const t=Y(e.module);n(t),s({items:t,useTimeout:!1})}),[e.module]);const s=e=>{var n,o,s,i;const r=null!==(n=null===e||void 0===e?void 0:e.items)&&void 0!==n?n:t,c=null!==(o=null===e||void 0===e?void 0:e.activeItem)&&void 0!==o?o:l;if(!r)return;const d=r.filter((e=>"lesson"!==e.kind)),u=d.findIndex((e=>e.key===(null===c||void 0===c?void 0:c.key))),m=r.findIndex((e=>e.key===(null===c||void 0===c?void 0:c.key))),g=null!==(i=null!==(s=u>=0?d[u+1]:null)&&void 0!==s?s:m>=0?r[m+1]:null)&&void 0!==i?i:r[0];(null===e||void 0===e?void 0:e.useTimeout)?setTimeout((()=>{a(g)}),1e3):a(g)};return o.createElement(o.Fragment,null,o.createElement(r.G7,{style:K.container},t&&o.createElement(Q,{items:t,activeItem:null!==l&&void 0!==l?l:void 0,onChange:e=>{"lesson"===e.kind?s({items:t,activeItem:e,useTimeout:!1}):a(e)}},o.createElement(r.G7,{key:null===l||void 0===l?void 0:l.key},"preview"===(null===l||void 0===l?void 0:l.kind)&&o.createElement(L,{data:l.lesson,setProjectState:e.setProjectState,onDone:s}),"construct"===(null===l||void 0===l?void 0:l.kind)&&o.createElement(B,{data:l.lesson,onDone:s}),"understand"===(null===l||void 0===l?void 0:l.kind)&&o.createElement(z,{data:l.lesson,onDone:s}),"experiment"===(null===l||void 0===l?void 0:l.kind)&&o.createElement(H,{data:l.lesson,setProjectState:e.setProjectState,onDone:s})),o.createElement("div",null,o.createElement("h3",{style:{borderTop:"solid 1px #3ca4ff",padding:8,margin:0,marginTop:16,textAlign:"center"}},"Community Comments - ",e.module.title),o.createElement(U.H,{repo:"ricklove/ricklove-code-lesson-comments"})))))},J={outerContainer:{flexDirection:"row"},contentContainer:{flex:1,overflow:"auto"},container:{flexDirection:"column"},itemsContainer:{background:"#333333"},itemView_header:{flexDirection:"row",alignItems:"center",background:"#333333",padding:4,marginRight:1},itemView:{flexDirection:"row",alignItems:"center",background:"#1e1e1e",padding:4,marginRight:1},itemView_selected:{flexDirection:"row",alignItems:"center",background:"#292a2d",padding:4,marginRight:1},itemText:{fontSize:14},itemText_selected:{fontSize:14,color:"#FFFF88"}},Q=e=>{const{items:t,activeItem:n}=e,l=(0,o.useRef)(!1),[a,s]=(0,o.useState)(!0),[i,c]=(0,o.useState)(!1);(0,o.useEffect)((()=>{i&&s(!1)}),[i]),(0,o.useEffect)((()=>{var t,o;if(null===n||void 0===n?void 0:n.key){if(!l.current){l.current=!0;const t=window.location.hash.substr(1),n=e.items.find((e=>e.key===t));if(console.log("LessonModuleNavigator load",{hash:t,matchItem:n}),n)return void e.onChange(n)}window.history.replaceState(null,null!==(t=null===n||void 0===n?void 0:n.label)&&void 0!==t?t:"",`#${null!==(o=null===n||void 0===n?void 0:n.key)&&void 0!==o?o:""}`)}}),[n]);return!a&&n?o.createElement(o.Fragment,null,o.createElement(r.Au,{onPress:()=>s((()=>!0))},o.createElement(r.G7,{style:J.itemView_header},o.createElement(r.xv,{style:J.itemText_selected},"\ud83e\udded Lesson Navigation")),o.createElement(r.G7,{style:J.itemsContainer},o.createElement(r.G7,{style:J.itemView_selected},o.createElement(r.xv,{style:J.itemText_selected},`\u27a1 ${n.label}`)))),e.children):o.createElement(o.Fragment,null,o.createElement("div",{onLoad:e=>{var t;t=e.target.clientWidth,c(t<600)}},o.createElement(r.G7,{style:J.outerContainer},o.createElement(r.G7,{style:J.container},o.createElement(r.Au,{onPress:()=>s((()=>!1))},o.createElement(r.G7,{style:J.itemView_header},o.createElement(r.xv,{style:J.itemText_selected},"\ud83e\udded Lesson Navigation"))),o.createElement(r.G7,{style:J.itemsContainer},t.map((t=>o.createElement(r.Au,{key:t.key,onPress:()=>{var o;(i&&s((()=>!1)),t.key!==(null===n||void 0===n?void 0:n.key))&&(o=t,e.onChange(o))}},o.createElement(r.G7,{style:t.key===(null===n||void 0===n?void 0:n.key)?J.itemView_selected:J.itemView},o.createElement(r.xv,{style:t.key===(null===n||void 0===n?void 0:n.key)?J.itemText_selected:J.itemText},`${t.key===(null===n||void 0===n?void 0:n.key)?"\u27a1 ":""}${t.label}`))))))),o.createElement(r.G7,{style:J.contentContainer},e.children))))},X={container:{background:"#111111"},containerPanel:{background:"#292a2d"},buttonView:{background:"#1e1e1e",alignSelf:"flex-start",padding:8,margin:1},buttonText:{fontSize:14,color:"#FFFFFFF"}},Z=e=>{const{loading:t,error:n,doWork:l}=(0,G.VL)(),[a,s]=(0,o.useState)(null);(0,o.useEffect)((()=>{l((async t=>{const n=await(await fetch(e.lesson.lessonJsonUrl)).json();t(),s(n)}))}),[e.lesson]);return o.createElement(o.Fragment,null,o.createElement(r.G7,{style:X.container},o.createElement(V.C.Loading,{loading:t}),o.createElement(V.C.ErrorBox,{error:n}),a&&o.createElement(q,{module:a,setProjectState:async t=>({iFrameUrl:`${e.lesson.lessonBuildRootUrl}/index.html?filesHashCode=${t.filesHashCode}`})})))}}}]);