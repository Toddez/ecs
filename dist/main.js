!function(t){var e={};function n(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,s){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(s,i,function(e){return t[e]}.bind(null,i));return s},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);class s{constructor(t,e){this.updateTimeStep=1/t,this.renderTimeStep=1/e,this.updateTime=(new Date).getTime()/1e3,this.renderTime=(new Date).getTime()/1e3,this.startTime=(new Date).getTime()/1e3,this.updates=0,this.frames=0}getTime(){return(new Date).getTime()/1e3-this.startTime}start(){this.onStart&&this.onStart(),window.requestAnimationFrame(()=>{this.tick()})}tick(){const t=(new Date).getTime()/1e3,e=t-this.updateTime,n=t-this.renderTime;e>=this.updateTimeStep&&this.onUpdate&&(this.onUpdate(e),this.updates+=1,this.updateTime=t),n>=this.renderTimeStep&&this.onRender&&(this.onRender(n),this.frames+=1,this.renderTime=t),window.requestAnimationFrame(()=>{this.tick()})}}class i{constructor(t,e){this.x=t,this.y=e}static mulM3(t,e){const n=e[0]*t.x+e[1]*t.y,s=e[3]*t.x+e[4]*t.y;return new i(n,s)}}class r{constructor(t,e,n){this.x=t,this.y=e,this.z=n}}class o{constructor(t,e,n){o.canvases.push(this),this.id=t,this.dimensions=e,this.parent=n,this.margin=new i(0,0),this.createElements(),this.setupWebGL(),this.setup2d(),this.setDimensions(),o.setupInput(this.canvasGl),o.setupInput(this.canvas2d)}createElements(){let t=window.document.body;this.parent&&(t=document.getElementById(this.parent)),this.canvasGl=document.createElement("canvas"),this.canvasGl.id=`${this.id}-gl`,this.canvasGl.style="position: absolute;",t.append(this.canvasGl),this.canvas2d=document.createElement("canvas"),this.canvas2d.id=`${this.id}-2d`,this.canvas2d.style="position: absolute;",t.append(this.canvas2d)}setupWebGL(){this.gl=this.canvasGl.getContext("webgl2",{antialias:!1});this.gl.getExtension("EXT_color_buffer_float")}setup2d(){this.context2d=this.canvas2d.getContext("2d")}setBackground(t){this.background=t}setDimensions(t){t&&(this.dimensions=t),this.canvasGl.width=this.dimensions.x-this.margin.x,this.canvasGl.height=this.dimensions.y-this.margin.y,this.canvas2d.width=this.dimensions.x-this.margin.x,this.canvas2d.height=this.dimensions.y-this.margin.y}setMargin(t){this.margin=t,this.setDimensions()}fullscreen(t){if(this.isFullscreen||(this.originalDimensions=this.dimensions),this.isFullscreen=t,!0===this.isFullscreen){const{body:t}=document,e=document.documentElement,n=Math.max(t.scrollHeight,t.offsetHeight,e.clientHeight,e.offsetHeight);this.dimensions=new i(document.body.clientWidth,n)}else this.originalDimensions&&(this.dimensions=this.originalDimensions);this.setDimensions()}static setupInput(t){t.onmousemove=function(e){const n=t.getBoundingClientRect();o.mousePos=new i(e.clientX-n.left,e.clientY-n.top),o.firstMouseMove&&(o.lastMousePos=o.mousePos,o.firstMouseMove=!1)},t.onmousedown=function(){o.mouseDown=!0},t.onmouseup=function(){o.mouseDown=!1},t.addEventListener("wheel",function(t){o.scrollTotal=new i(o.scrollTotal.x+t.deltaX,o.scrollTotal.y+t.deltaY)},!1)}static setupMouse(){o.mouseDown=!1,o.mousePos=new i(0,0),o.lastMousePos=new i(0,0),o.firstMouseMove=!0}static setupScroll(){o.scrollTotal=new i(0,0),o.lastScroll=new i(0,0)}static setupKeys(){o.keys={},window.addEventListener("keydown",t=>{const e=o.keys[t.which];e&&(e.down=!0,e.onDown&&e.onDown())}),window.addEventListener("keyup",t=>{const e=o.keys[t.which];e&&(e.down=!1,e.onUp&&e.onUp())})}static registerKey(t,e,n){o.keys[t]={down:!1,onDown:e,onUp:n}}static getKeyDown(t){return!!o.keys[t]&&o.keys[t].down}static mouseDelta(){const t=new i(o.mousePos.x-o.lastMousePos.x,o.mousePos.y-o.lastMousePos.y);return o.lastMousePos=o.mousePos,t}static scrollDelta(){const t=new i(o.scrollTotal.x-o.lastScroll.x,o.scrollTotal.y-o.lastScroll.y);return o.lastScroll=o.scrollTotal,t}static windowResizeCallback(){if(o.canvases)for(let t=0;t<o.canvases.length;t+=1)o.canvases[t].isFullscreen&&o.canvases[t].fullscreen(!0)}}o.canvases=[],window.addEventListener("load",()=>{window.addEventListener("resize",o.windowResizeCallback),o.setupMouse(),o.setupKeys(),o.setupScroll()});class a{static identity(t){return t?[t,0,0,0,0,t,0,0,0,0,t,0,0,0,0,t]:a.identity(1)}static translation(t){const e=a.identity(1);return e[12]=t.x,e[13]=t.y,e[14]=t.z,e}static rotation(t,e){const n=a.identity(1),s=t*(Math.PI/180),i=Math.cos(s),r=Math.sin(s),o=1-i,{x:c}=e,{y:l}=e,{z:h}=e;return n[0]=c*o+i,n[1]=l*c*o+h*r,n[2]=l*h*o-l*r,n[4]=c*l*o-h*r,n[5]=l*o+i,n[6]=l*h*o+c*r,n[8]=c*h*o+l*r,n[9]=l*h*o-c*r,n[10]=h*o+i,n}static scaling(t){const e=a.identity(1);return e[0]=t.x,e[5]=t.y,e[10]=t.z,e}static multiply(t,e){const n=new Array(16);for(let s=0;s<4;s+=1)for(let i=0;i<4;i+=1){n[s+4*i]=0;for(let r=0;r<4;r+=1)n[s+4*i]+=t[s+4*r]*e[r+4*i]}return n}static multiplyVector(t,e){return new r(t[0]*e.x+t[4]*e.y+t[8]*e.z+t[12],t[1]*e.x+t[5]*e.y+t[9]*e.z+t[13],t[2]*e.x+t[6]*e.y+t[10]*e.z+t[14])}static projection(t,e,n,s){const i=Math.tan(.5*t*Math.PI/180);return[.5/i,0,0,0,0,.5*e/i,0,0,0,0,-(s+n)/(s-n),-1,0,0,-2*s*n/(s-n),0]}}class c{constructor(t,e,n,s){this.children=[],this.position=t||new r(0,0,0),this.rotation=e||new r(0,0,0),this.scale=n||new r(1,1,1),this.shader=s,this.shaderData={positions:[0],indices:[0]}}}class l{constructor(){this.matrices=[]}push(t){t&&this.matrices.push(t)}pop(t){const e=t||1;for(let t=0;t<e;t+=1)this.matrices.pop()}eval(){let t=a.identity();for(let e=0;e<this.matrices.length;e+=1)t=a.multiply(t,this.matrices[e]);return t}}class h{constructor(){this.transformStack=new l,this.children=[]}render(){this.transformStack=new l;for(let t=0;t<this.children.length;t+=1)this.recursive(this.children[t])}recursive(t){if(this.transformStack.push(a.translation(t.position)),this.transformStack.push(a.rotation(t.rotation.x,new r(1,0,0))),this.transformStack.push(a.rotation(t.rotation.y,new r(0,1,0))),this.transformStack.push(a.rotation(t.rotation.z,new r(0,0,1))),this.transformStack.push(a.scaling(t.scale)),t.shader){const e=this.transformStack.eval(),n=[];for(let s=0;s<t.shaderData.positions.length;s+=1){let i=0;i=s%3==0?a.multiplyVector(e,new r(t.shaderData.positions[s],t.shaderData.positions[s+1],t.shaderData.positions[s+2])).x:s%3==1?a.multiplyVector(e,new r(t.shaderData.positions[s-1],t.shaderData.positions[s],t.shaderData.positions[s+1])).y:a.multiplyVector(e,new r(t.shaderData.positions[s-2],t.shaderData.positions[s-1],t.shaderData.positions[s])).z,n.push(i)}let s={};(s=Object.assign(s,t.shaderData)).positions=n,t.shader.data.push(s)}else console.warn("No shader defined for entity");for(let e=0;e<t.children.length;e+=1)this.recursive(t.children[e]);this.transformStack.pop(3)}}class d{constructor(t,e,n,s){this.id=t,this.vertex=e,this.fragment=n,this.render=s,this.compiled=!1,this.data=[],this.program=null}static init(t){d.canvas=t,d.gl=t.gl}static create(t,e,n,s){const i=new d(t,e,n,s);d.addShader(t,i)}compile(t){const e=t.createShader(t.VERTEX_SHADER);if(t.shaderSource(e,this.vertex),t.compileShader(e),!t.getShaderParameter(e,t.COMPILE_STATUS))return console.error("Vertex shader error",t.getShaderInfoLog(e)),t.deleteShader(e),null;const n=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(n,this.fragment),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))return console.error("Fragment shader error",t.getShaderInfoLog(n)),t.deleteShader(n),null;const s=t.createProgram();t.attachShader(s,e),t.attachShader(s,n),t.linkProgram(s),t.getProgramParameter(s,t.LINK_STATUS)||console.error("Failed to init shader program",t.getProgramInfoLog(s)),this.program=s,this.compiled=!0}static addShader(t,e){d.shaderStack||(d.shaderStack=[]),d.shaderStack.push(e)}static getShader(t){for(let e=0;e<d.shaderStack.length;e+=1){const n=d.shaderStack[e];if(n.id===t)return n}}static render(){const{gl:t}=d;t.viewport(0,0,d.canvas.dimensions.x-d.canvas.margin.x,d.canvas.dimensions.y-d.canvas.margin.y),t.clearColor(0,0,0,1),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT);for(const e of d.shaderStack)e.compiled||e.compile(t),e.render?e.render(t,e.program,e.data):console.warn("No render method defined for shader"),e.data=[]}}d.create("pbr","\n\tattribute vec3 aVertexPosition;\n\tattribute vec3 aVertexNormal;\n\tattribute vec2 aTextureCoord;\n\n\tuniform mat4 uModelViewMatrix;\n\tuniform mat4 uProjectionMatrix;\n\n\tvarying highp vec2 vTextureCoord;\n\tvarying highp vec3 vLighting;\n\n\tvoid main(void) {\n\t\tgl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);\n\t\tvTextureCoord = aTextureCoord;\n\n\t\thighp vec3 ambientLight = vec3(0.3, 0.3, 0.3);\n\t\thighp vec3 directionalLightColor = vec3(1, 1, 1);\n\t\thighp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));\n\t\thighp vec4 transformedNormal = vec4(aVertexNormal, 1.0);\n\t\thighp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);\n\t\tvLighting = ambientLight + (directionalLightColor * directional);\n\t}\n","\n\tvarying highp vec2 vTextureCoord;\n\tvarying highp vec3 vLighting;\n\n\tvoid main(void) {;\n\t\tgl_FragColor = vec4(vec3(vTextureCoord.x, vTextureCoord.y, 1.0).xyz * vLighting, 1.0);\n\t}\n",function(t,e,n){const s=t.getAttribLocation(e,"aVertexPosition"),i=t.getAttribLocation(e,"aVertexNormal"),r=t.getAttribLocation(e,"aTextureCoord"),o=t.getUniformLocation(e,"uModelViewMatrix"),c=t.getUniformLocation(e,"uProjectionMatrix");let l=[],h=[],u=[],m=[],p=0;for(let t=0;t<n.length;t+=1){const{indices:e}=n[t],{positions:s}=n[t],{textureCoordinates:i}=n[t],{vertexNormals:r}=n[t],o=[];for(let t=0;t<e.length;t+=1)o[t]=e[t]+p;l=l.concat(o),h=h.concat(s),u=u.concat(i),m=m.concat(r),p+=h.length/3}const f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,new Float32Array(h),t.STATIC_DRAW);const g=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,g),t.bufferData(t.ARRAY_BUFFER,new Float32Array(u),t.STATIC_DRAW);const v=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,v),t.bufferData(t.ARRAY_BUFFER,new Float32Array(m),t.STATIC_DRAW);const w=t.createBuffer();t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,w),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(l),t.STATIC_DRAW);{const e=3,n=t.FLOAT,i=!1,r=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,f),t.vertexAttribPointer(s,e,n,i,r,o),t.enableVertexAttribArray(s)}{const e=2,n=t.FLOAT,s=!1,i=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,g),t.vertexAttribPointer(r,e,n,s,i,o),t.enableVertexAttribArray(r)}{const e=3,n=t.FLOAT,s=!1,r=0,o=0;t.bindBuffer(t.ARRAY_BUFFER,v),t.vertexAttribPointer(i,e,n,s,r,o),t.enableVertexAttribArray(i)}t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,w),t.useProgram(e);const y=a.projection(45,(d.canvas.dimensions.x-d.canvas.margin.x)/(d.canvas.dimensions.y-d.canvas.margin.y),.1,100);t.uniformMatrix4fv(c,!1,y);const x=a.identity(1);t.uniformMatrix4fv(o,!1,x),t.drawElements(t.TRIANGLES,l.length,t.UNSIGNED_SHORT,0)});class u extends c{constructor(t,e,n){super(t,e,n,d.getShader("pbr"));this.shaderData={positions:[-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1],indices:[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23],textureCoordinates:[0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0,1],vertexNormals:[0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0]}}}window.addEventListener("load",()=>{const t=new s(60,60),e=new o("main",new i(500,500)),n=new h;let a,c;d.init(e),t.onStart=(()=>{e.fullscreen(!0),a=new u(new r(0,0,-5),new r(0,0,0),new r(1,1,1)),n.children.push(a),c=new u(new r(0,2,0),new r(0,0,0),new r(.2,2,.2)),a.children.push(c)}),t.onRender=(t=>{a.rotation.x+=2*t,a.rotation.y+=10*t,a.rotation.z+=5*t,c.rotation.y+=50*t,n.render(),d.render()}),t.onUpdate=(()=>{}),t.start()})}]);