/* MOBILE ONLY — compact tables. Desktop is untouched. */
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
        var wanted=/kode\s*rup|nama\s*paket|progress|progres|minggu/.test(label);
        keep[i]=wanted;
      }
      if(!keep.some(Boolean)) return;
      Array.prototype.forEach.call(table.rows,function(row){
        Array.prototype.forEach.call(row.cells,function(cell,i){ cell.style.display=keep[i] ? '' : 'none'; });
      });
    });
  }

  function injectMobileFixes(){
    if(document.getElementById('mobileLayoutSafetyFix')) return;
    var style=document.createElement('style');
    style.id='mobileLayoutSafetyFix';
    style.textContent=`
@media (max-width:760px){
  html,body,#dashboardView,#dashboardView .dashboard,#dashboardView .dashboard-inner{width:100%!important;max-width:100%!important;min-width:0!important;overflow-x:hidden!important;}
  #roleSidebar.role-sidebar{display:block!important;position:relative!important;top:auto!important;min-height:0!important;width:100%!important;margin:0 0 10px!important;padding:10px!important;overflow:visible!important;}
  #roleSidebarNav.role-sidebar-nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;width:100%!important;max-width:100%!important;overflow:visible!important;}
  #roleSidebarNav .role-nav-item{width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:9px 8px!important;font-size:11px!important;line-height:1.2!important;white-space:normal!important;overflow:hidden!important;}
  #roleSidebarNav .role-nav-icon{width:28px!important;height:28px!important;min-width:28px!important;font-size:14px!important;border-radius:8px!important;}
  #dashboardView .pimpinan-list,#dashboardView .admin-list,#dashboardView .report-card,#dashboardView .table-card,#dashboardView .pimpinan-hero,#dashboardView .admin-hero{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;}

  /* MONITORING PROYEK MOBILE ONLY. */
  #dashboardView .pimpinan-table-wrap{width:100%!important;max-width:100%!important;overflow:visible!important;}
  #dashboardView .pimpinan-table{display:block!important;width:100%!important;min-width:0!important;max-width:100%!important;table-layout:fixed!important;border:0!important;border-collapse:separate!important;border-spacing:0!important;}
  #dashboardView .pimpinan-table thead{display:none!important;}
  #dashboardView .pimpinan-table tbody{display:grid!important;gap:8px!important;width:100%!important;margin:0!important;padding:0!important;}
  #dashboardView .pimpinan-table tbody tr{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto auto auto auto!important;width:100%!important;min-width:0!important;max-width:100%!important;margin:0!important;padding:10px!important;background:#fff!important;border:1px solid #d9e3e9!important;border-radius:12px!important;box-shadow:0 2px 8px rgba(15,23,42,.05)!important;overflow:hidden!important;}
  #dashboardView .pimpinan-table tbody tr td,#dashboardView .pimpinan-table tbody tr td *{box-sizing:border-box!important;}
  #dashboardView .pimpinan-table tbody td{display:block!important;position:static!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:3px 4px!important;border:0!important;background:transparent!important;color:#526575!important;font-family:Arial,Helvetica,sans-serif!important;font-size:11px!important;font-weight:700!important;line-height:1.28!important;white-space:normal!important;overflow:visible!important;overflow-wrap:anywhere!important;word-break:normal!important;vertical-align:top!important;}
  #dashboardView .pimpinan-table tbody td::before{display:block!important;width:100%!important;margin:0 0 2px!important;color:#8193a0!important;font-size:8px!important;line-height:1.1!important;font-weight:900!important;letter-spacing:.3px!important;text-transform:uppercase!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(1)::before{content:'Kode RUP';}
  #dashboardView .pimpinan-table tbody td:nth-child(2)::before{content:'Nama Paket';}
  #dashboardView .pimpinan-table tbody td:nth-child(3)::before{content:'Total Nilai';}
  #dashboardView .pimpinan-table tbody td:nth-child(4)::before{content:'Progress';}
  #dashboardView .pimpinan-table tbody td:nth-child(5)::before{content:'Minggu';}
  #dashboardView .pimpinan-table tbody td:nth-child(6)::before{content:'Status';}
  #dashboardView .pimpinan-table tbody td:nth-child(7)::before{content:'Laporan Terakhir';}
  #dashboardView .pimpinan-table tbody td:nth-child(8)::before{content:none!important;display:none!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(1){grid-column:1!important;grid-row:1!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(8){grid-column:2!important;grid-row:1!important;text-align:right!important;width:auto!important;min-width:0!important;padding:0 0 2px 8px!important;align-self:start!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(2){grid-column:1 / -1!important;grid-row:2!important;width:100%!important;min-width:0!important;max-width:none!important;padding:4px 4px 7px!important;color:#17384d!important;font-size:14px!important;font-weight:900!important;line-height:1.3!important;white-space:normal!important;overflow:visible!important;overflow-wrap:break-word!important;word-break:normal!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(2) *{width:auto!important;max-width:100%!important;white-space:normal!important;overflow:visible!important;overflow-wrap:break-word!important;word-break:normal!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(3){grid-column:1!important;grid-row:3!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(4){grid-column:2!important;grid-row:3!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(5){grid-column:1!important;grid-row:4!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(6){grid-column:2!important;grid-row:4!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(7){grid-column:1 / -1!important;grid-row:5!important;padding-top:3px!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(1)>*,#dashboardView .pimpinan-table tbody td:nth-child(3)>*,#dashboardView .pimpinan-table tbody td:nth-child(5)>*,#dashboardView .pimpinan-table tbody td:nth-child(6)>*,#dashboardView .pimpinan-table tbody td:nth-child(7)>*{display:block!important;width:auto!important;max-width:100%!important;font-size:inherit!important;line-height:inherit!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:normal!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(4) .progress-pill,#dashboardView .pimpinan-table tbody td:nth-child(4) .progress-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:40px!important;min-height:23px!important;padding:3px 8px!important;border-radius:7px!important;background:#d7ecff!important;color:#111827!important;font-weight:900!important;}
  #dashboardView .pimpinan-table tbody td:nth-child(8) .pimpinan-action-btn,#dashboardView .pimpinan-table tbody td:nth-child(8) button{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:76px!important;max-width:105px!important;min-height:30px!important;margin:0!important;padding:6px 8px!important;border-radius:7px!important;background:#2f80b7!important;background-image:none!important;color:#111827!important;border:1px solid #246b98!important;box-shadow:none!important;font-size:10px!important;font-weight:900!important;line-height:1.1!important;white-space:normal!important;overflow:visible!important;text-align:center!important;}

  #dashboardView .rup-input-wrap{position:relative!important;z-index:30!important;}
  #dashboardView .rup-suggestions{position:absolute!important;left:0!important;right:0!important;top:calc(100% + 4px)!important;width:100%!important;max-width:100%!important;max-height:52vh!important;overflow-y:auto!important;overflow-x:hidden!important;z-index:9999!important;box-sizing:border-box!important;}
  #dashboardView .rup-option{width:100%!important;max-width:100%!important;white-space:normal!important;overflow-wrap:anywhere!important;}
  #dashboardView .pimpinan-suggestions{width:100%!important;max-width:100%!important;overflow-x:hidden!important;}
}
`;
    document.head.appendChild(style);
  }

  function run(){
    injectMobileFixes();
    if(isMobile()) compactTables();
  }

  document.addEventListener('DOMContentLoaded',function(){
    run();
    setTimeout(run,300);
    setTimeout(run,1000);
    setTimeout(run,2500);
  });

  window.addEventListener('resize',run);
})();
