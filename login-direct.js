/* Direct login + safe UI patch. Does not depend on google.script.run for login. */
(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';

  function setLogos(){
    const logos={logoLKPP:'./logo-lkpp.png',logoLabusel:'./logo-labusel.png',logoUKPBJ:'./logo-ukpbj.png',dashboardLogo:'./logo-ukpbj.png'};
    Object.keys(logos).forEach(function(id){const el=document.getElementById(id);if(el) el.src=logos[id];});
  }

  function resetLoginButton(){
    const button=document.getElementById('btnLogin');
    if(button){button.classList.remove('loading');button.disabled=false;button.textContent='MASUK';}
    const message=document.getElementById('loginMessage');
    if(message){message.className='message';message.textContent='';}
  }

  function loginDirect(){
    const username=(document.getElementById('loginUsername')?.value||'').trim();
    const password=(document.getElementById('loginPassword')?.value||'').trim();
    const message=document.getElementById('loginMessage');
    const button=document.getElementById('btnLogin');
    if(!username||!password){if(typeof tampilkanPesan==='function') tampilkanPesan(message,'Username dan password wajib diisi.','error');return false;}
    if(button){button.classList.add('loading');button.textContent='MEMPROSES...';button.disabled=true;}
    const controller=new AbortController();
    const timer=setTimeout(function(){controller.abort();},15000);
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({function:'login',args:[username,password]}),cache:'no-store',signal:controller.signal})
    .then(function(r){return r.text().then(function(text){let data;try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons server tidak valid.');}if(!r.ok) throw new Error(data?.message||'Request login gagal.');return data;});})
    .then(function(result){
      clearTimeout(timer);
      if(!result||!result.success){if(button){button.classList.remove('loading');button.textContent='MASUK';button.disabled=false;}if(typeof tampilkanPesan==='function') tampilkanPesan(message,result?.message||'Login gagal.','error');return;}
      currentUser=result.user;
      try{sessionStorage.setItem('monitoringUser',JSON.stringify(result.user));}catch(e){}
      if(typeof tutupModal==='function') tutupModal('modalLogin');
      if(typeof bukaDashboard==='function') bukaDashboard();
    })
    .catch(function(err){clearTimeout(timer);if(button){button.classList.remove('loading');button.textContent='MASUK';button.disabled=false;}const msg=err?.name==='AbortError'?'Koneksi ke server timeout.':(err?.message||'Terjadi kesalahan saat login.');if(typeof tampilkanPesan==='function') tampilkanPesan(message,msg,'error');});
    return false;
  }

  function patchPackageField(){
    const old=document.getElementById('laporanNamaPaket');
    if(!old || old.tagName==='TEXTAREA') return;
    const area=document.createElement('textarea');
    Array.from(old.attributes).forEach(function(attr){if(attr.name!=='type') area.setAttribute(attr.name,attr.value);});
    area.value=old.value||'';area.readOnly=true;area.rows=3;area.className=(old.className||'')+' laporan-nama-paket-wrap';area.style.minHeight='82px';area.style.resize='vertical';area.style.whiteSpace='pre-wrap';area.style.overflow='hidden';old.replaceWith(area);
  }

  function installSafeCss(){
    if(document.getElementById('safeUiPatchStyle')) return;
    const style=document.createElement('style');style.id='safeUiPatchStyle';
    style.textContent=`
      #dashboardView .pimpinan-action-btn,#dashboardView .pimpinan-monitoring-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;max-width:calc(100% - 8px)!important;margin-left:4px!important;margin-right:4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}
      #dashboardView .pimpinan-table th:last-child,#dashboardView .pimpinan-table td:last-child{padding-left:8px!important;padding-right:8px!important;width:12%!important;}
      #dashboardView .pimpinan-table th:nth-child(2),#dashboardView .pimpinan-table td:nth-child(2){width:31%!important;}
      #dashboardView #laporanNamaPaket{width:100%!important;max-width:100%!important;min-height:82px!important;line-height:1.45!important;white-space:pre-wrap!important;overflow:hidden!important;overflow-wrap:anywhere!important;word-break:normal!important;}
      #dashboardView #pimpinanBody tr.pimpinan-loading-row{display:none!important;}
      .notification-button{position:relative!important;z-index:10001!important;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important;}
      .notification-button.notification-attention{box-shadow:0 0 0 3px rgba(191,145,55,.14)!important;}
      .safe-notification-modal{position:fixed;inset:0;z-index:100001;display:flex;align-items:flex-start;justify-content:center;padding:92px 14px 20px;background:rgba(15,23,42,.38);}
      .safe-notification-card{width:min(520px,100%);max-height:76vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 25px 70px rgba(15,23,42,.30);padding:16px;}
      .safe-notification-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;}
      .safe-notification-head h3{margin:0;color:#12304a;font-size:19px;font-weight:900;}
      .safe-notification-close{width:34px;height:34px;border-radius:9px;background:#edf2f5;color:#17384d;font-size:18px;}
      .safe-notification-item{width:100%;margin:0 0 9px;padding:13px;border:1px solid #dce6ec;border-radius:13px;background:#f9fbfc;text-align:left;cursor:pointer;}
      .safe-notification-item:last-child{margin-bottom:0;}
      .safe-notification-item strong{display:block;color:#17384d;font-size:14px;line-height:1.35;}
      .safe-notification-item small{display:block;margin-top:4px;color:#6b7c89;font-size:11px;line-height:1.35;font-weight:700;}
      .safe-notification-go{display:inline-flex;margin-top:9px;padding:8px 11px;border-radius:8px;background:#173f5c;color:#fff;font-size:10px;font-weight:900;}
      .safe-notification-empty{padding:18px 8px;text-align:center;color:#71818d;font-size:13px;font-weight:800;}
      .verify-card.safe-notification-target{animation:safeNotificationPulse 1.4s ease-out;}
      @keyframes safeNotificationPulse{0%{box-shadow:0 0 0 0 rgba(191,145,55,.55);}100%{box-shadow:0 0 0 13px rgba(191,145,55,0);}}
      .safe-logout-modal{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(15,23,42,.62);}
      .safe-logout-card{width:min(390px,100%);padding:26px 22px 22px;border-radius:20px;background:#fff;box-shadow:0 25px 70px rgba(15,23,42,.28);text-align:center;}
      .safe-logout-icon{width:52px;height:52px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#eaf7f0;color:#17734a;font-size:25px;font-weight:900;}
      .safe-logout-title{margin:0;color:#12304a;font-size:21px;font-weight:900;}
      .safe-logout-text{margin:7px 0 18px;color:#647789;font-size:13px;font-weight:700;}
      .safe-logout-button{width:100%;padding:12px 16px;border:0;border-radius:10px;background:linear-gradient(135deg,#0a2337,#174d70);color:#fff;font-weight:900;cursor:pointer;}
      .safe-success-modal{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(15,23,42,.42);animation:safeSuccessFadeIn .18s ease-out;}
      .safe-success-card{width:min(430px,92vw);padding:28px 24px 24px;border-radius:20px;background:#fff;box-shadow:0 25px 70px rgba(15,23,42,.30);text-align:center;}
      .safe-success-icon{width:62px;height:62px;margin:0 auto 13px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#eaf7f0;color:#087443;font-size:31px;font-weight:900;}
      .safe-success-title{margin:0;color:#12304a;font-size:22px;line-height:1.2;font-weight:900;}
      .safe-success-text{margin:8px 0 0;color:#526071;font-size:14px;line-height:1.5;font-weight:700;}
      @keyframes safeSuccessFadeIn{from{opacity:0}to{opacity:1}}
    `;
    document.head.appendChild(style);
  }

  function removePimpinanLoadingRow(){
    const body=document.getElementById('pimpinanBody');
    if(!body || body.__loadingObserverInstalled) return;
    const remove=function(){body.querySelectorAll('tr').forEach(function(tr){const text=String(tr.textContent||'').trim();if(/^Memuat data proyek\.\.\.$/i.test(text)){tr.classList.add('pimpinan-loading-row');tr.remove();}});};
    body.__loadingObserverInstalled=true;remove();
    const observer=new MutationObserver(function(){remove();});observer.observe(body,{childList:true,subtree:true});
  }

  /*
   * NOTIFIKASI AKTIF:
   * Tombol NOTIFIKASI tidak lagi hanya scroll ke section yang tersembunyi.
   * Sekarang membuka daftar notifikasi yang benar-benar ada, lalu setiap
   * item dapat ditekan untuk langsung menuju laporan yang harus dieksekusi.
   */
  function installNotificationCenter(){
    const button=document.getElementById('notificationButton');
    if(!button || button.__notificationCenterInstalled) return;
    button.__notificationCenterInstalled=true;
    button.removeAttribute('onclick');

    const closeModal=function(){const m=document.getElementById('safeNotificationModal');if(m)m.remove();};

    const goToCard=function(card){
      if(!card) return;
      const section=document.getElementById('verifikasiSection');
      if(section){section.style.display='block';section.classList.add('notification-open');}
      closeModal();
      setTimeout(function(){
        document.querySelectorAll('.verify-card.safe-notification-target').forEach(function(x){x.classList.remove('safe-notification-target');});
        card.classList.add('safe-notification-target');
        card.scrollIntoView({behavior:'smooth',block:'center'});
      },60);
    };

    button.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      const cards=Array.from(document.querySelectorAll('#verifikasiSection .verify-card'));
      if(!cards.length){
        const section=document.getElementById('verifikasiSection');
        if(section){section.style.display='block';section.scrollIntoView({behavior:'smooth',block:'start'});}
        return;
      }
      const modal=document.createElement('div');modal.id='safeNotificationModal';modal.className='safe-notification-modal';
      const box=document.createElement('div');box.className='safe-notification-card';
      const head=document.createElement('div');head.className='safe-notification-head';
      head.innerHTML='<h3>Notifikasi</h3><button type="button" class="safe-notification-close" aria-label="Tutup">×</button>';
      box.appendChild(head);
      head.querySelector('button').onclick=closeModal;
      cards.forEach(function(card,index){
        const item=document.createElement('button');item.type='button';item.className='safe-notification-item';
        const pkg=card.querySelector('.verify-package')?.textContent?.trim()||('Laporan #'+(index+1));
        const meta=card.querySelector('.verify-meta')?.textContent?.trim()||'Menunggu tindakan verifikasi';
        item.innerHTML='<strong></strong><small></small><span class="safe-notification-go">BUKA & EKSEKUSI</span>';
        item.querySelector('strong').textContent=pkg;
        item.querySelector('small').textContent=meta;
        item.onclick=function(){goToCard(card);};
        box.appendChild(item);
      });
      modal.appendChild(box);document.body.appendChild(modal);
      modal.addEventListener('click',function(e){if(e.target===modal) closeModal();});
    });
  }

  function showLogoutPopup(){
    let old=document.getElementById('safeLogoutModal');if(old) old.remove();
    const modal=document.createElement('div');modal.id='safeLogoutModal';modal.className='safe-logout-modal';
    modal.innerHTML='<div class="safe-logout-card" role="dialog" aria-modal="true"><div class="safe-logout-icon">✓</div><h2 class="safe-logout-title">Berhasil Keluar</h2><p class="safe-logout-text">Sesi Anda sudah ditutup.</p><button type="button" class="safe-logout-button">LOGIN KEMBALI</button></div>';
    document.body.appendChild(modal);modal.querySelector('button').onclick=function(){modal.remove();if(typeof bukaLogin==='function') bukaLogin();};
  }

  function showSuccessPopup(text){
    const message=String(text||'Data berhasil disimpan.').trim();let old=document.getElementById('safeSuccessModal');if(old) old.remove();
    const modal=document.createElement('div');modal.id='safeSuccessModal';modal.className='safe-success-modal';
    modal.innerHTML='<div class="safe-success-card" role="status" aria-live="polite"><div class="safe-success-icon">✓</div><h2 class="safe-success-title">Berhasil Disimpan</h2><p class="safe-success-text"></p></div>';
    modal.querySelector('.safe-success-text').textContent=message;document.body.appendChild(modal);setTimeout(function(){if(modal.parentNode) modal.remove();},3500);
  }

  function watchSuccessMessages(){
    const showIfSuccess=function(el){
      if(!el||el.nodeType!==1||el.id==='safeSuccessModal'||el.closest('#safeSuccessModal')) return;
      const text=String(el.textContent||'').trim();if(!text)return;
      const isSuccess=el.classList.contains('success')||/berhasil|sukses|disimpan|tersimpan/i.test(text);
      if(isSuccess&&!el.dataset.safeSuccessShown){el.dataset.safeSuccessShown='1';showSuccessPopup(text);}
    };
    document.querySelectorAll('.message.success').forEach(showIfSuccess);
    const observer=new MutationObserver(function(mutations){mutations.forEach(function(mutation){if(mutation.type==='childList'){mutation.addedNodes.forEach(function(node){if(node.nodeType!==1)return;showIfSuccess(node);node.querySelectorAll?.('.message.success,.message').forEach(showIfSuccess);});}if(mutation.type==='characterData'&&mutation.target.parentElement)showIfSuccess(mutation.target.parentElement);if(mutation.type==='attributes'&&mutation.target)showIfSuccess(mutation.target);});});
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
  }

  function safeLogout(){
    try{sessionStorage.removeItem('monitoringUser');}catch(e){}try{localStorage.removeItem('monitoringUser');}catch(e){}
    resetLoginButton();if(typeof tutupSemuaModal==='function')tutupSemuaModal();document.querySelectorAll('.modal.show').forEach(function(m){m.classList.remove('show');});
    const dashboard=document.getElementById('dashboardView');const home=document.getElementById('homeView');if(dashboard)dashboard.classList.remove('active');if(home)home.classList.add('active');
    currentUser=null;window.isKabag=false;const username=document.getElementById('loginUsername');const password=document.getElementById('loginPassword');if(username)username.value='';if(password)password.value='';window.scrollTo(0,0);showLogoutPopup();
  }

  function patchKabagLoader(){
    if(typeof window.loadDashboardData!=='function'||window.__safeKabagPatch)return;
    const original=window.loadDashboardData;window.loadDashboardData=function(){const role=String((typeof currentUser!=='undefined'&&currentUser&&currentUser.role)||'').toUpperCase();window.isKabag=(role==='KABAG'||role==='KABAG UKPBJ'||role==='KABAG BPBJ');return original.apply(this,arguments);};window.__safeKabagPatch=true;
  }

  function init(){
    setLogos();installSafeCss();patchPackageField();removePimpinanLoadingRow();installNotificationCenter();watchSuccessMessages();
    const button=document.getElementById('btnLogin');if(button){button.onclick=function(e){if(e)e.preventDefault();return loginDirect();};}
    document.querySelectorAll('.btn-logout').forEach(function(btn){btn.onclick=function(e){if(e)e.preventDefault();safeLogout();};});
    patchKabagLoader();setTimeout(patchKabagLoader,100);setTimeout(patchKabagLoader,500);
    setTimeout(installNotificationCenter,500);setTimeout(installNotificationCenter,1500);setTimeout(installNotificationCenter,3000);
  }

  window.prosesLoginDirect=loginDirect;window.safeLogout=safeLogout;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
