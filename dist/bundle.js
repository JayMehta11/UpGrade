!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports["ees-client-lib"]=e():t["ees-client-lib"]=e()}(window,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=4)}([function(t,e,r){"use strict";r.r(e),r.d(e,"__extends",(function(){return o})),r.d(e,"__assign",(function(){return i})),r.d(e,"__rest",(function(){return a})),r.d(e,"__decorate",(function(){return u})),r.d(e,"__param",(function(){return s})),r.d(e,"__metadata",(function(){return f})),r.d(e,"__awaiter",(function(){return c})),r.d(e,"__generator",(function(){return l})),r.d(e,"__exportStar",(function(){return d})),r.d(e,"__values",(function(){return p})),r.d(e,"__read",(function(){return h})),r.d(e,"__spread",(function(){return y})),r.d(e,"__spreadArrays",(function(){return b})),r.d(e,"__await",(function(){return m})),r.d(e,"__asyncGenerator",(function(){return w})),r.d(e,"__asyncDelegator",(function(){return g})),r.d(e,"__asyncValues",(function(){return v})),r.d(e,"__makeTemplateObject",(function(){return _})),r.d(e,"__importStar",(function(){return O})),r.d(e,"__importDefault",(function(){return x}));
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};function o(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}var i=function(){return(i=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function a(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(t,n[o])&&(r[n[o]]=t[n[o]])}return r}function u(t,e,r,n){var o,i=arguments.length,a=i<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,r,n);else for(var u=t.length-1;u>=0;u--)(o=t[u])&&(a=(i<3?o(a):i>3?o(e,r,a):o(e,r))||a);return i>3&&a&&Object.defineProperty(e,r,a),a}function s(t,e){return function(r,n){e(r,n,t)}}function f(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function c(t,e,r,n){return new(r||(r=Promise))((function(o,i){function a(t){try{s(n.next(t))}catch(t){i(t)}}function u(t){try{s(n.throw(t))}catch(t){i(t)}}function s(t){t.done?o(t.value):new r((function(e){e(t.value)})).then(a,u)}s((n=n.apply(t,e||[])).next())}))}function l(t,e){var r,n,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,n=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}}function d(t,e){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}function p(t){var e="function"==typeof Symbol&&t[Symbol.iterator],r=0;return e?e.call(t):{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}}}function h(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,i=r.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(n=i.next()).done;)a.push(n.value)}catch(t){o={error:t}}finally{try{n&&!n.done&&(r=i.return)&&r.call(i)}finally{if(o)throw o.error}}return a}function y(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(h(arguments[e]));return t}function b(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<r;e++)for(var i=arguments[e],a=0,u=i.length;a<u;a++,o++)n[o]=i[a];return n}function m(t){return this instanceof m?(this.v=t,this):new m(t)}function w(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),i=[];return n={},a("next"),a("throw"),a("return"),n[Symbol.asyncIterator]=function(){return this},n;function a(t){o[t]&&(n[t]=function(e){return new Promise((function(r,n){i.push([t,e,r,n])>1||u(t,e)}))})}function u(t,e){try{(r=o[t](e)).value instanceof m?Promise.resolve(r.value.v).then(s,f):c(i[0][2],r)}catch(t){c(i[0][3],t)}var r}function s(t){u("next",t)}function f(t){u("throw",t)}function c(t,e){t(e),i.shift(),i.length&&u(i[0][0],i[0][1])}}function g(t){var e,r;return e={},n("next"),n("throw",(function(t){throw t})),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:m(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function v(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t=p(t),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise((function(n,o){(function(t,e,r,n){Promise.resolve(n).then((function(e){t({value:e,done:r})}),e)})(n,o,(e=t[r](e)).done,e.value)}))}}}function _(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function O(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function x(t){return t&&t.__esModule?t:{default:t}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class n{static setConfigData(t,e){n.commonConfig={hostURL:e,userId:t,api:{init:`${e}/api/init`,getAllExperimentConditions:`${e}/api/assign`,markExperimentPoint:`${e}/api/mark`,setGroupMemberShip:`${e}/api/groupmembership`,setWorkingGroup:`${e}/api/workinggroup`}}}static setData(t,e){n[t]=e}static getData(t){return n[t]}}e.default=n,n.commonConfig={hostURL:null,userId:null,api:{getAllExperimentConditions:null,markExperimentPoint:null,setGroupMemberShip:null,setWorkingGroup:null}},n.experimentConditionData=null,n.group=null,n.workingGroup=null},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(6);e.default=function(t,e){return n.__awaiter(this,void 0,void 0,(function*(){return yield function t(e,r,i,a){return n.__awaiter(this,void 0,void 0,(function*(){try{const t=yield o(e,{body:JSON.stringify(r),method:"POST",headers:{"Content-Type":"application/json"}});return{status:!0,data:yield t.json()}}catch(n){return++i===a?{status:!1,message:n}:yield t(e,r,i,a)}}))}(t,e,0,5)}))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){if(t instanceof Map){const e={};for(const r of t)e[r[0]]=r[1];return e}throw new Error("Invalid input type")}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=r(5);e.init=n.default;var o=r(8);e.setGroupMembership=o.default;var i=r(9);e.setWorkingGroup=i.default;var a=r(10);e.getExperimentCondition=a.default;var u=r(11);e.getAllExperimentConditions=u.default;var s=r(12);e.markExperimentPoint=s.default;var f=r(13);e.failedExperimentPoint=f.default},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=r(2),a=r(3);e.default=function(t,e,r){return n.__awaiter(this,void 0,void 0,(function*(){try{let n=!0,u=!0;if(o.default.setConfigData(t,e),r&&r.group&&(n=r.group instanceof Map,!n))throw new Error("Group type should be Map<string, Array<string>>");if(r&&r.workingGroup&&(u=r.workingGroup instanceof Map,!u))throw new Error("Working group type should be Map<string, string>");if(u&&n){let e={id:t};if(r&&r.group){const t=a.default(r.group);e=Object.assign(Object.assign({},e),{group:t}),o.default.setData("group",r.group)}if(r&&r.workingGroup){const t=a.default(r.group);e=Object.assign(Object.assign({},e),{workingGroup:t}),o.default.setData("workingGroup",r.workingGroup)}o.default.setData("experimentConditionData",null);const n=o.default.getData("commonConfig").api.init,u=yield i.default(n,e);if(u.status)return{id:t,group:r.group,workingGroup:r.workingGroup};throw new Error(u.message)}}catch(t){throw new Error(t)}}))}},function(t,e,r){r(7),t.exports=self.fetch.bind(self)},function(t,e,r){"use strict";r.r(e),r.d(e,"Headers",(function(){return p})),r.d(e,"Request",(function(){return v})),r.d(e,"Response",(function(){return O})),r.d(e,"DOMException",(function(){return E})),r.d(e,"fetch",(function(){return P}));var n="URLSearchParams"in self,o="Symbol"in self&&"iterator"in Symbol,i="FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(t){return!1}}(),a="FormData"in self,u="ArrayBuffer"in self;if(u)var s=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],f=ArrayBuffer.isView||function(t){return t&&s.indexOf(Object.prototype.toString.call(t))>-1};function c(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function l(t){return"string"!=typeof t&&(t=String(t)),t}function d(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return o&&(e[Symbol.iterator]=function(){return e}),e}function p(t){this.map={},t instanceof p?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function h(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function y(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function b(t){var e=new FileReader,r=y(e);return e.readAsArrayBuffer(t),r}function m(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function w(){return this.bodyUsed=!1,this._initBody=function(t){var e;this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:i&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:a&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:n&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():u&&i&&((e=t)&&DataView.prototype.isPrototypeOf(e))?(this._bodyArrayBuffer=m(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):u&&(ArrayBuffer.prototype.isPrototypeOf(t)||f(t))?this._bodyArrayBuffer=m(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):n&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},i&&(this.blob=function(){var t=h(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?h(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(b)}),this.text=function(){var t,e,r,n=h(this);if(n)return n;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=y(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a&&(this.formData=function(){return this.text().then(_)}),this.json=function(){return this.text().then(JSON.parse)},this}p.prototype.append=function(t,e){t=c(t),e=l(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},p.prototype.delete=function(t){delete this.map[c(t)]},p.prototype.get=function(t){return t=c(t),this.has(t)?this.map[t]:null},p.prototype.has=function(t){return this.map.hasOwnProperty(c(t))},p.prototype.set=function(t,e){this.map[c(t)]=l(e)},p.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},p.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),d(t)},p.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),d(t)},p.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),d(t)},o&&(p.prototype[Symbol.iterator]=p.prototype.entries);var g=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function v(t,e){var r,n,o=(e=e||{}).body;if(t instanceof v){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new p(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new p(e.headers)),this.method=(r=e.method||this.method||"GET",n=r.toUpperCase(),g.indexOf(n)>-1?n:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(o)}function _(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function O(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new p(e.headers),this.url=e.url||"",this._initBody(t)}v.prototype.clone=function(){return new v(this,{body:this._bodyInit})},w.call(v.prototype),w.call(O.prototype),O.prototype.clone=function(){return new O(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new p(this.headers),url:this.url})},O.error=function(){var t=new O(null,{status:0,statusText:""});return t.type="error",t};var x=[301,302,303,307,308];O.redirect=function(t,e){if(-1===x.indexOf(e))throw new RangeError("Invalid status code");return new O(null,{status:e,headers:{location:t}})};var E=self.DOMException;try{new E}catch(t){(E=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack}).prototype=Object.create(Error.prototype),E.prototype.constructor=E}function P(t,e){return new Promise((function(r,n){var o=new v(t,e);if(o.signal&&o.signal.aborted)return n(new E("Aborted","AbortError"));var a=new XMLHttpRequest;function u(){a.abort()}a.onload=function(){var t,e,n={status:a.status,statusText:a.statusText,headers:(t=a.getAllResponseHeaders()||"",e=new p,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}})),e)};n.url="responseURL"in a?a.responseURL:n.headers.get("X-Request-URL");var o="response"in a?a.response:a.responseText;r(new O(o,n))},a.onerror=function(){n(new TypeError("Network request failed"))},a.ontimeout=function(){n(new TypeError("Network request failed"))},a.onabort=function(){n(new E("Aborted","AbortError"))},a.open(o.method,o.url,!0),"include"===o.credentials?a.withCredentials=!0:"omit"===o.credentials&&(a.withCredentials=!1),"responseType"in a&&i&&(a.responseType="blob"),o.headers.forEach((function(t,e){a.setRequestHeader(e,t)})),o.signal&&(o.signal.addEventListener("abort",u),a.onreadystatechange=function(){4===a.readyState&&o.signal.removeEventListener("abort",u)}),a.send(void 0===o._bodyInit?null:o._bodyInit)}))}P.polyfill=!0,self.fetch||(self.fetch=P,self.Headers=p,self.Request=v,self.Response=O)},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=r(2),a=r(3);e.default=function(t){return n.__awaiter(this,void 0,void 0,(function*(){try{if(!(t instanceof Map))throw new Error("Group type should be Map<string, Array<string>>");const e=o.default.getData("commonConfig"),r=e.api.setGroupMemberShip,n=e.userId,u=a.default(t),s=yield i.default(r,{id:n,group:u});if(s.status){const e=o.default.getData("workingGroup");return{id:n,group:t,workingGroup:e}}throw new Error(s.message)}catch(t){throw new Error(t)}}))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=r(2),a=r(3);e.default=function(t){return n.__awaiter(this,void 0,void 0,(function*(){try{if(!(t instanceof Map))throw new Error("Working group type should be Map<string, string>");const e=o.default.getData("commonConfig"),r=e.api.setWorkingGroup,n=e.userId,u=a.default(t),s=yield i.default(r,{id:n,workingGroup:u});if(s.status){return{id:n,group:o.default.getData("group"),workingGroup:t}}throw new Error(s.message)}catch(t){throw new Error(t)}}))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(1);e.default=function(t,e){try{const r=n.default.getData("experimentConditionData");if(r){const n=r.filter(r=>e?r.name===e&&r.point===t:r.point===t&&!r.name);return n.length?n[0]:null}return null}catch(t){throw new Error(t)}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=r(2);e.default=function(){return n.__awaiter(this,void 0,void 0,(function*(){try{const t=o.default.getData("commonConfig"),e=t.api.getAllExperimentConditions,r=t.userId,n=yield i.default(e,{userId:r});if(o.default.setData("experimentConditionData",n.data?n.data:[]),n.status)return n.data;throw new Error(n.message)}catch(t){throw new Error(t)}}))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const n=r(0),o=r(1),i=r(2);e.default=function(t,e){return n.__awaiter(this,void 0,void 0,(function*(){try{const r=o.default.getData("commonConfig"),n=r.api.markExperimentPoint,a=r.userId;let u={experimentPoint:t,userId:a};e&&(u=Object.assign(Object.assign({},u),{partitionId:e}));const s=yield i.default(n,u);if(s.status)return{userId:a,experimentId:e,experimentPoint:t};throw new Error(s.message)}catch(t){throw new Error(t)}}))}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t,e,r){return{status:!0}}}])}));