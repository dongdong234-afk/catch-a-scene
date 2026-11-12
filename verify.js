// Catch a Scene: YouTube 영상이 실제로 있고 다른 사이트에서 재생(퍼가기)이 허용됐는지 확인하는 서버 함수
// YouTube oEmbed 응답: 200 = 재생 가능, 401 = 퍼가기 금지, 404 = 없거나 비공개
module.exports = async (req, res) => {
  const ids = String((req.query && req.query.ids) || '')
    .split(',').filter(x => /^[A-Za-z0-9_-]{11}$/.test(x)).slice(0, 20);
  const out = {};
  await Promise.all(ids.map(async id => {
    try {
      const url = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id);
      const r = await fetch(url);
      if (r.ok) {
        const j = await r.json();
        out[id] = { ok: true, title: j.title, author: j.author_name };
      } else out[id] = { ok: false, status: r.status };
    } catch (e) {
      out[id] = { ok: false, status: 0 };
    }
  }));
  res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
  res.status(200).json(out);
};
