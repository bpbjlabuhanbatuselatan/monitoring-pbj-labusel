(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';
  const RAW='https://raw.githubusercontent.com/bpbjlabuhanbatuselatan/monitoring-pbj-labusel/main/';
  const local={getLogoData:()=>({lkpp:RAW+'logo-lkpp.png',labusel:RAW+'logo-labusel.png',ukpbj:RAW+'logo-ukpbj.png'})};
  const aliases={authenticate:'login',registerAccount:'daftarUser'};

  function makeRunner(success,failure){
    let ok=success||null,bad=failure||null;
    let proxy;
    const target={};
    proxy=new Proxy(target,{get(_,name){
      if(name==='withSuccessHandler') return fn=>makeRunner(fn,bad);
      if(name==='withFailureHandler') return fn=>makeRunner(ok,fn);
      return async (...args)=>{
        try{
          if(name==='getLogoData'){
            const v=local.getLogoData();
            if(ok) ok(v);
            return v;
          }
          const fn=aliases[name]||name;
          const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({function:String(fn),args})});
          const text=await res.text();
          let data;
          try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons backend tidak valid.');}
          if(!res.ok) throw new Error(data.message||'Request gagal.');
          if(ok) ok(data);
          return data;
        }catch(err){
          if(bad) bad({message:err.message||String(err)});
          else console.error(err);
          return {success:false,message:err.message||String(err)};
        }
      };
    }});
    return proxy;
  }

  window.google=window.google||{};
  window.google.script=window.google.script||{};
  window.google.script.run=makeRunner(null,null);
  window.__supabaseBridge=makeRunner;
})();
