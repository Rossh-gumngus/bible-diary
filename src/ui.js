/* ===== stage 6: interface ===== */
var uid=0;
function svgIcon(paths,cls,vb){var s=svgEl("svg",{viewBox:vb||"0 0 24 24","aria-hidden":"true"});if(cls)s.setAttribute("class",cls);paths.forEach(function(d){s.appendChild(svgEl("path",{d:d}))});return s}
function lsGet(k,d){try{var v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}

/* --- modals --- */
var mstack=[],FOC='a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function focusables(root){return Array.prototype.filter.call(root.querySelectorAll(FOC),function(el){return el.getClientRects().length&&!el.closest("[hidden]")})}
function topM(){return mstack[mstack.length-1]||null}
function setInert(){var on=mstack.length>0;$("shell").inert=on;if(on)$("shell").setAttribute("aria-hidden","true");else $("shell").removeAttribute("aria-hidden");
  mstack.forEach(function(m,i){m.ov.inert=i<mstack.length-1});document.documentElement.classList.toggle("ap-lock",on)}
function openModal(content,o){o=o||{};var ov=h("div","ap-ov ap-"+(o.variant||"center")),dlg=h("div","ap-dlg");
  dlg.setAttribute("role",o.role||"dialog");dlg.setAttribute("aria-modal","true");dlg.tabIndex=-1;
  if(o.label)dlg.setAttribute("aria-labelledby",o.label);if(o.desc)dlg.setAttribute("aria-describedby",o.desc);
  content.hidden=false;dlg.appendChild(content);ov.appendChild(dlg);$("ovRoot").appendChild(ov);
  var m={ov:ov,dlg:dlg,content:content,o:o,ret:o.ret||document.activeElement};mstack.push(m);
  ov.addEventListener("pointerdown",function(ev){m.down=ev.target===ov});
  ov.addEventListener("click",function(ev){if(ev.target===ov&&m.down&&o.backdrop!==false)tryClose(m)});
  Array.prototype.forEach.call(content.querySelectorAll("[data-close]"),function(b){b.onclick=function(){tryClose(m)}});
  setInert();if(o.onOpen)o.onOpen(m);
  var f=o.focus?(typeof o.focus==="string"?dlg.querySelector(o.focus):o.focus):null;(f||dlg).focus({preventScroll:true});return m}
function findM(x){if(x&&x.ov)return x;for(var i=0;i<mstack.length;i++)if(mstack[i].content===x)return mstack[i];return null}
function closeModal(x){var m=findM(x);if(!m)return;var i=mstack.indexOf(m);if(i<0)return;mstack.splice(i,1);
  if(m.o.keep)$("hold").appendChild(m.content);m.ov.remove();setInert();if(m.o.onClose)m.o.onClose();
  var r=m.ret,t=topM();if(r&&r.isConnected&&r.focus&&(!t||t.dlg.contains(r)))r.focus({preventScroll:true});else if(t)t.dlg.focus({preventScroll:true})}
function tryClose(x){var m=findM(x);if(!m||m!==topM())return Promise.resolve(false);
  if(!(m.o.guard&&m.o.guard())){closeModal(m);return Promise.resolve(true)}
  return confirmDlg({title:"Закрыть без сохранения?",text:"Изменения в записи будут потеряны.",ok:"Закрыть",cancel:"Продолжить",danger:true}).then(function(ok){if(ok)closeModal(m);return ok})}
function closeTop(){var m=topM();return m?tryClose(m):Promise.resolve(true)}
function closeAll(){var m=topM();if(!m)return Promise.resolve(true);return tryClose(m).then(function(ok){return ok?closeAll():false})}
document.addEventListener("keydown",function(ev){var m=topM();if(!m)return;
  if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();tryClose(m);return}
  if(ev.key==="Tab"){var f=focusables(m.dlg),cur=document.activeElement;if(!f.length){ev.preventDefault();m.dlg.focus();return}
    var a=f[0],z=f[f.length-1];if(ev.shiftKey&&(cur===a||cur===m.dlg||!m.dlg.contains(cur))){ev.preventDefault();z.focus()}else if(!ev.shiftKey&&(cur===z||!m.dlg.contains(cur))){ev.preventDefault();a.focus()}return}
  if(det&&m===det.m&&(ev.key==="ArrowLeft"||ev.key==="ArrowRight")&&!/^(INPUT|TEXTAREA|SELECT)$/.test((ev.target||{}).tagName||"")){ev.preventDefault();detGo(ev.key==="ArrowLeft"?-1:1)}},true);
document.addEventListener("focusin",function(ev){var m=topM();if(m&&!m.dlg.contains(ev.target)&&!$("toasts").contains(ev.target))m.dlg.focus({preventScroll:true})});
function confirmDlg(o){var box=h("div"),hd=h("div","ap-dh"),t=h("h2","ap-dt",o.title);t.id="cfT"+(++uid);hd.appendChild(t);box.appendChild(hd);
  var bd=h("div","ap-db"),p=null;if(o.text){p=h("p","",o.text);p.id="cfD"+uid;bd.appendChild(p)}box.appendChild(bd);
  var ft=h("div","ap-df"),bc=h("button","btn",o.cancel||"Отмена"),bo=h("button","btn main",o.ok||"Да");bc.type=bo.type="button";ft.appendChild(bc);ft.appendChild(bo);box.appendChild(ft);
  return new Promise(function(res){var done=false,m=openModal(box,{variant:"cfm",role:"alertdialog",label:t.id,desc:p?p.id:null,focus:o.danger?bc:bo,onClose:function(){if(!done){done=true;res(false)}}});
    bo.onclick=function(){done=true;closeModal(m);res(true)};bc.onclick=function(){closeModal(m)}})}
function toast(t,o){o=o||{};var box=$("toasts"),el=h("div","ap-toast"+(o.cls?" "+o.cls:"")),tm2;el.appendChild(h("span","",t));
  if(o.action){var b=h("button","",o.action);b.type="button";b.onclick=function(){clearTimeout(tm2);el.remove();o.fn()};el.appendChild(b)}
  box.appendChild(el);while(box.children.length>3)box.firstChild.remove();tm2=setTimeout(function(){el.remove()},o.ms||(o.action?7000:3200));return el}

/* --- sheet, filters --- */
function sheetOpen(){return !!findM($("fSheet"))}
function openSheet(){openModal($("fSheet"),{variant:"sheet",label:"fTitle",keep:true,guard:function(){return formState()!==fSnap},onOpen:function(){if(entrySection==="note")grow();$("fSheet").querySelector(".ap-db").scrollTop=0}})}
$("fab").onclick=function(){if(curTab==="N")newNote();else newEntry()};$("newBtn").onclick=newEntry;
$("newNoteBtn").onclick=function(){newNote()};
$("fltBtn").onclick=function(){openModal($("fltPanel"),{variant:"side",label:"fltTitle",keep:true})};
$("qCh").addEventListener("change",function(){flt.ch=+this.value||0;render()});

/* --- swipe --- */
var swT=0;function swJust(){return Date.now()-swT<350}
function swipeWrap(el,e,row){var w=h("div","ap-sw"+(row?" ap-swr":"")),bg=h("div","ap-swbg");bg.setAttribute("aria-hidden","true");
  var sf=h("span","ap-sf",e.fav?"☆ Из избранного":"★ В избранное"),sd=h("span","ap-sd","Удалить");bg.appendChild(sf);bg.appendChild(sd);w.appendChild(bg);w.appendChild(el);
  var sx=0,sy=0,dx=0,on=false,lock=null,pid=null;
  el.addEventListener("pointerdown",function(ev){if(ev.pointerType==="mouse"||ev.button>0)return;sx=ev.clientX;sy=ev.clientY;dx=0;lock=null;pid=ev.pointerId;on=true});
  el.addEventListener("pointermove",function(ev){if(!on||ev.pointerId!==pid)return;var x=ev.clientX-sx,y=ev.clientY-sy;
    if(lock===null){if(Math.abs(x)<10&&Math.abs(y)<10)return;lock=Math.abs(x)>Math.abs(y)*1.4?"x":"y";if(lock==="x"){w.classList.add("ap-drag");try{el.setPointerCapture(pid)}catch(_){}}}
    if(lock!=="x")return;dx=x;el.style.transform="translateX("+dx+"px)";sf.style.visibility=dx>0?"visible":"hidden";sd.style.visibility=dx<0?"visible":"hidden"});
  function end(){if(!on)return;on=false;if(lock!=="x")return;w.classList.remove("ap-drag");swT=Date.now();var W=el.offsetWidth||300,th=Math.min(80,W*.3);
    if(dx<-th){el.style.transform="translateX(-"+W+"px)";setTimeout(function(){delWithUndo(e)},reduced()?0:180)}
    else{el.style.transform="";if(dx>th){e.fav=!e.fav;saveFav(e);toast(e.fav?"Добавлено в избранное":"Убрано из избранного");if(!coll)render()}}}
  el.addEventListener("pointerup",end);el.addEventListener("pointercancel",function(){on=false;lock=null;w.classList.remove("ap-drag");el.style.transform=""});return w}
function reduced(){return window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}

/* --- views --- */
var VIEW=lsGet("bd6-view","cards");if(["cards","compact","timeline"].indexOf(VIEW)<0)VIEW="cards";
function setView(v,focus){VIEW=v;lsSet("bd6-view",v);Array.prototype.forEach.call(document.querySelectorAll(".ap-views button"),function(b){var on=b.dataset.view===v;b.setAttribute("aria-checked",on);b.tabIndex=on?0:-1;if(on&&focus)b.focus()});renderList()}
Array.prototype.forEach.call(document.querySelectorAll(".ap-views button"),function(b){b.onclick=function(){setView(b.dataset.view)}});
document.querySelector(".ap-views").addEventListener("keydown",function(e){var o=["cards","compact","timeline"],i=o.indexOf(VIEW);
  if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();setView(o[(i+1)%3],1)}else if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();setView(o[(i+2)%3],1)}});

/* --- skeleton & empty --- */
function skel(box,n){for(var i=0;i<n;i++){var s=h("div","ap-sk");s.setAttribute("aria-hidden","true");box.appendChild(s)}}
var ILL={book:["M14 22c14-6 28-6 38 0v48c-10-6-24-6-38 0z","M90 22c-14-6-28-6-38 0v48c10-6 24-6 38 0z","M22 34h20M22 42h22M22 50h18M62 34h20M60 42h22M64 50h16","M52 8v8M40 12l4 6M64 12l-4 6"],
  search:["M54 46a20 20 0 1 1 0-.1z","M68 60l20 20","M42 46h24","M110 30h10M108 44h14M112 58h8"],
  cal:["M22 22h76v58H22z","M22 36h76","M38 14v14M82 14v14","M36 50h8M56 50h8M76 50h8M36 64h8M56 64h8"]};
function emptyState(kind,text,btn,fn){var d=h("div","ap-empty");d.appendChild(svgIcon(ILL[kind]||ILL.book,"",kind==="search"?"0 0 132 96":"0 0 104 90"));d.appendChild(h("p","",text));
  if(btn){var b=h("button","btn",btn);b.type="button";b.onclick=fn;d.appendChild(b)}return d}

/* --- recent on «Читать» --- */
function renderRecent(){var box=$("recent");box.innerHTML="";
  if(cloudLoading&&!entries.length){skel(box,2);return}
  var f=readingEntries().sort(cmpDesc);
  if(!f.length){box.appendChild(emptyState("book","Здесь появится история чтения.","Отметить чтение",newEntry));return}
  f.slice(0,3).forEach(function(e){box.appendChild(swipeWrap(card(e),e))});
  if(f.length>3){var b=h("button","btn sm","Дневник ("+f.length+") ›");b.type="button";b.onclick=function(){tab("L")};box.appendChild(b)}}

/* --- detail --- */
var det=null;
function openDetail(id,from){var current=entries.find(function(e){return e.id===id});if(!current)return;
  var list=(curList.some(function(x){return x.id===id})?curList:entries.filter(function(e){return isNote(e)===isNote(current)}).sort(cmpDesc)).map(function(x){return x.id});
  if(det){det.id=id;det.list=list;renderDetail();return}
  var box=h("div","ap-dm"),hd=h("div","ap-dh"),t=h("h2","ap-dt");t.id="dtT";hd.appendChild(t);var x=h("button","ap-x","×");x.type="button";x.setAttribute("aria-label","Закрыть");x.setAttribute("data-close","");hd.appendChild(x);box.appendChild(hd);
  var bd=h("div","ap-db");bd.style.touchAction="pan-y";box.appendChild(bd);
  var ft=h("div","ap-df ap-dnav"),pv=h("button","btn","‹ Назад"),cn=h("span","ap-dcnt"),nx=h("button","btn","Дальше ›");pv.type=nx.type="button";pv.setAttribute("aria-label","Предыдущая запись");nx.setAttribute("aria-label","Следующая запись");
  pv.onclick=function(){detGo(-1)};nx.onclick=function(){detGo(1)};ft.appendChild(pv);ft.appendChild(cn);ft.appendChild(nx);box.appendChild(ft);
  det={id:id,list:list,box:box,t:t,bd:bd,pv:pv,nx:nx,cn:cn};
  var sx=0,sy=0,act=false;bd.addEventListener("pointerdown",function(ev){if(ev.pointerType==="mouse")return;sx=ev.clientX;sy=ev.clientY;act=true});
  bd.addEventListener("pointerup",function(ev){if(!act)return;act=false;var dx=ev.clientX-sx,dy=ev.clientY-sy;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)detGo(dx<0?1:-1)});
  bd.addEventListener("pointercancel",function(){act=false});
  renderDetail();det.m=openModal(box,{variant:"sheet",label:"dtT",ret:from,onClose:function(){det=null}})}
function detIds(){return det.list.filter(function(id){return entries.some(function(x){return x.id===id})})}
function detGo(d){if(!det)return;var ids=detIds(),i=ids.indexOf(det.id),j=i+d;if(j<0||j>=ids.length)return;det.id=ids[j];renderDetail();det.bd.scrollTop=0;(d<0?det.pv:det.nx).disabled||(d<0?det.pv:det.nx).focus()}
function renderDetail(){if(!det)return;var e=entries.find(function(x){return x.id===det.id});if(!e){if(det.m)closeModal(det.m);return}
  var ids=detIds(),i=ids.indexOf(e.id),bd=det.bd;det.t.textContent=fmtDate(e.date);bd.innerHTML="";
  var mt=h("div","ap-dmeta"),tt=fmtSecs(secsOf(e)).trim();if(!isNote(e))mt.appendChild(h("span","",tt?"Время чтения: "+tt:"Время не отмечено"));mt.appendChild(favBtn(e));bd.appendChild(mt);
  if(e.key)bd.appendChild(h("p","ap-dkey",e.key));
  if(e.refs&&e.refs.length){var rf=h("div","refs");e.refs.forEach(function(r,k){if(k)rf.appendChild(document.createTextNode(", "));if(r.to){rf.appendChild(document.createTextNode(refLabel(r)));return}var b=h("button","",refLabel(r));b.type="button";b.title="Все записи по главе "+(BK[r.b]?BK[r.b].n:r.b)+" "+r.c;b.onclick=function(){if(BK[r.b])showPassage(r.b,+r.c,isNote(e)?"N":"L")};rf.appendChild(b)});bd.appendChild(rf)}
  if(e.tags&&e.tags.length)bd.appendChild(tagChips(e.tags));
  if(e.note){var o=h("div","ap-orn");o.appendChild(h("span","","◆"));o.setAttribute("aria-hidden","true");bd.appendChild(o);bd.appendChild(rich(e.note))}
  if(!e.key&&!e.note&&!(e.refs||[]).length)bd.appendChild(h("p","empty","Запись пуста."));
  var a=h("div","acts"),b1=h("button","btn sm","Изменить"),b2=h("button","btn sm","Удалить");b1.type=b2.type="button";b1.onclick=function(){startEdit(e)};b2.onclick=function(){askDelete(e)};a.appendChild(b1);a.appendChild(b2);
  if(!isNote(e)&&e.refs&&e.refs.length){
    var noteButton=h("button","btn sm","Заметка к отрывку");
    noteButton.type="button";
    noteButton.onclick=function(){newNote(e)};
    a.appendChild(noteButton);
  }
  a.style.marginTop="16px";bd.appendChild(a);
  det.pv.disabled=i<=0;det.nx.disabled=i<0||i>=ids.length-1;det.cn.textContent=i>=0?(i+1)+" из "+ids.length:""}

/* --- passage picker --- */
function openReadingInput(o){
  var box=h("form","ap-pk"),hd=h("div","ap-dh");
  var title=h("h2","ap-dt",o.title||"Ввести отрывки");
  title.id="readingTitle";
  hd.appendChild(title);
  box.appendChild(hd);
  var bd=h("div","ap-db"),label=h("label","","Что прочитано");
  label.htmlFor="readingText";
  var input=h("textarea");
  input.id="readingText";
  input.rows=3;
  input.value=o.init?refLabel(o.init):"";
  input.setAttribute("aria-describedby","readingHint readingError");
  var hint=h("p","hint","Укажи книгу, главу и стих. Разделяй отрывки запятыми. Например: Исход 3:16 - Исход 8:3, Иоанна 3:16.");
  hint.id="readingHint";
  var error=h("div","msg");
  error.id="readingError";
  error.setAttribute("role","alert");
  bd.append(label,input,hint,error);
  box.appendChild(bd);
  var ft=h("div","ap-df"),cancel=h("button","btn","Отмена"),save=h("button","btn main",o.init?"Применить":"Добавить");
  cancel.type="button";
  cancel.setAttribute("data-close","");
  save.type="submit";
  ft.append(cancel,save);
  box.appendChild(ft);
  var m=openModal(box,{variant:"sheet",label:title.id,focus:input});
  box.onsubmit=function(e){
    e.preventDefault();
    var parsed=parseReading(input.value);
    if(!parsed){error.textContent="Проверь названия книг, номера глав и стихов и порядок границ диапазона.";input.setAttribute("aria-invalid","true");input.focus();return}
    closeModal(m);
    o.done(parsed);
  };
}
var BAL={};B.forEach(function(b){var v=[fold(b.n)],m=b.n.match(/^(Birinci|İkinci|Üçüncü|1|2|3) (.+)$/);if(m){var n=NUMW.indexOf(m[1])+1||+m[1];v=[fold(n+" "+m[2]),fold(NUMW[n-1]+" "+m[2]),fold(n+m[2])]}BAL[b.k]=v});
function vsRanges(k,c,v){var mx=maxV(k,c);if(!v)return mx?[[1,mx]]:[];return String(v).split(",").map(function(p){var m=p.split("-"),a=+m[0],z=+(m[1]||m[0]);return [a,z]}).filter(function(r){return r[0]>=1&&r[1]>=r[0]})}
function openPicker(o){var st={step:"b",b:null,c:0,rg:[],start:null,mc:false,cs:null,cr:null},rd=readMap();
  if(o.init&&BK[o.init.b]){st.b=o.init.b;st.c=+o.init.c||1;st.step="v";st.rg=vsRanges(st.b,st.c,o.init.v)}
  var box=h("div","ap-pk"),hd=h("div","ap-dh"),t=h("h2","ap-dt",o.title||"Выбрать отрывок");t.id="pkT";hd.appendChild(t);var x=h("button","ap-x","×");x.type="button";x.setAttribute("aria-label","Закрыть");x.setAttribute("data-close","");hd.appendChild(x);box.appendChild(hd);
  var bd=h("div","ap-db");box.appendChild(bd);var ft=h("div","ap-df");box.appendChild(ft);
  var m=openModal(box,{variant:"sheet",label:"pkT"});
  function path(){var p=h("nav","ap-pkpath");p.setAttribute("aria-label","Шаги выбора");var a=h("button","","Книги");a.type="button";a.onclick=function(){st.step="b";draw()};p.appendChild(a);
    if(st.b){p.appendChild(h("span","","›"));var b=h("button","",BK[st.b].n);b.type="button";b.onclick=function(){st.step="c";draw()};p.appendChild(b)}
    if(st.step==="v"){p.appendChild(h("span","","›"));p.appendChild(h("span","",String(st.c)))}return p}
  function vtxt(){return st.rg.slice().sort(function(a,b){return a[0]-b[0]}).map(function(r){return r[0]===r[1]?String(r[0]):r[0]+"-"+r[1]}).join(",")}
  function finish(v){var mx=maxV(st.b,st.c),r={b:st.b,c:st.c,v:v||(mx?"1-"+mx:"")},e=vsErr(r.b,r.c,r.v);if(e){say("pkMsg",e);return}closeModal(m);o.done([r])}
  function finishCh(){
    if(!st.cr){say("pkMsg","Нажмите на первую и последнюю главу.");return}
    var first=st.cr[0],last=st.cr[1];
    if(o.chapterParts){
      var rs=[];
      for(var c=first;c<=last;c++)rs.push({b:st.b,c:c,v:"1-"+maxV(st.b,c)});
      closeModal(m);o.done(rs);return;
    }
    var r={b:st.b,c:first,v:"1"};
    if(first!==last)r.to={b:st.b,c:last,v:String(maxV(st.b,last))};
    else r.v="1-"+maxV(st.b,first);
    closeModal(m);o.done([r]);
  }
  function draw(){bd.innerHTML="";ft.innerHTML="";bd.appendChild(path());var cb=h("button","btn","Отмена");cb.type="button";cb.onclick=function(){closeModal(m)};ft.appendChild(cb);
    if(st.step==="b"){var q=h("input");q.type="search";q.placeholder="Найти книгу: Zəbur, Yəhya, 1 Kor…";q.setAttribute("aria-label","Найти книгу");bd.appendChild(q);
      var secs=[];[["Əhdi-Ətiq",0,39],["Əhdi-Cədid",39,66]].forEach(function(s){var hh=h("h3","ap-pkh",s[0]),g=h("div","ap-bgrid");bd.appendChild(hh);bd.appendChild(g);
        B.slice(s[1],s[2]).forEach(function(b){var bt=h("button","ap-bb");bt.type="button";bt.appendChild(h("span","",b.n));var n=Object.keys(rd[b.k]||{}).length;bt.appendChild(h("small","",b.c+" "+plur(b.c,"глава","главы","глав")+(n?" · прочитано "+n:"")));bt.dataset.k=b.k;
          bt.onclick=function(){st.b=b.k;st.step=b.c===1?"v":"c";st.c=b.c===1?1:0;st.rg=[];st.start=null;draw()};g.appendChild(bt)});secs.push([hh,g])});
      var none=h("p","empty","Книга не найдена.");none.hidden=true;bd.appendChild(none);
      q.addEventListener("input",function(){var f=fold(q.value.trim()).replace(/\s+/g," "),any=0;secs.forEach(function(s){var vis=0;Array.prototype.forEach.call(s[1].children,function(bt){var ok=!f||BAL[bt.dataset.k].some(function(a){return a.indexOf(f)>=0||a.replace(/ /g,"").indexOf(f.replace(/ /g,""))>=0});bt.hidden=!ok;if(ok)vis++});s[0].hidden=s[1].hidden=!vis;any+=vis});none.hidden=!!any});
      q.addEventListener("keydown",function(ev){if(ev.key==="Enter"){ev.preventDefault();var v=bd.querySelectorAll(".ap-bb:not([hidden])");if(v.length===1)v[0].click()}});
      if(window.matchMedia&&matchMedia("(pointer:fine)").matches)setTimeout(function(){q.focus()},0)}
    else if(st.step==="c"){var b=BK[st.b];bd.appendChild(h("p","hint",st.mc?"Нажмите на первую и последнюю главу — все стихи этих глав будут отмечены как прочитанные.":"Выберите главу. Точкой отмечены уже прочитанные."));
      var row=h("div","ap-pkrow"),mcb=h("button","btn sm ap-gp ap-whole","Несколько глав целиком");mcb.type="button";mcb.id="pkMulti";mcb.setAttribute("aria-pressed",st.mc?"true":"false");
      mcb.onclick=function(){st.mc=!st.mc;st.cs=null;st.cr=null;draw();var f=$("pkMulti");if(f)f.focus()};row.appendChild(mcb);var csel=h("div","ap-pksel");csel.setAttribute("aria-live","polite");row.appendChild(csel);bd.appendChild(row);
      var g=h("div","ap-ngrid");
      function cupd(){Array.prototype.forEach.call(g.children,function(bt){var c=+bt.textContent,on=!!(st.cr&&c>=st.cr[0]&&c<=st.cr[1]);bt.classList.toggle("ap-on",st.mc&&on);bt.classList.toggle("ap-st",st.mc&&st.cs===c);if(st.mc)bt.setAttribute("aria-pressed",on?"true":"false");else bt.removeAttribute("aria-pressed")});
        if(!st.mc){csel.textContent="";return}var n=st.cr?st.cr[1]-st.cr[0]+1:0;
        csel.textContent=n?b.n+" "+(n>1?st.cr[0]+"–"+st.cr[1]:st.cr[0])+" · "+n+" "+plur(n,"глава","главы","глав")+" целиком"+(st.cs!==null?" · выберите последнюю главу":""):"Выберите первую главу"}
      for(var c=1;c<=b.c;c++){var bt=h("button","ap-nb"+((rd[b.k]||{})[c]?" ap-rdc":""),String(c));bt.type="button";bt.setAttribute("aria-label",b.n+" "+c+((rd[b.k]||{})[c]?", прочитана":""));
        bt.onclick=(function(c){return function(){if(st.mc){if(st.cs===null){st.cs=c;st.cr=[c,c]}else{st.cr=[Math.min(st.cs,c),Math.max(st.cs,c)];st.cs=null}cupd();return}
          st.c=c;st.step="v";st.rg=[];st.start=null;draw()}})(c);g.appendChild(bt)}bd.appendChild(g);
      if(st.mc){var msg0=h("div","msg");msg0.id="pkMsg";bd.appendChild(msg0);var ok0=h("button","btn main","Добавить");ok0.type="button";ok0.id="pkAddCh";ok0.onclick=finishCh;ft.appendChild(ok0)}cupd()}
    else{var mx=maxV(st.b,st.c);bd.appendChild(h("p","hint","Нажмите на первый и последний стих — получится диапазон. Можно выбрать несколько диапазонов. «Вся глава» отмечает все стихи сразу."));
      var row=h("div","ap-pkrow"),wb=h("button","btn sm ap-gp ap-whole","Вся глава");wb.type="button";wb.id="pkWhole";row.appendChild(wb);
      var sel=h("div","ap-pksel");sel.setAttribute("aria-live","polite");row.appendChild(sel);bd.appendChild(row);var g=h("div","ap-ngrid");
      function full(){return st.start===null&&st.rg.length===1&&st.rg[0][0]===1&&st.rg[0][1]===mx}
      wb.onclick=function(){st.start=null;st.rg=full()?[]:[[1,mx]];upd()};
      function inR(v){for(var i=0;i<st.rg.length;i++)if(v>=st.rg[i][0]&&v<=st.rg[i][1])return i;return -1}
      function upd(){Array.prototype.forEach.call(g.children,function(bt){var v=+bt.textContent;bt.classList.toggle("ap-on",inR(v)>=0);bt.classList.toggle("ap-st",st.start===v);bt.setAttribute("aria-pressed",inR(v)>=0||st.start===v)});
        var vt=vtxt(),f=full();wb.setAttribute("aria-pressed",f?"true":"false");sel.textContent=vt?BK[st.b].n+" "+st.c+":"+vt+(f?" · вся глава":"")+(st.start?" · выберите конец диапазона":""):BK[st.b].n+" "+st.c+" · выберите стихи или «Вся глава»";}
      for(var v=1;v<=mx;v++){var bt=h("button","ap-nb ap-verse-number",String(v));bt.type="button";bt.onclick=(function(v){return function(){
        if(st.start===null){var i=inR(v);if(i>=0)st.rg.splice(i,1);else st.start=v}
        else{var a=Math.min(st.start,v),z=Math.max(st.start,v);st.start=null;var nr=[a,z],keep=[];st.rg.forEach(function(r){if(r[1]<a-1||r[0]>z+1)keep.push(r);else{nr[0]=Math.min(nr[0],r[0]);nr[1]=Math.max(nr[1],r[1])}});keep.push(nr);st.rg=keep}
        upd()}})(v);g.appendChild(bt)}
      bd.appendChild(g);var msg=h("div","msg");msg.id="pkMsg";bd.appendChild(msg);upd();
      var clr=h("button","btn","Очистить");clr.type="button";clr.onclick=function(){st.rg=[];st.start=null;upd()};ft.appendChild(clr);
      var ok=h("button","btn main","Добавить");ok.type="button";ok.onclick=function(){if(st.start!==null){st.rg.push([st.start,st.start]);st.start=null}finish(vtxt())};ft.appendChild(ok)}
    bd.scrollTop=0}
  draw();return m}

/* --- focus mode --- */
var wake=null;
function openFocus(){var M=MG(),P=PG(),t=[];if(M)t.push("Минуты в день: "+goalInfo(M).bar.txt);if(P)t.push("«"+PLAN[P.plan].t+"»: "+planInfo(P).bar.txt);$("fsSub").textContent=t.length?t.join(" · "):"Спокойного чтения. Таймер продолжит идти, даже если закрыть этот экран.";
  openModal($("focusBox"),{variant:"full",label:"focusTitle",keep:true,focus:"#fsStart",onClose:function(){if(wake){try{wake.release()}catch(e){}wake=null}}});
  try{if(navigator.wakeLock)navigator.wakeLock.request("screen").then(function(w){wake=w},function(){})}catch(e){}}
$("focusBtn").onclick=openFocus;
$("fsExit").onclick=function(){closeModal($("focusBox"))};
function finishReading(){
  tPause();
  closeModal($("focusBox"));
  newEntry(true);
}
$("fsDone").onclick=finishReading;
$("tDone").onclick=finishReading;

/* --- theme --- */
var THK="bd6-theme",THN={system:"как в системе",light:"светлая",dark:"тёмная"},THI={system:["M3 5h18v11H3z","M8 20h8M12 16v4"],light:["M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z","M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"],dark:["M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"]};
function themeCur(){var t=lsGet(THK,"system");return THN[t]?t:"system"}
function themeApply(t){var r=document.documentElement;if(t==="light"||t==="dark")r.setAttribute("data-theme",t);else r.removeAttribute("data-theme");
  var g=$("thIco");g.innerHTML="";THI[t].forEach(function(d){g.appendChild(svgEl("path",{d:d}))});var nx={system:"light",light:"dark",dark:"system"}[t];
  $("themeBtn").setAttribute("aria-label","Тема: "+THN[t]+". Переключить на: "+THN[nx]);$("themeBtn").title="Тема: "+THN[t]}
$("themeBtn").onclick=function(){var t={system:"light",light:"dark",dark:"system"}[themeCur()];lsSet(THK,t);themeApply(t);toast("Тема: "+THN[t])};
themeApply(themeCur());

/* --- header --- */
function renderHdr(){var s=streak(),el=$("hStreak");el.hidden=!s;$("hStreakT").textContent=s+" "+plur(s,"день","дня","дней");el.title="Дней подряд с записями: "+s;el.setAttribute("aria-label",el.title);
  /* мини-кольцо в шапке: одна цель — одно кольцо со счётчиком; обе — два концентрических кольца (внешнее — минуты сегодня, внутреннее — план), без числа */
  var hg=$("hGoal"),M=MG(),P=PG();hg.hidden=!M&&!P;if(!M&&!P)return;
  function arc(id,r,v){var C=2*Math.PI*r,c=$(id);c.style.strokeDasharray=C;c.style.strokeDashoffset=C*(1-v)}
  var mi=M?goalInfo(M).bar:null,pi=P?planInfo(P).bar:null,fr=function(b){return Math.min(1,b.max?b.v/b.max:0)},both=!!(M&&P),one=mi||pi;
  arc("hGoalC",14,fr(one));$("hGoalC2").style.display=$("hGoalB2").style.display=both?"":"none";if(both)arc("hGoalC2",8,fr(pi));
  var tx=[];if(mi)tx.push("Минуты сегодня: "+mi.txt);if(pi)tx.push("План: "+pi.txt);
  $("hGoalT").textContent=both?"":one.v+" / "+one.max;$("hGoalT").hidden=both;hg.classList.toggle("ap-hg2",both);
  hg.setAttribute("aria-label","Цели. "+tx.join(". ")+". Открыть «Прогресс»");hg.title=tx.join("\n")}
$("hGoal").onclick=openGoal;
var hdrC=false;window.addEventListener("scroll",function(){var y=window.scrollY||0;if(!hdrC&&y>40){hdrC=true;$("hdr").classList.add("ap-compact")}else if(hdrC&&y<8){hdrC=false;$("hdr").classList.remove("ap-compact")}},{passive:true});
function openGoal(){tab("P");var g=$("goalH");if(g&&g.scrollIntoView)g.scrollIntoView({block:"start"})}

/* --- tooltips --- */
var tipEl=null,tipT=null;
function tipShow(el){var t=el.getAttribute("data-tip");if(!t)return;if(!tipEl){tipEl=h("div","ap-tip");tipEl.setAttribute("role","tooltip");document.body.appendChild(tipEl)}
  tipEl.textContent=t;tipEl.hidden=false;var r=el.getBoundingClientRect(),w=tipEl.offsetWidth,hh=tipEl.offsetHeight,x=r.left+r.width/2-w/2,y=r.top-hh-8;
  x=Math.max(6,Math.min(window.innerWidth-w-6,x));if(y<6)y=r.bottom+8;tipEl.style.left=x+"px";tipEl.style.top=y+"px"}
function tipHide(){if(tipEl)tipEl.hidden=true}
document.addEventListener("pointerover",function(ev){var el=ev.target.closest&&ev.target.closest("[data-tip]");if(el&&ev.pointerType==="mouse")tipShow(el)});
document.addEventListener("pointerout",function(ev){var el=ev.target.closest&&ev.target.closest("[data-tip]");if(el&&ev.pointerType==="mouse")tipHide()});
document.addEventListener("pointerup",function(ev){if(ev.pointerType==="mouse")return;var el=ev.target.closest&&ev.target.closest("[data-tip]");if(el){tipShow(el);clearTimeout(tipT);tipT=setTimeout(tipHide,2200)}else tipHide()});
document.addEventListener("focusin",function(ev){var el=ev.target.closest&&ev.target.closest("[data-tip]");if(el)tipShow(el);else tipHide()});
window.addEventListener("scroll",tipHide,{passive:true});

/* --- tiles --- */
var tileOpen="";
function renderTiles(){var box=$("tiles"),m=readMap();box.innerHTML="";
  [["Əhdi-Ətiq",0,39,929],["Əhdi-Cədid",39,66,260]].forEach(function(t){var hd=h("div","ap-tsec");hd.appendChild(h("span","",t[0]));hd.appendChild(h("small","",cntRead(m,t[1],t[2])+" из "+t[3]+" глав"));box.appendChild(hd);
    var g=h("div","ap-tgrid"),dw=h("div");B.slice(t[1],t[2]).forEach(function(b){var n=Object.keys(m[b.k]||{}).length,p=n/b.c,op=n?.18+.82*p:0,tl=h("button","ap-tile"+(b.c>=40?" s3":b.c>=20?" s2":"")+(op>.55?" ap-dk":""));tl.type="button";
      var f=h("span","ap-tf");f.style.opacity=op;tl.appendChild(f);tl.appendChild(h("span","ap-tn",b.n));tl.appendChild(h("span","ap-tp",n+"/"+b.c));
      var tip=b.n+": "+n+" из "+b.c+" "+plur(b.c,"главы","глав","глав");tl.setAttribute("data-tip",tip);tl.setAttribute("aria-label",tip);tl.setAttribute("aria-expanded",tileOpen===b.k);
      tl.onclick=function(){tileOpen=tileOpen===b.k?"":b.k;renderTiles();var nt=box.querySelector('.ap-tile[aria-expanded="true"]');if(nt)nt.focus({preventScroll:true})};g.appendChild(tl);
      if(tileOpen===b.k)dw.appendChild(tileDet(b,m))});box.appendChild(g);box.appendChild(dw)})}
function tileDet(b,m){var rd=m[b.k]||{},n=Object.keys(rd).length,d=h("div","ap-tdet"),hd=h("div","bkh");hd.appendChild(h("span","bn",b.n));hd.appendChild(h("small","","прочитано "+n+" из "+b.c));d.appendChild(hd);
  var cs=h("div","cells");for(var c=1;c<=b.c;c++){var lab=b.n+" "+c,x;
    if(rd[c]){x=h("button","cell rd");x.type="button";x.title=lab+": прочитано, показать записи";x.setAttribute("aria-label",x.title);x.onclick=(function(k,c){return function(){showPassage(k,c)}})(b.k,c)}
    else{x=h("span","cell");x.title=lab+": не прочитано"}if(c%10===0)x.classList.add("t");cs.appendChild(x)}d.appendChild(cs);
  d.appendChild(h("p","hint",n?"Нажмите на отмеченную главу, чтобы открыть записи по ней.":"В этой книге пока нет прочитанных глав."));
  var cl=h("button","btn sm","Свернуть");cl.type="button";cl.onclick=function(){tileOpen="";renderTiles()};d.appendChild(cl);return d}

/* --- heatmap --- */
var heatY=+todayStr().slice(0,4);
function heatLvl(n,mins){return !n?0:mins<10?1:mins<25?2:mins<45?3:4}
$("heatPrev").onclick=function(){heatY--;renderHeat()};$("heatNext").onclick=function(){heatY++;renderHeat()};
function renderHeat(){var bd=byDate(),cy=+todayStr().slice(0,4),ys=Object.keys(bd).map(function(d){return +d.slice(0,4)}),minY=Math.min.apply(null,ys.concat([cy]));
  heatY=Math.max(minY,Math.min(cy,heatY));$("heatT").textContent=heatY+" год";$("heatPrev").disabled=heatY<=minY;$("heatNext").disabled=heatY>=cy;
  var w=$("heat"),g=h("div","ap-heat"),y=heatY,f=dnum(y+"-01-01"),l=dnum(y+"-12-31"),s=f-wdOf(y+"-01-01"),td=todayStr(),tot=0,nd=0;w.innerHTML="";g.setAttribute("role","group");g.setAttribute("aria-label","Записи по дням за "+y+" год");
  g.appendChild(h("span","ap-hm",""));["Пн","","Ср","","Пт","",""].forEach(function(x){g.appendChild(h("span","ap-hw",x))});
  for(var ws=s;ws<=l;ws+=7){var lab="";for(var k=0;k<7;k++){var ds=dstr(ws+k);if(ds.slice(8)==="01"&&ws+k>=f&&ws+k<=l)lab=MS[+ds.slice(5,7)-1]}g.appendChild(h("span","ap-hm",lab));
    for(k=0;k<7;k++){var dn=ws+k,ds2=dstr(dn),es=bd[ds2]||[],mins=Math.round(es.reduce(function(a,e){return a+secsOf(e)},0)/60),lv=heatLvl(es.length,mins);
      if(dn<f||dn>l||ds2>td){var p=h("span","ap-hc ap-x0");p.setAttribute("aria-hidden","true");g.appendChild(p);continue}
      if(es.length){nd++;tot+=mins}
      var c=h("span","ap-hc"+(lv?" l"+lv:"")+(ds2===calSel?" ap-hsel":""));c.tabIndex=-1;var tip=fmtDay(ds2)+": "+(es.length?es.length+" зап."+(mins?", "+mins+" мин":""):"нет записей");c.setAttribute("data-tip",tip);c.setAttribute("aria-label",tip);c.dataset.d=ds2;g.appendChild(c)}}
  g.addEventListener("click",function(ev){var c=ev.target.closest(".ap-hc");if(!c||!c.dataset.d)return;var ds=c.dataset.d;calSel=ds;calM=ds.slice(0,7);
    Array.prototype.forEach.call(g.querySelectorAll(".ap-hsel"),function(x){x.classList.remove("ap-hsel")});c.classList.add("ap-hsel");$("heatInfo").textContent=c.getAttribute("data-tip")+". День выбран в календаре ниже.";renderCal()});
  var first=g.querySelector(".ap-hc[data-d]");if(first)first.tabIndex=0;
  g.addEventListener("keydown",function(ev){var c=ev.target.closest(".ap-hc");if(!c)return;var d={ArrowRight:7,ArrowLeft:-7,ArrowDown:1,ArrowUp:-1}[ev.key];
    if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();c.click();return}if(!d)return;ev.preventDefault();var n=g.querySelector('.ap-hc[data-d="'+dstr(dnum(c.dataset.d)+d)+'"]');if(n){c.tabIndex=-1;n.tabIndex=0;n.focus()}});
  w.appendChild(g);$("heatInfo").textContent=nd?"За "+y+" год: дней с записями — "+nd+(tot?", минут — "+tot:"")+".":"За "+y+" год записей нет.";
  var lg=$("heatLeg");lg.innerHTML="";lg.appendChild(h("span","","Меньше"));[0,1,2,3,4].forEach(function(i){var c=h("span","ap-hc"+(i?" l"+i:""));c.setAttribute("aria-hidden","true");lg.appendChild(c)});lg.appendChild(h("span","","Больше"));
  if(heatY===cy)requestAnimationFrame(function(){w.scrollLeft=w.scrollWidth})}

/* --- achievements --- */
var ACH=[["first","Первая запись","Дневник начат",function(s){return [s.n,1]},"M12 20V8M8 12l4-4 4 4M5 4h14"],
  ["e10","10 записей","Десять записей в дневнике",function(s){return [s.n,10]},"M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"],
  ["e50","50 записей","Полсотни записей",function(s){return [s.n,50]},"M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"],
  ["e100","100 записей","Сотня записей",function(s){return [s.n,100]},"M6 4h12v16H6zM9 8h6M9 12h6M9 16h4"],
  ["book","Первая книга","Прочитаны все главы одной книги",function(s){return [s.books,1]},"M4 5c3-1.5 5-1.5 8 0v14c-3-1.5-5-1.5-8 0zM12 5c3-1.5 5-1.5 8 0v14c-3-1.5-5-1.5-8 0z"],
  ["gosp","Четыре Евангелия","Matta, Mark, Luka и Yəhya",function(s){return [s.gosp,89]},"M12 3v18M6 9h12"],
  ["pent","Пятикнижие","От Yaradılış до Qanunun Təkrarı",function(s){return [s.pent,187]},"M4 20h16M6 20V9M10 20V9M14 20V9M18 20V9M3 9l9-5 9 5z"],
  ["psa","Вся Zəbur","Все 150 псалмов",function(s){return [s.psa,150]},"M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"],
  ["nt","Əhdi-Cədid","Все 260 глав",function(s){return [s.nt,260]},"M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"],
  ["ot","Əhdi-Ətiq","Все 929 глав",function(s){return [s.ot,929]},"M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"],
  ["bible","Вся Библия","Все 1189 глав",function(s){return [s.ot+s.nt,1189]},"M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3zM5 18a3 3 0 0 1 3-3h11M12 6v6M9.5 8.5h5"],
  ["h10","10 часов чтения","Суммарное время по записям",function(s){return [Math.floor(s.secs/3600),10]},"M12 7v5l3 2M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z"],
  ["d30","30 дней чтения","Дни с записями, не обязательно подряд",function(s){return [s.nd,30]},"M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"]];
function achStats(){var list=readingEntries(),m=readMap(list),s={n:list.length,ot:cntRead(m,0,39),nt:cntRead(m,39,66),books:0,secs:0,nd:0,gosp:0,pent:0,psa:Object.keys(m.PSA||{}).length},d={};
  B.forEach(function(b,i){var n=Object.keys(m[b.k]||{}).length;if(n===b.c)s.books++;if(i<5)s.pent+=n;if(i>=39&&i<43)s.gosp+=n});
  list.forEach(function(e){s.secs+=secsOf(e);if(e.date)d[e.date]=1});s.nd=Object.keys(d).length;return s}
function achList(){var s=achStats();return ACH.map(function(a){var p=a[3](s);return {id:a[0],t:a[1],d:a[2],v:Math.min(p[0],p[1]),max:p[1],on:p[0]>=p[1],ic:a[4]}})}
function achCheck(){if(!dataReady)return;var L=achList(),on=L.filter(function(a){return a.on}).map(function(a){return a.id}),st=null;
  try{st=JSON.parse(localStorage.getItem("bd6-ach")||"null")}catch(e){}
  if(!Array.isArray(st)){lsSet("bd6-ach",JSON.stringify(on));return}
  var nw=on.filter(function(id){return st.indexOf(id)<0});if(!nw.length)return;
  lsSet("bd6-ach",JSON.stringify(st.concat(nw)));nw.forEach(function(id){var a=L.find(function(x){return x.id===id});toast("Новое достижение: «"+a.t+"»",{cls:"ap-achv"})});if(curTab==="P")renderAch()}
function renderAch(){var box=$("ach");box.innerHTML="";var L=achList(),n=L.filter(function(a){return a.on}).length;
  box.setAttribute("aria-label","Достижения: получено "+n+" из "+L.length);
  L.forEach(function(a){var d=h("div","ap-a "+(a.on?"ap-on":"ap-off")),ic=h("div","ap-ai");ic.appendChild(svgIcon([a.on?a.ic:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v9H5z"]));d.appendChild(ic);
    var tx=h("div");tx.appendChild(h("div","ap-at",a.t));tx.appendChild(h("div","ap-ad",a.d));tx.appendChild(h("div","ap-ap",a.on?"Получено":a.v+" из "+a.max));d.appendChild(tx);
    d.setAttribute("aria-label",a.t+": "+(a.on?"получено":"пока нет, "+a.v+" из "+a.max));box.appendChild(d)})}

/* --- start --- */
Array.prototype.forEach.call(document.querySelectorAll(".ap-views button"),function(b){var on=b.dataset.view===VIEW;b.setAttribute("aria-checked",on);b.tabIndex=on?0:-1});
window.addEventListener("load",moveInd);try{document.fonts.ready.then(moveInd)}catch(e){}
resetForm();tShow();tab("W");render();initCloud();syInit();
