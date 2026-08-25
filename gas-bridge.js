(function(){
  const API='https://msfkpwwqrpbmgdtlbwdo.supabase.co/functions/v1/gas-api';
  const DRIVE={
    lkpp:'https://drive.google.com/uc?export=view&id=1hrEQHiXqXL5-8gfDKQ3OQai0FXu0p5oK',
    labusel:'https://drive.google.com/uc?export=view&id=1gig7Cps9DnqnTcBJ4ffjJx5CPn0IXj7A',
    ukpbj:'https://drive.google.com/uc?export=view&id=1B5wA7Lf_52FJzxwxDUUNE5WqI6b6coBP'
  };
  function runner(success,failure){
    let ok=success||null,bad=failure||null;
    const proxy=new Proxy({}, {get(_,name){
      if(name==='withSuccessHandler') return fn=>{ok=fn;return proxy;};
      if(name==='withFailureHandler') return fn=>{bad=fn;return proxy;};
      return async (...args)=>{
        try{
          if(name==='getLogoData'){
            const v={lkpp:DRIVE.lkpp,labusel:DRIVE.labusel,ukpbj:DRIVE.ukpbj};
            if(typeof ok==='function') ok(v);
            return v;
          }
          const res=await fetch(API,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({function:String(name),args})
          });
          const text=await res.text();
          let data;
          try{data=text?JSON.parse(text):null;}
          catch(e){throw new Error(text||'Respons backend tidak valid.');}
          if(!res.ok) throw new Error((data&&data.message)||'Request backend gagal.');
          if(typeof ok==='function') ok(data);
          return data;
        }catch(err){
          const e={message:err&&err.message?err.message:String(err)};
          if(typeof bad==='function') bad(e);
          return null;
        }
      };
    }});
    return proxy;
  }
  window.google=window.google||{};
  window.google.script=window.google.script||{};
  window.google.script.run=runner(null,null);
  window.__supabaseBridge=runner;
})();
