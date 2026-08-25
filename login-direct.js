/* Direct login/logo runtime for GitHub Pages. */
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

  function loginDirect(){
    const username=(document.getElementById('loginUsername')?.value||'').trim();
    const password=(document.getElementById('loginPassword')?.value||'').trim();
    const message=document.getElementById('loginMessage');
    const button=document.getElementById('btnLogin');

    if(!username||!password){
      if(typeof tampilkanPesan==='function') tampilkanPesan(message,'Username dan password wajib diisi.','error');
      return;
    }

    if(button){button.classList.add('loading');button.textContent='MEMPROSES...';}

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
      if(button){button.classList.remove('loading');button.textContent='MASUK';}
      if(!result||!result.success){
        if(typeof tampilkanPesan==='function') tampilkanPesan(message,result?.message||'Login gagal.','error');
        return;
      }

      /* IMPORTANT: index.html declares `let currentUser`.
         Assign that lexical global, not window.currentUser. */
      currentUser=result.user;

      try{sessionStorage.setItem('monitoringUser',JSON.stringify(result.user));}catch(e){}
      if(typeof tutupModal==='function') tutupModal('modalLogin');
      if(typeof bukaDashboard==='function') bukaDashboard();
    })
    .catch(function(err){
      clearTimeout(timer);
      if(button){button.classList.remove('loading');button.textContent='MASUK';}
      const msg=err?.name==='AbortError'?'Koneksi ke server timeout.':(err?.message||'Terjadi kesalahan saat login.');
      if(typeof tampilkanPesan==='function') tampilkanPesan(message,msg,'error');
    });
  }

  /* Run immediately when possible; also run after DOM ready for cached/late loads. */
  function init(){
    setLogos();
    window.prosesLogin=loginDirect;
  }

  init();
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }
})();
