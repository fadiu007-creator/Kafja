const SUPABASE_URL="https://saavqlbwffrwxingbnri.supabase.co";
const SUPABASE_KEY="sb_publishable_IruAYNoelmN7N4Q1Hy2HFg_wxw-1zgS";
const authClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
async function sb(path,options={}){
 const session=(await authClient.auth.getSession()).data.session;
 const token=session?.access_token||SUPABASE_KEY;
 const res=await fetch(SUPABASE_URL+"/rest/v1/"+path,{...options,headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+token,"Content-Type":"application/json",...(options.headers||{})}});
 if(!res.ok) throw new Error(await res.text());
 return res.status===204?null:res.json();
}
window.supabaseApi={
 list:()=>sb("coffee_shops?select=id,name,city,price,water_served,note,created_at&order=created_at.desc"),
 add:(x)=>sb("coffee_shops",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(x)}),
 ratings:()=>sb("coffee_shop_ratings?select=id,coffee_shop_id,water_served,price,created_at&order=created_at.desc"),
 addRating:(x)=>sb("coffee_shop_ratings",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify(x)}),
 adminRatings:()=>sb("coffee_shop_ratings?select=id,coffee_shop_id,water_served,price,created_at,coffee_shops(name,city)&order=created_at.desc&limit=50"),
 updateShop:(id,x)=>sb("coffee_shops?id=eq."+id,{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify(x)}),
 deleteShop:(id)=>sb("coffee_shops?id=eq."+id,{method:"DELETE"}),
 deleteRating:(id)=>sb("coffee_shop_ratings?id=eq."+id,{method:"DELETE"}),
 signIn:(email,password)=>authClient.auth.signInWithPassword({email,password}),
 signOut:()=>authClient.auth.signOut(),
 isAdmin:async()=>{const {data,error}=await authClient.rpc("kafja_is_admin");if(error)throw error;return data===true}
};