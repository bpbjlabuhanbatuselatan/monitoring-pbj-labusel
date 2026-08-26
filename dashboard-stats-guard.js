(function(){
  'use strict';
  const ENDPOINT='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/dashboard-fast';
  const KEY='monitoring_dashboard_cache_v1';
  const IDS=['statProyek','statLaporan','pimpinanTotalProyek','pimpinanTotalNilai','pimpinanBerjalan','pimpinanSelesai','pimpinanRataRata'];
  let latest=null;

  function set(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}
  function paint(d){
    if(!d||d.success===false)return;
    latest=d;
    const proyek=Number(d.totalProyek); const laporan=Number(d.totalLaporan);
    set('statProyek',Number.isFinite(proyek)?proyek:'—');
    set('statLaporan',Number.isFinite(laporan)?laporan:'—');
    set('pimpinanTotalProyek',Number.isFinite(proyek)?proyek:'—');
    set('pimpinanTotalNilai',d.totalNilaiDisplay||'—');
    set('pimpinanBerjalan',Number.isFinite(Number(d.proyekBerjalan))?Number(d.proyekBerjalan):'—');
    set('pimpinanSelesai',Number.isFinite(Number(d.proyekSelesai))?Number(d.proyekSelesai):'—');
    set('pimpinanRataRata',Number.isFinite(Number(d.rataRataProgres))?Number(d.rataRataProgres)+'%':'—');
    try{localStorage.setItem(KEY,JSON.stringify({savedAt:Date.now(),data:d}));}catch(e){}
  }
  function cached(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.data&&x.data.success!==false?x.data:null;}catch(e){return null;}}
  function hideWrongZero(){IDS.forEach(function(id){const e=document.getElementById(id);if(e&&/^(0|Rp 0|0%)$/.test(e.textContent.trim()))e.textContent='—';});}
  async function fetchFresh(){
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({function:'getPimpinanDashboardData',args:[]}),cache:'no-store'});
      const d=await r.json();
      if(r.ok)paint(d);
    }catch(e){}
  }
  function start(){
    const c=cached();
    if(c)paint(c); else hideWrongZero();
    fetchFresh();
    const observer=new MutationObserver(function(){
      if(!latest){hideWrongZero();return;}
      paint(latest);
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
