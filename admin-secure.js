(function(){
 const $=s=>document.querySelector(s);
 function closeLogin(){const m=$("#adminLoginModal");if(m)m.classList.add("hidden");const f=$("#adminLoginForm");if(f)f.reset();const e=$("#adminLoginError");if(e)e.classList.add("hidden");}
 async function openLogin(){
  if(window.admin===true){return}
  const m=$("#adminLoginModal");if(!m)return;
  $("#adminLoginError").classList.add("hidden");m.classList.remove("hidden");setTimeout(()=>$("#adminEmail").focus(),20);
 }
 async function submit(e){
  e.preventDefault();
  const f=new FormData(e.target),email=String(f.get("email")||"").trim(),pw=String(f.get("password")||"");
  const btn=e.target.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent="Duke hyrë…";
  const err=$("#adminLoginError");err.classList.add("hidden");
  try{
   const r=await window.supabaseApi.signIn(email,pw);
   if(r.error)throw new Error("login");
   const ok=await window.supabaseApi.isAdmin();
   if(!ok){await window.supabaseApi.signOut();throw new Error("login");}
   window.admin=true;window.adminUser=email;window.lastRatingSeen=Number(localStorage.getItem("kafja_admin_seen")||0);
   closeLogin();$("#adminBtn").textContent="Admin ✓";$("#adminPanel").classList.remove("hidden");
   if("Notification" in window&&Notification.permission==="default")Notification.requestPermission().catch(()=>{});
   if(window.refreshAdmin)await window.refreshAdmin();if(window.load)await window.load();
   if(window.adminTimer)clearInterval(window.adminTimer);window.adminTimer=setInterval(window.checkNewRatings,30000);
  }catch(x){
   err.textContent="Email-i ose fjalëkalimi nuk është i saktë, ose kjo llogari nuk ka qasje administratori.";err.classList.remove("hidden");
  }finally{btn.disabled=false;btn.textContent="Hyr";}
 }
 window.addEventListener("DOMContentLoaded",function(){
  $("#adminBtn").onclick=openLogin;
  $("#adminLoginForm").onsubmit=submit;
  document.querySelectorAll("[data-admin-login-close]").forEach(x=>x.onclick=closeLogin);
 });
})();