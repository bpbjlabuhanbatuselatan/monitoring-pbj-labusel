/* MOBILE ONLY — compact tables + safe RUP search fallback. Desktop is untouched. */
(function(){
  function isMobile(){ return window.matchMedia('(max-width:760px)').matches; }

  function compactTables(){
    document.querySelectorAll('.table-card table, .admin-table, .pimpinan-table').forEach(function(table){
      var head=table.querySelector('thead tr') || table.querySelector('tr');
      if(!head) return;
      var cells=head.children;
      if(!cells || !cells.length) return;

      var keep=[];
      for(var i=0;i<cells.length;i++){
        var label=(cells[i].textContent||'').trim().toLowerCase().replace(/\s+/g,' ');
        var wanted=/kode\s*rup|nama\s*paket|progress|progres|minggu|aksi/.test(label);
        keep[i]=wanted;
      }

      if(!keep.some(Boolean)) return;

      Array.prototype.forEach.call(table.rows,function(row){
        Array.prototype.forEach.call(row.cells,function(cell,i){
          cell.style.display=keep[i] ? '' : 'none';
        });
      });
    });
  }

  function injectMobileFixes(){
    if(document.getElementById('mobileLayoutSafetyFix')) return;

    var style=document.createElement('style');
    style.id='mobileLayoutSafetyFix';
    style.textContent=`
@media (max-width:760px){
  html,body,#dashboardView,#dashboardView .dashboard,#dashboardView .dashboard-inner{
    width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;
  }

  /* Semua role: menu tetap sebagai grid dalam satu blok, tanpa carousel/geser samping. */
  #roleSidebar.role-sidebar{
    display:block!important;position:relative!important;top:auto!important;min-height:0!important;
    width:100%!important;margin:0 0 10px!important;padding:10px!important;overflow:visible!important;
  }
  #roleSidebarNav.role-sidebar-nav{
    display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:7px!important;width:100%!important;max-width:100%!important;overflow:visible!important;
  }
  #roleSidebarNav .role-nav-item{
    width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;
    padding:9px 8px!important;font-size:11px!important;line-height:1.2!important;
    white-space:normal!important;overflow:hidden!important;
  }
  #roleSidebarNav .role-nav-icon{
    width:28px!important;height:28px!important;min-width:28px!important;
    font-size:14px!important;border-radius:8px!important;
  }

  /* Semua panel menempel pas ke lebar layar HP. */
  #dashboardView .pimpinan-list,#dashboardView .admin-list,#dashboardView .report-card,#dashboardView .table-card,
  #dashboardView .pimpinan-hero,#dashboardView .admin-hero{
    width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;
  }

  /* Monitoring proyek: hanya 5 kolom berguna di HP dan semuanya muat. */
  #dashboardView .pimpinan-table-wrap{width:100%!important;max-width:100%!important;overflow:hidden!important;}
  #dashboardView .pimpinan-table{
    width:100%!important;min-width:0!important;max-width:100%!important;
    table-layout:fixed!important;border-collapse:collapse!important;
  }
  #dashboardView .pimpinan-table th,#dashboardView .pimpinan-table td{
    box-sizing:border-box!important;overflow:hidden!important;overflow-wrap:anywhere!important;
    word-break:normal!important;white-space:normal!important;
  }
  #dashboardView .pimpinan-table th:nth-child(1),#dashboardView .pimpinan-table td:nth-child(1){width:15%!important;}
  #dashboardView .pimpinan-table th:nth-child(2),#dashboardView .pimpinan-table td:nth-child(2){width:53%!important;}
  #dashboardView .pimpinan-table th:nth-child(4),#dashboardView .pimpinan-table td:nth-child(4){width:10%!important;}
  #dashboardView .pimpinan-table th:nth-child(5),#dashboardView .pimpinan-table td:nth-child(5){width:8%!important;}
  #dashboardView .pimpinan-table th:nth-child(8),#dashboardView .pimpinan-table td:nth-child(8){width:14%!important;}
  #dashboardView .pimpinan-table .pimpinan-action-btn{
    display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;
    padding:4px 2px!important;font-size:7px!important;line-height:1.1!important;
    white-space:normal!important;overflow-wrap:anywhere!important;text-align:center!important;
  }

  /* Search RUP: dropdown selalu berada di dalam card dan bisa discroll. */
  #dashboardView .rup-input-wrap{position:relative!important;z-index:30!important;}
  #dashboardView .rup-suggestions{
    position:absolute!important;left:0!important;right:0!important;top:calc(100% + 4px)!important;
    width:100%!important;max-width:100%!important;max-height:52vh!important;overflow-y:auto!important;overflow-x:hidden!important;
    z-index:9999!important;box-sizing:border-box!important;
  }
  #dashboardView .rup-option{width:100%!important;max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;}

  /* Dropdown monitoring juga tidak boleh melebar keluar layar. */
  #dashboardView .pimpinan-suggestions{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
}
`;
    document.head.appendChild(style);
  }

  function ensureMasterProyekForRup(){
    if(typeof window.cariRUP !== 'function') return;

    var loading=false;
    var loaded=false;
    var originalCariRUP=window.cariRUP;

    window.cariRUP=function(){
      var data=(typeof window.masterProyek !== 'undefined' && Array.isArray(window.masterProyek))
        ? window.masterProyek : null;

      if(data && data.length){
        loaded=true;
        return originalCariRUP.apply(this,arguments);
      }

      if(loaded){
        return originalCariRUP.apply(this,arguments);
      }

      if(loading){ return; }
      loading=true;

      var box=document.getElementById('rupSuggestions');
      if(box){
        box.innerHTML='<div class="rup-empty">Memuat daftar Kode RUP...</div>';
        box.classList.add('show');
      }

      if(typeof google==='undefined' || !google.script || !google.script.run){
        loading=false;
        return originalCariRUP.apply(this,arguments);
      }

      google.script.run
        .withSuccessHandler(function(list){
          loading=false;
          loaded=true;
          if(typeof window.masterProyek !== 'undefined'){
            window.masterProyek=Array.isArray(list)?list:[];
          }
          originalCariRUP.call(window);
        })
        .withFailureHandler(function(err){
          loading=false;
          if(box){
            box.innerHTML='<div class="rup-empty">Gagal memuat Kode RUP. Silakan coba lagi.</div>';
            box.classList.add('show');
          }
          console.error('Mobile RUP search gagal:',err);
        })
        .getMasterProyek();
    };
  }

  function run(){
    injectMobileFixes();
    if(isMobile()) compactTables();
  }

  document.addEventListener('DOMContentLoaded',function(){
    run();
    ensureMasterProyekForRup();
    setTimeout(run,300);
    setTimeout(run,1000);
    setTimeout(run,2500);
  });

  window.addEventListener('resize',run);
})();
