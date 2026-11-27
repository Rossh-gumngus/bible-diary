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
function readingCycle(list){
  var total=B.reduce(function(sum,book){return sum+book.v.reduce(function(n,verses){return n+verses},0)},0);
  var number=1,remaining=total,chapters={};
  readingEntries(list).sort(function(a,b){return cmpDesc(b,a)}).forEach(function(entry){
    refChapters(entry.refs).forEach(function(ref){
      var chapter=+ref.c,limit=maxV(ref.b,chapter);
      if(!limit)return;
      var book=chapters[ref.b]||(chapters[ref.b]={});
      var seen=book[chapter]||(book[chapter]=new Set());
      vsRanges(ref.b,chapter,ref.v).forEach(function(range){
        if(!Number.isInteger(range[0])||!Number.isInteger(range[1]))return;
        for(var verse=range[0];verse<=Math.min(range[1],limit);verse++){
          if(!seen.has(verse)){seen.add(verse);remaining--}
        }
      });
    });
    if(remaining===0){number++;remaining=total;chapters={}}
  });
  var full={},partial={};
  Object.keys(chapters).forEach(function(key){
    Object.keys(chapters[key]).forEach(function(chapter){
      var count=chapters[key][chapter].size;
      if(!count)return;
      var state=count===maxV(key,+chapter)?full:partial;
      (state[key]||(state[key]={}))[chapter]=true;
    });
  });
  return {number:number,full:full,partial:partial};
}
function renderTiles(){var box=$("tiles"),cycle=readingCycle(),m=cycle.full;box.innerHTML="";
  box.appendChild(h("p","ap-cycle","Круг чтения № "+cycle.number));
  [["Əhdi-Ətiq",0,39,929],["Əhdi-Cədid",39,66,260]].forEach(function(t){var hd=h("div","ap-tsec");hd.appendChild(h("span","",t[0]));hd.appendChild(h("small","",cntRead(m,t[1],t[2])+" из "+t[3]+" глав"));box.appendChild(hd);
    var g=h("div","ap-tgrid"),dw=h("div");B.slice(t[1],t[2]).forEach(function(b){var n=Object.keys(m[b.k]||{}).length,p=n/b.c,op=n?.18+.82*p:0,tl=h("button","ap-tile"+(b.c>=40?" s3":b.c>=20?" s2":"")+(op>.55?" ap-dk":""));tl.type="button";
      var f=h("span","ap-tf");f.style.opacity=op;tl.appendChild(f);tl.appendChild(h("span","ap-tn",b.n));tl.appendChild(h("span","ap-tp",n+"/"+b.c));
      var partial=Object.keys(cycle.partial[b.k]||{}).length;
      var tip=b.n+": "+n+" из "+b.c+" глав целиком"+(partial?", частично: "+partial:"");
      tl.setAttribute("data-tip",tip);tl.setAttribute("aria-label",tip);tl.setAttribute("aria-expanded",tileOpen===b.k);
      tl.onclick=function(){tileOpen=tileOpen===b.k?"":b.k;renderTiles();var nt=box.querySelector('.ap-tile[aria-expanded="true"]');if(nt)nt.focus({preventScroll:true})};g.appendChild(tl);
      if(tileOpen===b.k)dw.appendChild(tileDet(b,m,cycle.partial))});box.appendChild(g);box.appendChild(dw)})}
function tileDet(b,m,partial){
  var rd=m[b.k]||{},part=partial[b.k]||{},n=Object.keys(rd).length,p=Object.keys(part).length,d=h("div","ap-tdet"),hd=h("div","bkh");
  hd.appendChild(h("span","bn",b.n));hd.appendChild(h("small","",n+" из "+b.c+" глав целиком"+(p?" · частично: "+p:"")));d.appendChild(hd);
  var cs=h("div","cells");
  for(let c=1;c<=b.c;c++){
    var lab=b.n+" "+c,x;
    if(rd[c]||part[c]){
      x=h("button","cell "+(rd[c]?"rd":"part"));x.type="button";
      x.title=lab+(rd[c]?": прочитано целиком":": прочитано частично");x.setAttribute("aria-label",x.title+", показать записи");
      x.onclick=function(){showPassage(b.k,c)};
    }else{x=h("span","cell");x.title=lab+": не прочитано"}
    if(c%10===0)x.classList.add("t");cs.appendChild(x);
  }
  d.appendChild(cs);
  var cl=h("button","btn sm","Свернуть");cl.type="button";cl.onclick=function(){tileOpen="";renderTiles()};d.appendChild(cl);return d;
}

/* --- achievements --- */
var ACH = [
  {id:"bible",title:"Библия целиком",unit:"times",levels:[1,2,3,5,10]},
  {id:"ot",title:"Ветхий Завет целиком",unit:"times",levels:[1,2,3,5,10]},
  {id:"nt",title:"Новый Завет целиком",unit:"times",levels:[1,2,3,5,10,20]},
  {id:"days",title:"Дней чтения",unit:"days",levels:[7,30,90,180,365,730]},
  {id:"streak",title:"Дней чтения подряд",unit:"days",levels:[3,7,14,30,60,90,180,365]},
  {id:"total",title:"Общее время чтения",unit:"hours",levels:[1,5,10,25,50,100,250,500]},
  {id:"record",title:"Самое долгое чтение за день",unit:"minutes",levels:[15,30,45,60,90,120]}
];

function completeReadings(readings){
  var coverage=new Map();
  readings.forEach(function(entry){
    var chapters=new Map();
    refChapters(entry.refs).forEach(function(ref){
      var end=maxV(ref.b,+ref.c);
      if(!end)return;
      var key=ref.b+":"+(+ref.c);
      if(!chapters.has(key))chapters.set(key,{end:end,ranges:[]});
      vsRanges(ref.b,+ref.c,ref.v).forEach(function(range){
        if(Number.isInteger(range[0])&&Number.isInteger(range[1])&&range[0]<=end)chapters.get(key).ranges.push([range[0],Math.min(range[1],end)]);
      });
    });
    // Count overlapping references to a verse only once within one reading record.
    chapters.forEach(function(chapter,key){
      if(!chapter.ranges.length)return;
      if(!coverage.has(key))coverage.set(key,new Int32Array(chapter.end+2));
      var marks=coverage.get(key),last=0;
      chapter.ranges.sort(function(a,b){return a[0]-b[0]}).forEach(function(range){
        var start=Math.max(last+1,range[0]),end=range[1];
        if(start>end)return;
        marks[start]++;
        marks[end+1]--;
        last=end;
      });
    });
  });
  function completed(books){
    var minimum=Infinity;
    for(var book of books){
      for(var chapter=1;chapter<=book.c;chapter++){
        var marks=coverage.get(book.k+":"+chapter),count=0;
        if(!marks)return 0;
        for(var verse=1;verse<marks.length-1;verse++){
          count+=marks[verse];
          minimum=Math.min(count,minimum);
          if(!minimum)return 0;
        }
      }
    }
    return minimum;
  }
  var ot=completed(B.slice(0,39)),nt=completed(B.slice(39));
  return {bible:Math.min(ot,nt),ot:ot,nt:nt};
}

function achStats(list,today){
  var readings=readingEntries(list),daily=new Map(),total=0,record=0;
  readings.forEach(function(entry){
    var seconds=secsOf(entry),day=(daily.get(entry.date)||0)+seconds;
    daily.set(entry.date,day);
    total+=seconds;
    record=Math.max(record,day);
  });
  return Object.assign(completeReadings(readings),{
    days:daily.size,streak:longestStreak(new Set(daily.keys()),today||todayStr()),total:total,record:record
  });
}
function achValue(value,unit){
  if(unit==="days")return value+" "+plur(value,"день","дня","дней");
  if(unit==="times")return value+" "+plur(value,"раз","раза","раз");
  return readingTime(value);
}
function achList(stats){
  return ACH.map(function(a){
    var scale=a.unit==="hours"?3600:a.unit==="minutes"?60:1;
    var value=stats[a.id],earned=a.levels.filter(function(level){return value>=level*scale});
    return {id:a.id,title:a.title,value:achValue(value,a.unit),earned:earned,
      next:a.levels[earned.length],unit:a.unit,scale:scale};
  });
}
function achCheck(){
  if(!dataReady)return;
  var list=achList(achStats()),stored=null;
  try{stored=JSON.parse(localStorage.getItem("bd6-ach")||"null")}catch(e){}
  var previous=Array.isArray(stored)?stored:[];
  var known=new Set(previous),announced=known.has("level:initialized");
  known.add("level:initialized");
  list.forEach(function(a){
    var latest=null;
    a.earned.forEach(function(level){
      var id="level:"+a.id+":"+level;
      if(!known.has(id)){known.add(id);latest=level}
    });
    if(announced&&latest!==null)toast(a.title+" · "+achValue(latest*a.scale,a.unit),{cls:"ap-achv"});
  });
  if(known.size!==previous.length||!stored)lsSet("bd6-ach",JSON.stringify(Array.from(known)));
}
function renderAch(){
  var box=$("ach");
  box.replaceChildren();
  achList(achStats()).forEach(function(a){
    var row=h("div","ap-a"),top=h("div","ap-ahead");
    top.append(h("h3","ap-at",a.title),h("strong","ap-av",a.value));
    row.appendChild(top);
    if(a.earned.length){
      var levels=a.earned.map(function(level){return achValue(level*a.scale,a.unit)});
      row.appendChild(h("p","ap-ap","Пройденные уровни: "+levels.join(", ")));
    }
    var next=a.next===undefined?"Все уровни пройдены":"Следующий уровень: "+achValue(a.next*a.scale,a.unit);
    row.appendChild(h("p","ap-ap",next));
    box.appendChild(row);
  });
}

/* --- start --- */
Array.prototype.forEach.call(document.querySelectorAll(".ap-views button"),function(b){var on=b.dataset.view===VIEW;b.setAttribute("aria-checked",on);b.tabIndex=on?0:-1});
window.addEventListener("load",moveInd);try{document.fonts.ready.then(moveInd)}catch(e){}
resetForm();tShow();tab("W");render();initCloud();syInit();
