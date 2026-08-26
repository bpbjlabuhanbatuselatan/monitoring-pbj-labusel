/* MOBILE ONLY — compact tables. Desktop is untouched. */
(function(){
  function isMobile(){ return window.matchMedia('(max-width:760px)').matches; }

  /*
   * Jangan lagi menyembunyikan kolom tabel secara JavaScript.
   * Untuk mobile, setiap tabel diatur oleh CSS supaya tidak merusak
   * data ketika tbody diisi setelah AJAX/GAS selesai.
   */
  function compactTables(){
    /* Intentionally empty. CSS below handles the mobile layout. */
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

  /* ==========================================================
     LAPORAN MINGGUAN — MOBILE CARD
     Hanya #laporanTableSection yang diubah. Desktop tetap tabel.
     ========================================================== */
  #dashboardView #laporanTableSection{
    width:100%!important;
    max-width:100%!important;
    min-width:0!important;
    padding:14px!important;
    margin:0 0 12px!important;
    border-radius:16px!important;
    overflow:hidden!important;
  }
  #dashboardView #laporanTableSection .table-wrap{
    width:100%!important;
    max-width:100%!important;
    overflow:visible!important;
  }
  #dashboardView #laporanTableSection table{
    display:block!important;
    width:100%!important;
    min-width:0!important;
    max-width:100%!important;
    table-layout:auto!important;
    border-collapse:separate!important;
    border-spacing:0!important;
  }
  #dashboardView #laporanTableSection thead{display:none!important;}
  #dashboardView #laporanTableSection tbody{
    display:grid!important;
    width:100%!important;
    gap:10px!important;
    margin:0!important;
    padding:0!important;
  }
  #dashboardView #laporanTableSection tbody tr{
    display:grid!important;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    grid-auto-rows:auto!important;
    gap:0!important;
    width:100%!important;
    min-width:0!important;
    margin:0!important;
    padding:11px!important;
    background:#fff!important;
    border:1px solid #dce6ec!important;
    border-radius:13px!important;
    box-shadow:0 3px 11px rgba(15,23,42,.055)!important;
    overflow:hidden!important;
  }
  #dashboardView #laporanTableSection tbody td{
    display:block!important;
    width:auto!important;
    min-width:0!important;
    max-width:100%!important;
    height:auto!important;
    margin:0!important;
    padding:5px 5px!important;
    border:0!important;
    background:transparent!important;
    color:#526575!important;
    font-family:Arial,Helvetica,sans-serif!important;
    font-size:11px!important;
    font-weight:700!important;
    line-height:1.32!important;
    white-space:normal!important;
    overflow:visible!important;
    overflow-wrap:anywhere!important;
    word-break:normal!important;
    vertical-align:top!important;
  }
  #dashboardView #laporanTableSection tbody td::before{
    display:block!important;
    margin:0 0 3px!important;
    color:#8193a0!important;
    font-size:8px!important;
    line-height:1.15!important;
    font-weight:900!important;
    letter-spacing:.35px!important;
    text-transform:uppercase!important;
  }
  #dashboardView #laporanTableSection tbody td:nth-child(1)::before{content:'ID Laporan';}
  #dashboardView #laporanTableSection tbody td:nth-child(2)::before{content:'Tanggal';}
  #dashboardView #laporanTableSection tbody td:nth-child(3)::before{content:'Kode RUP';}
  #dashboardView #laporanTableSection tbody td:nth-child(4)::before{content:'Nama Paket';}
  #dashboardView #laporanTableSection tbody td:nth-child(5)::before{content:'Nama Penyedia';}
  #dashboardView #laporanTableSection tbody td:nth-child(6)::before{content:'Lokasi';}
  #dashboardView #laporanTableSection tbody td:nth-child(7)::before{content:'Minggu';}
  #dashboardView #laporanTableSection tbody td:nth-child(8)::before{content:'Progress';}
  #dashboardView #laporanTableSection tbody td:nth-child(9)::before{content:'Dibuat Oleh';}
  #dashboardView #laporanTableSection tbody td:nth-child(10)::before{content:'Status';}
  #dashboardView #laporanTableSection tbody td:nth-child(11)::before{content:'Keterangan';}

  /* Row layout: compact and symmetric. */
  #dashboardView #laporanTableSection tbody td:nth-child(1){grid-column:1!important;grid-row:1!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(2){grid-column:2!important;grid-row:1!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(3){grid-column:1!important;grid-row:2!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(7){grid-column:2!important;grid-row:2!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(4){grid-column:1 / -1!important;grid-row:3!important;padding-top:7px!important;padding-bottom:8px!important;color:#17384d!important;font-size:14px!important;font-weight:900!important;line-height:1.3!important;overflow-wrap:break-word!important;word-break:normal!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(5){grid-column:1!important;grid-row:4!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(6){grid-column:2!important;grid-row:4!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(8){grid-column:1!important;grid-row:5!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(10){grid-column:2!important;grid-row:5!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(9){grid-column:1!important;grid-row:6!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(11){grid-column:2!important;grid-row:6!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(8) *{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:38px!important;padding:4px 8px!important;border-radius:8px!important;background:#d7ecff!important;color:#111827!important;font-size:10px!important;font-weight:900!important;line-height:1.1!important;white-space:nowrap!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(10) *{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:auto!important;max-width:100%!important;padding:4px 8px!important;border-radius:8px!important;background:#eef2f6!important;color:#344054!important;font-size:9px!important;font-weight:900!important;line-height:1.15!important;white-space:normal!important;text-align:center!important;}
  #dashboardView #laporanTableSection tbody td:nth-child(11){color:#667085!important;font-size:10px!important;}

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
