!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var s in n)("object"==typeof exports?exports:e)[s]=n[s]}}(self,(()=>(()=>{"use strict";var e;class t{constructor(e,t){this.t17=!1,this.vaal=!1,this.mod=e,this.args=t,this.index=Number(t[0]),this.active=Boolean(t[1]);for(const e of t)switch(e){case"t17":this.t17=!0;break;case"vaal":this.vaal=!0}}getMetadata(){return[...this.args]}getModifier(){return this.mod}getIndex(){return this.index}isActive(){return this.active}isVaal(){return this.vaal}isT17(){return this.t17}equals(e){return this===e||!!e&&this.mod===e.getModifier()&&this.active===e.isActive()&&this.index===e.getIndex()&&this.vaal===e.isVaal()&&this.t17===e.isT17()}}!function(e){e[e.INCLUSIVE=0]="INCLUSIVE",e[e.EXCLUSIVE=1]="EXCLUSIVE"}(e||(e={}));class n{constructor(e,t,n,s,i){this.modifiers=n,this.blacklist=i,this.excludes=s,this.vaal=t,this.t17=e}includes(e,t){for(const n of t)if(n.equals(e))return!0;return!1}substrings(e,t){let n=[],s=e.getModifier().toLowerCase().split("\\n");for(let e=0;e<s.length;e++){let i=s[e];for(let e=0;e<i.length;e++)for(let s=e+1;s<=i.length;s++){let l=i.substring(e,s);1!=l.length&&(t.blacklisted(l)||n.push(l))}}return n.sort(((e,t)=>e.length-t.length)),n}}class s extends n{check(e,t,n){if(this.excludes.blacklisted(e))return!1;for(let s=0;s<this.modifiers.length;s++){let i=this.modifiers[s];if(i.getModifier().toLowerCase().includes(e)){if(i.isT17()&&!this.t17)continue;if(i.isVaal()&&!this.vaal)continue;let e=!1;for(const t of n)i.getModifier().toLowerCase().includes(t)&&(e=!0);if(e)continue;if(!this.includes(i,t))return!1}}return!0}create(e,t,n,s){if(0===n.length)return;if(s>this.modifiers.length)throw new Error("Infinite Recursion has been prevented");n=e.upgrade(this.t17,n,t);let i=new Set;for(let e=0;e<n.length;e++){let t=n[e];this.substrings(t,this.blacklist).forEach((e=>i.add(e)))}const l=new Map,r=Array.from(i).filter((e=>e.length>=2)).sort(((e,t)=>e.length-t.length));for(const e of r){if(e.length>=20)break;if(!e.startsWith(" ")&&!e.endsWith(" ")&&this.check(e,n,t))for(const t of n)t.getModifier().toLowerCase().includes(e.toLowerCase())&&(l.has(e)||l.set(e,0),l.set(e,(l.get(e)||0)+1))}let o=Array.from(l.entries());o.sort(((e,t)=>{const n=t[1]-e[1];return 0!==n?n:e[0].length+(e[0].includes("#")?2:0)-(t[0].length+(t[0].includes("#")?2:0))}));const c=o[0][0];n=n.filter((e=>!e.getModifier().toLowerCase().includes(c))),t.add(c),this.create(e,t,n,s+1)}}class i extends n{check(e,t,n){if(this.excludes.blacklisted(e))return!1;for(let n=0;n<this.modifiers.length;n++){let s=this.modifiers[n],i=s.getModifier().toLowerCase().includes(e.toLowerCase()),l=this.includes(s,t);if((!s.isT17()||this.t17)&&(!s.isVaal()||this.vaal)&&(!l&&i||l&&!i))return!1}return!0}create(e,t,n,s){if(0!==n.length)for(const e of n){let n=new Set,s=[];this.substrings(e,this.blacklist).forEach((e=>n.add(e)));for(const t in this.modifiers){let n=this.modifiers[t];n.getModifier().toLowerCase().includes(e.getModifier().toLowerCase())&&s.push(n)}s.push(e);let i=[],l=Array.from(n).sort(((e,t)=>e.length-t.length));for(const e of l)e.startsWith(" ")||e.endsWith(" ")||this.check(e,s,t)&&i.push(e);i.sort(((e,t)=>{const n=e.includes("#")||e.includes(" ")?e.length+2:e.length,s=t.includes("#")||t.includes(" ")?t.length+2:t.length;if(n!==s)return n-s;const i=e.includes(" ");return i===t.includes(" ")?0:i?1:-1})),i.length>0&&t.add(i[0])}}}class l{constructor(){this.blacklist=new Set,this.forbidden=new Set}populate(e){for(let t=0;t<e.length;t++)this.blacklist.add(e[t].toLowerCase().trim())}lock(e){for(let t=0;t<e.length;t++)0!==e[t].length&&this.forbidden.add(e[t].toLowerCase().trim())}blacklisted(e){for(let t of this.blacklist)if(t.includes(e))return!0;for(let t of this.forbidden)if(e.includes(t))return!0;return!1}}const r=[[9,[74]],[10,[81]],[11,[137]],[12,[102,103]],[13,[98,104]],[22,[108]],[26,[78]],[29,[96]],[30,[72]],[31,[68]],[33,[114]],[34,[115]],[35,[94]],[37,[73,76]],[39,[61,62]],[40,[95]],[45,[84,86,87]],[49,[118]],[52,[64]],[59,[111]],[61,[39]],[62,[39]],[64,[52]],[68,[31]],[72,[30]],[73,[37]],[74,[9]],[76,[37]],[78,[26]],[81,[10]],[84,[45]],[86,[45]],[87,[45]],[94,[35]],[95,[40]],[96,[29]],[98,[13]],[102,[12,103]],[103,[12,102]],[104,[13]],[108,[22]],[111,[59]],[114,[33]],[115,[34]],[118,[49]],[137,[11]]];class o{constructor(e){this.mapping=new Map;let n=new Map;for(let s=0;s<r.length;s++){let i=r[s][0],l=e[i],o=new t(l.getModifier(),l.getMetadata());n.set(i,o)}for(let e=0;e<r.length;e++){let t=r[e],s=t[0],i=t[1],l=n.get(s),o=[];for(let e=0;e<i.length;e++){let t=i[e],s=n.get(t);s&&o.push(s)}l&&o&&this.mapping.set(l,o)}}upgrade(e,t,n){const s=new Set(t),i=Array.from(this.mapping.keys());for(const l of t)for(const t of i)if(l.equals(t)){let i=this.mapping.get(t)||[];for(const t of i)if(e||t.isT17()||t.getModifier().includes("#% more Monster Life")){let e=!1;for(const s of n)if(t.getModifier().toLowerCase().includes(s)){e=!0;break}e||s.add(t)}}return Array.from(s)}}const c=performance.now();let a=new Map,d=new Map,u=new l,f=[],h=[],g=[];function m(e,t){const n=document.getElementById("overlay"),s=document.getElementById(e),i=document.body;n.classList.toggle("hidden",!t),s.classList.toggle("hidden",!t),i.classList.toggle("no-scroll",t)}async function p(e){const t=e.map((e=>fetch(e).then((t=>{if(!t.ok)throw new Error(`Failed to load ${e}: ${t.status} ${t.statusText}`);return t.text()}))));return Promise.all(t)}function E(t,n,s){const i=document.createElement("div");return i.classList.add("selectable"),s.isT17()&&(i.classList.add("t17"),i.style.display="none"),s.isVaal()&&(i.classList.add("vaal"),i.style.display="none"),i.dataset.mod=t.toString(),i.dataset.t17=s.isT17().toString(),i.dataset.vaal=s.isVaal().toString(),i.textContent=s.getModifier().replace(/\\n/g,"\n"),i.addEventListener("click",(i=>{let l=i.target;if(l.classList.contains("disabled-item"))return;l.classList.toggle("selected-item");let o=l.classList.contains("selected-item"),c=n==e.EXCLUSIVE?h:g;!function(t,n,s,i){let l=s==e.EXCLUSIVE?"inclusive":"exclusive",r=document.querySelector(`#${l} .selectable[data-mod="${t}"]`);n?(r.classList.add("disabled-item"),L(!n,s==e.EXCLUSIVE?g:h,i)):r.classList.remove("disabled-item")}(t,o,n,s),L(o,c,s),function(t,n){const s=Object.values(e).filter((e=>"number"==typeof e));for(const i of r)if(i[0]===t){let t=i[1];for(const i of t)for(const t of s){let s=e[t].toLowerCase(),l=document.querySelector(`#${s} .selectable[data-mod="${i}"]`);n?l.classList.add("disabled-item"):l.classList.remove("disabled-item")}break}}(t,o),v()})),i}function L(e,t,n){if(e)t.push(n);else{const e=t.indexOf(n);e>-1&&t.splice(e,1)}}function y(){document.getElementById("regex").innerText="",document.getElementById("hint").innerText="",h.length=0,g.length=0,a.clear(),d.clear(),document.querySelectorAll(".selected-item, .disabled-item").forEach((e=>{e.classList.remove("selected-item","disabled-item")}))}function I(e){var t;const n=e.value,s=null===(t=e.closest(".container-search"))||void 0===t?void 0:t.nextElementSibling,i=document.getElementById("t17"),l=document.getElementById("vaal");if(s&&s.classList.contains("mod-container")){let e=s.children;for(let t=0;t<e.length;t++){const s=e[t];if(s.textContent&&s.textContent.toLowerCase().includes(n.toLowerCase())){let e=i.checked&&"true"===s.dataset.t17,t=l.checked&&"true"===s.dataset.vaal,n="false"===s.dataset.t17&&"false"===s.dataset.vaal;(e||t||n)&&(s.style.display="")}else s.style.display="none"}}}function b(){document.getElementById("regex").innerText="crunching numbers...",document.getElementById("hint").innerText="",setTimeout((()=>{let t=document.getElementById("any").checked,n=k(!0,e.EXCLUSIVE),s=k(t,e.INCLUSIVE),i=function(){let e=C("quantity","optimize-quantity","m q"),t=C("pack-size","optimize-pack","iz"),n=C("scarabs","optimize-scarab","abs"),s=C("maps","optimize-maps","ps:"),i=C("currency","optimize-currency","urr"),l="";return e&&(l+=e),t&&(l+=t),n&&(l+=n),s&&(l+=s),i&&(l+=i),l}(),l=function(){let t=document.getElementById("maps-include").checked?e.INCLUSIVE:e.EXCLUSIVE,n=[];document.getElementById("map-normal").checked&&n.push("n"),document.getElementById("map-rare").checked&&n.push("r"),document.getElementById("map-magic").checked&&n.push("m");let s=t==e.INCLUSIVE&&3!=n.length&&0!=n.length,i=t==e.EXCLUSIVE&&0!=n.length;return s||i?` "${t==e.EXCLUSIVE?"!":""}y: ${function(e){return 1==e.length?e[0]:`(${e.join("|")})`}(n)}"`:""}(),r=(n+(n.length>0?" ":"")+s+(s.length>0?" ":"")+i+l).trim();document.getElementById("regex").innerText=r;let o=document.getElementById("hint");o.innerText=r.length>0?`length: ${r.length} / 50`:"",o.style.color=r.length>50?"#ff4d4d":"#e0e0e0",!document.getElementById("optimize").checked||m("loading-modal",!1)}),100)}function v(){!document.getElementById("optimize").checked&&b()}function k(t,n){const r=document.getElementById("t17"),c=document.getElementById("vaal");let m=function(t){let n=new l;return t==e.EXCLUSIVE&&n.populate([...g].map((e=>e.getModifier()))),t==e.INCLUSIVE&&n.populate([...h].map((e=>e.getModifier()))),n}(n),p=t?new s(r.checked,c.checked,f,m,u):new i(r.checked,c.checked,f,m,u),E=n==e.EXCLUSIVE?h:g,L="";if(function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}(a.get(n)||[],E))L=d.get(n)||"";else{let s=new Set,i=new o(f);try{if(p.create(i,s,E,0),a.set(n,[...E]),t)L=Array.from(s).join("|").replace(/#/g,"\\d+"),L=L.length>0?`"${n==e.EXCLUSIVE?"!":""}${L}"`:"";else{let e="";for(const t of s){let n=t.replace(/#/g,"\\d+");e+=t.includes(" ")?`"${n}" `:`${n} `}L=e}d.set(n,L)}catch(e){console.error(e)}}return L}function C(e,t,n){let s=function(e,t){let n=parseFloat(e);if(isNaN(n))return null;if(0===n)return null;if(t&&(n=10*Math.floor(n/10)),0===n)return"";let s=Math.floor(n%100/10),i=n%10;if(n>=200)return"2..";if(199===n)return"199";if(n>100)return 0==i?`1[${s}-9].`:0===s?`(\\d0[${i}-9]|\\d[1-9].)`:9===s?8!=i?`19[${s}-9]`:"19[89]":`1([${s}-9][${i}-9]|[${s+1}-9].)`;if(100===n)return"\\d{3}";if(n>=10){if(0===i){let e;return e=9===s?"9.":8===s?"[89].":`[${s}-9].`,`(${e}|1..)`}if(9===s)return`(${s}[${i}-9]|1..)`;{let e=[];return 9===i?e.push("9"):8===i?e.push("[89]"):e.push(`[${i}-9]`),8===s&&e.push("9."),7===s?e.push("[89]."):e.push(`[${s+1}-9].`),`(${s}${e[0]}|${e[1]}|1..)`}}return n<10?9===n?"(9|\\d..?)":8===n?"([89]|\\d..?)":n>1?`([${n}-9]|\\d..?)`:"":e}(document.getElementById(e).value,document.getElementById(t).checked);return null===s?null:""===s?`"${n}" `:`"${n}.*${s}%" `}function w(e){return e.filter((e=>!e.getModifier().includes("Corrupted")))}function S(e){document.getElementById(e).addEventListener("change",(t=>{const n=t.target;document.querySelectorAll("[data-"+e+'="true"]').forEach((e=>{let t=e;t.style.display=n.checked?"block":"none",n.checked||t.classList.remove("selected-item")})),document.querySelectorAll(".container-search").forEach((e=>{I(e)}))}))}function x(e){const t=document.getElementById(e);t.checked=!0;const n=new Event("change",{bubbles:!0,cancelable:!0});t.dispatchEvent(n)}function $(e,t){for(const n of t)V(e,n)}function V(t,n){let s=t==e.EXCLUSIVE?"exclusive":"inclusive",i=document.querySelectorAll(`#${s} .selectable`);for(const e of i)if(e.textContent.toLowerCase().includes(n)){const t=new MouseEvent("click",{bubbles:!0,cancelable:!0});e.dispatchEvent(t)}}return document.addEventListener("DOMContentLoaded",(()=>{p(["./league/settler/map.name.config","./league/settler/map.affix.config","./league/settler/map.general.config","./league/settler/map.blacklist.config"]).then((e=>function(e){const t=new l;for(let n=0;n<e.length-1;n++){let s=e[n].split("\n");t.populate(s)}return t.lock(e[e.length-1].split("\n")),t}(e))).then((n=>{u=n,async function(){p(["./league/settler/map.mods.config"]).then((e=>e[0])).then((n=>function(n){let s=n.split("\n"),i=document.querySelectorAll(".mod-container");for(let n=0;n<s.length;n++){let l=s[n].trim(),r=l.startsWith("$"),o=l.substring(1).split(";"),c=r?o.slice(0,-1):[];const a=new t(r?o[o.length-1]:l,c);f.push(a);for(let t=0;t<i.length;t++){let s=0==t?e.EXCLUSIVE:e.INCLUSIVE,l=E(n,s,a);if(s==e.EXCLUSIVE)i[t].appendChild(l);else{let e=i[t];e.children.length>0?e.insertBefore(l,e.children[0]):e.appendChild(l)}}}}(n)))}().then((()=>function(){document.querySelectorAll(".container-search").forEach((e=>{e.addEventListener("input",(e=>{I(e.target)}))})),S("t17"),S("vaal"),document.getElementById("clear").addEventListener("click",(()=>{y()})),document.getElementById("copy").addEventListener("click",(()=>{let e=document.getElementById("regex").innerText;navigator.clipboard.writeText(e)})),document.getElementById("import").addEventListener("click",(()=>{m("import-modal",!0)})),document.getElementById("generate").addEventListener("click",(()=>{m("loading-modal",!0),b()})),document.getElementById("import-load").addEventListener("click",(()=>{!function(){y(),x("t17"),x("vaal");let t=document.getElementById("import-string"),n=function(e){const t=/"([^"]*)"|[^\s]+/g;let n,s=[];for(;null!==(n=t.exec(e));)n[1]?s.push(n[1]):s.push(n[0]);return s}(t.value);t.value="";for(const t of n)if(t.startsWith("!")){let n=t.substring(1).split("|");$(e.EXCLUSIVE,n)}else if(n.includes("|")){let n=t.split("|");$(e.INCLUSIVE,n)}else{let n=t.startsWith('"')?t.substring(1,t.length-1):t;V(e.INCLUSIVE,n)}v()}()})),document.getElementById("report").addEventListener("click",(()=>{window.open("https://github.com/n1klas4008/poe-regex/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=","_blank")})),document.getElementById("suggest").addEventListener("click",(()=>{window.open("https://github.com/n1klas4008/poe-regex/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=","_blank")})),document.querySelectorAll(".close-modal").forEach((e=>{e.addEventListener("click",(function(e){const t=e.target.closest(".modal-content");t&&t.parentElement&&t.parentElement.id&&m(t.parentElement.id,!1)}))})),document.querySelectorAll(".trigger-0").forEach((e=>{e.addEventListener("change",(e=>{v()}))})),document.querySelectorAll(".trigger-1").forEach((e=>{e.addEventListener("input",(e=>{v()}))})),document.querySelectorAll(".trigger-2").forEach((t=>{t.addEventListener("input",(t=>{a.delete(e.INCLUSIVE)}))})),document.querySelectorAll(".trigger-3").forEach((n=>{n.addEventListener("input",(n=>{h=w(h),g=w(g);let s=null;switch(n.target.id){case"corrupted-include":s=e.INCLUSIVE;break;case"corrupted-exclude":s=e.EXCLUSIVE}if(null!=s){let n=new t("Corrupted",[]);(s===e.EXCLUSIVE?h:g).push(n)}v()}))}));const n=document.querySelectorAll('input[type="checkbox"]');n.forEach((e=>{e.addEventListener("change",(()=>{!function(e){const t=e.classList;let s="";for(const e of t)if(e.includes("btn-group-")){s=e;break}0!=s.length&&(e.checked?n.forEach((t=>{t.classList.contains(s)&&t!==e&&(t.checked=!1)})):Array.from(n).filter((e=>e.classList.contains(s))).some((e=>e.checked))||(e.checked=!0))}(e)}))}))}())).then((()=>function(){const e=performance.now()-c;console.log(`build-time ${e}ms`)}()))})).catch((e=>function(e){console.error(e)}(e)))})),{}})()));