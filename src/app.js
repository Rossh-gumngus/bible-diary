
var B="GEN,Yaradılış,50;EXO,Çıxış,40;LEV,Levililər,27;NUM,Saylar,36;DEU,Qanunun Təkrarı,34;JOS,Yeşua,24;JDG,Hakimlər,21;RUT,Rut,4;1SA,Birinci Şamuel,31;2SA,İkinci Şamuel,24;1KI,Birinci Padşahlar,22;2KI,İkinci Padşahlar,25;1CH,Birinci Salnamələr,29;2CH,İkinci Salnamələr,36;EZR,Ezra,10;NEH,Nehemya,13;EST,Ester,10;JOB,Əyyub,42;PSA,Zəbur,150;PRO,Süleymanın Məsəlləri,31;ECC,Vaiz,12;SNG,Nəğmələr Nəğməsi,8;ISA,Yeşaya,66;JER,Yeremya,52;LAM,Mərsiyələr,5;EZK,Yezekel,48;DAN,Daniel,12;HOS,Huşə,14;JOL,Yoel,3;AMO,Amos,9;OBA,Avdiya,1;JON,Yunus,4;MIC,Mikeya,7;NAM,Nahum,3;HAB,Habaqquq,3;ZEP,Sefanya,3;HAG,Haqqay,2;ZEC,Zəkəriyyə,14;MAL,Malaki,4;MAT,Matta,28;MRK,Mark,16;LUK,Luka,24;JHN,Yəhya,21;ACT,Həvarilərin İşləri,28;ROM,Romalılara,16;1CO,1 Korinflilərə,16;2CO,2 Korinflilərə,13;GAL,Qalatiyalılara,6;EPH,Efeslilərə,6;PHP,Filipililərə,4;COL,Kolosselilərə,4;1TH,1 Saloniklilərə,5;2TH,2 Saloniklilərə,3;1TI,1 Timoteyə,6;2TI,2 Timoteyə,4;TIT,Titə,3;PHM,Filimona,1;HEB,İbranilərə,13;JAS,Yaqub,5;1PE,1 Peter,5;2PE,2 Peter,3;1JN,1 Yəhya,5;2JN,2 Yəhya,1;3JN,3 Yəhya,1;JUD,Yəhuda,1;REV,Vəhy,22".split(";").map(function(s){var a=s.split(",");return{k:a[0],n:a[1],c:+a[2]}});
var BK={};B.forEach(function(b){BK[b.k]=b});
/* число стихов по главам: Azərbaycan dilində Müqəddəs Kitab (ebible.org/azb, USFM) */
var VS="31.25.24.26.32.22.24.22.29.32.32.20.18.24.21.16.27.33.38.18.34.24.20.67.34.35.46.22.35.43.55.32.20.31.29.43.36.30.23.23.57.38.34.34.28.34.31.22.33.26;22.25.22.31.23.30.25.32.35.29.10.51.22.31.27.36.16.27.25.26.36.31.33.18.40.37.21.43.46.38.18.35.23.35.35.38.29.31.43.38;17.16.17.35.19.30.38.36.24.20.47.8.59.57.33.34.16.30.37.27.24.33.44.23.55.46.34;54.34.51.49.31.27.89.26.23.36.35.16.33.45.41.50.13.32.22.29.35.41.30.25.18.65.23.31.40.16.54.42.56.29.34.13;46.37.29.49.33.25.26.20.29.22.32.32.18.29.23.22.20.22.21.20.23.30.25.22.19.19.26.68.29.20.30.52.29.12;18.24.17.24.15.27.26.35.27.43.23.24.33.15.63.10.18.28.51.9.45.34.16.33;36.23.31.24.31.40.25.35.57.18.40.15.25.20.20.31.13.31.30.48.25;22.23.18.22;28.36.21.22.12.21.17.22.27.27.15.25.23.52.35.23.58.30.24.42.15.23.29.22.44.25.12.25.11.31.13;27.32.39.12.25.23.29.18.13.19.27.31.39.33.37.23.29.33.43.26.22.51.39.25;53.46.28.34.18.38.51.66.28.29.43.33.34.31.34.34.24.46.21.43.29.53;18.25.27.44.27.33.20.29.37.36.21.21.25.29.38.20.41.37.37.21.26.20.37.20.30;54.55.24.43.26.81.40.40.44.14.47.40.14.17.29.43.27.17.19.8.30.19.32.31.31.32.34.21.30;17.18.17.22.14.42.22.18.31.19.23.16.22.15.19.14.19.34.11.37.20.12.21.27.28.23.9.27.36.27.21.33.25.33.27.23;11.70.13.24.17.22.28.36.15.44;11.20.32.23.19.19.73.18.38.39.36.47.31;22.23.15.17.14.14.10.17.32.3;22.13.26.21.27.30.21.22.35.22.20.25.28.22.35.22.16.21.29.29.34.30.17.25.6.14.23.28.25.31.40.22.33.37.16.33.24.41.30.24.34.17;6.12.8.8.12.10.17.9.20.18.7.8.6.7.5.11.15.50.14.9.13.31.6.10.22.12.14.9.11.12.24.11.22.22.28.12.40.22.13.17.13.11.5.26.17.11.9.14.20.23.19.9.6.7.23.13.11.11.17.12.8.12.11.10.13.20.7.35.36.5.24.20.28.23.10.12.20.72.13.19.16.8.18.12.13.17.7.18.52.17.16.15.5.23.11.13.12.9.9.5.8.28.22.35.45.48.43.13.31.7.10.10.9.8.18.19.2.29.176.7.8.9.4.8.5.6.5.6.8.8.3.18.3.3.21.26.9.8.24.13.10.7.12.15.21.10.20.14.9.6;33.22.35.27.23.35.27.36.18.32.31.28.25.35.33.33.28.24.29.30.31.29.35.34.28.28.27.28.27.33.31;18.26.22.16.20.12.29.17.18.20.10.14;17.17.11.16.16.13.13.14;31.22.26.6.30.13.25.22.21.34.16.6.22.32.9.14.14.7.25.6.17.25.18.23.12.21.13.29.24.33.9.20.24.17.10.22.38.22.8.31.29.25.28.28.25.13.15.22.26.11.23.15.12.17.13.12.21.14.21.22.11.12.19.12.25.24;19.37.25.31.31.30.34.22.26.25.23.17.27.22.21.21.27.23.15.18.14.30.40.10.38.24.22.17.32.24.40.44.26.22.19.32.21.28.18.16.18.22.13.30.5.28.7.47.39.46.64.34;22.22.66.22.22;28.10.27.17.17.14.27.18.11.22.25.28.23.23.8.63.24.32.14.49.32.31.49.27.17.21.36.26.21.26.18.32.33.31.15.38.28.23.29.49.26.20.27.31.25.24.23.35;21.49.30.37.31.28.28.27.27.21.45.13;11.23.5.19.15.11.16.14.17.15.12.14.16.9;20.32.21;15.16.15.13.27.14.17.14.15;21;17.10.10.11;16.13.12.13.15.16.20;15.13.19;17.20.19;18.15.20;15.23;21.13.10.14.11.15.14.23.17.12.17.14.9.21;14.17.18.6;25.23.17.25.48.34.29.34.38.42.30.50.58.36.39.28.27.35.30.34.46.46.39.51.46.75.66.20;45.28.35.41.43.56.37.38.50.52.33.44.37.72.47.20;80.52.38.44.39.49.50.56.62.42.54.59.35.35.32.31.37.43.48.47.38.71.56.53;51.25.36.54.47.71.53.59.41.42.57.50.38.31.27.33.26.40.42.31.25;26.47.26.37.42.15.60.40.43.48.30.25.52.28.41.40.34.28.41.38.40.30.35.27.27.32.44.31;32.29.31.25.21.23.25.39.33.21.36.21.14.23.33.27;31.16.23.21.13.20.40.13.27.33.34.31.13.40.58.24;24.17.18.18.21.18.16.24.15.18.33.21.13;24.21.29.31.26.18;23.22.21.32.33.24;30.30.21.23;29.23.25.18;10.20.13.18.28;12.17.18;20.15.16.16.25.21;18.26.17.22;16.15.15;25;14.18.19.16.14.20.28.13.28.39.40.29.25;27.26.18.17.20;25.25.22.19.14;21.22.18;10.29.24.21.21;13;15;25;20.29.22.11.14.17.17.13.21.11.19.18.18.20.8.21.18.24.21.15.27.21";
VS.split(";").forEach(function(s,i){B[i].v=s.split(".").map(Number)});
function maxV(k,c){var b=BK[k];return b&&b.v?b.v[c-1]||0:0}
function plurV(n){var t=n%100,u=n%10;return t>10&&t<20?"стихов":u===1?"стих":u>1&&u<5?"стиха":"стихов"}
function vsErr(k,c,v){if(!v)return "";var mx=maxV(k,c),p=v.split(","),i,a,z,m;
  for(i=0;i<p.length;i++){m=p[i].split("-");a=+m[0];z=+(m[1]||m[0]);
    if(a<1)return "Номера стихов начинаются с 1.";
    if(z<a)return "Диапазон стихов пишите по возрастанию: "+z+"-"+a+".";
    if(mx&&z>mx)return "В "+BK[k].n+" "+c+" всего "+mx+" "+plurV(mx)+"."}
  return ""}
var LKEY="bd2-entries",TKEY="bd2-timer",entries=[],coll=null,editId=null,refs=[],tags=[],openM={},tm={acc:0,start:0};
try{var raw=localStorage.getItem(LKEY);if(raw)entries=JSON.parse(raw)||[]}catch(e){}
try{var tr=localStorage.getItem(TKEY);if(tr)tm=JSON.parse(tr)||tm}catch(e){}
function $(i){return document.getElementById(i)}
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function pad(n){return String(n).padStart(2,"0")}
function todayStr(){var d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function fmtDate(s){var a=s.split("-");return new Date(+a[0],+a[1]-1,+a[2]).toLocaleDateString("ru-RU",{weekday:"short",day:"numeric",month:"long",year:"numeric"})}
function secsOf(e){return (+e.min||0)*60+(+e.sec||0)}
function fmtSecs(s){var H=Math.floor(s/3600),M=Math.floor(s%3600/60),S=s%60;return (H?H+" ч ":"")+(M?M+" мин ":"")+(S&&!H?S+" сек":"")}
function refLabel(r){var b=BK[r.b];return (b?b.n:r.b)+" "+r.c+(r.v?":"+r.v:"")}
function monthName(k){var a=k.split("-");return ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"][+a[1]-1]+" "+a[0]}
function say(id,t){$(id).textContent=t}
var curTab="W",cloudLoading=false,dataReady=false;
function tab(w,opt){var prev=curTab;curTab=w;["W","L","P","Y"].forEach(function(x){var on=w===x,b=$("tab"+x);$("p"+x).hidden=!on;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1});
  if(prev!==w){var p=$("p"+w);p.classList.remove("ap-enter");void p.offsetWidth;p.classList.add("ap-enter");if(!(opt&&opt.keep))window.scrollTo(0,0)}
  moveInd();
  if(w==="L")renderList();else if(w==="P")renderProg();else if(w==="Y")renderYB();else renderRecent()}
["W","L","P","Y"].forEach(function(x){$("tab"+x).onclick=function(){tab(x)}});
$("nav").addEventListener("keydown",function(e){var o=["W","L","P","Y"],i=o.indexOf(curTab),n=null;
  if(e.key==="ArrowRight"||e.key==="ArrowDown")n=o[(i+1)%4];else if(e.key==="ArrowLeft"||e.key==="ArrowUp")n=o[(i+3)%4];else if(e.key==="Home")n="W";else if(e.key==="End")n="Y";
  if(n){e.preventDefault();tab(n);$("tab"+n).focus()}});
function moveInd(){var b=$("tab"+curTab),ind=$("navInd");if(!b.getClientRects().length)return;
  /* stage 10: индикатор — «пилюля» под активной вкладкой (и в нижней панели, и в боковой) */
  ind.style.width=b.offsetWidth+"px";ind.style.height=b.offsetHeight+"px";ind.style.transform="translate("+b.offsetLeft+"px,"+b.offsetTop+"px)"}
window.addEventListener("resize",moveInd);
function chip(list,i,cls,txt,redraw){var c=h("span","chip "+cls);c.appendChild(h("span","",txt));var b=h("button","","×");b.type="button";b.setAttribute("aria-label","Убрать");b.onclick=function(){list.splice(i,1);redraw()};c.appendChild(b);return c}
function drawRefs(){var d=$("refs");d.innerHTML="";refs.forEach(function(r,i){d.appendChild(chip(refs,i,"",refLabel(r),drawRefs))})}
function drawTags(){var d=$("tags");d.innerHTML="";tags.forEach(function(t,i){d.appendChild(chip(tags,i,"tag",t,drawTags))})}
function addTag(){var t=$("fTag").value.replace(/,/g," ").trim();if(t&&tags.indexOf(t)<0){tags.push(t);drawTags()}$("fTag").value=""}
$("fTag").addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===","){e.preventDefault();addTag()}});
$("fTag").addEventListener("blur",addTag);

/* storage */
function persist(){if(coll)return;try{localStorage.setItem(LKEY,JSON.stringify(entries))}catch(e){}}
function body(e){return{kind:"entry",date:e.date,min:e.min,sec:e.sec,refs:e.refs||[],key:e.key||"",tags:e.tags||[],note:e.note||"",fav:!!e.fav}}
function putEntry(e){if(coll){coll.doc(e.id).set(body(e)).then(function(){setSync("ok")},function(){setSync("err")})}
  else{stampE(e);var i=entries.findIndex(function(x){return x.id===e.id});if(i>=0)entries[i]=e;else entries.push(e);persist();render();syncDirty()}}
function saveMany(list){if(!list.length)return;if(coll){list.forEach(function(e){coll.doc(e.id).set(body(e)).then(function(){setSync("ok")},function(){setSync("err")})})}
  else{list.forEach(function(e){stampE(e);var i=entries.findIndex(function(x){return x.id===e.id});if(i>=0)entries[i]=e;else entries.push(e)});persist();render();syncDirty()}}
function saveFav(e){var o=entries.find(function(x){return x.id===e.id});if(o&&o!==e)o.fav=e.fav;
  if(coll)coll.doc(e.id).set(body(o||e)).then(function(){setSync("ok")},function(){setSync("err")});else{stampE(o||e);if(o&&o!==e)e.updatedAt=o.updatedAt;persist();syncDirty()}}
function removeEntry(id){if(coll){coll.doc(id).delete().catch(function(){setSync("err")})}else{entries=entries.filter(function(x){return x.id!==id});tombE(id);persist();render();syncDirty()}}
function setSync(s){say("sync",s==="ok"?"Записи синхронизируются с вашим аккаунтом и доступны на всех устройствах.":s==="err"?"Не удалось связаться с хранилищем. Записи сохранены только на этом устройстве.":"Записи хранятся в этом браузере на этом устройстве.")}
setSync();
function noCloud(){cloudLoading=false;dataReady=true;render()}
async function initCloud(){try{
  if(!window.claude||!claude.use)return noCloud();
  cloudLoading=true;render();
  var db=await claude.use("db"),user=await claude.use("user");if(!db||!user)return noCloud();
  var id=await user.id();if(!id)return noCloud();
  var c=db.collection("data/users/"+id),local=entries.slice(),to=setTimeout(function(){setSync("err");if(cloudLoading){cloudLoading=false;render()}},10000);
  coll=c;
  c.onSnapshot(function(snap){clearTimeout(to);
    entries=snap.docs.filter(function(d){return d.exists&&(d.data()||{}).kind==="entry"}).map(function(d){return Object.assign({id:d.id},d.data())});
    goalFromSnap(snap);cloudLoading=false;dataReady=true;render();setSync("ok")},function(){clearTimeout(to);coll=null;setSync("err");noCloud()});
  if(local.length){local.forEach(putEntry);try{localStorage.removeItem(LKEY)}catch(e){}}
}catch(e){coll=null;setSync("err");noCloud()}}
var fSnap="";
function formState(){return JSON.stringify([$("fDate").value,$("fMin").value,$("fSec").value,$("fKey").value,$("fTag").value.trim(),$("fNote").value,refs,tags])}
function resetForm(){editId=null;refs=[];tags=[];$("fDate").value=todayStr();["fMin","fSec","fKey","fTag","fNote"].forEach(function(i){$(i).value=""});
  drawRefs();drawTags();say("msg","");setPreview(false);$("save").textContent="Сохранить запись";$("fTitle").textContent="Новая запись";fSnap=formState()}
function fillTime(){var s=Math.floor(tEl());if(s>0){$("fMin").value=Math.floor(s/60);$("fSec").value=s%60}}
function newEntry(){if(sheetOpen())return;resetForm();if(!tm.start)fillTime();fSnap=formState();openSheet()}
function startEdit(e){closeAll().then(function(ok){if(!ok)return;resetForm();editId=e.id;$("fDate").value=e.date;$("fMin").value=e.min||"";$("fSec").value=e.sec||"";$("fKey").value=e.key||"";$("fNote").value=e.note||"";
  refs=(e.refs||[]).slice();tags=(e.tags||[]).slice();drawRefs();drawTags();$("save").textContent="Сохранить изменения";$("fTitle").textContent="Изменить запись";fSnap=formState();openSheet()})}
$("cancel").onclick=function(){closeTop()};
$("pickBtn").onclick=function(){openPicker({done:function(r){refs.push(r);drawRefs();say("msg","")}})};
$("save").onclick=function(){
  if(tm.start)tPause();
  addTag();
  var e={id:editId||("e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6)),date:$("fDate").value||todayStr(),min:$("fMin").value,sec:$("fSec").value,refs:refs.slice(),key:$("fKey").value.trim(),tags:tags.slice(),note:$("fNote").value.trim(),fav:false};
  if(editId){var o=entries.find(function(x){return x.id===editId});if(o)e.fav=!!o.fav}
  if(!e.refs.length&&!e.key&&!e.note){say("msg","Добавьте отрывок, мысль или заметку.");return}
  var was=editId;putEntry(e);resetForm();tm={acc:0,start:0};tSave();tShow();closeModal($("fSheet"));toast(was?"Изменения сохранены":"Запись сохранена");tab("L")};
/* markup & refs */
function fold(s){return String(s).replace(/[\s\S]/g,function(c){if(c==="İ"||c==="I"||c==="ı")return "i";var l=c.toLowerCase();return l.length===1?l:c})}
var NUMW=["Birinci","İkinci","Üçüncü"],NM={},RX=(function(){var alts=[];
  B.forEach(function(b){var v=[b.n],m=b.n.match(/^(Birinci|İkinci|Üçüncü|1|2|3) (.+)$/);
    if(m){var n=NUMW.indexOf(m[1])+1||+m[1];v=[n+" "+m[2],NUMW[n-1]+" "+m[2]]}
    v.forEach(function(x){var f=fold(x);NM[f]=b.k;alts.push(f)})});
  alts.sort(function(a,b){return b.length-a.length});
  alts=alts.map(function(a){return a.replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/^(\d) /,"$1\\s*").replace(/ /g,"\\s+")});
  return new RegExp("("+alts.join("|")+")\\s+(\\d{1,3})(?::(\\d{1,3}(?:[-–—]\\d{1,3})?(?:,\\s?\\d{1,3}(?:[-–—]\\d{1,3})?)*))?(?![\\p{L}\\p{N}])","gu")})();
function findRefs(t){var f=fold(t),out=[],m;RX.lastIndex=0;
  while((m=RX.exec(f))){var i=m.index,k=NM[m[1].replace(/\s+/g," ").replace(/^(\d)(?=\S)/,"$1 ")],b=BK[k],c=+m[2];
    if(!b||c<1||c>b.c||(i>0&&/[\p{L}\p{N}]/u.test(f[i-1]))){RX.lastIndex=i+1;continue}
    var v=(m[3]||"").replace(/[–—]/g,"-").replace(/\s/g,"");if(vsErr(k,c,v)){RX.lastIndex=i+1;continue}
    out.push({s:i,e:i+m[0].length,b:k,c:c,v:v})}
  return out}
function refText(par,t){var p=0;findRefs(t).forEach(function(r){if(r.s>p)par.appendChild(document.createTextNode(t.slice(p,r.s)));
    var a=h("button","rl",t.slice(r.s,r.e));a.type="button";a.title="Записи по этому отрывку: "+BK[r.b].n+" "+r.c;a.onclick=function(){showPassage(r.b,r.c)};par.appendChild(a);p=r.e});
  if(p<t.length)par.appendChild(document.createTextNode(t.slice(p)))}
var IRX=/\*\*(.+?)\*\*|\*(?![\s*])([^*]+?)\*/g;
function inl(par,t){var p=0,m,re=new RegExp(IRX.source,"g");
  while((m=re.exec(t))){if(m.index>p)refText(par,t.slice(p,m.index));
    if(m[1]!==undefined){var b=h("strong");inl(b,m[1]);par.appendChild(b)}else{var i=h("em");refText(i,m[2]);par.appendChild(i)}p=re.lastIndex}
  if(p<t.length)refText(par,t.slice(p))}
function rich(t,el){var d=el||h("div","note");d.innerHTML="";var cur=null,ct=null;
  String(t||"").split("\n").forEach(function(l){var q=l.match(/^\s*>\s?(.*)$/),li=l.match(/^\s*[-•]\s+(.*)$/),ty=q?"q":li?"l":"p";
    if(ty!==ct){ct=ty;cur=h(ty==="q"?"blockquote":ty==="l"?"ul":"span",ty==="p"?"pl":"");d.appendChild(cur)}
    else if(ty!=="l")cur.appendChild(document.createTextNode("\n"));
    if(ty==="l"){var x=h("li");inl(x,li[1]);cur.appendChild(x)}else inl(cur,q?q[1]:l)});
  return d}
function plain(t){var l=String(t||"").split("\n").map(function(x){return x.replace(/^\s*(>\s?|[-•]\s+)/,"").replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(?![\s*])([^*]+?)\*/g,"$1").trim()}).filter(Boolean)[0]||"";
  if(l.length>90){l=l.slice(0,89);var sp=l.lastIndexOf(" ");if(sp>60)l=l.slice(0,sp);l=l.replace(/[\s,.;:—-]+$/,"")+"…"}return l}

/* editor */
var ta=$("fNote");
function grow(){ta.style.height="auto";ta.style.height=Math.max(160,ta.scrollHeight+2)+"px"}
ta.addEventListener("input",grow);
function edit(s,e,txt,selS,selE){var v=ta.value;ta.value=v.slice(0,s)+txt+v.slice(e);ta.focus();ta.setSelectionRange(selS,selE);grow()}
function wrapSel(m){var s=ta.selectionStart,e=ta.selectionEnd,sel=ta.value.slice(s,e),lead=sel.match(/^\s*/)[0],trail=sel.match(/\s*$/)[0],core=sel.trim();
  if(!core){edit(s,e,m+m,s+m.length,s+m.length);return}
  edit(s,e,lead+m+core+m+trail,s+lead.length+m.length,s+lead.length+m.length+core.length)}
function prefixSel(p){var v=ta.value,s=v.lastIndexOf("\n",ta.selectionStart-1)+1,e=v.indexOf("\n",ta.selectionEnd);if(e<0)e=v.length;
  if(ta.selectionEnd>ta.selectionStart&&v[ta.selectionEnd-1]==="\n"&&ta.selectionEnd-1>=s)e=ta.selectionEnd-1;
  var ls=v.slice(s,e).split("\n"),all=ls.every(function(l){return l.indexOf(p)===0}),out=ls.map(function(l){return all?l.slice(p.length):p+l}).join("\n");
  edit(s,e,out,s+(ls.length>1?0:out.length),s+out.length)}
function insertRef(){var s=ta.selectionStart,e=ta.selectionEnd;
  openPicker({title:"Вставить ссылку на отрывок",done:function(r){var val=ta.value,t=refLabel(r);
    if(s>0&&!/\s/.test(val[s-1]))t=" "+t;if(e<val.length&&!/\s/.test(val[e]))t+=" ";
    edit(s,e,t,s+t.length,s+t.length);say("msg","")}})}
Array.prototype.forEach.call($("tbar").querySelectorAll("button"),function(b){
  b.addEventListener("mousedown",function(ev){ev.preventDefault()});
  b.onclick=function(){if(!$("pv").hidden)return;if(b.dataset.w)wrapSel(b.dataset.w);else if(b.dataset.p)prefixSel(b.dataset.p);else insertRef()}});
function setPreview(on){$("pv").hidden=!on;ta.hidden=on;$("pvBtn").textContent=on?"Редактировать":"Предпросмотр";$("pvBtn").setAttribute("aria-pressed",on);
  Array.prototype.forEach.call($("tbar").querySelectorAll("button"),function(b){b.disabled=on});
  if(on){if(ta.value.trim())rich(ta.value,$("pv"));else{$("pv").innerHTML="";$("pv").appendChild(h("span","empty","Заметка пока пуста."))}}else grow()}
$("pvBtn").onclick=function(){setPreview($("pv").hidden)};

var flt={q:"",date:"",tag:"",book:"",ch:0,fav:false},openD={};
function fActive(){return !!(flt.q||flt.date||flt.tag||flt.book||flt.fav)}
function fCount(){return (flt.date?1:0)+(flt.tag?1:0)+(flt.book?1:0)+(flt.fav?1:0)}
function fillChSel(){var s=$("qCh"),b=BK[flt.book];s.innerHTML="";s.appendChild(new Option(b?"Все главы":"Сначала книга",""));
  if(b)for(var i=1;i<=b.c;i++)s.appendChild(new Option(i,i));s.value=b&&flt.ch?String(flt.ch):"";s.disabled=!b}
function syncF(){$("q").value=flt.q;$("qDate").value=flt.date;$("qTag").value=flt.tag;$("qBook").value=flt.book;fillChSel();$("qFav").checked=flt.fav}
function showPassage(b,c){closeAll().then(function(ok){if(!ok)return;flt={q:"",date:"",tag:"",book:b,ch:c,fav:false};syncF();tab("L")})}
function setTag(t){closeAll().then(function(ok){if(!ok)return;flt.tag=t;syncF();if(curTab!=="L")tab("L");else render()})}
(function(){var s=$("qBook"),g1=document.createElement("optgroup"),g2=document.createElement("optgroup");g1.label="Əhdi-Ətiq";g2.label="Əhdi-Cədid";
  s.appendChild(new Option("Все книги",""));B.forEach(function(b,i){(i<39?g1:g2).appendChild(new Option(b.n,b.k))});s.appendChild(g1);s.appendChild(g2)})();
$("q").addEventListener("input",function(){flt.q=this.value;render()});
$("qDate").addEventListener("change",function(){flt.date=this.value;render()});
$("qTag").addEventListener("change",function(){flt.tag=this.value;render()});
$("qBook").addEventListener("change",function(){flt.book=this.value;flt.ch=0;render()});
$("qFav").addEventListener("change",function(){flt.fav=this.checked;render()});
$("qReset").onclick=function(){flt={q:"",date:"",tag:"",book:"",ch:0,fav:false};syncF();render()};
function tagCounts(){var n={};entries.forEach(function(e){(e.tags||[]).forEach(function(t){n[t]=(n[t]||0)+1})});return n}
function fillSel(s,first,n,lab){var v=s.value;s.innerHTML="";s.appendChild(new Option(first,""));
  Object.keys(n).sort(function(a,b){return a.localeCompare(b,"az")}).forEach(function(t){s.appendChild(new Option(lab?t+" ("+n[t]+")":t,t))});s.value=n[v]?v:""}
function match(e){
  if(flt.date&&e.date!==flt.date)return false;
  if(flt.fav&&!e.fav)return false;
  if(flt.tag&&(e.tags||[]).indexOf(flt.tag)<0)return false;
  if(flt.book&&!(e.refs||[]).some(function(r){return r.b===flt.book&&(!flt.ch||+r.c===+flt.ch)}))return false;
  var q=fold(flt.q.trim());if(!q)return true;
  return fold([e.key,e.note,(e.tags||[]).join(" "),(e.refs||[]).map(refLabel).join(" ")].join(" ")).indexOf(q)>=0}

/* list */
function render(){renderList();if(curTab==="P")renderProg();if(curTab==="Y")renderYB();if(curTab==="W")renderRecent();renderGoalCard();renderHdr();achCheck();if(det)renderDetail()}
var curList=[];
function cmpDesc(a,b){return a.date<b.date?1:a.date>b.date?-1:(a.id<b.id?1:-1)}
function renderList(){
  var dl=$("tagList");dl.innerHTML="";var tc=tagCounts();Object.keys(tc).forEach(function(t){var o=document.createElement("option");o.value=t;dl.appendChild(o)});
  if(flt.tag&&!tc[flt.tag])flt.tag="";fillSel($("qTag"),"Все темы",tc,true);$("qTag").value=flt.tag;fillSel($("tmOld"),"Выберите тему",tc,true);fillChSel();
  renderChips();var fc=fCount(),bd=$("fltN");bd.hidden=!fc;bd.textContent=fc;$("fltBtn").setAttribute("aria-label","Фильтры"+(fc?", активно: "+fc:""));
  var list=$("list");list.innerHTML="";
  if(cloudLoading&&!entries.length){skel(list,4);say("found","Загрузка записей…");say("found2","");curList=[];return}
  var f=entries.filter(match);f.sort(cmpDesc);curList=f;
  var tot=f.reduce(function(a,e){return a+secsOf(e)},0),ft="Найдено записей: "+f.length+", время: "+(fmtSecs(tot).trim()||"0 мин");
  say("found",ft);say("found2",ft);
  if(!f.length){list.appendChild(entries.length?emptyState("search","Ничего не найдено.","Сбросить фильтры",resetFlt):emptyState("book","Записей пока нет. Добавьте первую — после чтения или прямо сейчас.","Новая запись",newEntry));return}
  if(VIEW==="compact")listCompact(list,f);else if(VIEW==="timeline")listTimeline(list,f);else listCards(list,f)}
function resetFlt(){flt={q:"",date:"",tag:"",book:"",ch:0,fav:false};syncF();render()}
function monthGroups(f){var groups=[],gi={};f.forEach(function(e){var k=e.date.slice(0,7);if(!(k in gi)){gi[k]=groups.length;groups.push({k:k,days:[],di:{},n:0,s:0})}var g=groups[gi[k]];
    if(!(e.date in g.di)){g.di[e.date]=g.days.length;g.days.push([])}g.days[g.di[e.date]].push(e);g.n++;g.s+=secsOf(e)});return groups}
function listCards(list,f){var act=fActive();
  monthGroups(f).forEach(function(g,idx){
    var d=h("details","month"),sm=h("summary","",monthName(g.k));
    sm.appendChild(h("small","",g.n+" зап."+(g.s?", "+fmtSecs(g.s):"")));d.appendChild(sm);
    d.open=act||(g.k in openM?openM[g.k]:idx===0);
    d.addEventListener("toggle",function(){if(!fActive())openM[g.k]=d.open});
    g.days.forEach(function(es){d.appendChild(es.length>1?dayCard(es):swipeWrap(card(es[0]),es[0]))});list.appendChild(d)})}
function listCompact(list,f){monthGroups(f).forEach(function(g){var mh=h("div","ap-mh");mh.appendChild(h("span","",monthName(g.k)));mh.appendChild(h("small","",g.n+" зап."+(g.s?", "+fmtSecs(g.s):"")));list.appendChild(mh);
  g.days.forEach(function(es){es.forEach(function(e){list.appendChild(swipeWrap(rowEl(e),e,true))})})})}
function rowEl(e){var r=h("div","ap-row entry-row");r.tabIndex=0;r.setAttribute("role","button");var a=e.date.split("-"),dt=new Date(+a[0],+a[1]-1,+a[2]);
  var d=h("div","ap-rd");d.appendChild(h("div","",String(+a[2])+" "+MS[+a[1]-1]));d.appendChild(h("div","",dt.toLocaleDateString("ru-RU",{weekday:"short"})));r.appendChild(d);
  var m=h("div","ap-rm"),k=keyOf(e);m.appendChild(h("div","ap-rr",(e.refs||[]).length?e.refs.map(refLabel).join("; "):"Без отрывка"));if(k.t)m.appendChild(h("div","ap-rk",k.t));r.appendChild(m);
  var x=h("div","ap-rx"),t=fmtSecs(secsOf(e)).trim();if(t)x.appendChild(h("span","",t.replace(/ сек$/," с")));x.appendChild(favBtn(e));r.appendChild(x);
  r.setAttribute("aria-label",fmtDay(e.date)+": "+((e.refs||[]).map(refLabel).join("; ")||k.t||"запись"));
  r.addEventListener("click",function(ev){if(ev.target.closest("button")||swJust())return;openDetail(e.id,r)});
  r.addEventListener("keydown",function(ev){if(ev.target===r&&(ev.key==="Enter"||ev.key===" ")){ev.preventDefault();openDetail(e.id,r)}});return r}
function listTimeline(list,f){monthGroups(f).forEach(function(g){list.appendChild(h("div","ap-tlm",monthName(g.k)));var w=h("div","ap-tlw");
  g.days.forEach(function(es){var d=h("div","ap-tld"),hd=h("div","ap-tldh"),s=es.reduce(function(a,e){return a+secsOf(e)},0);hd.appendChild(h("span","",fmtDate(es[0].date)));if(s)hd.appendChild(h("span","",fmtSecs(s).trim()));d.appendChild(hd);
    es.forEach(function(e){var b=h("button","ap-tli"),k=keyOf(e);b.type="button";var rr=h("div","ap-rr",(e.refs||[]).length?e.refs.map(refLabel).join("; "):"Без отрывка");if(e.fav){var st=h("span","ap-fv"," ★");st.setAttribute("aria-label","избранное");rr.appendChild(st)}b.appendChild(rr);
      if(k.t)b.appendChild(h("div","ap-rk",k.t));if(e.tags&&e.tags.length)b.appendChild(h("div","ap-rs",e.tags.join(" · ")));b.onclick=function(){openDetail(e.id,b)};d.appendChild(b)});w.appendChild(d)});list.appendChild(w)})}
function renderChips(){var box=$("aChips");box.innerHTML="";var items=[];
  if(flt.q.trim())items.push(["Поиск: «"+flt.q.trim()+"»",function(){flt.q=""}]);
  if(flt.date)items.push(["Дата: "+fmtDay(flt.date),function(){flt.date=""}]);
  if(flt.tag)items.push(["Тема: "+flt.tag,function(){flt.tag=""}]);
  if(flt.book&&BK[flt.book])items.push([BK[flt.book].n+(flt.ch?" "+flt.ch:""),function(){flt.book="";flt.ch=0}]);
  if(flt.fav)items.push(["Только избранное",function(){flt.fav=false}]);
  items.forEach(function(it){var c=h("span","chip");c.appendChild(h("span","",it[0]));var x=h("button","","×");x.type="button";x.setAttribute("aria-label","Убрать фильтр: "+it[0]);
    x.onclick=function(){it[1]();syncF();render();var n=$("aChips").querySelector("button");(n||$("q")).focus()};c.appendChild(x);box.appendChild(c)});
  if(items.length>1){var r=h("button","btn sm","Сбросить всё");r.type="button";r.onclick=function(){resetFlt();$("q").focus()};box.appendChild(r)}}
function keyOf(e){return e.key?{t:e.key,a:false}:{t:plain(e.note),a:true}}
function tagChips(ts){var tg=h("div","chips");ts.forEach(function(x){var b=h("button","chip tag",x);b.type="button";b.title="Показать записи с темой «"+x+"»";b.onclick=function(){setTag(x)};tg.appendChild(b)});return tg}
function favBtn(e){var b=h("button","star",e.fav?"★":"☆");b.type="button";
  function upd(){b.textContent=e.fav?"★":"☆";b.setAttribute("aria-pressed",!!e.fav);b.setAttribute("aria-label",e.fav?"Убрать из избранного":"В избранное");b.title=b.getAttribute("aria-label")}
  upd();b.onclick=function(){e.fav=!e.fav;upd();saveFav(e);if(!coll)setTimeout(render,0)};return b}
function card(e,sub){
  var c=h("article","entry ap-click"+(sub?" subc":"")),top=h("div","top");top.appendChild(h("span","",fmtDate(e.date)));c.tabIndex=0;c.dataset.id=e.id;
  var r=h("span","r"),t=fmtSecs(secsOf(e));if(t)r.appendChild(h("span","",t));r.appendChild(favBtn(e));top.appendChild(r);c.appendChild(top);
  var k=keyOf(e);if(k.t)c.appendChild(h("div","key"+(k.a?" auto":""),k.t));
  if(e.refs&&e.refs.length)c.appendChild(h("div","refs",e.refs.map(refLabel).join("; ")));
  if(e.tags&&e.tags.length)c.appendChild(tagChips(e.tags));
  if(e.note)c.appendChild(rich(e.note));
  var a=h("div","acts"),b1=h("button","btn sm","Изменить"),b2=h("button","btn sm","Удалить");b1.type=b2.type="button";
  b1.onclick=function(){startEdit(e)};b2.onclick=function(){askDelete(e)};
  a.appendChild(b1);a.appendChild(b2);c.appendChild(a);
  c.addEventListener("click",function(ev){ev.stopPropagation();if(ev.target.closest("button,a,summary,input,select,textarea")||swJust())return;if(window.getSelection&&String(window.getSelection()).length)return;openDetail(e.id,c)});
  c.addEventListener("keydown",function(ev){if(ev.target===c&&ev.key==="Enter"){ev.preventDefault();openDetail(e.id,c)}});return c}
function dayCard(es){
  var day=es[0].date,c=h("article","entry day ap-click"),top=h("div","top");top.appendChild(h("span","",fmtDate(day)));
  var s=es.reduce(function(a,e){return a+secsOf(e)},0);top.appendChild(h("span","",es.length+" зап."+(s?", "+fmtSecs(s):"")));c.appendChild(top);
  var ks=h("div","keys"),kseen={};es.forEach(function(e){var k=keyOf(e);if(k.t&&!kseen[k.t]&&(kseen[k.t]=1))ks.appendChild(h("div","key"+(k.a?" auto":""),k.t))});if(ks.childNodes.length)c.appendChild(ks);
  var rl=[],ts=[];es.forEach(function(e){(e.refs||[]).forEach(function(r){var l=refLabel(r);if(rl.indexOf(l)<0)rl.push(l)});(e.tags||[]).forEach(function(t){if(ts.indexOf(t)<0)ts.push(t)})});
  if(rl.length)c.appendChild(h("div","refs",rl.join("; ")));if(ts.length)c.appendChild(tagChips(ts));
  var a=h("div","acts"),b=h("button","btn sm",openD[day]?"Скрыть отдельные записи":"Показать отдельные записи"),box=h("div");b.type="button";b.setAttribute("aria-expanded",!!openD[day]);
  box.hidden=!openD[day];es.forEach(function(e){box.appendChild(swipeWrap(card(e,true),e))});
  b.onclick=function(){openD[day]=!openD[day];box.hidden=!openD[day];b.textContent=openD[day]?"Скрыть отдельные записи":"Показать отдельные записи";b.setAttribute("aria-expanded",!!openD[day])};
  a.appendChild(b);c.appendChild(a);c.appendChild(box);
  c.tabIndex=0;c.addEventListener("click",function(ev){if(ev.target.closest("button,a,summary")||swJust())return;openDetail(es[0].id,c)});
  c.addEventListener("keydown",function(ev){if(ev.target===c&&ev.key==="Enter"){ev.preventDefault();openDetail(es[0].id,c)}});return c}
function askDelete(e){var rf=(e.refs||[]).map(refLabel).join("; ");
  confirmDlg({title:"Удалить запись?",text:fmtDay(e.date)+(rf?" · "+rf:"")+". Запись можно будет вернуть в течение нескольких секунд.",ok:"Удалить",danger:true}).then(function(ok){if(ok)delWithUndo(e)})}
function delWithUndo(e){var o=entries.find(function(x){return x.id===e.id})||e,copy=JSON.parse(JSON.stringify(o));
  if(det&&det.id===e.id)closeModal(det.m);removeEntry(e.id);if(coll){entries=entries.filter(function(x){return x.id!==e.id});render()}
  toast("Запись удалена",{action:"Отменить",fn:function(){putEntry(copy);if(coll){entries.push(copy);render()}toast("Запись восстановлена")}})}
/* topics */
$("tmRen").onclick=function(){var o=$("tmOld").value,n=$("tmNew").value.replace(/,/g," ").replace(/\s+/g," ").trim();
  if(!o||!n){say("tmMsg","Выберите тему и впишите новое название.");return}if(n===o){say("tmMsg","Название не изменилось.");return}
  var merge=!!tagCounts()[n],cnt=entries.filter(function(e){return (e.tags||[]).indexOf(o)>=0}).length;
  confirmDlg({title:merge?"Объединить темы?":"Переименовать тему?",text:"«"+o+"» → «"+n+"». Изменится записей: "+cnt+".",ok:merge?"Объединить":"Переименовать"}).then(function(ok){if(!ok)return;
  var ch=entries.filter(function(e){return (e.tags||[]).indexOf(o)>=0}).map(function(e){var t=[];e.tags.forEach(function(x){x=x===o?n:x;if(t.indexOf(x)<0)t.push(x)});return Object.assign({},e,{tags:t})});
  if(flt.tag===o)flt.tag=n;saveMany(ch);$("tmNew").value="";say("tmMsg",(merge?"Темы объединены":"Тема переименована")+", изменено записей: "+ch.length+".")})};
$("tmDel").onclick=function(){var o=$("tmOld").value;if(!o){say("tmMsg","Выберите тему.");return}
  var cnt=entries.filter(function(e){return (e.tags||[]).indexOf(o)>=0}).length;
  confirmDlg({title:"Удалить тему?",text:"Тема «"+o+"» будет убрана из записей: "+cnt+". Сами записи останутся.",ok:"Удалить тему",danger:true}).then(function(ok){if(!ok)return;
  var ch=entries.filter(function(e){return (e.tags||[]).indexOf(o)>=0}).map(function(e){return Object.assign({},e,{tags:e.tags.filter(function(x){return x!==o})})});
  if(flt.tag===o)flt.tag="";saveMany(ch);say("tmMsg","Тема удалена из записей: "+ch.length+".")})};
/* progress */
var GKEY="bd2-goal",goal=null,calM=todayStr().slice(0,7),calSel="",mapOpen={},gDelArm=false,gDelT=null,SVGNS="http://www.w3.org/2000/svg";
try{var gr=localStorage.getItem(GKEY);if(gr)goal=JSON.parse(gr)||null}catch(e){}
function plur(n,a,b,c){n=Math.abs(Math.round(n));var t=n%100,u=n%10;return t>10&&t<20?c:u===1?a:u>1&&u<5?b:c}
function num(n){return Number(n).toLocaleString("ru-RU",{maximumFractionDigits:1})}
function dnum(s){var a=s.split("-");return Date.UTC(+a[0],+a[1]-1,+a[2])/864e5}
function dstr(n){var d=new Date(n*864e5);return d.getUTCFullYear()+"-"+pad(d.getUTCMonth()+1)+"-"+pad(d.getUTCDate())}
function fmtDay(s){var a=s.split("-");return new Date(+a[0],+a[1]-1,+a[2]).toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"}).replace(/\s*г\.?$/,"")}
function wdOf(s){return (new Date(dnum(s)*864e5).getUTCDay()+6)%7}
var MS=["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"],WD=["Пн","Вт","Ср","Чт","Пт","Сб","Вс"],WDF=["понедельник","вторник","среда","четверг","пятница","суббота","воскресенье"];
function readMap(list){var m={};(list||entries).forEach(function(e){(e.refs||[]).forEach(function(r){var b=BK[r.b],c=+r.c;if(b&&c>=1&&c<=b.c){(m[r.b]=m[r.b]||{})[c]=1}})});return m}
function cntRead(m,from,to){var n=0;B.slice(from,to).forEach(function(b){n+=Object.keys(m[b.k]||{}).length});return n}
function chOf(e){var s={};(e.refs||[]).forEach(function(r){if(BK[r.b])s[r.b+" "+(+r.c)]=1});return Object.keys(s).length}
function renderProg(){renderRings();renderTiles();renderHeat();renderCal();renderGoal();renderStats();renderAch()}
function pct(a,b){return num(Math.floor(a/b*1000)/10)+" %"}

/* 4.2 calendar */
function byDate(){var o={};entries.forEach(function(e){(o[e.date]=o[e.date]||[]).push(e)});return o}
$("calPrev").onclick=function(){var a=calM.split("-"),y=+a[0],m=+a[1]-1;if(m<1){m=12;y--}calM=y+"-"+pad(m);renderCal()};
$("calNext").onclick=function(){var a=calM.split("-"),y=+a[0],m=+a[1]+1;if(m>12){m=1;y++}calM=y+"-"+pad(m);renderCal()};
function renderCal(){var bd=byDate(),g=$("cal"),a=calM.split("-"),y=+a[0],mo=+a[1],first=calM+"-01",nd=new Date(y,mo,0).getDate(),off=wdOf(first),td=todayStr();
  $("calT").textContent=monthName(calM);g.innerHTML="";WD.forEach(function(w){g.appendChild(h("span","wd",w))});
  for(var i=0;i<off;i++)g.appendChild(h("span","pad"));
  for(var d=1;d<=nd;d++){var ds=calM+"-"+pad(d),n=(bd[ds]||[]).length,b=h("button","cday"+(n?" has":"")+(ds===td?" today":"")+(ds===calSel?" sel":""));b.type="button";
    b.appendChild(h("span","dn",d));if(n)b.appendChild(h("span","cnt",n));
    b.setAttribute("aria-label",fmtDay(ds)+(n?", записей: "+n:", записей нет"));b.setAttribute("aria-pressed",ds===calSel);
    b.onclick=(function(ds){return function(){calSel=calSel===ds?"":ds;renderCal()}})(ds);g.appendChild(b)}
  var box=$("calDay");box.innerHTML="";if(!calSel)return;var es=(bd[calSel]||[]).slice().sort(function(a,b){return a.id<b.id?1:-1});
  box.appendChild(h("div","calh2",fmtDay(calSel)));
  if(!es.length)box.appendChild(h("div","empty","В этот день записей нет."));else es.forEach(function(e){box.appendChild(card(e))})}

/* 4.3 goals: две независимые цели — «Минуты в день» и «План чтения».
   goal = {minutes:{perDay,start}|null, plan:{id,start}|null} или null, если обе выключены */
var GDROP="",GDK="bd8-gdrop-ack",gEd={minutes:false,plan:false};
function isDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s||"")}
function oldLabel(g){var n=Math.round(+g.n);return g.type==="ch"?un("ch",n)+" в день":"Библия за "+n+" "+plur(n,"день","дня","дней")}
/* любой формат (старая одиночная цель этапов 3–7 или новый) → {g:{minutes,plan}|null, drop:подпись снятой старой цели} */
function normGoal(g){var r={g:null,drop:""},m=null,p=null;if(!g||typeof g!=="object")return r;
  if(g.type){if(g.type==="min"&&+g.n>=1&&isDate(g.start))m={perDay:Math.max(1,Math.min(1440,Math.round(+g.n))),start:g.start};
    else if(g.type==="plan"&&typeof g.plan==="string"&&PLAN[g.plan]&&isDate(g.start))p={id:g.plan,start:g.start};
    else if((g.type==="ch"||g.type==="bible")&&+g.n>=1)r.drop=oldLabel(g)}
  else{var a=g.minutes,b=g.plan;
    if(a&&typeof a==="object"&&+a.perDay>=1&&+a.perDay<=1440&&isDate(a.start))m={perDay:Math.round(+a.perDay),start:a.start};
    if(b&&typeof b==="object"&&typeof b.id==="string"&&PLAN[b.id]&&isDate(b.start))p={id:b.id,start:b.start}}
  if(m||p)r.g={minutes:m,plan:p};return r}
function MG(){return goal&&goal.minutes?{type:"min",n:goal.minutes.perDay,start:goal.minutes.start}:null}
function PG(){return goal&&goal.plan&&PLAN[goal.plan.id]?{type:"plan",plan:goal.plan.id,n:planDays(PLAN[goal.plan.id]).length,start:goal.plan.start}:null}
function noteDrop(l){if(l&&lsGet(GDK,"")!==l)GDROP=l}
function saveGoal(g){if(g&&!g.minutes&&!g.plan)g=null;if(g)g={minutes:g.minutes||null,plan:g.plan||null};goal=g;var pend=!coll&&g?1:0;
  try{if(g)localStorage.setItem(GKEY,JSON.stringify(Object.assign({},g,pend?{pend:1}:{})));else localStorage.removeItem(GKEY)}catch(e){}
  if(!coll)stampG();
  if(coll){if(g)coll.doc("goal").set(goalBody(g)).then(function(){setSync("ok")},function(){setSync("err")});else coll.doc("goal").delete().catch(function(){setSync("err")})}
  renderProgIf();renderGoalCard();renderHdr()}
function goalBody(g){return{kind:"goal",minutes:g.minutes?{perDay:+g.minutes.perDay,start:g.minutes.start}:null,plan:g.plan?{id:g.plan.id,start:g.plan.start}:null}}
function setPart(k,v){var g={minutes:goal?goal.minutes:null,plan:goal?goal.plan:null};g[k]=v;saveGoal(g)}
/* миграция при загрузке из localStorage */
(function(){var pend=goal&&goal.pend,r=normGoal(goal);noteDrop(r.drop);goal=r.g;
  try{if(goal)localStorage.setItem(GKEY,JSON.stringify(Object.assign({},goal,pend?{pend:1}:{})));else localStorage.removeItem(GKEY)}catch(e){}})();
function renderProgIf(){if(curTab==="P")renderProg()}
function un(t,n,acc){return n+" "+(t==="min"?(acc?plur(n,"минуту","минуты","минут"):plur(n,"минута","минуты","минут")):(acc?plur(n,"главу","главы","глав"):plur(n,"глава","главы","глав")))}
function unG(t,n){var one=n%10===1&&n%100!==11;return n+" "+(t==="min"?(one?"минуты":"минут"):(one?"главы":"глав"))}
function goalInfo(g,list,today){if(g.type==="plan")return planInfo(g,list,today);list=list||entries;today=today||todayStr();var n=+g.n,s=g.start,L=[],st,D=dnum(today)-dnum(s)+1;
  if(g.type==="bible"){var end=dstr(dnum(s)+n-1),m=readMap(list),rd=cntRead(m,0,66),rem=1189-rd,bar={v:rd,max:1189,mark:D>=1&&D<=n?Math.min(1189,Math.ceil(1189*D/n)):null,txt:rd+" из 1189 глав · "+pct(rd,1189)+(D>=1&&D<=n?" · по плану к концу дня: "+Math.min(1189,Math.ceil(1189*D/n))+" (черта)":"")};
    L.push("Цель: прочитать Библию за "+n+" "+plur(n,"день","дня","дней")+", с "+fmtDay(s)+" по "+fmtDay(end)+".");
    L.push("Прочитано "+rd+" из 1189 глав ("+pct(rd,1189)+"), осталось "+un("ch",rem)+".");
    if(!rem){L.push("Вся Библия прочитана. Цель достигнута!");return{lines:L,bar:bar,st:"ok"}}
    if(D<1){L.push("План начнётся "+fmtDay(s)+".");return{lines:L,bar:bar,st:"wait"}}
    if(D>n){L.push("Срок плана закончился "+fmtDay(end)+". Цель можно изменить.");return{lines:L,bar:bar,st:"late"}}
    var left=n-D+1,pace=Math.ceil(rem/left*10)/10;L.push("Осталось дней: "+left+". Нужно примерно "+num(pace)+" "+(pace%1?"главы":plur(pace,"глава","главы","глав"))+" в день.");
    st=status(rd,Math.ceil(1189*D/n),Math.ceil(1189*(D-1)/n),"ch");L.push(st.t);return{lines:L,bar:bar,st:st.s}}
  var t=g.type,val=function(e){return t==="ch"?chOf(e):secsOf(e)/60};
  L.push("Цель: "+un(t,n)+" в день, с "+fmtDay(s)+".");
  var bar={v:0,max:n,txt:"Сегодня: 0 из "+unG(t,n)};
  if(D<1){L.push("План начнётся "+fmtDay(s)+".");return{lines:L,bar:bar,st:"wait"}}
  var done=0,tdn=0;list.forEach(function(e){if(e.date>=s&&e.date<=today){var v=val(e);done+=v;if(e.date===today)tdn+=v}});
  done=Math.floor(done);tdn=Math.floor(tdn);var due=Math.max(0,n*D-(done-tdn)),mx=Math.max(n,due);bar={v:tdn,max:mx,txt:"Сегодня: "+tdn+" из "+unG(t,mx)+(due>n?" (включая "+(due-n)+" за прошлые дни)":"")+" · "+Math.min(100,Math.floor(tdn/mx*100))+" %"};
  L.push("Сегодня: "+tdn+" из "+n+".");L.push("С начала плана ("+D+" "+plur(D,"день","дня","дней")+"): "+done+" из "+n*D+".");
  st=status(done,n*D,n*(D-1),t);L.push(st.t);return{lines:L,bar:bar,st:st.s}}
function status(done,Pt,Py,t){if(done>=Pt)return done>Pt?{s:"ok",t:"Впереди плана на "+un(t,done-Pt,1)+"."}:{s:"ok",t:"Вы точно по плану."};
  if(done>=Py)return{s:"ok",t:"Идёте по плану. Чтобы выполнить план к концу дня, осталось "+un(t,Pt-done)+"."};
  return{s:"late",t:"Отстаёте на "+un(t,Py-done,1)+". Чтобы догнать план сегодня, "+(t==="min"?"почитайте":"прочитайте")+" ещё "+un(t,Pt-done,1)+"."}}
function gBtn(t,fn,cls){var b=h("button","btn sm"+(cls?" "+cls:""),t);b.type="button";b.onclick=fn;return b}
function gFocus(id){var e=$(id);if(e)try{e.focus({preventScroll:false})}catch(x){}}
function gSec(k,title,on,desc){var s=h("section","ap-gsec"+(on?" on":""));s.id="gs-"+k;var hd=h("div","ap-gsh"),tw=h("div","ap-gsti"),t=h("h3","ap-h3",title);t.id="gs-"+k+"-t";tw.appendChild(t);tw.appendChild(h("span","ap-gsd",desc));hd.appendChild(tw);
  var sw=h("button","ap-gsw");sw.type="button";sw.id="gs-"+k+"-sw";sw.setAttribute("role","switch");sw.setAttribute("aria-checked",on?"true":"false");sw.setAttribute("aria-labelledby","gs-"+k+"-t");sw.appendChild(h("span","ap-gswk"));
  sw.onclick=function(){if(goal&&goal[k])gOff(k);else if(gEd[k]){gEd[k]=false;say("gMsg","");renderGoal();gFocus("gs-"+k+"-sw")}else{gEd[k]=true;say("gMsg","");renderGoal();gFocus(k==="minutes"?"gMin":"gPlan")}};
  hd.appendChild(sw);s.appendChild(hd);return s}
function gOff(k){var mn=k==="minutes";confirmDlg({title:mn?"Выключить «Минуты в день»?":"Выключить план чтения?",text:"Записи останутся в дневнике"+(mn?"":", а отметки плана вернутся, если снова выбрать этот план с той же датой начала")+". Включить можно в любой момент.",ok:"Выключить",danger:true}).then(function(ok){if(ok){gEd[k]=false;setPart(k,null);say("gMsg",mn?"Цель «Минуты в день» выключена.":"План чтения выключен.");gFocus("gs-"+k+"-sw")}})}
function gActs(save,cancel){var a=h("div","acts"),b1=h("button","btn main","Сохранить"),b2=h("button","btn","Отмена");b1.type=b2.type="button";b1.onclick=save;b2.onclick=cancel;a.appendChild(b1);a.appendChild(b2);return a}
function gField(lab,el){var d=h("div"),l=h("label","",lab);l.htmlFor=el.id;d.appendChild(l);d.appendChild(el);return d}
function gDate(id,v){var i=document.createElement("input");i.type="date";i.id=id;i.value=v;return i}
function minSec(){var M=goal&&goal.minutes,ed=gEd.minutes,s=gSec("minutes","Минуты в день",!!M||ed,M?un("min",M.perDay)+" в день":"Сколько минут читать каждый день");
  if(ed){var f=h("div","gform"),inp=document.createElement("input");inp.type="number";inp.id="gMin";inp.min="1";inp.max="1440";inp.step="1";inp.inputMode="numeric";inp.value=M?M.perDay:15;
    var pr=h("div","ap-gpre");pr.setAttribute("role","group");pr.setAttribute("aria-label","Быстрый выбор минут");
    function sync(){[].forEach.call(pr.children,function(b){b.setAttribute("aria-pressed",String(+b.getAttribute("data-n")===+inp.value))})}
    [10,15,20,30].forEach(function(n){var b=gBtn(n+" мин",function(){inp.value=n;sync()},"ap-gp");b.setAttribute("data-n",n);pr.appendChild(b)});sync();inp.oninput=sync;
    var di=gDate("gMinStart",M?M.start:todayStr()),row=h("div","row");row.appendChild(gField("Сколько минут в день",inp));row.appendChild(gField("С какого дня считать",di));f.appendChild(row);f.appendChild(pr);
    f.appendChild(gActs(function(){var n=+inp.value;if(!(n>=1&&n<=1440&&n%1===0)){say("gMsg","Укажите целое число минут от 1 до 1440.");inp.focus();return}gEd.minutes=false;setPart("minutes",{perDay:n,start:isDate(di.value)?di.value:todayStr()});say("gMsg","Цель «Минуты в день» сохранена: "+un("min",n)+".");gFocus("gs-minutes-sw")},
      function(){gEd.minutes=false;say("gMsg","");renderGoal();gFocus("gs-minutes-sw")}));
    inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();f.querySelector(".acts .btn").click()}};s.appendChild(f)}
  else if(M){var gi=goalInfo(MG()),c=h("div","goal "+gi.st);gi.lines.forEach(function(l,i){c.appendChild(h("p",i===gi.lines.length-1?"gst":"",l))});s.appendChild(c);
    var a=h("div","acts");a.appendChild(gBtn("Изменить",function(){gEd.minutes=true;say("gMsg","");renderGoal();gFocus("gMin")}));s.appendChild(a)}
  else s.appendChild(h("p","hint","Выключено. Включите, чтобы видеть, сколько минут осталось на сегодня."));
  return s}
function planSec(){var P=goal&&goal.plan,ed=gEd.plan,pl=P?PLAN[P.id]:null,s=gSec("plan","План чтения",!!P||ed,pl?pl.t+", с "+fmtDay(P.start):"Чтение по расписанию: 90, 60 или 365 дней");
  if(ed){var f=h("div","gform"),sel=document.createElement("select");sel.id="gPlan";PLANS.forEach(function(p){sel.appendChild(new Option(p.t+" ("+planDays(p).length+" дней)",p.id))});if(P)sel.value=P.id;
    var inf=h("p","hint");inf.id="gPlanInfo";function upd(){var p=PLAN[sel.value];inf.textContent=p?planDays(p).length+" дней, "+plR(planTotal(p))+". Источник: "+p.src+".":""}sel.onchange=upd;upd();
    var di=gDate("gPlanStart",P?P.start:todayStr()),row=h("div","row");row.appendChild(gField("План",sel));row.appendChild(gField("Дата начала плана",di));f.appendChild(row);f.appendChild(inf);
    f.appendChild(gActs(function(){if(!PLAN[sel.value])return;gEd.plan=false;setPart("plan",{id:sel.value,start:isDate(di.value)?di.value:todayStr()});say("gMsg","План «"+PLAN[sel.value].t+"» сохранён.");gFocus("gs-plan-sw")},
      function(){gEd.plan=false;say("gMsg","");renderGoal();gFocus("gs-plan-sw")}));s.appendChild(f)}
  else if(P){s.appendChild(planView(true));var a=h("div","acts");
    a.appendChild(gBtn("Изменить",function(){gEd.plan=true;say("gMsg","");renderGoal();gFocus("gPlan")}));
    a.appendChild(gBtn("Начать заново",function(){confirmDlg({title:"Начать план заново?",text:"План «"+pl.t+"» начнётся сегодня. Все записи останутся в дневнике, но в плане будут учитываться только записи с сегодняшнего дня.",ok:"Начать заново"}).then(function(ok){if(ok){setPart("plan",{id:P.id,start:todayStr()});say("gMsg","План начат заново.")}})}));s.appendChild(a)}
  else s.appendChild(h("p","hint","Выключено. Выберите план и дату начала — на главной появится список чтений на сегодня."));
  return s}
function renderGoal(){var v=$("goalView");v.innerHTML="";
  if(GDROP){var n=h("div","ap-gnote");n.setAttribute("role","note");n.appendChild(h("p","","Прежняя цель «"+GDROP+"» больше не поддерживается и снята. Записи и прогресс не изменились. Теперь можно включить «Минуты в день» и «План чтения» — по отдельности или обе сразу."));
    n.appendChild(gBtn("Понятно",function(){lsSet(GDK,GDROP);GDROP="";renderGoal();gFocus("gs-minutes-sw")}));v.appendChild(n)}
  v.appendChild(minSec());v.appendChild(planSec())}
function goalFromSnap(snap){var d=snap.docs.find(function(x){return x.id==="goal"&&x.exists&&(x.data()||{}).kind==="goal"}),g=d?d.data():null,lg=null;
  try{lg=JSON.parse(localStorage.getItem(GKEY)||"null")}catch(e){}
  if(!g&&lg&&lg.pend){var lr=normGoal(lg);if(lr.g){saveGoal(lr.g);return}}
  var r=normGoal(g);noteDrop(r.drop);goal=r.g;try{if(goal)localStorage.setItem(GKEY,JSON.stringify(goal));else localStorage.removeItem(GKEY)}catch(e){}}

/* 4.4 stats */
function svgEl(t,a,txt){var e=document.createElementNS(SVGNS,t);for(var k in a)e.setAttribute(k,a[k]);if(txt!==undefined)e.textContent=txt;return e}
function niceMax(m){if(m<=0)return 10;var p=Math.pow(10,Math.floor(Math.log10(m))),r=m/p;return (r<=1?1:r<=2?2:r<=5?5:10)*p}
function bars(data,title,FW){var W=FW||Math.max(260,Math.min(720,($("stats").clientWidth||320))),H=180,L=36,R=6,T=18,Bt=26,iw=W-L-R,ih=H-T-Bt,mx=niceMax(Math.max.apply(null,data.map(function(d){return d.v}))),bw=iw/data.length;
  var s=svgEl("svg",{viewBox:"0 0 "+W+" "+H,width:W,height:H,role:"img","class":"chart"});s.appendChild(svgEl("title",{},title));
  [0,.5,1].forEach(function(f){var y=T+ih-ih*f;s.appendChild(svgEl("line",{x1:L,x2:W-R,y1:y,y2:y,"class":"grid"}));s.appendChild(svgEl("text",{x:L-5,y:y+4,"text-anchor":"end","class":"ax"},num(mx*f)))});
  var lw=Math.max.apply(null,data.map(function(d){return d.l.length}))*6.5+6,step=Math.max(1,Math.ceil(lw/bw));
  data.forEach(function(d,i){var x=L+i*bw,bh=ih*d.v/mx;if(d.v>0){s.appendChild(svgEl("rect",{x:x+bw*.15,y:T+ih-bh,width:bw*.7,height:Math.max(bh,1),rx:2,"class":"bar"}));
      if(bw>=22)s.appendChild(svgEl("text",{x:x+bw/2,y:T+ih-bh-4,"text-anchor":"middle","class":"val"},num(Math.round(d.v))))}
    s.appendChild(svgEl("rect",{x:x,y:T,width:bw,height:ih,fill:"transparent","class":"hit","data-tip":d.f+": "+num(d.v)+" мин"}));
    if(i%step===(data.length-1)%step)s.appendChild(svgEl("text",{x:x+bw/2,y:H-8,"text-anchor":"middle","class":"ax"},d.l))});
  return s}
function statsData(list,today){list=list||entries;today=today||todayStr();var T=dnum(today),wk={},mo={},wd=[0,0,0,0,0,0,0],days={},tot=0,first=null;
  list.forEach(function(e){var s=secsOf(e);days[e.date]=1;if(!first||e.date<first)first=e.date;tot+=s;var dn=dnum(e.date),ws=dn-wdOf(e.date);wk[ws]=(wk[ws]||0)+s;mo[e.date.slice(0,7)]=(mo[e.date.slice(0,7)]||0)+s;wd[wdOf(e.date)]+=s});
  var cw=T-wdOf(today),W=[],M=[],a=today.split("-"),y=+a[0],m=+a[1];
  for(var i=11;i>=0;i--){var ws=cw-7*i,ds=dstr(ws);W.push({l:ds.slice(8)+"."+ds.slice(5,7),f:"Неделя с "+fmtDay(ds),v:(wk[ws]||0)/60})}
  for(i=11;i>=0;i--){var mm=m-i,yy=y;while(mm<1){mm+=12;yy--}var k=yy+"-"+pad(mm);M.push({l:MS[mm-1],f:monthName(k),v:(mo[k]||0)/60})}
  var nd=Object.keys(days).length,best=wd.indexOf(Math.max.apply(null,wd)),cal=first?Math.max(1,T-dnum(first)+1):0;
  return{W:W,M:M,WD:WD.map(function(l,i){return{l:l,f:WDF[i],v:wd[i]/60}}),tot:tot,nd:nd,perRead:nd?tot/nd:0,perCal:cal?tot/cal:0,first:first,best:tot?best:-1}}
function renderStats(){var st=$("stats"),d=statsData();st.innerHTML="";
  var dl=h("dl","sts");function row(k,v){dl.appendChild(h("dt","",k));dl.appendChild(h("dd","",v))}
  function t(s){s=Math.round(s);return fmtSecs(s).trim()||"0 мин"}
  row("Общее время",t(d.tot));row("Дней чтения",String(d.nd));
  row("В среднем за день чтения",t(d.perRead));row("В среднем за календарный день"+(d.first?" (с "+fmtDay(d.first)+")":""),d.first?t(d.perCal):"—");
  row("Самый продуктивный день недели",d.best>=0?WDF[d.best]+" ("+t(d.WD[d.best].v*60)+")":"—");st.appendChild(dl);
  if(!d.tot)st.appendChild(h("p","hint","Пока нет записей со временем чтения. Запустите таймер на вкладке «Читать» или укажите минуты в записи — здесь появятся графики."));
  [["Минуты по неделям (последние 12 недель)",d.W],["Минуты по месяцам (последние 12 месяцев)",d.M],["Минуты по дням недели (за всё время)",d.WD]].forEach(function(c){st.appendChild(h("h3","",c[0]));var w=h("div","chartw");w.appendChild(bars(c[1],c[0]));st.appendChild(w)})}
var rzT=null;window.addEventListener("resize",function(){clearTimeout(rzT);rzT=setTimeout(function(){if(!$("pP").hidden)renderStats()},200)});

/* goal card on «Читать» */
function gLabel(g){return g.type==="plan"?"план «"+PLAN[g.plan].t+"»":un("min",g.n)+" в день"}
function renderGoalCard(){var c=$("gCard"),pw=$("planW"),P=PG(),M=MG();pw.hidden=!P;pw.innerHTML="";if(P)pw.appendChild(planView(false));c.hidden=!M;if(!M)return;var gi=goalInfo(M),b=gi.bar,p=Math.min(100,b.max?b.v/b.max*100:0);
  $("gcT").textContent="Минуты в день: "+un("min",M.n);$("gcF").style.width=p+"%";$("gcN").textContent=b.txt;$("gcM").hidden=true;
  $("gcV").textContent=String(b.v);$("gcU").textContent="из "+b.max+" мин";var rc=$("gcR"),C=2*Math.PI*43;rc.style.strokeDasharray=C;rc.style.strokeDashoffset=C*(1-p/100);
  $("gcB").setAttribute("aria-valuenow",Math.round(p));$("gcB").setAttribute("aria-label","Минуты сегодня");$("gcS").textContent=gi.lines[gi.lines.length-1];c.className="gcard ap-hero "+gi.st}
$("gCard").onclick=openGoal;$("gCard").onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();openGoal()}};

/* year book */
var ybYear=null;
function ybYears(){var s={};entries.forEach(function(e){if(e.date)s[e.date.slice(0,4)]=1});return Object.keys(s).sort().reverse()}
function renderYB(){var ys=ybYears(),cur=todayStr().slice(0,4),sel=$("ybYear");if(!ys.length)ys=[cur];
  if(!ybYear||ys.indexOf(ybYear)<0)ybYear=ys.indexOf(cur)>=0?cur:ys[0];
  sel.innerHTML="";ys.forEach(function(y){sel.appendChild(new Option(y,y))});sel.value=ybYear;
  var bk=$("ybBook"),E=ybEntries(ybYear);bk.innerHTML="";$("ybPrint").disabled=$("ybDl").disabled=!E.length;
  if(!E.length){bk.appendChild(h("p","yb-empty","За "+ybYear+" год записей пока нет. Добавьте записи во вкладке «Читать» — здесь появится книга года."));return}
  buildBook(ybYear,E,bk)}
function ybEntries(y){return entries.filter(function(e){return (e.date||"").slice(0,4)===y}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:(a.id<b.id?-1:1)})}
$("ybYear").onchange=function(){ybYear=this.value;renderYB()};
function ybNote(t){var n=rich(t);Array.prototype.slice.call(n.querySelectorAll("button.rl")).forEach(function(b){b.parentNode.replaceChild(h("span","yb-ref",b.textContent),b)});return n}
function ybEntry(e){var d=h("div","yb-e"),top=h("div","yb-d"),r=h("span");top.appendChild(h("span","",fmtDate(e.date)));
  var t=fmtSecs(secsOf(e)).trim();if(t)r.appendChild(document.createTextNode(t));if(e.fav)r.appendChild(h("span","yb-fav",(t?" ":"")+"★ избранное"));top.appendChild(r);d.appendChild(top);
  if(e.key)d.appendChild(h("div","yb-k",e.key));
  if(e.refs&&e.refs.length)d.appendChild(h("div","yb-rf",e.refs.map(refLabel).join("; ")));
  if(e.tags&&e.tags.length)d.appendChild(h("div","yb-tg","Темы: "+e.tags.join(", ")));
  if(e.note)d.appendChild(ybNote(e.note));return d}
function ybRows(dl,rows){rows.forEach(function(r){dl.appendChild(h("dt","",r[0]));dl.appendChild(h("dd","",r[1]))})}
function buildBook(y,E,root){
  var tot=0,days={},mo=[0,0,0,0,0,0,0,0,0,0,0,0],fav=E.filter(function(e){return e.fav});
  E.forEach(function(e){var s=secsOf(e);tot+=s;days[e.date]=1;mo[+e.date.slice(5,7)-1]+=s});
  var nd=Object.keys(days).length,m=readMap(E),ot=cntRead(m,0,39),nt=cntRead(m,39,66),all=ot+nt,T=function(s){return fmtSecs(Math.round(s)).trim()||"0 мин"};
  var tp=h("div","yb-title");tp.appendChild(h("p","yb-h","Дневник чтения Библии"));tp.appendChild(h("p","yb-yr",y));
  tp.appendChild(h("p","yb-s","Müqəddəs Kitab, Azərbaycan dilində"));tp.appendChild(h("p","yb-s","Записи с "+fmtDay(E[0].date)+" по "+fmtDay(E[E.length-1].date)));root.appendChild(tp);
  var st=h("div","yb-sec yb-stats");st.appendChild(h("h2","","Итоги "+y+" года"));var dl=h("dl","yb-st");
  var bm=mo.indexOf(Math.max.apply(null,mo));
  ybRows(dl,[["Записей",String(E.length)],["Дней чтения",String(nd)],["Общее время",T(tot)],["В среднем за день чтения",T(nd?tot/nd:0)],
    ["Прочитано глав",all+" из 1189 ("+pct(all,1189)+")"],["Əhdi-Ətiq",ot+" из 929 ("+pct(ot,929)+")"],["Əhdi-Cədid",nt+" из 260 ("+pct(nt,260)+")"],
    ["Избранных записей",String(fav.length)],["Самый активный месяц",tot?monthName(y+"-"+pad(bm+1)).split(" ")[0]+" ("+T(mo[bm])+")":"—"]]);
  st.appendChild(dl);st.appendChild(h("h3","","Минуты по месяцам"));
  if(!tot)st.appendChild(h("p","yb-empty","Время чтения в этом году не отмечено."));
  var ch=bars(mo.map(function(v,i){return{l:MS[i],f:monthName(y+"-"+pad(i+1)),v:v/60}}),"Минуты по месяцам, "+y,640);ch.setAttribute("class","yb-chart");st.appendChild(ch);root.appendChild(st);
  var mp=h("div","yb-sec yb-mapsec"),h2=h("h2","","Карта прочитанного за "+y+" год");mp.appendChild(h2);
  mp.appendChild(h("p","yb-tot","Глава отмечена, если она есть хотя бы в одной записи этого года. Всего: "+all+" из 1189 глав."));
  [["Əhdi-Ətiq",0,39],["Əhdi-Cədid",39,66]].forEach(function(t){mp.appendChild(h("h3","",t[0]));var g=h("div","yb-map");
    B.slice(t[1],t[2]).forEach(function(b){var rd=m[b.k]||{},n=Object.keys(rd).length,bk=h("div","yb-bk"),hd=h("div","yb-bkh");hd.appendChild(h("span","",b.n));hd.appendChild(h("small","",n+" из "+b.c));bk.appendChild(hd);
      var cs=h("div","yb-cs");for(var c=1;c<=b.c;c++)cs.appendChild(h("span","yb-c"+(rd[c]?" yb-r":"")));bk.appendChild(cs);g.appendChild(bk)});mp.appendChild(g)});
  root.appendChild(mp);
  var fv=h("div","yb-sec yb-favs");fv.appendChild(h("h2","","Избранные записи"));
  if(fav.length)fav.forEach(function(e){fv.appendChild(ybEntry(e))});else fv.appendChild(h("p","yb-empty","В этом году избранных записей нет."));root.appendChild(fv);
  var gs={},order=[];E.forEach(function(e){var k=e.date.slice(0,7);if(!gs[k]){gs[k]=[];order.push(k)}gs[k].push(e)});
  order.forEach(function(k){var s=h("div","yb-sec yb-month"),hh=h("h2","",monthName(k)),ms=gs[k].reduce(function(a,e){return a+secsOf(e)},0);
    hh.appendChild(h("small","",gs[k].length+" зап."+(ms?", "+T(ms):"")));s.appendChild(hh);gs[k].forEach(function(e){s.appendChild(ybEntry(e))});root.appendChild(s)});
  return root}
$("ybPrint").onclick=function(){if(!$("ybBook").childNodes.length)renderYB();try{window.print()}catch(e){say("ybMsg","Печать недоступна в этом окне. Скачайте книгу как HTML и напечатайте из браузера.")}};
window.addEventListener("beforeprint",function(){if(!$("ybBook").querySelector(".yb-title"))renderYB()});
/* шрифт Lora для скачанной «Книги года»: копируются только правила @font-face Lora этой страницы (в сборке со встроенными шрифтами это data:-URI), без внешних запросов; если их нет — Georgia */
function ybFonts(){var o="";try{for(var i=0;i<document.styleSheets.length;i++){var rs;try{rs=document.styleSheets[i].cssRules}catch(e){continue}
  for(var j=0;j<rs.length;j++){var r=rs[j];if(r.type===5&&/lora/i.test(r.style.getPropertyValue("font-family"))&&/data:/.test(r.cssText))o+=r.cssText+"\n"}}}catch(e){}return o}
function ybHTML(y){var root=h("main","yb-book");buildBook(y,ybEntries(y),root);
  var css=":root{--bg:#fff;--paper:#fff;--ink:#1c2733;--mute:#5d6b76;--rule:#c5cdc8;--accent:#1d5b78;--onacc:#fff;--warm:#a8742a;color-scheme:light}\nhtml,body{margin:0;background:#fff;color:#1c2733;font-family:Lora,Georgia,\"Times New Roman\",serif;line-height:1.55}\n.yb-book{max-width:760px;margin:0 auto;padding:24px 18px 40px}\n*{box-sizing:border-box}\n"+$("ybcss").textContent+"\n@page{size:A4;margin:16mm 15mm 18mm}\n@media print{.yb-book{max-width:none;padding:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}";
  return "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n<title>Дневник чтения Библии — "+y+"</title>\n<style>\n"+ybFonts()+css+"\n</style>\n</head>\n<body>\n"+root.outerHTML+"\n</body>\n</html>\n"}
$("ybDl").onclick=async function(){var y=ybYear,html=ybHTML(y),fn="kniga-goda-"+y+".html";
  try{if(window.claude&&claude.use){var d=await claude.use("downloads");if(d){var r=await d.save({filename:fn,data:html});say("ybMsg",r&&r.status?"Файл «"+fn+"» сохранён. Откройте его в браузере и напечатайте (Ctrl+P или «Поделиться → Печать»).":"");return}}}catch(e){}
  try{var u=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"})),a=document.createElement("a");a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},5000);
    say("ybMsg","Файл «"+fn+"» скачан. Откройте его в браузере и напечатайте (Ctrl+P или «Поделиться → Печать»).")}catch(e){say("ybMsg","Не удалось скачать файл.")}};

/* backup */
function dlBlob(fn,data,type){var u=URL.createObjectURL(new Blob([data],{type:type})),a=document.createElement("a");a.href=u;a.download=fn;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},5000)}
$("exp").onclick=async function(){var fn="dnevnik-chteniya-"+todayStr()+".json",data=JSON.stringify({app:"bible-diary",version:4,entries:entries.map(function(e){var o=Object.assign({id:e.id},body(e));if(e.updatedAt)o.updatedAt=e.updatedAt;return o}),goal:goal?goalBody(goal):null},null,1);
  try{if(window.claude&&claude.use){var d=await claude.use("downloads");if(d){var r=await d.save({filename:fn,data:data});say("bmsg",r&&r.status?"Копия сохранена.":"");return}}}catch(e){}
  try{dlBlob(fn,data,"application/json");say("bmsg","Копия скачана: «"+fn+"».")}catch(e){say("bmsg","Копия не сохранена.")}};
$("imp").onclick=function(){$("file").click()};
$("file").onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();
  r.onload=function(){try{var j=JSON.parse(r.result),a=Array.isArray(j)?j:j.entries;if(!Array.isArray(a))throw 0;var n=0;
    var gm="";if(j&&j.goal){var gr=normGoal(j.goal),gmsg=[];if(gr.g){var cur={minutes:goal?goal.minutes:null,plan:goal?goal.plan:null},chg=false;
        [["minutes","«Минуты в день»"],["plan","план чтения"]].forEach(function(x){if(gr.g[x[0]]){if(!cur[x[0]]){cur[x[0]]=gr.g[x[0]];chg=true;gmsg.push(x[1]+" — установлено")}else gmsg.push(x[1]+" — не применено: у вас уже есть такая цель")}});if(chg)saveGoal(cur)}
      if(gr.drop)gmsg.push("цель «"+gr.drop+"» не перенесена: такой тип цели больше не поддерживается");if(gmsg.length)gm=" Цели из копии: "+gmsg.join("; ")+"."}
    a.forEach(function(e){if(e&&e.id&&String(e.id)!=="goal"&&/^\d{4}-\d{2}-\d{2}$/.test(e.date||"")){putEntry({id:String(e.id),date:e.date,min:e.min||"",sec:e.sec||"",refs:Array.isArray(e.refs)?e.refs:[],key:String(e.key||""),tags:Array.isArray(e.tags)?e.tags:[],note:String(e.note||""),fav:!!e.fav,updatedAt:+e.updatedAt||0,_imp:1});n++}});
    say("bmsg","Загружено записей: "+n+"."+gm)}catch(x){say("bmsg","Файл не подходит: нужна копия, скачанная из этого дневника.")}};
  r.readAsText(f);this.value=""};

/* timer */
function tSave(){try{localStorage.setItem(TKEY,JSON.stringify(tm))}catch(e){}}
function tEl(){return tm.acc+(tm.start?(Date.now()-tm.start)/1000:0)}
function tFmt(s){s=Math.floor(s);return pad(Math.floor(s/3600))+":"+pad(Math.floor(s%3600/60))+":"+pad(s%60)}
function tClk(){var t=tFmt(tEl());["clk","clk2","fsClk"].forEach(function(i){$(i).textContent=t})}
function tShow(){tClk();var l=tm.start?"Пауза":(tEl()>=1?"Продолжить":"Старт");Array.prototype.forEach.call(document.querySelectorAll("[data-tstart]"),function(b){b.textContent=l;b.setAttribute("aria-pressed",!!tm.start)})}
function tPause(){if(tm.start){tm.acc+=(Date.now()-tm.start)/1000;tm.start=0;tSave()}fillTime();tShow()}
function tToggle(){if(tm.start)tPause();else{tm.start=Date.now();tSave();tShow()}}
Array.prototype.forEach.call(document.querySelectorAll("[data-tstart]"),function(b){b.onclick=tToggle});
$("tReset").onclick=function(){tm={acc:0,start:0};tSave();$("fMin").value="";$("fSec").value="";tShow()};
setInterval(function(){if(tm.start)tClk()},500);