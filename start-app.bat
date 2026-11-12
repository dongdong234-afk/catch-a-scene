@echo off
setlocal
cd /d "%~dp0"
if "%OPENAI_API_KEY%"=="" (
  echo OPENAI_API_KEY is not set. Demo features still work, but AI analysis needs the key.
)
start "Catch a Scene" http://localhost:3000
node server.js
