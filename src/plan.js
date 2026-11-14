/* ===== stage 7: reading plans ===== */
function planDays(p){if(p._d)return p._d;p._d=p.d.split("|").map(function(s){var out=[];if(!s)return out;
  s.split(",").forEach(function(x){
    /* план с сегментами (seg:1): один пункт = один отрывок схемы, всегда со стихами; BOOK.c:v, BOOK.c:v1-v2, BOOK.c1:v1-c2:v2 */
    if(p.seg){var g=x.match(/^(\w+)\.(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/);if(!g||!BK[g[1]])return;var c1=+g[2],v1=+g[3],c2=g[4]?+g[4]:c1,v2=g[5]?+g[5]:v1,parts=[];
      for(var c=c1;c<=c2;c++){var a=c===c1?v1:1,z=c===c2?v2:maxV(g[1],c);parts.push({b:g[1],c:c,v:a===z?String(a):a+"-"+z})}
      out.push({b:g[1],c:c1,v:parts[0].v,parts:parts,lab:c1===c2?c1+":"+(v1===v2?v1:v1+"-"+v2):c1+":"+v1+"–"+c2+":"+v2});return}
    var m=x.match(/^(\w+)\.(\d+)(?:-(\d+))?(?::(\d+(?:-\d+)?))?$/);if(!m||!BK[m[1]])return;var a=+m[2],z=+(m[3]||a);for(var c=a;c<=z;c++)out.push({b:m[1],c:c,v:m[4]||""})});return out});return p._d}
function planTotal(p){return planDays(p).reduce(function(a,d){return a+d.length},0)}
function vRanges(v){return String(v).split(",").map(function(x){var m=x.split("-");return [+m[0],+(m[1]||m[0])]})}
function vOverlap(a,b){var A=vRanges(a),B2=vRanges(b);return A.some(function(x){return B2.some(function(y){return x[0]<=y[1]&&y[0]<=x[1]})})}
function plR(n){return n+" "+plur(n,"чтение","чтения","чтений")}
function plRg(n){return n+" "+plur(n,"чтения","чтений","чтений")}
function planDate(g,n){return dstr(dnum(g.start)+n-1)}
function shortDay(s){var a=s.split("-");return (+a[2])+" "+MS[+a[1]-1]}
/* выполнено = есть запись с датой не раньше старта плана, где указана эта глава (для части главы — пересекающиеся стихи или вся глава) */
function planState(g,list,today){var p=PLAN[g.plan],days=planDays(p),N=days.length,s=g.start,D=dnum(today||todayStr())-dnum(s)+1,idx={};
  (list||entries).forEach(function(e){if((e.date||"")>=s)(e.refs||[]).forEach(function(r){var k=r.b+" "+(+r.c);(idx[k]=idx[k]||[]).push(String(r.v||""))})});
  function isDone1(it){var l=idx[it.b+" "+it.c];if(!l)return false;if(!it.v)return true;return l.some(function(v){return !v||vOverlap(v,it.v)})}
  function isDone(it){return it.parts?it.parts.every(isDone1):isDone1(it)}
  var mk=days.map(function(d){return d.map(isDone)}),total=0,done=0,dueN=0,dueY=0,k=0,pref=true,firstUndone=0;
  mk.forEach(function(d,i){var n=d.length,dn=d.filter(Boolean).length;total+=n;done+=dn;if(i<D)dueN+=n;if(i<D-1)dueY+=n;if(pref&&dn===n)k=i+1;else pref=false;if(!firstUndone&&dn<n)firstUndone=i+1});
  var missed=[];for(var i=0;i<Math.min(D-1,N);i++)days[i].forEach(function(it,j){if(!mk[i][j])missed.push(it)});
  return {p:p,days:days,mk:mk,N:N,D:D,total:total,done:done,dueN:Math.min(dueN,total),dueY:Math.min(dueY,total),k:k,missed:missed,firstUndone:firstUndone,grace:p.grace||[]}}
function planInfo(g,list,today){var ps=planState(g,list,today),N=ps.N,D=ps.D,L=[],end=planDate(g,N),bar;
  L.push("План «"+ps.p.t+"»: "+N+" "+plur(N,"день","дня","дней")+", с "+fmtDay(g.start)+" по "+fmtDay(end)+".");
  L.push("Прочитано "+ps.done+" из "+plRg(ps.total)+" ("+pct(ps.done,ps.total)+"), осталось "+plR(ps.total-ps.done)+".");
  bar={v:ps.done,max:ps.total,mark:D>=1&&D<=N?ps.dueN:null,txt:"Прочитано "+ps.done+" из "+ps.total+" · "+pct(ps.done,ps.total)+(D>=1&&D<=N?" · день "+D+" из "+N:"")};
  var r={lines:L,bar:bar,ps:ps};
  if(ps.done>=ps.total){L.push("План выполнен. Слава Богу!");r.st="ok";return r}
  if(D<1){L.push("План начнётся "+fmtDay(g.start)+".");r.st="wait";return r}
  if(D>N){L.push("Срок плана закончился "+fmtDay(end)+". Осталось "+plR(ps.total-ps.done)+". Можно начать заново или дочитать.");r.st="late";return r}
  if(ps.done>=ps.dueN){var ad=ps.k-D;L.push(ps.done>ps.dueN?"Впереди плана на "+plR(ps.done-ps.dueN)+(ad>0?" (на "+ad+" "+plur(ad,"день","дня","дней")+")":"")+".":"Вы точно по плану: на сегодня всё прочитано.");r.st="ok"}
  else if(ps.done>=ps.dueY){L.push("Идёте по плану. На сегодня осталось "+plR(ps.dueN-ps.done)+".");r.st="ok"}
  else{var bd=Math.max(1,D-1-ps.k);L.push("Отстаёте на "+plR(ps.dueY-ps.done)+" (примерно на "+bd+" "+plur(bd,"день","дня","дней")+")."+(ps.grace.some(function(g){return g>=D})?" Дни навёрстывания помогут догнать план.":""));r.st="late"}
  return r}
function itLab(it){return it.lab||(it.c+(it.v?":"+it.v:""))}
function bName(k){return BK[k]?BK[k].n:k}
function planSum(items){if(items.length&&items[0].parts)return items.map(function(it){return bName(it.b)+" "+it.lab}).join("; ");var out=[],i=0;while(i<items.length){var r=items[i],n=BK[r.b]?BK[r.b].n:r.b;if(r.v){out.push(n+" "+r.c+":"+r.v);i++;continue}
  var j=i;while(j+1<items.length&&items[j+1].b===r.b&&!items[j+1].v&&items[j+1].c===items[j].c+1)j++;out.push(n+" "+r.c+(j>i?"–"+items[j].c:""));i=j+1}return out.join("; ")}
/* краткое содержание дня: каждая ссылка не переносится внутри себя */
function sumEl(items){var s=h("span","ap-ss");if(!items.length){s.textContent="День навёрстывания";return s}
  planSum(items).split("; ").forEach(function(x,i){if(i)s.appendChild(document.createTextNode("; "));var k=x.lastIndexOf(" ");s.appendChild(document.createTextNode(x.slice(0,k+1)));s.appendChild(h("span","ap-nw",x.slice(k+1)))});return s}
function chkList(items,marks){var ul=h("ul","ap-chk");items.forEach(function(it,i){var li=h("li",marks[i]?"ap-dn":""),ic=h("span","ap-ck",marks[i]?"✓":"");ic.setAttribute("aria-hidden","true");li.appendChild(ic);var lb=h("span","ap-cl"),b=BK[it.b];lb.appendChild(document.createTextNode((b?b.n:it.b)+" "));lb.appendChild(h("span","ap-cn",itLab(it)));li.appendChild(lb);
  var sr=h("span","ap-sr",marks[i]?", прочитано":", не прочитано");li.appendChild(sr);ul.appendChild(li)});return ul}
function pbar(b){var w=h("div","gcb ap-pb");w.setAttribute("role","progressbar");w.setAttribute("aria-valuemin","0");w.setAttribute("aria-valuemax",String(b.max));w.setAttribute("aria-valuenow",String(b.v));w.setAttribute("aria-valuetext",b.txt);
  var f=h("div");f.style.width=(b.max?Math.min(100,b.v/b.max*100):0)+"%";w.appendChild(f);if(b.mark!=null){var m=h("span");m.style.left=Math.min(100,b.mark/b.max*100)+"%";m.title="По плану к концу дня: "+b.mark;w.appendChild(m)}return w}
function newEntryWith(rs){if(sheetOpen())return;resetForm();if(!tm.start)fillTime();refs=[];rs.forEach(function(r){(r.parts||[r]).forEach(function(q){refs.push({b:q.b,c:q.c,v:q.v||""})})});drawRefs();fSnap=formState();openSheet()}
function planView(full){var G=PG(),gi=planInfo(G),ps=gi.ps,D=ps.D,c=h("div","ap-plan ap-card "+gi.st);
  var hd=h("div","ap-plh");hd.appendChild(h("span","ap-plt",ps.p.t));hd.appendChild(h("span","ap-pld",D>=1&&D<=ps.N?"день "+D+" из "+ps.N:D<1?"старт "+fmtDay(G.start):"срок закончился"));c.appendChild(hd);
  c.appendChild(pbar(gi.bar));c.appendChild(h("div","gcn",gi.bar.txt));
  if(full)gi.lines.slice(0,-1).forEach(function(l){c.appendChild(h("p","ap-pll",l))});
  c.appendChild(h("p","gst",gi.lines[gi.lines.length-1]));
  var day=D<1?1:D>ps.N?0:D,todo=[];
  if(day){var items=ps.days[day-1],grace=!items.length;
    c.appendChild(h("h3","ap-h3",(D<1?"Первый день":"Сегодня, день "+day)+(grace?" — День навёрстывания":"")));
    if(grace){c.appendChild(h("p","hint",ps.missed.length?"Сегодня нет нового чтения: дочитайте пропущенное ("+plR(ps.missed.length)+").":"Сегодня нет нового чтения, а пропущенного нет. Можно отдохнуть или прочитать наперёд."));todo=ps.missed.slice(0,30);if(todo.length){var sh=full?todo:todo.slice(0,8);c.appendChild(chkList(sh,sh.map(function(){return false})));if(ps.missed.length>sh.length)c.appendChild(h("p","hint","…и ещё "+plR(ps.missed.length-sh.length)+(ps.missed.length>30?" (в запись попадут первые 30)":"")+"."))}}
    else{var mk=ps.mk[day-1];c.appendChild(chkList(items,mk));todo=items.filter(function(it,i){return !mk[i]})}}
  else{todo=ps.missed.slice(0,30)}
  if(day&&ps.days[day-1].length&&ps.missed.length){var ms=h("p","hint","Пропущено в прошлые дни: "+plR(ps.missed.length)+".");c.appendChild(ms)}
  var a=h("div","acts ap-pla");
  if(todo.length){var w=h("button","btn ap-pri","Записать");w.type="button";w.title="Открыть новую запись с отрывками: "+planSum(todo);w.onclick=function(){newEntryWith(todo)};a.appendChild(w)}
  else if(day&&ps.days[day-1].length)c.appendChild(h("p","hint","На сегодня всё прочитано."));
  var s=h("button","btn","Расписание");s.type="button";s.onclick=function(){openSchedule()};a.appendChild(s);
  if(!full){var pr=h("button","btn","Прогресс ›");pr.type="button";pr.onclick=openGoal;a.appendChild(pr)}
  c.appendChild(a);
  if(full){var src=h("p","ap-src","Источник: "+ps.p.src+". ");if(ps.p.url){var ln=h("a","",ps.p.url.replace(/^https:\/\/www\./,""));ln.href=ps.p.url;ln.target="_blank";ln.rel="noopener noreferrer";src.appendChild(ln)}c.appendChild(src)}
  return c}
function openSchedule(focus){var G=PG();if(!G)return;var ps=planState(G),box=h("div","ap-sch"),hd=h("div","ap-dh"),t=h("h2","ap-dt","Расписание: "+ps.p.t);t.id="schT";hd.appendChild(t);
  var x=h("button","ap-x","×");x.type="button";x.setAttribute("aria-label","Закрыть");x.setAttribute("data-close","");hd.appendChild(x);box.appendChild(hd);
  var bd=h("div","ap-db"),info=h("p","hint","Прочитано "+ps.done+" из "+plRg(ps.total)+". Отметка ставится сама, когда в записи с датой не раньше старта плана ("+fmtDay(G.start)+") есть эта глава.");bd.appendChild(info);
  var open={},list=h("div","ap-sdays");bd.appendChild(list);box.appendChild(bd);
  var ft=h("div","ap-df"),tb=h("button","btn","К сегодняшнему дню");tb.type="button";ft.appendChild(tb);var cb=h("button","btn main","Закрыть");cb.type="button";cb.setAttribute("data-close","");ft.appendChild(cb);box.appendChild(ft);
  function row(i){var items=ps.days[i],mk=ps.mk[i],n=items.length,dn=mk.filter(Boolean).length,today=i+1===ps.D,d=h("div","ap-sday"+(today?" ap-today":"")+(n&&dn===n?" ap-sdone":""));d.id="sch"+(i+1);
    var b=h("button","ap-sbtn");b.type="button";b.setAttribute("aria-expanded",!!open[i]);var l=h("span","ap-sn","День "+(i+1));b.appendChild(l);b.appendChild(h("span","ap-sdt",shortDay(planDate(G,i+1))+(today?" · сегодня":"")));
    b.appendChild(sumEl(items));var st=h("span","ap-sst",n?(dn===n?"✓":dn+"/"+n):"—");st.setAttribute("aria-label",n?(dn===n?"всё прочитано":"прочитано "+dn+" из "+n):"нет нового чтения");b.appendChild(st);
    b.onclick=function(){open[i]=!open[i];d.replaceWith(row(i));var nb=$("sch"+(i+1)).querySelector(".ap-sbtn");if(nb)nb.focus()};d.appendChild(b);
    if(open[i]){var w=h("div","ap-sbody");if(n){w.appendChild(chkList(items,mk));var todo=items.filter(function(it,j){return !mk[j]});var wb=h("button","btn sm",todo.length?"Записать этот день":"Записать ещё раз");wb.type="button";wb.onclick=function(){var r=todo.length?todo:items;closeModal(m);newEntryWith(r)};w.appendChild(wb)}
      else w.appendChild(h("p","hint","В этот день нового чтения нет — время дочитать пропущенное."));d.appendChild(w)}
    return d}
  for(var i=0;i<ps.N;i++)list.appendChild(row(i));
  function go(n){n=Math.max(1,Math.min(ps.N,n));var el=$("sch"+n);if(el){open[n-1]=true;el.replaceWith(row(n-1));el=$("sch"+n);bd.scrollTop=el.offsetTop-bd.offsetTop-8;var bb=el.querySelector(".ap-sbtn");if(bb)bb.focus({preventScroll:true})}}
  tb.onclick=function(){go(ps.D<1?1:ps.D)};
  var m=openModal(box,{variant:"sheet",label:"schT"});go(focus||(ps.D<1?1:ps.D>ps.N?ps.N:ps.D));return m}
