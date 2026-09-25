let shops=[],ratings=[],water="all",ratingShop=null,map,pickerMap,markers,pickerMarker;
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=v=>"€"+Number(v||0).toFixed(2);

const MUNICIPALITY_COORDS={
"Deçan":[42.5407,20.2875],"Dragash":[42.0261,20.6534],"Drenas (Gllogoc)":[42.6269,20.8939],"Ferizaj":[42.3702,21.1553],
"Fushë Kosovë":[42.6391,21.0961],"Gjakovë":[42.3803,20.4308],"Gjilan":[42.4635,21.4694],"Graçanicë":[42.6000,21.1960],
"Hani i Elezit":[42.1500,21.2960],"Istog":[42.7800,20.4875],"Junik":[42.5230,20.2770],"Kaçanik":[42.2319,21.2597],
"Kamenicë":[42.5781,21.5803],"Klinë":[42.6210,20.5770],"Kllokot":[42.3700,21.3700],"Leposaviq":[43.1030,20.8010],
"Lipjan":[42.5217,21.1258],"Malishevë":[42.5290,20.7460],"Mamushë":[42.3300,20.7300],"Mitrovicë":[42.8914,20.8660],
"Mitrovicë e Veriut":[42.8940,20.8650],"Novobërdë":[42.6150,21.4350],"Obiliq":[42.6869,21.0700],"Partesh":[42.3980,21.4330],
"Pejë":[42.6591,20.2883],"Podujevë":[42.9100,21.1930],"Prishtinë":[42.6629,21.1655],"Prizren":[42.2153,20.7415],
"Rahovec":[42.3994,20.6547],"Ranillug":[42.4890,21.6040],"Shtime":[42.4331,21.0397],"Shtërpcë":[42.2394,21.0273],
"Skënderaj":[42.7467,20.7886],"Suharekë":[42.3581,20.8250],"Viti":[42.3214,21.3588],"Vushtrri":[42.8231,20.9675],
"Zubin Potok":[42.9140,20.6890],"Zveçan":[42.9070,20.8400]
};

const SETTLEMENTS={
"Deçan":["Baballoq","Beleg","Belle","Carrabreg i Epërm","Carrabreg i Ulët","Drenoc","Dubovik","Gllogjan","Isniq","Jasiq","Junik","Pobërgjë","Prapaqan","Strellc i Epërm","Strellc i Ulët"],
"Gjakovë":["Babaj i Bokës","Batushë","Bec","Bishtazhin","Brekoc","Cërmjan","Damjan","Firajë","Gërgoc","Hereç","Jabllanicë","Koshare","Mejë","Molliq","Morinë","Novosellë e Epërme","Qerret","Rogovë","Skivjan","Sopot","Stubëll","Trakaniq","Ujz","Vraniq"],
"Drenas (Gllogoc)":["Abri e Epërme","Arllat","Baicë","Çikatovë e Re","Çikatovë e Vjetër","Dobroshec","Domanek","Fushticë e Epërme","Gllanasellë","Gllobar","Komoran","Krajkovë","Likoshan","Llapushnik","Negroc","Paklek","Polluzhë","Sankoc","Shtuticë","Tërstenik","Vërboc","Vuçak"],
"Gjilan":["Bilinicë","Bresalc","Bukovik","Burincë","Cërnicë","Çelik","Dobërçan","Gadish","Goden","Gumnishtë","Kmetoc","Livoç i Epërm","Livoç i Ulët","Llashticë","Malishevë","Përlepnicë","Pidiç","Pograxhë","Ponesh","Shillovë","Shurdhan","Sllakoc i Epërm","Uglar","Velekincë","Vrapçiq","Zhegër","Zhegoc"],
"Dragash":["Baçkë","Bellobrad","Blaç","Breznë","Brod","Brodosanë","Brrut","Buçe","Buzez","Dikancë","Glloboçicë","Kërstec","Kosavë","Kuk","Kuklibeg","Mlikë","Pllajnik","Radesh","Restelicë","Vranishtë","Zaplluxhë","Zgatar","Zlipotok","Zym"],
"Istog":["Banjë","Banjicë","Bellopojë","Cërkolez","Cerrcë","Dobrushë","Dragolec","Dubravë","Gjurakoc","Kaliqan","Kosh","Kovragë","Lubozhdë","Mojstir","Osojan","Prekallë","Rakosh","Shushicë","Studenicë","Vrellë","Zabllaq","Zallq"],
"Kaçanik":["Bajnicë","Begracë","Biqec","Bob","Dimcë","Doganaj","Dromjak","Duraj","Elezaj","Gabricë","Gajre","Gërlicë e Epërme","Gorancë","Ivajë","Kaçanik i Vjetër","Kovaçec","Krivenik","Paldenicë","Pustenik","Rezhancë","Runjevë","Soponicë","Stagovë","Strazhë"],
"Klinë":["Berkovë","Binxhë","Budisalc","Çabiq","Dollc","Drenoc","Dresnik","Dush","Gllarevë","Grabanicë","Gremnik","Jashanicë","Klinavac","Krushevë e Madhe","Nagllavë","Pograxhë","Pjetërq i Epërm","Radulloc","Resnik","Sferkë","Shtupel","Siqevë","Ujmirë","Videjë","Zllakuqan"],
"Fushë Kosovë":["Bardh i Madh","Bardh i Vogël","Batushë","Bresje","Graboc i Poshtëm","Hade","Harilaq","Kuzmin"],
"Kamenicë":["Berivojcë","Boscë","Busavatë","Dajkoc","Desivojcë","Hogosht","Koretin","Kopërnicë","Lisockë","Muqivërc","Rogoqicë","Strezoc","Topanicë","Tugjec","Vriqec"],
"Mitrovicë":["Bajgorë","Bare","Banjskë","Broboniq","Cërnushë","Gushavc","Kçiq i Madh","Kçiq i Vogël","Kovragë","Mazhiq","Rashan","Shipol","Shupkovc","Stantërg","Vaganicë"],
"Leposaviq":["Bërzancë","Cerajë","Dren","Ibër","Jashanicë","Jošanica","Koshutovë","Lesak","Majdan","Osojan","Rudinë","Soçanicë","Vraçevë"],
"Lipjan":["Akosnicë","Androfc","Babush","Banullë","Blinajë","Dobrajë e Madhe","Gadime e Epërme","Gadime e Ulët","Janjevë","Kleçkë","Magurë","Medvec","Plitkoviq","Poturovc","Rubovc","Smallushë","Sllovi","Shalë"],
"Malishevë":["Bellanicë","Bubavec","Banjë","Carrallukë","Drenoc","Dragobil","Gajrak","Jançisht","Kijevë","Kërvasari","Llashkadrenoc","Mleqan","Ngucat","Pagarushë","Pllaqicë","Qifllak","Rudë","Senik","Shkarashnik","Turjakë"],
"Novobërdë":["Bostan","Buçë","Carevc","Gumnishtë","Izvor","Jasenovik","Kllobukar","Llabjan","Manishincë","Makresh i Epërm","Makresh i Poshtëm","Prekoc","Strazhë"],
"Obiliq":["Babimoc","Bakshi","Bardh i Madh","Breznicë","Hamidi","Hade","Janqishtë","Mazgit","Plemetin","Raskovë","Shipitullë","Shkabaj"],
"Rahovec":["Bellacërkë","Bratotinë","Celinë","Çifllak","Drenoc","Fortesë","Hoçë e Madhe","Kramovik","Mrasor","Nishor","Opterushë","Pastasellë","Ratkoc","Reti","Rogovë","Suhogërllë","Xërxë","Zatriq"],
"Partesh":["Budrigë e Epërme","Budrigë e Poshtme","Pasjan","Partesh"],
"Pejë":["Babiq","Baran","Bellopojë","Brestovik","Çallapek","Drelaj","Gllaviçicë","Gorazhdec","Haxhaj","Jabllanicë","Kliçinë","Kuqishtë","Lëvoshë","Loxhë","Nabërgjan","Novosellë","Peçaj","Raushiq","Rugovë","Sverkë"],
"Podujevë":["Balloc","Bradash","Brecë","Dumnicë","Gllamnik","Gërgur","Kërpimeh","Luzhnicë","Murgull","Orllan","Pakashticë","Podujevë","Pollatë","Sallabajë","Sfeçël","Turuqicë"],
"Prishtinë":["Bardhosh","Barilevë","Besi","Bërnicë e Epërme","Bërnicë e Poshtme","Çagllavicë","Hajvalia","Keçekollë","Koliq","Kukaj","Llukar","Marec","Makoc","Prugoc","Sharban","Slivovë","Sofali","Trudë"],
"Prizren":["Atmaxhë","Billushë","Caparc","Drajçiq","Gorozhub","Grazhdanik","Jabllanicë","Jeshkovë","Korishë","Kushnin","Landovicë","Lubizhdë","Lubinjë e Epërme","Lubinjë e Poshtme","Mushnikovë","Nashec","Novak","Petrovë","Piranë","Poslishtë","Randobravë","Reçan","Romajë","Sërbicë","Smaç","Velezhë","Vërmicë","Zhur"],
"Ranillug":["Bozhevc","Domoroc","Gornja Budriga","Korminjan","Pançelo","Petrovc","Ranillug","Ropotovë"],
"Skënderaj":["Acarevë","Aqarevë","Baks","Bajë","Burojë","Çirez","Dashec","Drenicë","Dushk","Izbicë","Klinë e Epërme","Kllodernicë","Kopiliq","Kotor","Llaushë","Likoc","Lubovec","Marinë","Murgë","Polac","Prekaz i Epërm","Prekaz i Poshtëm","Runik","Tërnavc"],
"Shtime":["Belincë","Carralevë","Davidoc","Devetak","Duga","Godanc","Gllavicë","Koshare","Mollopolc","Muzeqinë","Nishor","Petrovë","Reçak","Topillë","Vojnovc"],
"Shtërpcë":["Berevc","Biti e Epërme","Biti e Poshtme","Brodi","Drekoc","Firajë","Gotovushë","Jazhincë","Shtërpcë","Sevcë","Vičë"],
"Suharekë":["Bllacë","Bukosh","Budakovë","Breshanc","Delloc","Duhël","Dubravë","Duhël e Madhe","Gjinoc","Greikoc","Javor","Kasterc","Krushicë","Leshan","Mushitisht","Nishor","Popolan","Reqan","Sallagrazhdë","Savrovë","Semetisht","Studençan","Tërrnje"],
"Ferizaj":["Bablak","Bërnicë","Cërnillë","Dardani","Doganaj","Dramjak","Ferizaj","Greme","Greme","Jezerc","Koshare","Kosinë","Komogllavë","Mirosalë","Nerodime e Epërme","Nerodime e Poshtme","Pleshinë","Prelez i Jerlive","Sazli","Sojevë","Talinc","Theqaf","Varosh","Zaskok"],
"Viti":["Beguncë","Binçë","Budrikë e Epërme","Budrikë e Poshtme","Cërnicë","Drobesh","Gërmovë","Kabash","Letnicë","Lubishtë","Mogillë","Podgorcë","Pozheran","Remnik","Sadovinë e Çerkezëve","Sllatinë e Epërme","Smirë","Stubëll","Tërpezë","Viti","Zhiti"],
"Vushtrri":["Akrashticë","Banjskë","Beçiq","Bukosh","Druar","Duboc","Galicë","Gracë","Gojbulë","Karaqë","Karaqicë","Lummadh","Maxhunaj","Mihaliq","Nadakoc","Pantinë","Pasomë","Prelluzhë","Samadraxhë","Sfaraçak","Skromë","Studime e Epërme","Studime e Poshtme","Shtruzhë"],
"Zubin Potok":["Banjë","Bube","Çabër","Gazivodë","Ibër","Jagnjenicë","Kërligatë","Kovaçë","Prelez","Rudine","Sërrboc","Ujman","Zubin Potok"],
"Zveçan":["Banjska","Banjskë","Banjicë","Boletin","Graboc","Kelmend","Kozarevë","Leposaviq","Lipë","Llokvë","Mitrovicë e Veriut","Prilep","Rudare","Suhodoll","Zhazhë"],
"Graçanicë":["Çagllavicë","Dobrotin","Laplje Selo","Livagjë","Preoc","Skulanevë","Sushicë","Uglar","Ugljare"],
"Hani i Elezit":["Dimcë","Gorancë","Paldenicë","Pustenik","Rezhancë"],
"Junik":["Gjocaj","Jasiq","Junik"],
"Kllokot":["Mogillë","Grnçar","Vërboc","Kllokot"],
"Mamushë":["Mamushë","Studençan i Mamushës"]
};

function fillSettlements(){
 const s=$("#settlement"),city=$("#city");if(!s||!city)return;
 const municipality=city.value;const values=SETTLEMENTS[municipality]||[];
 s.innerHTML='<option value="">Zgjidh fshatin / vendbanimin…</option>'+values.map(v=>'<option>'+esc(v)+'</option>').join("");
}

function coordsForCity(city){return MUNICIPALITY_COORDS[city]||[42.6,20.9]}
function setPicker(lat,lng,zoom=13){
 if(!pickerMap)return;
 pickerMap.setView([lat,lng],zoom);
 if(pickerMarker)pickerMarker.setLatLng([lat,lng]);
 else pickerMarker=L.marker([lat,lng],{draggable:true}).addTo(pickerMap);
 $("#latitude").value=lat.toFixed(6);$("#longitude").value=lng.toFixed(6);
 pickerMarker.on("dragend",()=>{const p=pickerMarker.getLatLng();$("#latitude").value=p.lat.toFixed(6);$("#longitude").value=p.lng.toFixed(6)});
}
function initMaps(){
 if(!window.L)return;
 map=L.map("map").setView([42.6,20.9],8);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(map);
 markers=L.layerGroup().addTo(map);
 pickerMap=L.map("pickerMap").setView([42.6,20.9],8);L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(pickerMap);
 pickerMap.on("click",e=>setPicker(e.latlng.lat,e.latlng.lng,15));
 setTimeout(()=>{map.invalidateSize();pickerMap.invalidateSize()},250);
}
function renderMap(list=shops){
 if(!map||!markers)return;markers.clearLayers();
 const points=[];
 list.filter(x=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)).forEach(x=>{
  const marker=L.marker([x.latitude,x.longitude]).bindPopup('<div class="popup-title">'+esc(x.name)+'</div><div class="popup-city">📍 '+esc(x.settlement?x.settlement+", ":"")+esc(x.city)+'</div><div class="popup-price">'+money(summary(x.id).total?summary(x.id).avg:x.price)+'</div>');
  marker.addTo(markers);points.push([x.latitude,x.longitude]);
 });
 if(points.length)map.fitBounds(points,{padding:[25,25],maxZoom:13});
}
async function load(){
 try{
  const [rows,rs]=await Promise.all([window.supabaseApi.list(),window.supabaseApi.ratings()]);
  shops=rows.map(x=>({id:x.id,name:x.name,city:x.city,settlement:x.settlement||"",latitude:Number(x.latitude),longitude:Number(x.longitude),price:Number(x.price),water:x.water_served?"yes":"no",note:x.note||"",createdAt:new Date(x.created_at).getTime()}));
  ratings=rs.map(x=>({id:x.id,shopId:x.coffee_shop_id,water:x.water_served,price:Number(x.price),createdAt:new Date(x.created_at).getTime()}));render();
 }catch(e){console.error(e);$("#stats").textContent="Nuk u lidh me bazën e të dhënave."}
}
function summary(id){const r=ratings.filter(x=>x.shopId===id),yes=r.filter(x=>x.water).length;return{total:r.length,yes,no:r.length-yes,avg:r.length?r.reduce((a,x)=>a+x.price,0)/r.length:0}}
function render(){
 const q=$("#search").value.trim().toLowerCase(),sort=$("#sort").value;
 let list=shops.filter(x=>(water==="all"||x.water===water)&&(!q||x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q)||(x.settlement||"").toLowerCase().includes(q)));
 list.sort((a,b)=>sort==="low"?(summary(a.id).total?summary(a.id).avg:a.price)-(summary(b.id).total?summary(b.id).avg:b.price):sort==="high"?(summary(b.id).total?summary(b.id).avg:b.price)-(summary(a.id).total?summary(a.id).avg:a.price):sort==="name"?a.name.localeCompare(b.name):b.createdAt-a.createdAt);
 $("#stats").textContent=shops.length+" lokale • "+ratings.length+" vlerësime";
 $("#list").innerHTML=list.map(x=>{const r=summary(x.id),balanced=r.total>0&&r.yes===r.no;return '<article class="card" data-open-rating="'+x.id+'"><div class="cardtop"><div><h3>'+esc(x.name)+'</h3><div class="city">📍 '+esc(x.settlement?x.settlement+", ":"")+esc(x.city)+'</div></div><div class="price">'+money(r.total?r.avg:x.price)+'</div></div><div class="ratingbox"><b>'+r.total+' vlerësime</b><span>💧 Po: '+r.yes+'</span><span>🚫 Jo: '+r.no+'</span></div><span class="water '+(r.yes>=r.no?"yes":"no")+'">'+(balanced?"⚠️ Mund të mos shërbehet ujë":(r.yes>=r.no?"💧 Kryesisht me ujë":"🚫 Kryesisht pa ujë"))+'</span>'+(x.note?'<p class="note">'+esc(x.note)+'</p>':"")+'<div class="date">'+(r.total?"Çmimi mesatar: "+money(r.avg):"Çmimi i listuar: "+money(x.price))+'</div><button class="ratebtn" data-rate="'+x.id+'">＋ Shto vlerësimin tim</button></article>'}).join("");
 $("#empty").classList.toggle("hidden",!list.length);$$("[data-rate]").forEach(b=>b.onclick=e=>{e.stopPropagation();openRating(+b.dataset.rate)});$$("[data-open-rating]").forEach(c=>c.onclick=()=>openRating(+c.dataset.openRating));renderMap(list);
}
function openModal(){ $("#modal").classList.remove("hidden");$("#form input")?.focus();fillSettlements();const p=coordsForCity($("#city").value);setPicker(p[0],p[1],$("#city").value?12:8);setTimeout(()=>pickerMap?.invalidateSize(),100)}
function closeModal(){$("#modal").classList.add("hidden");$("#form").reset();fillSettlements()}
function openRating(id){ratingShop=shops.find(x=>x.id===id);if(!ratingShop)return;$("#ratingTitle").textContent=ratingShop.name;$("#ratingModal").classList.remove("hidden");$("#ratingForm").reset();$("#ratingPrice").focus()}
function closeRating(){$("#ratingModal").classList.add("hidden");ratingShop=null}
$("#addTop").onclick=openModal;$$("[data-close]").forEach(x=>x.onclick=closeModal);$$("[data-rating-close]").forEach(x=>x.onclick=closeRating);
$("#search").oninput=render;$("#sort").onchange=render;$("#city").onchange=()=>{fillSettlements();const p=coordsForCity($("#city").value);setPicker(p[0],p[1],12)};
$("#settlement").onchange=()=>{if(!$("#settlement").value)return;const p=coordsForCity($("#city").value);setPicker(p[0],p[1],14)};
$$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");water=b.dataset.water;render()});
$("#form").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);try{const lat=f.get("latitude"),lng=f.get("longitude");await window.supabaseApi.add({name:f.get("name").trim(),city:f.get("city"),settlement:f.get("settlement")||null,price:Number(f.get("price")),water_served:f.get("water")==="yes",note:f.get("note").trim(),latitude:lat?Number(lat):null,longitude:lng?Number(lng):null});closeModal();await load();toast("Lokali u shtua në Kafja ✓")}catch(err){console.error(err);alert("Nuk u shtua lokali.")}};
$("#ratingForm").onsubmit=async e=>{e.preventDefault();if(!ratingShop)return;const f=new FormData(e.target);try{await window.supabaseApi.addRating({coffee_shop_id:ratingShop.id,water_served:f.get("water")==="yes",price:Number(f.get("price"))});closeRating();await load();toast("Vlerësimi u shtua ✓")}catch(err){console.error(err);alert("Nuk u shtua vlerësimi.")}};
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
initMaps();fillSettlements();load();