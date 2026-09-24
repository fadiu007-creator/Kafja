let shops=[], ratings=[], water="all", ratingShop=null;
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function load(){
  try{
    const [rows,rs]=await Promise.all([window.supabaseApi.list(),window.supabaseApi.ratings()]);
    shops=rows.map(x=>({id:x.id,name:x.name,city:x.city,price:Number(x.price),water:x.water_served?"yes":"no",note:x.note||"",createdAt:new Date(x.created_at).getTime()}));
    ratings=rs.map(x=>({id:x.id,shopId:x.coffee_shop_id,water:x.water_served,price:Number(x.price)}));
    render()
  }catch(e){console.error(e);$("#stats").textContent="Nuk u lidh me bazën e të dhënave.";}
}
function summary(id){
 const r=ratings.filter(x=>x.shopId===id), yes=r.filter(x=>x.water).length, no=r.length-yes;
 const avg=r.length?r.reduce((a,x)=>a+x.price,0)/r.length:0;
 return {total:r.length,yes,no,avg};
}
function render(){
 const q=$("#search").value.trim().toLowerCase(),sort=$("#sort").value;
 let list=shops.filter(x=>(water==="all"||x.water===water)&&(!q||x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q)));
 list.sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:sort==="name"?a.name.localeCompare(b.name):b.createdAt-a.createdAt);
 $("#stats").textContent=shops.length+" lokale • "+ratings.length+" vlerësime";
 $("#list").innerHTML=list.map(x=>{
   const r=summary(x.id);
   return '<article class="card" data-open-rating="'+x.id+'"><div class="cardtop"><div><h3>'+esc(x.name)+'</h3><div class="city">📍 '+esc(x.city)+'</div></div><div class="price">€'+(r.total?r.avg:x.price).toFixed(2)+'</div></div>'+
   '<div class="ratingbox"><b>'+r.total+' vlerësime</b><span>💧 Po: '+r.yes+'</span><span>🚫 Jo: '+r.no+'</span></div>'+
   '<span class="water '+(r.total?(r.yes>=r.no?"yes":"no"):(x.water==="yes"?"yes":"no"))+'">'+(r.total?(r.yes>=r.no?"💧 Kryesisht me ujë":"🚫 Kryesisht pa ujë"):(x.water==="yes"?"💧 Ujë i shërbyer":"Ujë jo"))+'</span>'+
   (x.note?'<p class="note">'+esc(x.note)+'</p>':"")+
   '<div class="date">'+(r.total?"Çmimi mesatar: €"+r.avg.toFixed(2):"Çmimi i listuar: €"+x.price.toFixed(2))+'</div>'+
   '<button class="ratebtn" data-rate="'+x.id+'">＋ Shto vlerësimin tim</button></article>'
 }).join("");
 $("#empty").classList.toggle("hidden",list.length>0);
 $("[data-rate]").forEach(b=>b.onclick=e=>{e.stopPropagation();openRating(Number(b.dataset.rate))});$("[data-open-rating]").forEach(c=>c.onclick=()=>openRating(Number(c.dataset.openRating)));
}
function openModal(){$("#modal").classList.remove("hidden");setTimeout(()=>$("#form input")?.focus(),20)}
function closeModal(){$("#modal").classList.add("hidden");$("#form").reset()}
function openRating(id){ratingShop=shops.find(x=>x.id===id);if(!ratingShop)return;$("#ratingTitle").textContent=ratingShop.name;$("#ratingModal").classList.remove("hidden");$("#ratingForm").reset();$("#ratingPrice").focus()}
function closeRating(){$("#ratingModal").classList.add("hidden");ratingShop=null}
$("#addTop").onclick=openModal; $("[data-close]").forEach(x=>x.onclick=()=>closeModal()); $("[data-rating-close]").forEach(x=>x.onclick=()=>closeRating());
$("#search").oninput=render;$("#sort").onchange=render;
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");water=b.dataset.water;render()});
$("#form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),payload={name:f.get("name").trim(),city:f.get("city").trim(),price:Number(f.get("price")),water_served:f.get("water")==="yes",note:f.get("note").trim()};try{await window.supabaseApi.add(payload);await load();closeModal();toast("Lokali u shtua në Kafja ✓")}catch(err){alert("Nuk u shtua lokali. Provo përsëri.");console.error(err)}};
$("#ratingForm").onsubmit=async e=>{e.preventDefault();if(!ratingShop)return;const f=new FormData(e.target);try{await window.supabaseApi.addRating({coffee_shop_id:ratingShop.id,water_served:f.get("water")==="yes",price:Number(f.get("price"))});await load();closeRating();toast("Vlerësimi u shtua ✓")}catch(err){alert("Nuk u shtua vlerësimi. Provo përsëri.");console.error(err)}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
load();