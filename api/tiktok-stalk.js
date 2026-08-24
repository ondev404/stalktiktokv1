const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({status:false,message:"Method not allowed."});

  try {
    const cleanUsername = String(req.body?.username || "").trim().replace(/^@/, "");
    if (!cleanUsername) return res.status(400).json({status:false,message:"Username harus diisi."});

    const url = `https://user.tikmatrix.com/?username=${encodeURIComponent(cleanUsername)}`;
    const {data} = await axios.get(url, {
      headers: {
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language":"en-US,en;q=0.9",
        "Referer":"https://user.tikmatrix.com/"
      },
      timeout:10000
    });

    const $ = cheerio.load(data);
    if ($(".user-card").length === 0)
      return res.status(404).json({status:false,message:`User '${cleanUsername}' tidak ditemukan.`});

    const photoProfile =
      $("img.user-avatar").attr("src") ||
      $('meta[property="og:image"]').attr("content") || null;

    const name = $("h2.user-name").text().trim() || null;
    const userHandle = $("p.user-handle").text().trim().replace(/^@/,"") || cleanUsername;

    let followers="0", following="0", hearts="0", videos="0", friends="0";
    $(".stat-card").each((_,el)=>{
      const num=$(el).find(".stat-number").text().trim();
      const label=$(el).find(".stat-label").text().trim().toLowerCase();
      if(label.includes("followers")) followers=num;
      else if(label.includes("following")) following=num;
      else if(label.includes("hearts")||label.includes("likes")) hearts=num;
      else if(label.includes("videos")) videos=num;
      else if(label.includes("friends")) friends=num;
    });

    let accountCreated="N/A", nicknameLastModified="N/A";
    $(".detail-item").each((_,el)=>{
      const label=$(el).find(".detail-label").text().trim().toLowerCase();
      const clone=$(el).find(".detail-value").clone();
      clone.find(".copy-icon").remove();
      const value=clone.text().trim();
      if(label.includes("account created")) accountCreated=value;
      else if(label.includes("nickname last modified")) nicknameLastModified=value;
    });

    return res.status(200).json({
      status:true,
      data:{photoProfile,username:userHandle,name,followers,following,hearts,videos,friends,accountCreated,nicknameLastModified}
    });
  } catch(error) {
    console.error(error);
    return res.status(500).json({status:false,message:error.message||"Terjadi kesalahan saat mengambil data."});
  }
};