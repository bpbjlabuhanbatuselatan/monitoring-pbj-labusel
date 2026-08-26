(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';
  const local={getLogoData:()=>({lkpp:'./logo-lkpp.png',labusel:'./logo-labusel.png',ukpbj:'./logo-ukpbj.png'})};
  const aliases={authenticate:'login',registerAccount:'daftarUser'};

  function makeRunner(){
    let ok=null,bad=null;
    const target={};
    const runner=new Proxy(target,{get(_,name){
      if(name==='withSuccessHandler') return fn=>{ok=typeof fn==='function'?fn:null;return runner;};
      if(name==='withFailureHandler') return fn=>{bad=typeof fn==='function'?fn:null;return runner;};
      return (...args)=>{
        const success=ok, failure=bad;
        ok=null; bad=null;
        return new Promise(async resolve=>{
          let lastError=null;
          for(let attempt=1;attempt<=2;attempt++){
            try{
              if(name==='getLogoData'){
                const value=local.getLogoData();
                if(success) success(value);
                resolve(value);
                return;
              }

              const fn=aliases[name]||name;
              const controller=new AbortController();
              const timer=setTimeout(()=>controller.abort(),45000);

              let res;
              try{
                res=await fetch(API,{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({function:String(fn),args}),
                  signal:controller.signal,
                  cache:'no-store'
                });
              }finally{
                clearTimeout(timer);
              }

              const text=await res.text();
              let data;
              try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons backend tidak valid.');}

              if(!res.ok){
                const err=new Error(data&&data.message?data.message:'Request gagal.');
                err.httpStatus=res.status;
                throw err;
              }

              if(success) success(data);
              resolve(data);
              return;
            }catch(err){
              lastError=err;
              const retryable=err&&(
                err.name==='AbortError'||
                err.httpStatus===408||
                err.httpStatus===429||
                err.httpStatus>=500
              );
              if(!retryable||attempt===2) break;
              await new Promise(r=>setTimeout(r,700));
            }
          }

          const message=lastError&&lastError.name==='AbortError'
            ?'Koneksi ke server timeout. Silakan coba lagi.'
            :(lastError&&lastError.message?lastError.message:String(lastError));

          if(failure) failure({message});
          else console.error(message);
          resolve({success:false,message});
        });
      };
    }});
    return runner;
  }

  window.google=window.google||{};
  window.google.script=window.google.script||{};
  window.google.script.run=makeRunner();
  window.__supabaseBridge=makeRunner;

  /* MOBILE ONLY: foto detail tampil langsung penuh, bukan thumbnail/card kecil.
     Desktop tidak disentuh. Login/auth/bridge di atas tidak diubah. */
  document.addEventListener('DOMContentLoaded',function(){
    if(!window.matchMedia || !window.matchMedia('(max-width:760px)').matches) return;
    if(typeof window.renderProgressDetail!=='function') return;

    const originalRender=window.renderProgressDetail;

    window.renderProgressDetail=function(mingguList){
      if(!Array.isArray(mingguList)) return originalRender(mingguList);

      const body=document.getElementById('progressDetailBody');
      if(!body) return originalRender(mingguList);

      body.innerHTML='';

      if(!mingguList.length){
        body.innerHTML='<div class="empty">Belum ada laporan mingguan untuk proyek ini.</div>';
        return;
      }

      mingguList.forEach(function(item){
        const laporan=item&&item.laporan||{};
        const block=document.createElement('div');
        block.className='week-block';

        const head=document.createElement('div');
        head.className='week-head';
        const weekTitle=document.createElement('div');
        weekTitle.className='week-title';
        weekTitle.textContent='Minggu ke-'+(item.mingguKe||laporan.mingguKe||'-');
        const progress=document.createElement('div');
        progress.className='week-progress';
        progress.textContent=(laporan.progres||'0')+'%';
        head.appendChild(weekTitle);
        head.appendChild(progress);
        block.appendChild(head);

        const meta=document.createElement('div');
        meta.className='week-meta';
        meta.textContent='Tanggal: '+(laporan.tanggal||'-')+' | Penyedia: '+(laporan.namaPenyedia||'-')+' | Dibuat oleh: '+(laporan.dibuatOleh||'-');
        block.appendChild(meta);

        if(laporan.keterangan){
          const note=document.createElement('div');
          note.className='week-note';
          note.textContent='Keterangan: '+laporan.keterangan;
          block.appendChild(note);
        }

        const photos=Array.isArray(item.foto)?item.foto:[];

        if(!photos.length){
          const emptyPhoto=document.createElement('div');
          emptyPhoto.className='no-photo';
          emptyPhoto.style.marginTop='10px';
          emptyPhoto.textContent='Belum ada foto dokumentasi pada minggu ini.';
          block.appendChild(emptyPhoto);
        }else{
          const grid=document.createElement('div');
          grid.className='week-photo-grid';
          grid.style.display='block';
          grid.style.width='100%';
          grid.style.marginTop='12px';

          photos.forEach(function(photo,index){
            const href=photo&&photo.linkFoto?photo.linkFoto:'';
            if(!href) return;

            const card=document.createElement('div');
            card.className='week-photo-card';
            card.style.width='100%';
            card.style.margin='0 0 14px 0';
            card.style.padding='0';
            card.style.border='0';
            card.style.background='transparent';
            card.style.boxShadow='none';

            const img=document.createElement('img');
            img.src=href;
            img.alt='Foto dokumentasi minggu ke-'+(item.mingguKe||'-')+' nomor '+(index+1);
            img.loading='lazy';
            img.style.display='block';
            img.style.width='100%';
            img.style.height='auto';
            img.style.maxWidth='100%';
            img.style.objectFit='contain';
            img.style.borderRadius='10px';
            img.style.background='#f4f7f9';

            card.appendChild(img);
            grid.appendChild(card);
          });

          block.appendChild(grid);
        }

        body.appendChild(block);
      });
    };
  },{once:true});
})();
