(window.__LOADABLE_LOADED_CHUNKS__=window.__LOADABLE_LOADED_CHUNKS__||[]).push([[24],{H84F:function(t,n,e){"use strict";e.r(n),e.d(n,"art_gpu_01",(function(){return u}));var o=e("eVsZ"),r=e.n(o),i=e("la2L"),a="/content/art/artwork/gpu-01/gpu-01",u={key:"gpu-01",title:"Gpu Example 01",description:"2015 - http://patriciogonzalezvivo.com\n\nThis is included as a great example of a gpu shader.\n    \nFrom: https://thebookofshaders.com/13/",artist:"@patriciogv",getTokenDescription:function(t){return null},renderArt:function(t,n){void 0===n&&(n="This is my hash!");Object(i.a)(n).random;var e=null;return new r.a((function(t){t.preload=function(){e=t.loadShader(a+".vert",a+".frag")},t.setup=function(){t.createCanvas(600,600,t.WEBGL),t.noStroke()},t.draw=function(){e&&(e.setUniform("u_resolution",[600,600]),e.setUniform("u_time",t.millis()/1e3),e.setUniform("u_mouse",[t.mouseX,t.map(t.mouseY,0,600,600,0)]),t.shader(e),t.rect(0,0,600,600))}}),t)}}}}]);
//# sourceMappingURL=24-04d2fde910ce0ae22328.js.map