const SUPABASE_URL="https://saavqlbwffrwxingbnri.supabase.co";
const SUPABASE_KEY="sb_publishable_IruAYNoelmN7N4Q1Hy2HFg_wxw-1zgS";
async function sb(path,options={}){
 const res=await fetch(SUPABASE_URL+"/rest/v1/"+path,{...options,headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY,"Content-Type":"application/json",...(options.headers||{})}});
 if(!res.ok) throw new Error(await res.text());
 return res.status===204?null:res.json();
}
window.supabaseApi={
 list:()=>sb("coffee_shops?select=id,name,city,price,water_served,note,created_at&order=created_at.desc"),
 add:(x)=>sb("coffee_shops",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(x)})
};