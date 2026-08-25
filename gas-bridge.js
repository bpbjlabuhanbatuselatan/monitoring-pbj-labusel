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
          try{
            if(name==='getLogoData'){
              const value=local.getLogoData();
              if(success) success(value);
              resolve(value);
              return;
            }
            const fn=aliases[name]||name;
            const controller=new AbortController();
            const timer=setTimeout(()=>controller.abort(),15000);
            const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({function:String(fn),args}),signal:controller.signal,cache:'no-store'});
            clearTimeout(timer);
            const text=await res.text();
            let data;
            try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons backend tidak valid.');}
            if(!res.ok) throw new Error(data.message||'Request gagal.');
            if(success) success(data);
            resolve(data);
          }catch(err){
            const message=err&&err.name==='AbortError'?'Koneksi ke server timeout.':(err&&err.message?err.message:String(err));
            if(failure) failure({message});
            else console.error(message);
            resolve({success:false,message});
          }
        });
      };
    }});
    return runner;
  }

  window.google=window.google||{};
  window.google.script=window.google.script||{};
  window.google.script.run=makeRunner();
  window.__supabaseBridge=makeRunner;
})();
