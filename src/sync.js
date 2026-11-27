/* ===== stage 11: синхронизация с Google Диском (appDataFolder, один файл diary.json) =====
   Только в отдельной версии (без claude.use). Источник истины — localStorage; Диск синхронизируется с ним.
   Слияние: по записи (id) — побеждает больший updatedAt; удаления — «надгробия» (tombs) со временем удаления;
   цель — целиком, побеждает более новая; список полученных достижений — объединение. Тема и вид списка — настройки устройства. */
var SY={KEY:"bd11-sync",TOK:"bd11-tok",FILE:"diary.json",SCOPE:"https://www.googleapis.com/auth/drive.appdata",API:"https://www.googleapis.com/drive/v3",UP:"https://www.googleapis.com/upload/drive/v3",GIS:"https://accounts.google.com/gsi/client"};
var syM=(function(){try{return JSON.parse(localStorage.getItem(SY.KEY)||"null")||{}}catch(e){return {}}})();
if(!syM.tombs||typeof syM.tombs!=="object")syM.tombs={};
var syTok=null,syTc=null,syBusy=false,syAgain=false,syTimer=null,syRetry=null,syRetryN=0,syGen=0,syState="",syMsgT="",syLastFocus=0,syGisP=null,syTokWait=null;
function syOn(){return !window.claude&&!coll}
function sySave(){try{localStorage.setItem(SY.KEY,JSON.stringify(syM))}catch(e){}}
/* --- хуки из хранилища --- */
function stampE(e){if(e._imp){delete e._imp;if(!(+e.updatedAt>0))e.updatedAt=Date.now()}else e.updatedAt=Date.now();if(syM.tombs[e.id]){delete syM.tombs[e.id];sySave()}}
function tombE(id){syM.tombs[id]=Date.now();sySave()}
function stampG(){syM.gTs=Date.now();sySave();syncDirty()}
function syncDirty(){syGen++;if(!syM.signed||!syOn())return;clearTimeout(syTimer);syTimer=setTimeout(function(){syncNow(false)},1500)}
/* миграция: у старых записей нет updatedAt — считаем 0 (любая правка новее) */
if(!window.claude)entries.forEach(function(e){if(!(+e.updatedAt>=0))e.updatedAt=0});
/* --- слияние --- */
function syCanon(d){return JSON.stringify({e:d.entries.slice().sort(function(a,b){return a.id<b.id?-1:a.id>b.id?1:0}),t:d.tombs,g:d.goal,a:(d.ach||[]).slice().sort()})}
function syLocal(){var ach=[];try{ach=JSON.parse(localStorage.getItem("bd6-ach")||"[]")||[]}catch(e){}
  return {entries:entries.map(function(e){var o=Object.assign({},e);o.updatedAt=+e.updatedAt||0;return o}),tombs:Object.assign({},syM.tombs),goal:{value:goal?goalBody(goal):null,updatedAt:+syM.gTs||0},ach:Array.isArray(ach)?ach:[]}}
function syPick(a,b){var x=+a.updatedAt||0,y=+b.updatedAt||0;if(x!==y)return x>y?a:b;var s=JSON.stringify(a),t=JSON.stringify(b);return s>=t?a:b}
function syMerge(L,R){var map={},tombs={},cut=Date.now()-400*864e5;
  [L.tombs||{},R.tombs||{}].forEach(function(t){Object.keys(t).forEach(function(id){var v=+t[id]||0;if(v>(tombs[id]||0))tombs[id]=v})});
  [L.entries||[],R.entries||[]].forEach(function(l){splitLegacyEntries(l).forEach(function(e){map[e.id]=map[e.id]?syPick(map[e.id],e):e})});
  var out=[];Object.keys(map).forEach(function(id){var e=map[id];if(tombs[id]!=null&&tombs[id]>=(+e.updatedAt||0))return;delete tombs[id];out.push(e)});
  Object.keys(tombs).forEach(function(id){if(tombs[id]<cut)delete tombs[id]});
  var lg=L.goal||{value:null,updatedAt:0},rg=R.goal||{value:null,updatedAt:0},g;
  if((+lg.updatedAt||0)!==(+rg.updatedAt||0))g=(+lg.updatedAt||0)>(+rg.updatedAt||0)?lg:rg;
  else g=!lg.value?rg:!rg.value?lg:(JSON.stringify(lg.value)>=JSON.stringify(rg.value)?lg:rg);
  var ach=(L.ach||[]).slice();(R.ach||[]).forEach(function(x){if(ach.indexOf(x)<0)ach.push(x)});
  return {entries:out,tombs:tombs,goal:{value:g.value||null,updatedAt:+g.updatedAt||0},ach:ach}}
function syApply(M){var L=syLocal();if(syCanon(L)===syCanon(M))return false;
  entries=M.entries.map(function(e){return Object.assign({},e)});syM.tombs=M.tombs;
  if(JSON.stringify(L.goal.value)!==JSON.stringify(M.goal.value)){var r=normGoal(M.goal.value);goal=r.g;try{if(goal)localStorage.setItem(GKEY,JSON.stringify(goal));else localStorage.removeItem(GKEY)}catch(e){}}
  syM.gTs=M.goal.updatedAt;try{localStorage.setItem("bd6-ach",JSON.stringify(M.ach))}catch(e){}
  sySave();persist();render();return true}
/* --- статус --- */
function syTime(t){var d=new Date(t),hm=pad(d.getHours())+":"+pad(d.getMinutes());return todayStr()===d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())?"в "+hm:d.getDate()+" "+MS[d.getMonth()]+" в "+hm}
function syStatus(st,msg){syState=st;syMsgT=msg||"";var t=st==="ok"?"Синхронизировано "+syTime(syM.last||Date.now()):st==="busy"?"Синхронизация…":st==="off"?"Нет сети. Изменения сохранены на устройстве и отправятся позже.":st==="auth"?"Нужно снова войти в Google: нажмите «Синхронизировать сейчас».":st==="err"?(msg||"Не удалось синхронизировать."):"";
  var el=$("syStat");if(el)el.textContent=t;var hi=$("hSync");if(hi){hi.hidden=!syM.signed;hi.className="ap-ib ap-hsync ap-sy-"+(st||"idle");hi.title=t||"Синхронизация с Google Диском";hi.setAttribute("aria-label",hi.title)}}
function syUI(){var box=$("syncBox");if(!box)return;box.hidden=!!window.claude;if(window.claude)return;
  var noId=!GOOGLE_CLIENT_ID,file=location.protocol==="file:";
  $("syNote").hidden=!(noId||file);$("syNote").textContent=noId?"Синхронизация не настроена: в файле не указан GOOGLE_CLIENT_ID. Дневник полностью работает на этом устройстве.":file?"Синхронизация работает, только когда дневник открыт с сайта (например, GitHub Pages) или через localhost, а не из файла.":"";
  var can=!noId&&!file;$("syIn").hidden=!can||!!syM.signed;$("syNow").hidden=!can||!syM.signed;$("syOut").hidden=!can||!syM.signed;$("syAcc").hidden=!syM.signed;
  $("syAcc").textContent=syM.signed?(syM.email?"Аккаунт: "+syM.email:"Вход выполнен"):"";$("syHint").hidden=!can;if(!syM.signed){$("syStat").textContent=can&&syState==="err"?syMsgT:""}
  syStatus(syState,syMsgT)}
/* --- Google Identity Services: загружается только после «Войти через Google» (или если вход уже был) --- */
function syLoadGis(){if(window.google&&google.accounts&&google.accounts.oauth2)return Promise.resolve();if(syGisP)return syGisP;
  syGisP=new Promise(function(ok,no){var s=document.createElement("script");s.src=SY.GIS;s.async=true;s.onload=function(){ok()};s.onerror=function(){syGisP=null;no(new Error("gis"))};document.head.appendChild(s)});return syGisP}
function syTokLoad(){if(syTok)return syTok;try{var t=JSON.parse(sessionStorage.getItem(SY.TOK)||"null");if(t&&t.exp>Date.now()+60000)syTok=t}catch(e){}return syTok}
function syTokSet(r){syTok={t:r.access_token,exp:Date.now()+(+r.expires_in||3600)*1000};try{sessionStorage.setItem(SY.TOK,JSON.stringify(syTok))}catch(e){}}
function syTokDrop(){syTok=null;try{sessionStorage.removeItem(SY.TOK)}catch(e){}}
function syAuth(prompt){return syLoadGis().then(function(){return new Promise(function(ok,no){
  if(!syTc)syTc=google.accounts.oauth2.initTokenClient({client_id:GOOGLE_CLIENT_ID,scope:SY.SCOPE,callback:function(r){var w=syTokWait;syTokWait=null;if(r&&r.access_token)syTokSet(r);if(!w)return;if(r&&r.access_token)w.ok(syTok);else w.no(new Error("auth:"+(r&&r.error||"denied")))},
    error_callback:function(e){var w=syTokWait;syTokWait=null;if(w)w.no(new Error("auth:"+(e&&e.type||"popup")))}});
  var to=setTimeout(function(){if(syTokWait&&syTokWait.ok===ok){syTokWait=null;no(new Error("auth:timeout"))}},prompt?180000:20000);
  syTokWait={ok:function(t){clearTimeout(to);ok(t)},no:function(e){clearTimeout(to);no(e)}};var o={prompt:prompt};if(syM.email)o.login_hint=syM.email;syTc.requestAccessToken(o)})})}
function syToken(interactive){var t=syTokLoad();if(t)return Promise.resolve(t);return syAuth(interactive&&!syM.signed?"select_account":"")}
/* --- Drive REST v3 --- */
function syWait(ms){return new Promise(function(r){setTimeout(r,ms)})}
function syErr(code,msg){var e=new Error(msg||("http "+code));e.code=code;return e}
async function syFetch(url,opt,tries){tries=tries||0;opt=opt||{};var t=syTokLoad();if(!t)throw syErr(401,"no token");
  opt.headers=Object.assign({},opt.headers||{},{Authorization:"Bearer "+t.t});var r;
  try{r=await fetch(url,opt)}catch(e){throw syErr(0,"offline")}
  if(r.ok)return r;
  var reason="";try{var j=await r.clone().json();reason=((j.error&&j.error.errors&&j.error.errors[0])||{}).reason||(j.error&&j.error.status)||""}catch(e){}
  if(r.status===401){syTokDrop();throw syErr(401)}
  var rate=r.status===429||r.status>=500||(r.status===403&&/rateLimit|userRateLimit|RATE_LIMIT|quota/i.test(reason));
  if(rate&&tries<3){var ra=+r.headers.get("Retry-After");await syWait(ra>0?ra*1000:Math.min(8000,(500<<tries)+Math.random()*300));return syFetch(url,opt,tries+1)}
  throw syErr(r.status,reason)}
async function syFind(){if(syM.fileId)return [syM.fileId];var r=await syFetch(SY.API+"/files?spaces=appDataFolder&q="+encodeURIComponent("name='"+SY.FILE+"' and trashed=false")+"&fields="+encodeURIComponent("files(id,modifiedTime)")+"&orderBy=modifiedTime%20desc&pageSize=10");
  var j=await r.json(),fs=(j.files||[]).map(function(f){return f.id});syM.fileId=fs[0]||"";sySave();return fs}
async function syDown(id){var r;try{r=await syFetch(SY.API+"/files/"+encodeURIComponent(id)+"?alt=media")}catch(e){if(e.code===404){syM.fileId="";sySave();return null}throw e}
  var t=await r.text();if(!t)return null;var j=JSON.parse(t);if(!j||j.app!=="bible-diary"||!Array.isArray(j.entries))throw syErr(-1,"bad file");return j}
async function syUp(doc){var data=JSON.stringify(doc);
  if(syM.fileId){try{await syFetch(SY.UP+"/files/"+encodeURIComponent(syM.fileId)+"?uploadType=media",{method:"PATCH",headers:{"Content-Type":"application/json"},body:data});return}catch(e){if(e.code!==404)throw e;syM.fileId=""}}
  var bd="bd11"+Math.random().toString(36).slice(2),meta={name:SY.FILE,parents:["appDataFolder"],mimeType:"application/json"};
  var body="--"+bd+"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"+JSON.stringify(meta)+"\r\n--"+bd+"\r\nContent-Type: application/json\r\n\r\n"+data+"\r\n--"+bd+"--";
  var r=await syFetch(SY.UP+"/files?uploadType=multipart&fields=id",{method:"POST",headers:{"Content-Type":"multipart/related; boundary="+bd},body:body});var j=await r.json();syM.fileId=j.id;sySave()}
async function syEmail(){if(syM.email)return;try{var r=await syFetch(SY.API+"/about?fields="+encodeURIComponent("user(emailAddress,displayName)"));var j=await r.json();if(j.user&&j.user.emailAddress){syM.email=j.user.emailAddress;sySave();syUI()}}catch(e){}}
/* --- цикл: скачать → слить → применить → отправить, если на Диске не то же самое --- */
async function syncNow(interactive){if(!syOn()||!GOOGLE_CLIENT_ID||!syM.signed)return;if(syBusy){syAgain=true;return}
  if(navigator.onLine===false){syStatus("off");return}
  syBusy=true;clearTimeout(syTimer);clearTimeout(syRetry);syStatus("busy");var gen0=syGen;
  try{try{await syToken(interactive)}catch(e){syStatus("auth");syBusy=false;return}
    var run=async function(){var ids=await syFind(),R=null,extra=ids.slice(1);
      if(ids[0]){R=await syDown(ids[0]);if(!R&&!syM.fileId)return run()}
      /* если два устройства одновременно создали файл — слить все копии, лишние удалить */
      for(var i=0;i<extra.length;i++){var X=await syDown(extra[i]);if(X)R=R?syMerge(R,X):X}
      var L=syLocal(),M=syMerge(L,R||{entries:[],tombs:{},goal:null,ach:[]});
      syApply(M);if(!R||extra.length||syCanon(R)!==syCanon(M))await syUp({app:"bible-diary",kind:"sync",v:1,savedAt:Date.now(),entries:M.entries,tombs:M.tombs,goal:M.goal,ach:M.ach});
      for(var k=0;k<extra.length;k++){try{await syFetch(SY.API+"/files/"+encodeURIComponent(extra[k]),{method:"DELETE"})}catch(e){}}};
    try{await run()}catch(e){if(e.code===401){await syToken(false);await run()}else throw e}
    syM.last=Date.now();syRetryN=0;sySave();syStatus("ok");syEmail()}
  catch(e){if(e.code===0){syStatus("off")}else if(e.code===401||/^auth/.test(e.message)){syStatus("auth")}
    else{var c=e.code;syStatus("err",c===403?"Нет доступа к Google Диску (403). Проверьте, что Drive API включён и вход разрешён.":c===429||c>=500?"Google Диск временно недоступен. Повторим позже.":c===-1?"Файл синхронизации на Диске повреждён; локальные записи не изменены.":"Не удалось синхронизировать ("+(c||"ошибка")+").");
      if(c===429||c>=500||(c===403&&/rate|quota/i.test(e.message))){syRetryN++;syRetry=setTimeout(function(){syncNow(false)},Math.min(300000,15000*Math.pow(2,syRetryN-1)))}}}
  finally{syBusy=false}
  if(syAgain||syGen!==gen0){syAgain=false;if(syState==="ok")syncDirty()}}
function sySignIn(){if(!GOOGLE_CLIENT_ID)return;syStatus("busy");syUI();
  syAuth("select_account").then(function(){syM.signed=true;sySave();syUI();return syncNow(true)}).then(function(){if(syState==="ok")toast("Синхронизация с Google Диском включена")},function(e){syM.signed=false;sySave();syState="err";syMsgT=/popup_closed|denied|access_denied/.test(e.message)?"Вход отменён.":/gis/.test(e.message)?"Не удалось загрузить вход Google: проверьте сеть.":"Не удалось войти в Google.";syUI()})}
function sySignOut(){var t=syTokLoad();syTokDrop();syM.signed=false;syM.email="";syM.fileId="";syM.last=0;sySave();syState="";syMsgT="";
  try{if(t&&window.google&&google.accounts&&google.accounts.oauth2)google.accounts.oauth2.revoke(t.t,function(){})}catch(e){}
  syUI();toast("Вы вышли из Google. Записи остались на этом устройстве.")}
function syInit(){syUI();if(window.claude)return;
  $("syIn").onclick=sySignIn;$("syNow").onclick=function(){syncNow(true)};$("syOut").onclick=sySignOut;
  $("hSync").onclick=function(){tab("L");var b=$("syncBox");b.scrollIntoView({block:"center"});var f=$("syNow");if(!f.hidden)f.focus({preventScroll:true})};
  window.addEventListener("online",function(){if(syM.signed)syncNow(false)});window.addEventListener("offline",function(){if(syM.signed)syStatus("off")});
  function wake(){if(!syM.signed||document.visibilityState==="hidden")return;var n=Date.now();if(n-syLastFocus<20000)return;syLastFocus=n;syncNow(false)}
  window.addEventListener("focus",wake);document.addEventListener("visibilitychange",wake);
  if(syM.signed&&GOOGLE_CLIENT_ID&&location.protocol!=="file:"){syStatus("idle");syLastFocus=Date.now();syncNow(false)}}
