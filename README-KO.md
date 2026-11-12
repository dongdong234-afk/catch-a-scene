# Catch a Scene

영화 대사와 노래 속 영어 표현을 장면·맥락·퀴즈로 배우는 앱입니다.

## 실행

1. Node.js 18 이상을 설치합니다.
2. `OPENAI_API_KEY` 환경변수를 설정합니다. 키가 없어도 예시 결과와 저장·퀴즈 기능은 사용할 수 있습니다.
3. `start-app.bat`을 더블클릭하거나 아래 명령을 실행합니다.

```powershell
node server.js
```

브라우저에서 `http://localhost:3000`을 열면 됩니다. 배포할 때는 포함된 `vercel.json`과 `api` 폴더를 그대로 사용하세요.

## Vercel에 공개 배포

이 프로젝트에는 로그인 기능이나 사용자 인증이 없습니다. Vercel에 배포하면 방문자는 회원가입·로그인 없이 바로 앱을 사용할 수 있습니다.

1. Vercel에서 **Add New → Project**를 선택합니다.
2. 이 폴더를 GitHub 저장소로 올리거나, `catch-a-scene-app.zip`을 압축 해제한 폴더를 연결합니다.
3. Project Settings → Environment Variables에 다음 값을 추가합니다.
   - 이름: `OPENAI_API_KEY`
   - 값: OpenAI API 키
4. Project Settings → Deployment Protection에서 Vercel Authentication 또는 보호 기능이 켜져 있다면 끕니다.
5. Deploy를 누르면 발급된 `vercel.app` 주소를 누구에게나 공유할 수 있습니다.

`OPENAI_API_KEY`는 서버 환경변수로만 사용되며 브라우저에 노출되지 않습니다. 다만 공개 앱이므로 방문자가 AI 분석을 사용할 때 API 비용이 발생할 수 있습니다. Vercel과 OpenAI 계정에서 사용량·한도를 설정해 주세요.

## 앱 설치

Chrome 또는 Edge에서 앱을 연 뒤 주소창의 설치 아이콘을 누르면 데스크톱·모바일 홈 화면에 앱으로 설치할 수 있습니다.
