/* MOBILE ONLY — compact tables and a single-block PPK menu. Desktop untouched. */
(function(){
  function isMobile(){ return window.matchMedia('(max-width:760px)').matches; }
  function norm(s){ return (s||'').replace(/\s+/g,' ').trim().toLowerCase(); }

  function compactTables(){
    document.querySelectorAll('.table-card table, .admin-table, .pimpinan-table').forEach(function(table){
      var head=table.querySelector('thead tr') || table.querySelector('tr');
      if(!head) return;
      var cells=head.children, keep=[];
      for(var i=0;i<cells.length;i++){
        var label=norm(cells[i].textContent);
        keep[i]=/kode\s*rup|nama\s*paket|progress|progres|minggu|aksi/.test(label);
      }
      if(!keep.some(Boolean)) return;
      Array.prototype.forEach.call(table.rows,function(row){
        Array.prototype.forEach.call(row.cells,function(cell,i){
          cell.style.display=keep[i] ? '' : 'none';
        });
      });
    });
  }

  function clickableAncestor(el){
    var cur=el;
    for(var i=0;cur && i<6;i++,cur=cur.parentElement){
      if(cur.tagName==='BUTTON'||cur.tagName==='A'||cur.getAttribute('role')==='button'||cur.hasAttribute('onclick')) return cur;
    }
    return el;
  }

  function compactMenu(){
    var labels=['dashboard','input laporan','verifikasi & notifikasi','laporan mingguan'], items=[];
    labels.forEach(function(label){
      var found=null;
      Array.prototype.some.call(document.querySelectorAll('button,a,[role="button"],div,span'),function(el){
        var t=norm(el.textContent);
        if(!t || t.length>70) return false;
        if(t===label || t.indexOf(label)!==-1){ found=clickableAncestor(el); return true; }
        return false;
      });
      if(found && items.indexOf(found)<0) items.push(found);
    });
    if(items.length<3) return;

    var parent=items[0].parentElement;
    if(!items.every(function(x){return x.parentElement===parent;})){
      var chain=[]; for(var n=items[0];n;n=n.parentElement) chain.push(n);
      for(var j=1;j<items.length;j++){
        var set=new Set(); for(var m=items[j];m;m=m.parentElement) set.add(m);
        chain=chain.filter(function(x){return set.has(x);});
      }
      parent=chain[0];
    }
    if(!parent || parent===document.body) return;

    parent.style.setProperty('display','grid','important');
    parent.style.setProperty('grid-template-columns','repeat(2,minmax(0,1fr))','important');
    parent.style.setProperty('gap','8px','important');
    parent.style.setProperty('width','100%','important');
    parent.style.setProperty('overflow','visible','important');
    parent.style.setProperty('transform','none','important');
    parent.style.setProperty('white-space','normal','important');

    items.forEach(function(item){
      item.style.setProperty('width','100%','important');
      item.style.setProperty('min-width','0','important');
      item.style.setProperty('max-width','none','important');
      item.style.setProperty('transform','none','important');
      item.style.setProperty('margin','0','important');
      item.style.setProperty('font-size','14px','important');
      item.style.setProperty('line-height','1.2','important');
      item.style.setProperty('white-space','normal','important');
    });

    Array.prototype.forEach.call(parent.children,function(child){
      if(items.indexOf(child)>=0) return;
      var t=norm(child.textContent);
      var cls=norm(child.className&&typeof child.className==='string'?child.className:'');
      var aria=norm(child.getAttribute&&child.getAttribute('aria-label'));
      if(/next|prev|previous|arrow|carousel|slider|pagination|indicator|dots/.test(cls+' '+aria) || (t==='' && child.offsetHeight<30)){
        child.style.setProperty('display','none','important');
      }
    });
  }

  function normalMobileFonts(){
    document.querySelectorAll('.brand-title,.brand-role,.notification-button,.btn-logout,.welcome p,.stat-label,.report-title,.table-title,.field label,.field input,.field select,.field textarea,.save-btn,.week-info,.photo-note,.photo-count,.verify-meta,.verify-note,.admin-subtitle,.pimpinan-subtitle').forEach(function(el){
      el.style.fontSize='12px';
    });
    document.querySelectorAll('.stat-value,.welcome h1').forEach(function(el){ el.style.fontSize=el.classList.contains('stat-value')?'20px':'22px'; });
  }

  function run(){
    if(!isMobile()) return;
    compactTables();
    compactMenu();
    normalMobileFonts();
  }
  document.addEventListener('DOMContentLoaded',function(){
    run(); setTimeout(run,300); setTimeout(run,800); setTimeout(run,1500); setTimeout(run,2500);
  });
  window.addEventListener('resize',run);
})();
