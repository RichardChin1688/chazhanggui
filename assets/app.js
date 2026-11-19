/* 茶掌柜系统 · 交互 */
(function(){
  const $=(s,r)=>(r||document).querySelector(s);
  const $$=(s,r)=>Array.from((r||document).querySelectorAll(s));

  const side=$('#side'), mask=$('#sideMask');
  const content=$('#content'), crumb=$('#crumb'), mbTitle=$('#mbTitle');

  const TITLES={
    dash:['掌柜晨会','今日总览'],
    stock:['看仓掌柜','管货和钱 · 该收多少料'],
    flavor:['风味掌柜','管口感 · 批次稳不稳'],
    trace:['验货掌柜','管信任 · 客户扫码看'],
    check:['把关掌柜','管不出事 · 发前先过'],
    cust:['识人掌柜','管客户 · 谁该回来了'],
    care:['茶养掌柜','管喝什么 · 时令配茶'],
    chat:['问掌柜','想问什么直接说'],
    orders:['订单','全部单据'],
    shop:['门店与账号','基本设置']
  };

  function closeSide(){ side.classList.remove('on'); mask&&mask.classList.remove('on'); }
  $('#mbBtn')?.addEventListener('click',()=>{ side.classList.add('on'); mask&&mask.classList.add('on'); });
  mask&&mask.addEventListener('click',closeSide);

  function go(v){
    $$('.view').forEach(x=>x.classList.remove('on'));
    const el=$('#v-'+v);
    if(el) el.classList.add('on');
    $$('.sb-item').forEach(x=>x.classList.toggle('on',x.dataset.v===v));
    const t=TITLES[v]||['',''];
    const title=t[0], sub=t[1];
    const tt=document.querySelector('.top-title');
    if(tt) tt.innerHTML=title+'<span class="crumb">'+sub+'</span>';
    if(mbTitle) mbTitle.textContent=title;
    content.scrollTop=0; window.scrollTo(0,0);
    closeSide();
    if(v==='chat') seedChat();
  }

  document.addEventListener('click',e=>{
    const it=e.target.closest('.sb-item[data-v]');
    if(it){ go(it.dataset.v); return; }
    const g=e.target.closest('[data-go]');
    if(g){ go(g.dataset.go); }
  });

  // 日期
  const now=new Date();
  const wk=['周日','周一','周二','周三','周四','周五','周六'][now.getDay()];
  const p=n=>String(n).padStart(2,'0');
  const td=$('#today');
  if(td) td.textContent=`${now.getFullYear()}-${p(now.getMonth()+1)}-${p(now.getDate())} ${wk}`;

  /* ================= 问掌柜 · 模拟对话 ================= */
  const SEED=[
    {who:'a',t:'古树晒红还剩多少？要不要补？'},
    {who:'b',name:'看仓掌柜',t:'现存 14 饼（批次 B2309）。近 30 天卖 68 饼，日均 2.3 饼，够卖 6 天。<br>建议本周补 40 饼，按现在的动销刚好接得上春茶前的空档。<br><span class="shot">依据：11-19 库存快照 · 近 30 天出库单 68 单</span>'},
    {who:'a',t:'哪些老客该提醒回购了？'},
    {who:'b',name:'识人掌柜',t:'24 位到点，其中 3 位超期：<br>· 周慧敏（44 天未回，常买明前龙井 250g）<br>· 王德明（51 天未回，偏爱白牡丹）<br>· 林予安（38 天未回，古树晒红常客）<br>先提醒哪几位，我列好话术给您。'}
  ];

  window.seedChat=function(){
    const box=$('#chatBox');
    if(!box||box.dataset.seeded) return;
    box.dataset.seeded='1';
    SEED.forEach(m=>box.appendChild(bubble(m)));
    box.scrollTop=box.scrollHeight;
  };

  function bubble(m){
    const d=document.createElement('div');
    d.className='msg '+(m.who==='a'?'me':'ai');
    d.innerHTML=(m.who==='b'?`<div class="who">✦ ${m.name||'茶掌柜'}</div>`:'')+
      `<div class="txt">${m.t}</div>`;
    return d;
  }

  document.addEventListener('submit',e=>{
    if(e.target.id!=='chatForm') return;
    e.preventDefault();
    const inp=$('#chatIn'), box=$('#chatBox');
    const q=inp.value.trim(); if(!q) return;
    box.appendChild(bubble({who:'a',t:q}));
    inp.value='';
    box.scrollTop=box.scrollHeight;
    setTimeout(()=>{
      box.appendChild(bubble({who:'b',name:'茶掌柜',t:'收到。这件事我看一眼账再答您——稍等片刻，我先把数捞出来。<span class="shot">正在查：订单 / 库存 / 客户档案</span>'}));
      box.scrollTop=box.scrollHeight;
    },700);
  });

  // 抽屉
  $$('[data-open]').forEach(b=>b.addEventListener('click',()=>{
    const id='drawer-'+b.dataset.open;
    const el=$('#'+id); if(el){ el.classList.add('on'); $('#drawerMask').classList.add('on'); }
  }));
  $('#drawerMask')?.addEventListener('click',()=>{
    $$('.drawer').forEach(d=>d.classList.remove('on'));
    $('#drawerMask').classList.remove('on');
  });
  $$('.drawer-h .x').forEach(x=>x.addEventListener('click',()=>{
    $$('.drawer').forEach(d=>d.classList.remove('on'));
    $('#drawerMask').classList.remove('on');
  }));

  // 表格筛选（简单 tab）
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-filter]');
    if(!t) return;
    const wrap=t.closest('.filter-row'); if(!wrap) return;
    $$('[data-filter]',wrap).forEach(x=>x.classList.remove('on'));
    t.classList.add('on');
  });
})();
