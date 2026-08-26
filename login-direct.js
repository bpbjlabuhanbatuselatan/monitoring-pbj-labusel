/* Direct login + safe UI patch. Does not depend on google.script.run for login. */
(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';

  function setLogos(){
    const logos={
      logoLKPP:'./logo-lkpp.png',
      logoLabusel:'./logo-labusel.png',
      logoUKPBJ:'./logo-ukpbj.png',
      dashboardLogo:'./logo-ukpbj.png'
    };
    Object.keys(logos).forEach(function(id){
      const el=document.getElementById(id);
      if(el) el.src=logos[id];
    });
  }

  function resetLoginButton(){
    const button=document.getElementById('btnLogin');
    if(button){
      button.classList.remove('loading');
      button.disabled=false;
      button.textContent='MASUK';
    }
    const message=document.getElementById('loginMessage');
    if(message){
      message.className='message';
      message.textContent='';
    }
  }

  function loginDirect(){
    const username=(document.getElementById('loginUsername')?.value||'').trim();
    const password=(document.getElementById('loginPassword')?.value||'').trim();
    const message=document.getElementById('loginMessage');
    const button=document.getElementById('btnLogin');

    if(!username||!password){
      if(typeof tampilkanPesan==='function') tampilkanPesan(message,'Username dan password wajib diisi.','error');
      return false;
    }

    if(button){button.classList.add('loading');button.textContent='MEMPROSES...';button.disabled=true;}

    const controller=new AbortController();
    const timer=setTimeout(function(){controller.abort();},15000);

    fetch(API,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({function:'login',args:[username,password]}),
      cache:'no-store',
      signal:controller.signal
    })
    .then(function(r){
      return r.text().then(function(text){
        let data;
        try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons server tidak valid.');}
        if(!r.ok) throw new Error(data?.message||'Request login gagal.');
        return data;
      });
    })
    .then(function(result){
      clearTimeout(timer);
      if(!result||!result.success){
        if(button){button.classList.remove('loading');button.textContent='MASUK';button.disabled=false;}
        if(typeof tampilkanPesan==='function') tampilkanPesan(message,result?.message||'Login gagal.','error');
        return;
      }

      currentUser=result.user;
      try{sessionStorage.setItem('monitoringUser',JSON.stringify(result.user));}catch(e){}
      if(typeof tutupModal==='function') tutupModal('modalLogin');
      if(typeof bukaDashboard==='function') bukaDashboard();
    })
    .catch(function(err){
      clearTimeout(timer);
      if(button){button.classList.remove('loading');button.textContent='MASUK';button.disabled=false;}
      const msg=err?.name==='AbortError'?'Koneksi ke server timeout.':(err?.message||'Terjadi kesalahan saat login.');
      if(typeof tampilkanPesan==='function') tampilkanPesan(message,msg,'error');
    });
    return false;
  }

  function patchPackageField(){
    const old=document.getElementById('laporanNamaPaket');
    if(!old || old.tagName==='TEXTAREA') return;

    const area=document.createElement('textarea');
    Array.from(old.attributes).forEach(function(attr){
      if(attr.name!=='type') area.setAttribute(attr.name,attr.value);
    });
    area.value=old.value||'';
    area.readOnly=true;
    area.rows=3;
    area.className=(old.className||'')+' laporan-nama-paket-wrap';
    area.style.minHeight='82px';
    area.style.resize='vertical';
    area.style.whiteSpace='pre-wrap';
    area.style.overflow='hidden';
    old.replaceWith(area);
  }

  function installSafeCss(){
    if(document.getElementById('safeUiPatchStyle')) return;
    const style=document.createElement('style');
    style.id='safeUiPatchStyle';
    style.textContent=`
      /* Safe final patch: spacing only, no layout rewrite. */
      #dashboardView .pimpinan-action-btn,
      #dashboardView .pimpinan-monitoring-btn{
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        box-sizing:border-box !important;
        max-width:calc(100% - 8px) !important;
        margin-left:4px !important;
        margin-right:4px !important;
        white-space:nowrap !important;
        overflow:hidden !important;
        text-overflow:ellipsis !important;
      }

      #dashboardView .pimpinan-table th:last-child,
      #dashboardView .pimpinan-table td:last-child{
        padding-left:8px !important;
        padding-right:8px !important;
        width:12% !important;
      }

      #dashboardView .pimpinan-table th:nth-child(2),
      #dashboardView .pimpinan-table td:nth-child(2){
        width:31% !important;
      }

      #dashboardView #laporanNamaPaket{
        width:100% !important;
        max-width:100% !important;
        min-height:82px !important;
        line-height:1.45 !important;
        white-space:pre-wrap !important;
        overflow:hidden !important;
        overflow-wrap:anywhere !important;
        word-break:normal !important;
      }

      .safe-logout-modal{
        position:fixed;
        inset:0;
        z-index:99999;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:18px;
        background:rgba(15,23,42,.62);
      }
      .safe-logout-card{
        width:min(390px,100%);
        padding:26px 22px 22px;
        border-radius:20px;
        background:#fff;
        box-shadow:0 25px 70px rgba(15,23,42,.28);
        text-align:center;
      }
      .safe-logout-icon{
        width:52px;
        height:52px;
        margin:0 auto 12px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:50%;
        background:#eaf7f0;
        color:#17734a;
        font-size:25px;
        font-weight:900;
      }
      .safe-logout-title{
        margin:0;
        color:#12304a;
        font-size:21px;
        font-weight:900;
      }
      .safe-logout-text{
        margin:7px 0 18px;
        color:#647789;
        font-size:13px;
        font-weight:700;
      }
      .safe-logout-button{
        width:100%;
        padding:12px 16px;
        border:0;
        border-radius:10px;
        background:linear-gradient(135deg,#0a2337,#174d70);
        color:#fff;
        font-weight:900;
        cursor:pointer;
      }
    `;
    document.head.appendChild(style);
  }

  function showLogoutPopup(){
    let old=document.getElementById('safeLogoutModal');
    if(old) old.remove();

    const modal=document.createElement('div');
    modal.id='safeLogoutModal';
    modal.className='safe-logout-modal';
    modal.innerHTML=''
      +'<div class="safe-logout-card" role="dialog" aria-modal="true">'
      +'<div class="safe-logout-icon">✓</div>'
      +'<h2 class="safe-logout-title">Berhasil Keluar</h2>'
      +'<p class="safe-logout-text">Sesi Anda sudah ditutup.</p>'
      +'<button type="button" class="safe-logout-button">LOGIN KEMBALI</button>'
      +'</div>';

    document.body.appendChild(modal);
    modal.querySelector('button').onclick=function(){
      modal.remove();
      if(typeof bukaLogin==='function') bukaLogin();
    };
  }

  function safeLogout(){
    try{sessionStorage.removeItem('monitoringUser');}catch(e){}
    try{localStorage.removeItem('monitoringUser');}catch(e){}

    resetLoginButton();

    if(typeof tutupSemuaModal==='function') tutupSemuaModal();
    document.querySelectorAll('.modal.show').forEach(function(m){m.classList.remove('show');});

    const dashboard=document.getElementById('dashboardView');
    const home=document.getElementById('homeView');
    if(dashboard) dashboard.classList.remove('active');
    if(home) home.classList.add('active');

    currentUser=null;
    window.isKabag=false;

    const username=document.getElementById('loginUsername');
    const password=document.getElementById('loginPassword');
    if(username) username.value='';
    if(password) password.value='';

    window.scrollTo(0,0);
    showLogoutPopup();
  }

  function patchKabagLoader(){
    if(typeof window.loadDashboardData!=='function' || window.__safeKabagPatch) return;
    const original=window.loadDashboardData;
    window.loadDashboardData=function(){
      const role=String(window.currentUser?.role||'').toUpperCase();
      window.isKabag=(role==='KABAG'||role==='KABAG UKPBJ'||role==='KABAG BPBJ');
      return original.apply(this,arguments);
    };
    window.__safeKabagPatch=true;
  }

  function init(){
    setLogos();
    installSafeCss();
    patchPackageField();

    const button=document.getElementById('btnLogin');
    if(button){
      button.onclick=function(e){
        if(e) e.preventDefault();
        return loginDirect();
      };
    }

    /* Replace the old logout handler without touching backend/data. */
    document.querySelectorAll('.btn-logout').forEach(function(btn){
      btn.onclick=function(e){
        if(e) e.preventDefault();
        safeLogout();
      };
    });

    patchKabagLoader();
    setTimeout(patchKabagLoader,100);
    setTimeout(patchKabagLoader,500);
  }

  window.prosesLoginDirect=loginDirect;
  window.safeLogout=safeLogout;

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
