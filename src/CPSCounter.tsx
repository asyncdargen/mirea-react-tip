import React, { useEffect, useRef, useState } from 'react';

export default function CPSCounter(){
  const timesRef = useRef<number[]>([]);
  const [cps, setCps] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(()=>{
    const id = setInterval(()=>{
      const now = Date.now();
      timesRef.current = timesRef.current.filter(t => now - t < 1000);
      setCps(timesRef.current.length);
    }, 100);
    return ()=>clearInterval(id);
  },[]);

  const handleClick = ()=>{
    timesRef.current.push(Date.now());
    setTotal(t => t + 1);
    setCps(timesRef.current.length);
  };

  const handleReset = ()=>{
    timesRef.current = [];
    setTotal(0);
    setCps(0);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:20}}>
      <h1 style={{margin:0,marginBottom:16}}>CPS Тестер</h1>
      <div style={{fontSize:72,fontWeight:700,color:'#34d399',marginBottom:8}}>{cps}</div>
      <div style={{marginBottom:24,color:'#9aa8b7'}}>кликов в секунду</div>
      <button onClick={handleClick} style={{width:420,height:180,fontSize:32,fontWeight:700,background:'#2563eb',color:'white',border:'none',borderRadius:12,cursor:'pointer',boxShadow:'0 6px 18px rgba(0,0,0,0.3)',marginBottom:20}} onMouseDown={(e)=> (e.currentTarget.style.transform='scale(0.97)')} onMouseUp={(e)=> (e.currentTarget.style.transform='scale(1)')}>КЛИКНИ МЕНЯ</button>
      <div style={{marginBottom:12,color:'#9aa8b7'}}>Всего кликов: {total}</div>
      <div style={{display:'flex',gap:12}}>
        <button onClick={handleReset} style={{padding:'10px 18px',borderRadius:8,border:'none',background:'#ef4444',color:'white',cursor:'pointer'}}>Сбросить</button>
      </div>
    </div>
  );
}
