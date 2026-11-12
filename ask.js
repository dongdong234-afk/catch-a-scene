// Catch a Scene: 영화 대사·노래 해석 요청을 OpenAI API로 보내는 서버 함수
// 환경 변수 OPENAI_API_KEY 가 있어야 동작해요. 모델은 OPENAI_MODEL 로 바꿀 수 있어요.
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
// 웹 검색 도구 이름 후보 (계정·모델에 따라 지원 이름이 달라서 차례로 시도)
const SEARCH_TOOLS = ['web_search', 'web_search_preview', null];

async function callOpenAI(key, prompt, toolType) {
  const body = { model: MODEL, input: prompt };
  if (toolType) body.tools = [{ type: toolType }];
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

function outputText(data) {
  if (typeof data.output_text === 'string' && data.output_text) return data.output_text;
  return (data.output || [])
    .filter(item => item.type === 'message')
    .flatMap(item => item.content || [])
    .filter(c => c.type === 'output_text' && typeof c.text === 'string')
    .map(c => c.text)
    .join('');
}

module.exports = async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (req.method === 'GET') return res.status(200).json({ ready: !!key });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!key) return res.status(501).json({ error: 'OPENAI_API_KEY is not set' });

  const { prompt, search } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 12000) {
    return res.status(400).json({ error: 'invalid prompt' });
  }
  try {
    const tools = search ? SEARCH_TOOLS : [null];
    let out;
    for (const t of tools) {
      out = await callOpenAI(key, prompt, t);
      // 검색 도구를 지원하지 않아 생긴 400 오류면 다음 후보로 다시 시도
      if (out.ok || out.status !== 400 || !t) break;
    }
    if (!out.ok) {
      const msg = (out.data.error && out.data.error.message) || 'upstream error';
      return res.status(out.status === 429 ? 429 : 502).json({ error: msg });
    }
    return res.status(200).json({ text: outputText(out.data) });
  } catch (e) {
    return res.status(502).json({ error: 'request failed' });
  }
};
