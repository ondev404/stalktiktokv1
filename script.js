const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const I={
id:{eyebrow:"PUBLIC PROFILE",title:"TikTok Profile",scan:"SCAN",ready:"Masukkan username untuk melihat profil.",scanning:"MEMINDAI...",tryAgain:"Coba username lain.",public:"PUBLIK",followers:"PENGIKUT",following:"MENGIKUTI",hearts:"HATI",videos:"VIDEO",friends:"TEMAN",account:"AKUN",created:"AKUN DIBUAT",modified:"NAMA TERAKHIR DIUBAH",copied:"Username disalin!"},
en:{eyebrow:"PUBLIC PROFILE",title:"TikTok Profile",scan:"SCAN",ready:"Enter a username to see the profile.",scanning:"SCANNING...",tryAgain:"Try another username.",public:"PUBLIC",followers:"FOLLOWERS",following:"FOLLOWING",hearts:"HEARTS",videos:"VIDEOS",friends:"FRIENDS",account:"ACCOUNT",created:"ACCOUNT CREATED",modified:"NICKNAME MODIFIED",copied:"Username copied!"}
};
let lang="id", last="";
function tr(){document.documentElement.lang=lang;$$("[data-i18n]").forEach(e=>e.textContent=I[lang][e.dataset.i18n]);}
$$("[data-lang]").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;$$("[data-lang]").forEach(x=>x.classList.toggle("active",x===b));tr()});
$("#theme").onclick=()=>{document.body.classList.toggle("dark");$("#theme").textContent=document.body.classList.contains("dark")?"☾":"☼"};
function state(s){["empty","loading","error","result"].forEach(x=>$("#"+x).classList.toggle("hidden",x!==s))}
function toast(t){$("#toast").textContent=t;$("#toast").classList.add("show");setTimeout(()=>$("#toast").classList.remove("show"),1500)}
function count(id,val){const e=$("#"+id), raw=String(val??"0"), m=raw.match(/[\d.,]+/);if(!m){e.textContent=raw;return}const n=parseInt(m[0].replace(/[.,]/g,""),10);if(!Number.isFinite(n)){e.textContent=raw;return}const suf=raw.slice(m[0].length),st=performance.now();function f(t){let p=Math.min(1,(t-st)/550);e.textContent=Math.floor(n*(1-Math.pow(1-p,3))).toLocaleString("en-US")+suf;if(p<1)requestAnimationFrame(f)}requestAnimationFrame(f)}
function fill(d){
$("#name").textContent=d.name||d.username||"Unknown";$("#handle").textContent="@"+(d.username||"");$("#avatar").src=d.photoProfile||"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500"><rect width="100%" height="100%" fill="#5ce1e6"/><text x="50%" y="55%" text-anchor="middle" font-size="120" font-family="Arial" font-weight="900">?</text></svg>`);
$("#open").href="https://www.tiktok.com/@"+encodeURIComponent(d.username||"");["followers","following","hearts","videos","friends"].forEach(k=>count(k,d[k]));$("#created").textContent=d.accountCreated||"N/A";$("#modified").textContent=d.nicknameLastModified||"N/A";$("#updated").textContent=new Date().toLocaleTimeString(lang==="id"?"id-ID":"en-US",{hour:"2-digit",minute:"2-digit"});
$("#copy").onclick=async()=>{try{await navigator.clipboard.writeText("@"+d.username);toast(I[lang].copied)}catch{toast("@"+d.username)}};
}
async function stalk(u){state("loading");last=u;const b=$("#scan");b.disabled=true;try{const r=await fetch("/api/tiktok-stalk",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u})}),j=await r.json();if(!r.ok||!j.status)throw Error(j.message||"Unable to fetch profile.");fill(j.data);state("result")}catch(e){$("#errorMsg").textContent=e.message;state("error")}finally{b.disabled=false}}
$("#form").onsubmit=e=>{e.preventDefault();const u=$("#username").value.trim().replace(/^@/,"");if(!u){$("#username").focus();return}stalk(u)};
$("#retry").onclick=()=>last?stalk(last):state("empty");
$("#username").oninput=e=>e.target.value=e.target.value.replace(/\s/g,"");
tr();state("empty");

// ===== ACCESS GATE =====
// Edit these two URLs to your own channel / sharing destination.
const GATE_CONFIG = {
  channelUrl: "https://whatsapp.com/channel/0029Vb6o7sgGU3BKw965Ti0o",
  shareText: "Cek profil TikTok ini di NEOTIK: " + window.location.origin
};

(function setupGate(){
  const modal = document.createElement("div");
  modal.id = "accessGate";
  modal.innerHTML = `
    <div class="gate-backdrop"></div>
    <div class="gate-modal">
      <div class="gate-logo">NT<span>✦</span></div>
      <div class="gate-kicker">NEOTIK / ACCESS</div>
      <h2>UNLOCK<br><em>NEOTIK.</em></h2>
      <p id="gateDesc">Untuk masuk, lakukan 2 langkah di bawah.</p>
      <div class="gate-steps">
        <button class="gate-action" id="followGate"><span>01</span><b>FOLLOW SALURAN</b><i>↗</i></button>
        <button class="gate-action" id="shareGate"><span>02</span><b>SHARE KE TEMAN</b><i>↗</i></button>
      </div>
      <div class="gate-progress"><i id="gateBar"></i></div>
      <small id="gateStatus">0 / 2 COMPLETE</small>
      <button id="unlockGate" class="unlock" disabled>UNLOCK →</button>
      <div class="gate-note">Public profile data • No password required</div>
    </div>`;
  document.body.appendChild(modal);

  let followed=false, shared=false;
  const follow=()=>{ followed=true; window.open(GATE_CONFIG.channelUrl,"_blank","noopener"); update(); };
  const share=async()=>{
    shared=true;
    const data={title:"NEOTIK",text:GATE_CONFIG.shareText,url:window.location.origin};
    try{
      if(navigator.share) await navigator.share(data);
      else window.open("https://wa.me/?text="+encodeURIComponent(GATE_CONFIG.shareText)," _blank");
    }catch(_){}
    update();
  };
  function update(){
    const n=(followed?1:0)+(shared?1:0);
    $("#gateStatus").textContent=`${n} / 2 COMPLETE`;
    $("#gateBar").style.width=(n*50)+"%";
    $("#unlockGate").disabled=n<2;
    if(followed) $("#followGate").classList.add("done");
    if(shared) $("#shareGate").classList.add("done");
  }
  $("#followGate").onclick=follow;
  $("#shareGate").onclick=share;
  $("#unlockGate").onclick=()=>{
    modal.classList.add("closing");
    localStorage.setItem("neotik_gate_v3","1");
    setTimeout(()=>modal.remove(),350);
  };
  // Gate is shown on every fresh browser session; remove this check if you want it every visit.
  if(localStorage.getItem("neotik_gate_v3")==="1") modal.remove();
})();
