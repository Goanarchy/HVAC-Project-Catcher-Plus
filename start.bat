@echo off
setlocal
cd /d "%~dp0"
set "URL=file:///%~dp0index.html"
set "URL=%URL:\=/%"
where msedge >nul 2>nul && (
  start "" "msedge" --app="%URL%" --profile-directory=Default
  exit /b
)
where chrome >nul 2>nul && (
  start "" "chrome" --app="%URL%"
  exit /b
)
start "" "%~dp0index.html"
exit /b
