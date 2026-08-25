/* MOBILE ONLY — reduce project/weekly tables to the useful columns. */
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
        /* Mobile project/weekly summary: only these fields. */
        var wanted=/kode\s*rup|nama\s*paket|progress|progres|minggu|aksi/.test(label);
        keep[i]=wanted;
      }

      /* If a table has no recognizable headers, leave it alone. */
      if(!keep.some(Boolean)) return;

      Array.prototype.forEach.call(table.rows,function(row){
        Array.prototype.forEach.call(row.cells,function(cell,i){
          cell.style.display=keep[i] ? '' : 'none';
        });
      });
    });
  }

  function run(){ if(isMobile()) compactTables(); }
  document.addEventListener('DOMContentLoaded',function(){
    run();
    setTimeout(run,300);
    setTimeout(run,1000);
    setTimeout(run,2500);
  });
  window.addEventListener('resize',run);
})();
