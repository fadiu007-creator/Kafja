let shops=[], ratings=[], water="all", ratingShop=null, admin=false, adminUser=null, lastRatingSeen=0, adminTimer=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function money(v){return "€"+Number(v||0).toFixed(2)}
async function load(){
 try{
  const [rows,rs]=await Promise.all([window.supabaseApi.list(),window.supabaseApi.ratings()]);
  shops=rows.map(x=>({id:x.id,name:x.name,city:x.city,price:Number(x.price),water:x.water_served?"yes":"no",note:x.note||"",createdAt:new Date(x.created_at).getTime()}));
  ratings=rs.map(x=>({id:x.id,shopId:x.coffee_shop_id,water:x.water_served,price:Number(x.price),createdAt:new Date(x.created_at).getTime()}));
  render(); if(admin) await refreshAdmin();
 }catch(e){console.error(e);$("#stats").textContent="Nuk u lidh me bazën e të dhënave.";}
}
function summary(id){
 const r=ratings.filter(x=>x.shopId===id),yes=r.filter(x=>x.water).length,no=r.length-yes,avg=r.length?r.reduce((a,x)=>a+x.price,0)/r.length:0;
 return {total:r.length,yes,no,avg};
}
function render(){
 const q=$("#search").value.trim().toLowerCase(),sort=$("#sort").value;
 let list=shops.filter(x=>(water==="all"||x.water===water)&&(!q||x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q)));
 list.sort((a,b)=>sort==="low"?(summary(a.id).total?summary(a.id).avg:a.price)-(summary(b.id).total?summary(b.id).avg:b.price):sort==="high"?(summary(b.id).total?summary(b.id).avg:b.price)-(summary(a.id).total?summary(a.id).avg:a.price):sort==="name"?a.name.localeCompare(b.name):b.createdAt-a.createdAt);
 $("#stats").textContent=shops.length+" lokale • "+ratings.length+" vlerësime";
 $("#list").innerHTML=list.map(x=>{
  const r=summary(x.id),adminBtns=admin?'<div class="admin-card-actions"><button data-edit="'+x.id+'">✏️ Ndrysho</button><button data-delete="'+x.id+'">🗑️ Fshi</button></div>':"";
  return '<article class="card" data-open-rating="'+x.id+'"><div class="cardtop"><div><h3>'+esc(x.name)+'</h3><div class="city">📍 '+esc(x.city)+'</div></div><div class="price">'+money(r.total?r.avg:x.price)+'</div></div>'+
  '<div class="ratingbox"><b>'+r.total+' vlerësime</b><span>💧 Po: '+r.yes+'</span><span>🚫 Jo: '+r.no+'</span></div>'+
  '<span class="water '+(r.total?(r.yes>=r.no?"yes":"no"):(x.water==="yes"?"yes":"no"))+'">'+(r.total?(r.yes>=r.no?"💧 Kryesisht me ujë":"🚫 Kryesisht pa ujë"):(x.water==="yes"?"💧 Ujë i shërbyer":"Ujë jo"))+'</span>'+
  (x.note?'<p class="note">'+esc(x.note)+'</p>':"")+
  '<div class="date">'+(r.total?"Çmimi mesatar: "+money(r.avg):"Çmimi i listuar: "+money(x.price))+'</div>'+
  '<button class="ratebtn" data-rate="'+x.id+'">＋ Shto vlerësimin tim</button>'+adminBtns+'</article>'
 }).join("");
 $("#empty").classList.toggle("hidden",list.length>0);
 $$("[data-rate]").forEach(b=>b.onclick=e=>{e.stopPropagation();openRating(Number(b.dataset.rate))});
 $$("[data-open-rating]").forEach(c=>c.onclick=()=>openRating(Number(c.dataset.openRating)));
 $$("[data-edit]").forEach(b=>b.onclick=e=>{e.stopPropagation();openEdit(Number(b.dataset.edit))});
 $$("[data-delete]").forEach(b=>b.onclick=e=>{e.stopPropagation();deleteShop(Number(b.dataset.delete))});
}
function openModal(){$("#modal").classList.remove("hidden");setTimeout(()=>$("#form input")?.focus(),20)}
function closeModal(){$("#modal").classList.add("hidden");$("#form").reset()}
function openRating(id){ratingShop=shops.find(x=>x.id===id);if(!ratingShop)return;$("#ratingTitle").textContent=ratingShop.name;$("#ratingModal").classList.remove("hidden");$("#ratingForm").reset();$("#ratingPrice").focus()}
function closeRating(){$("#ratingModal").classList.add("hidden");ratingShop=null}
async function refreshAdmin(){
 if(!admin)return;
 const rs=await window.supabaseApi.adminRatings();
 const unseen=rs.filter(x=>new Date(x.created_at).getTime()>lastRatingSeen);
 $("#adminBadge").textContent=unseen.length?"+"+unseen.length:"";
 $("#adminBadge").classList.toggle("hidden",!unseen.length);
 $("#adminLatest").innerHTML=rs.slice(0,20).map(x=>'<div class="notice"><div><b>'+esc(x.coffee_shops?.name||"Lokal")+'</b><span> · '+esc(x.coffee_shops?.city||"")+'</span></div><div>'+ (x.water_served?"💧 Po":"🚫 Jo")+' · '+money(x.price)+' · '+new Date(x.created_at).toLocaleString("sq-AL",{dateStyle:"short",timeStyle:"short"})+'</div><button data-delete-rating="'+x.id+'">Fshi</button></div>').join("")||'<p class="muted">Nuk ka ende vlerësime.</p>';
 $$("[data-delete-rating]").forEach(b=>b.onclick=()=>deleteRating(Number(b.dataset.deleteRating)));
 $("#adminShops").innerHTML=shops.map(x=>'<div class="manage-row"><div><b>'+esc(x.name)+'</b><span>'+esc(x.city)+' · '+summary(x.id).total+' vlerësime</span></div><div><button data-admin-edit="'+x.id+'">✏️</button><button data-admin-delete="'+x.id+'">🗑️</button></div></div>').join("")||'<p class="muted">Nuk ka lokale.</p>';
 $$("[data-admin-edit]").forEach(b=>b.onclick=()=>openEdit(Number(b.dataset.adminEdit)));
 $$("[data-admin-delete]").forEach(b=>b.onclick=()=>deleteShop(Number(b.dataset.adminDelete)));
}
async function openAdmin(){
 const email=prompt("Email-i i administratorit:");
 if(!email)return;
 const password=prompt("Fjalëkalimi:");
 if(!password)return;
 const r=await window.supabaseApi.signIn(email,password);
 if(r.error){alert("Hyrja dështoi: "+r.error.message);return}
 const ok=await window.supabaseApi.isAdmin();
 if(!ok){await window.supabaseApi.signOut();alert("Kjo llogari nuk është administrator.");return}
 admin=true;adminUser=email;lastRatingSeen=Number(localStorage.getItem("kafja_admin_seen")||0);
 $("#adminBtn").textContent="Admin ✓";$("#adminPanel").classList.remove("hidden");
 if("Notification" in window&&Notification.permission==="default") Notification.requestPermission().catch(()=>{});
 await refreshAdmin();load();if(adminTimer)clearInterval(adminTimer);adminTimer=setInterval(checkNewRatings,30000);
}
async function checkNewRatings(){
 if(!admin)return;
 try{
  const rs=await window.supabaseApi.adminRatings(),newOnes=rs.filter(x=>new Date(x.created_at).getTime()>lastRatingSeen);
  if(newOnes.length){
   $("#adminBadge").textContent="+"+newOnes.length;$("#adminBadge").classList.remove("hidden");
   if("Notification" in window&&Notification.permission==="granted") new Notification("Kafja — vlerësim i ri",{body:newOnes[0].coffee_shops?.name+" · "+money(newOnes[0].price)});
  }
  $("#adminLatest").innerHTML=rs.slice(0,20).map(x=>'<div class="notice"><div><b>'+esc(x.coffee_shops?.name||"Lokal")+'</b><span> · '+esc(x.coffee_shops?.city||"")+'</span></div><div>'+ (x.water_served?"💧 Po":"🚫 Jo")+' · '+money(x.price)+' · '+new Date(x.created_at).toLocaleString("sq-AL",{dateStyle:"short",timeStyle:"short"})+'</div><button data-delete-rating="'+x.id+'">Fshi</button></div>').join("");
  $$("[data-delete-rating]").forEach(b=>b.onclick=()=>deleteRating(Number(b.dataset.deleteRating)));
 }catch(e){console.error(e)}
}
async function adminSeen(){
 lastRatingSeen=Date.now();localStorage.setItem("kafja_admin_seen",String(lastRatingSeen));$("#adminBadge").classList.add("hidden");await refreshAdmin();
}
async function adminLogout(){
 await window.supabaseApi.signOut();admin=false;adminUser=null;clearInterval(adminTimer);$("#adminPanel").classList.add("hidden");$("#adminBtn").innerHTML='Admin <span id="adminBadge" class="badge hidden"></span>';render();
}
function openEdit(id){
 const x=shops.find(s=>s.id===id);if(!x||!admin)return;
 $("#editId").value=x.id;$("#editName").value=x.name;$("#editCity").value=x.city;$("#editPrice").value=x.price;$("#editWaterYes").checked=x.water==="yes";$("#editWaterNo").checked=x.water==="no";$("#editNote").value=x.note;$("#editModal").classList.remove("hidden");
}
function closeEdit(){$("#editModal").classList.add("hidden")}
async function deleteShop(id){
 if(!admin)return;const x=shops.find(s=>s.id===id);if(!x||!confirm('Fshi "'+x.name+'" dhe të gjitha vlerësimet e tij?'))return;
 try{await window.supabaseApi.deleteShop(id);toast("Lokali u fshi ✓");await load()}catch(e){alert("Nuk u fshi lokali.");console.error(e)}
}
async function deleteRating(id){
 if(!admin||!confirm("Fshi këtë vlerësim?"))return;
 try{await window.supabaseApi.deleteRating(id);toast("Vlerësimi u fshi ✓");await load()}catch(e){alert("Nuk u fshi vlerësimi.");console.error(e)}
}
$("#editCity").innerHTML=$("#form [name=city]").innerHTML;$("#addTop").onclick=openModal;$("#adminBtn").onclick=openAdmin;
$("#adminLogout").onclick=adminLogout;$("#adminSeen").onclick=adminSeen;
$$("[data-close]").forEach(x=>x.onclick=()=>closeModal());$$("[data-rating-close]").forEach(x=>x.onclick=()=>closeRating());$$("[data-edit-close]").forEach(x=>x.onclick=()=>closeEdit());
$("#search").oninput=render;$("#sort").onchange=render;
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");water=b.dataset.water;render()});
$("#form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),payload={name:f.get("name").trim(),city:f.get("city").trim(),price:Number(f.get("price")),water_served:f.get("water")==="yes",note:f.get("note").trim()};try{await window.supabaseApi.add(payload);await load();closeModal();toast("Lokali u shtua në Kafja ✓")}catch(err){alert("Nuk u shtua lokali. Provo përsëri.");console.error(err)}};
$("#ratingForm").onsubmit=async e=>{e.preventDefault();if(!ratingShop)return;const f=new FormData(e.target);try{await window.supabaseApi.addRating({coffee_shop_id:ratingShop.id,water_served:f.get("water")==="yes",price:Number(f.get("price"))});await load();closeRating();toast("Vlerësimi u shtua ✓")}catch(err){alert("Nuk u shtua vlerësimi. Provo përsëri.");console.error(err)}};
$("#editForm").onsubmit=async e=>{e.preventDefault();if(!admin)return;const f=new FormData(e.target);try{await window.supabaseApi.updateShop(Number(f.get("id")),{name:f.get("name").trim(),city:f.get("city").trim(),price:Number(f.get("price")),water_served:f.get("water")==="yes",note:f.get("note").trim()});closeEdit();await load();toast("Lokali u ndryshua ✓")}catch(err){alert("Nuk u ndryshua lokali.");console.error(err)}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
load();