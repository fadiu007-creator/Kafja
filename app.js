const KEY="kafja-shops-v1";
const seed=[
{id:1,name:"Café X",city:"Ferizaj",price:1,water:"yes",note:"Uji shërbehet bashkë me kafenë.",createdAt:Date.now()-172800000},
{id:2,name:"Café Y",city:"Prishtinë",price:1.5,water:"no",note:"",createdAt:Date.now()-86400000},
{id:3,name:"Café Z",city:"Ferizaj",price:1.2,water:"yes",note:"",createdAt:Date.now()-3600000}
];
let shops=JSON.parse(localStorage.getItem(KEY)||"null")||seed;
let water="all";
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function save(){localStorage.setItem(KEY,JSON.stringify(shops))}
function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
 const q=$("#search").value.trim().toLowerCase(), sort=$("#sort").value;
 let list=shops.filter(x=>(water==="all"||x.water===water)&&(!q||x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q)));
 list.sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:sort==="name"?a.name.localeCompare(b.name):b.createdAt-a.createdAt);
 $("#stats").textContent=shops.length+" lokale të listuara • "+shops.filter(x=>x.water==="yes").length+" me ujë";
 $("#list").innerHTML=list.map(x=>'<article class="card"><div class="cardtop"><div><h3>'+esc(x.name)+'</h3><div class="city">📍 '+esc(x.city)+'</div></div><div class="price">€'+Number(x.price).toFixed(2)+'</div></div><span class="water '+(x.water==="yes"?"yes":"no")+'">'+(x.water==="yes"?"💧 Ujë i shërbyer":"Ujë jo")+'</span>'+(x.note?'<p class="note">'+esc(x.note)+'</p>':"")+'<div class="date">Shtuar nga komuniteti</div></article>').join("");
 $("#empty").classList.toggle("hidden",list.length>0);
}
function openModal(){$("#modal").classList.remove("hidden");setTimeout(()=>$("#form input")?.focus(),20)}
function closeModal(){$("#modal").classList.add("hidden");$("#form").reset()}
$("#addTop").onclick=openModal;
$$("[data-close]").forEach(x=>x.onclick=closeModal);
$("#search").oninput=render; $("#sort").onchange=render;
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");water=b.dataset.water;render()});
$("#form").onsubmit=e=>{
 e.preventDefault(); const f=new FormData(e.target);
 shops.unshift({id:Date.now(),name:f.get("name").trim(),city:f.get("city").trim(),price:Number(f.get("price")),water:f.get("water"),note:f.get("note").trim(),createdAt:Date.now()});
 save();render();closeModal();
 const t=$("#toast");t.textContent="Lokali u shtua në Kafja ✓";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);
};
render();