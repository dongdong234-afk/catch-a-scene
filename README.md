# Catch a Scene (OpenAI 버전)

영화 대사나 노래를 입력하면 맥락과 숨은 의미를 해석해 주고, 표현을 영상과 퀴즈로 익히는 영어 학습 앱이에요. AI 해석은 OpenAI API를 써요.

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 화면 전체 (HTML, CSS, JS 한 파일) |
| `api/ask.js` | 영화·노래 해석을 OpenAI API에 요청 (웹 검색 포함) |
| `api/verify.js` | YouTube 영상이 실제로 있고 앱 안에서 재생 가능한지 확인 |
| `server.js` | 내 컴퓨터에서 실행할 때 쓰는 서버 (Vercel에서는 안 쓰여요) |
| `vercel.json` | Vercel 배포 설정 |
| `package.json` | 프로젝트 정보, `npm start`로 server.js 실행 |

`index.html`만 따로 열면 화면과 영상 레슨, 퀴즈는 보이지만 AI 해석과 영상 검사는 동작하지 않아요. 서버(`api` 폴더)와 함께 실행해야 해요.

## OpenAI API 키 만들기

1. platform.openai.com 에 로그인해요.
2. **API keys** 메뉴에서 **Create new secret key**를 눌러 키를 만들고 복사해요. 키는 이때 한 번만 보여요.
3. **Billing**에서 결제 수단을 등록하고, **Limits**에서 월 사용 한도를 정해 두세요.

## 방법 1. Vercel에 배포하기

1. 이 폴더의 파일을 `api` 폴더까지 그대로 올려서 배포해요.
2. Vercel 프로젝트 → **Settings → Environment Variables**에서 아래 값을 추가해요.
   - Name: `OPENAI_API_KEY`
   - Value: 복사한 키
3. **Deployments**에서 최신 배포의 ⋯ 메뉴 → **Redeploy**를 눌러요.

배포된 주소에서는 YouTube 영상이 앱 안에서 재생되고, 재생할 수 없는 영상은 목록에서 자동으로 빠져요.

## 방법 2. 내 컴퓨터에서 실행하기

Node.js 18 이상이 필요해요. 추가로 설치할 패키지는 없어요.

```bash
# macOS / Linux
OPENAI_API_KEY=sk-여기에키 node server.js

# Windows PowerShell
$env:OPENAI_API_KEY="sk-여기에키"; node server.js
```

브라우저에서 http://localhost:3000 을 열면 돼요.

## 설정 바꾸기

| 환경 변수 | 기본값 | 설명 |
|---|---|---|
| `OPENAI_API_KEY` | 없음 (필수) | OpenAI API 키 |
| `OPENAI_MODEL` | `gpt-5-mini` | 사용할 모델. 계정에서 쓸 수 있는 모델 이름으로 바꿀 수 있어요. |

웹 검색 도구를 지원하지 않는 모델이면 자동으로 검색 없이 해석해요.

## 주의할 점

- 사이트 주소를 아는 사람은 누구나 해석 기능을 쓸 수 있고, 비용은 키 주인에게 청구돼요. 월 사용 한도를 꼭 정해 두세요.
- API 키를 `index.html`이나 GitHub에 직접 적지 마세요. 환경 변수로만 넣어야 안전해요.
- 저장한 표현과 해석은 각 사용자의 브라우저에 저장돼요. 다른 기기에서는 이어지지 않아요.
- 영상 구간은 대략적인 위치예요. 영어 자막은 YouTube가 띄워요.
- 노래 해석은 저작권 때문에 가사를 짧게만 인용하도록 AI에 지시해 두었어요.
