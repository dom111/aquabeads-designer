(()=>{var O=(a,n,t)=>{if(!n.has(a))throw TypeError("Cannot "+t)};var m=(a,n,t)=>(O(a,n,"read from private field"),t?t.call(a):n.get(a)),f=(a,n,t)=>{if(n.has(a))throw TypeError("Cannot add the same private member more than once");n instanceof WeakSet?n.add(a):n.set(a,t)},c=(a,n,t,e)=>(O(a,n,"write to private field"),e?e.call(a,t):n.set(a,t),t);var s;(function(a){a.Attribute="attribute",a.Pseudo="pseudo",a.PseudoElement="pseudo-element",a.Tag="tag",a.Universal="universal",a.Adjacent="adjacent",a.Child="child",a.Descendant="descendant",a.Parent="parent",a.Sibling="sibling",a.ColumnCombinator="column-combinator"})(s||(s={}));var p;(function(a){a.Any="any",a.Element="element",a.End="end",a.Equals="equals",a.Exists="exists",a.Hyphen="hyphen",a.Not="not",a.Start="start"})(p||(p={}));var V=/^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/,I=/\\([\da-f]{1,6}\s?|(\s)|.)/gi,tt=new Map([[126,p.Element],[94,p.Start],[36,p.End],[42,p.Any],[33,p.Not],[124,p.Hyphen]]),nt=new Set(["has","not","matches","is","where","host","host-context"]);function J(a){switch(a.type){case s.Adjacent:case s.Child:case s.Descendant:case s.Parent:case s.Sibling:case s.ColumnCombinator:return!0;default:return!1}}var at=new Set(["contains","icontains"]);function et(a,n,t){let e=parseInt(n,16)-65536;return e!==e||t?n:e<0?String.fromCharCode(e+65536):String.fromCharCode(e>>10|55296,e&1023|56320)}function v(a){return a.replace(I,et)}function T(a){return a===39||a===34}function G(a){return a===32||a===9||a===10||a===12||a===13}function $(a){let n=[],t=K(n,`${a}`,0);if(t<a.length)throw new Error(`Unmatched selector: ${a.slice(t)}`);return n}function K(a,n,t){let e=[];function o(h){let i=n.slice(t+h).match(V);if(!i)throw new Error(`Expected name, found ${n.slice(t)}`);let[u]=i;return t+=h+u.length,v(u)}function r(h){for(t+=h;t<n.length&&G(n.charCodeAt(t));)t++}function l(){t+=1;let h=t,i=1;for(;i>0&&t<n.length;t++)n.charCodeAt(t)===40&&!w(t)?i++:n.charCodeAt(t)===41&&!w(t)&&i--;if(i)throw new Error("Parenthesis not matched");return v(n.slice(h,t-1))}function w(h){let i=0;for(;n.charCodeAt(--h)===92;)i++;return(i&1)===1}function S(){if(e.length>0&&J(e[e.length-1]))throw new Error("Did not expect successive traversals.")}function E(h){if(e.length>0&&e[e.length-1].type===s.Descendant){e[e.length-1].type=h;return}S(),e.push({type:h})}function Q(h,i){e.push({type:s.Attribute,name:h,action:i,value:o(1),namespace:null,ignoreCase:"quirks"})}function _(){if(e.length&&e[e.length-1].type===s.Descendant&&e.pop(),e.length===0)throw new Error("Empty sub-selector");a.push(e)}if(r(0),n.length===t)return t;t:for(;t<n.length;){let h=n.charCodeAt(t);switch(h){case 32:case 9:case 10:case 12:case 13:{(e.length===0||e[0].type!==s.Descendant)&&(S(),e.push({type:s.Descendant})),r(1);break}case 62:{E(s.Child),r(1);break}case 60:{E(s.Parent),r(1);break}case 126:{E(s.Sibling),r(1);break}case 43:{E(s.Adjacent),r(1);break}case 46:{Q("class",p.Element);break}case 35:{Q("id",p.Equals);break}case 91:{r(1);let i,u=null;n.charCodeAt(t)===124?i=o(1):n.startsWith("*|",t)?(u="*",i=o(2)):(i=o(0),n.charCodeAt(t)===124&&n.charCodeAt(t+1)!==61&&(u=i,i=o(1))),r(0);let d=p.Exists,z=tt.get(n.charCodeAt(t));if(z){if(d=z,n.charCodeAt(t+1)!==61)throw new Error("Expected `=`");r(2)}else n.charCodeAt(t)===61&&(d=p.Equals,r(1));let N="",H=null;if(d!=="exists"){if(T(n.charCodeAt(t))){let D=n.charCodeAt(t),C=t+1;for(;C<n.length&&(n.charCodeAt(C)!==D||w(C));)C+=1;if(n.charCodeAt(C)!==D)throw new Error("Attribute value didn't end");N=v(n.slice(t+1,C)),t=C+1}else{let D=t;for(;t<n.length&&(!G(n.charCodeAt(t))&&n.charCodeAt(t)!==93||w(t));)t+=1;N=v(n.slice(D,t))}r(0);let B=n.charCodeAt(t)|32;B===115?(H=!1,r(1)):B===105&&(H=!0,r(1))}if(n.charCodeAt(t)!==93)throw new Error("Attribute selector didn't terminate");t+=1;let x={type:s.Attribute,name:i,action:d,value:N,namespace:u,ignoreCase:H};e.push(x);break}case 58:{if(n.charCodeAt(t+1)===58){e.push({type:s.PseudoElement,name:o(2).toLowerCase(),data:n.charCodeAt(t)===40?l():null});continue}let i=o(1).toLowerCase(),u=null;if(n.charCodeAt(t)===40)if(nt.has(i)){if(T(n.charCodeAt(t+1)))throw new Error(`Pseudo-selector ${i} cannot be quoted`);if(u=[],t=K(u,n,t+1),n.charCodeAt(t)!==41)throw new Error(`Missing closing parenthesis in :${i} (${n})`);t+=1}else{if(u=l(),at.has(i)){let d=u.charCodeAt(0);d===u.charCodeAt(u.length-1)&&T(d)&&(u=u.slice(1,-1))}u=v(u)}e.push({type:s.Pseudo,name:i,data:u});break}case 44:{_(),e=[],r(1);break}default:{if(n.startsWith("/*",t)){let d=n.indexOf("*/",t+2);if(d<0)throw new Error("Comment was not terminated");t=d+2,e.length===0&&r(0);break}let i=null,u;if(h===42)t+=1,u="*";else if(h===124){if(u="",n.charCodeAt(t+1)===124){E(s.ColumnCombinator),r(2);break}}else if(V.test(n.slice(t)))u=o(0);else break t;n.charCodeAt(t)===124&&n.charCodeAt(t+1)!==124&&(i=u,n.charCodeAt(t+1)===42?(u="*",t+=2):u=o(1)),e.push(u==="*"?{type:s.Universal,namespace:i}:{type:s.Tag,name:u,namespace:i})}}}return _(),t}var k=(a,...n)=>{let[t]=$(a).map(e=>e.reduce((o,r)=>{var l;if(o===null&&r.type!=="tag")throw new Error("Unexpected.");return r.type==="tag"?document.createElement(r.name):(r.type==="attribute"&&r.name!=="class"&&o.setAttribute(r.name,(l=r.value)!=null?l:""),r.type==="attribute"&&r.name==="class"&&o.classList.add(r.value),o)},null));return n.forEach(e=>t.append(e)),t};var A,F=class{constructor(n,...t){f(this,A,void 0);c(this,A,k(n,...t))}element(){return m(this,A)}empty(){this.element().childNodes.forEach(n=>n.remove())}};A=new WeakMap;var g=F;var y,P,M,q,U=class extends g{constructor(t,e,o){super("div.cell");f(this,y,"transparent");f(this,P,void 0);f(this,M,void 0);f(this,q,void 0);c(this,P,o),c(this,M,t),c(this,q,e),this.bindEvents()}bindEvents(){["mousedown","mousemove","touchstart","touchmove"].forEach(t=>this.element().addEventListener(t,e=>{t==="mousemove"&&e.which!==1||(e.preventDefault(),this.paint())}))}paint(){c(this,y,m(this,P).currentColour()),this.element().style.backgroundColor=m(this,y)}x(){return m(this,M)}y(){return m(this,q)}};y=new WeakMap,P=new WeakMap,M=new WeakMap,q=new WeakMap;var R=U;var L,W=class extends g{constructor(t,e=26,o=22){super("section.board");f(this,L,void 0);c(this,L,this.generateCells(e,o,t)),m(this,L).forEach(r=>this.element().append(k("div.row",...r.map(l=>l.element()))))}generateCells(t,e,o){return new Array(t).fill(0).map((r,l)=>new Array(e-l%2).fill(0).map((w,S)=>new R(S,l,o)))}};L=new WeakMap;var X=W;var b,j=class extends g{constructor(){super("section.picker");f(this,b,void 0);c(this,b,k('input[type="color"][value="#000000"]')),this.element().append(m(this,b))}currentColour(){return m(this,b).value}};b=new WeakMap;var Y=j;var Z=new Y,rt=new X(Z),it=document.getElementById("app");it.append(rt.element(),Z.element());})();
//# sourceMappingURL=app.js.map
