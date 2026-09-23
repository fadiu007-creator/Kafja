let shops=[], water="all";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
async function load(){try{const rows=await window.supabaseApi.list();shops=rows.map(x=>({id:x.id,name:x.name,city:x.city,price:Number(x.price),water:x.water_served?"yes":"no",note:x.note||"",createdAt:new Date(x.created_at).getTime()}));render()}catch(e){console.error(e);$("#stats").textContent="Nuk u lidh me bazën e të dhënave.";}}
function render(){
 const q=$("#search").value.trim().toLowerCase(),sort=$("#sort").value;
 let list=shops.filter(x=>(water==="all"||x.water===water)&&(!q||x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q)));
 list.sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:sort==="name"?a.name.localeCompare(b.name):b.createdAt-a.createdAt);
 $("#stats").textContent=shops.length+" lokale të listuara • "+shops.filter(x=>x.water==="yes").length+" me ujë";
 $("#list").innerHTML=list.map(x=>'<article class="card"><div class="cardtop"><div><h3>'+esc(x.name)+'</h3><div class="city">📍 '+esc(x.city)+'</div></div><div class="price">€'+Number(x.price).toFixed(2)+'</div></div><span class="water '+(x.water==="yes"?"yes":"no")+'">'+(x.water==="yes"?"💧 Ujë i shërbyer":"Ujë jo")+'</span>'+(x.note?'<p class="note">'+esc(x.note)+'</p>':"")+'<div class="date">Shtuar nga komuniteti</div></article>').join("");
 $("#empty").classList.toggle("hidden",list.length>0);
}
function openModal(){$("#modal").classList.remove("hidden");setTimeout(()=>$("#form input")?.focus(),20)}
function closeModal(){$("#modal").classList.add("hidden");$("#form").reset()}
$("#addTop").onclick=openModal; $$("[data-close]").forEach(x=>x.onclick=closeModal);
$("#search").oninput=render;$("#sort").onchange=render;
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");water=b.dataset.water;render()});
$("#form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),payload={name:f.get("name").trim(),city:f.get("city").trim(),price:Number(f.get("price")),water_served:f.get("water")==="yes",note:f.get("note").trim()};try{await window.supabaseApi.add(payload);await load();closeModal();const t=$("#toast");t.textContent="Lokali u shtua në Kafja ✓";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}catch(err){alert("Nuk u shtua lokali. Provo përsëri.");console.error(err)}};
load();