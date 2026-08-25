(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';
  const RAW='https://raw.githubusercontent.com/bpbjlabuhanbatuselatan/monitoring-pbj-labusel/main/';
  const local={getLogoData:()=>({lkpp:RAW+'logo-lkpp.png',labusel:RAW+'logo-labusel.png',ukpbj:RAW+'logo-ukpbj.png'})};
  const aliases={authenticate:'login',registerAccount:'daftarUser'};
  function runner(success,failure){
    let ok=success,bad=failure;
    const proxy=new Proxy({}, {get(_,name){
      if(name==='withSuccessHandler') return fn=>{ok=fn;return proxy;};
      if(name==='withFailureHandler') return fn=>{bad=fn;return proxy;};
      return async (...args)=>{
        try{
          if(name==='getLogoData'){const v=local.getLogoData();ok&&ok(v);return v;}
          const fn=aliases[name]||name;
          const res=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({function:String(fn),args})});
          const text=await res.text();let data;try{data=JSON.parse(text);}catch(e){throw new Error(text||'Respons backend tidak valid.');}
          if(!res.ok)throw new Error(data.message||'Request gagal.');
          ok&&ok(data);return data;
        }catch(err){bad&&bad({message:err.message||String(err)});}
      };
    }});
    return proxy;
  }
  window.google=window.google||{};window.google.script=window.google.script||{};window.google.script.run=runner(null,null);window.__supabaseBridge=runner;
})();
