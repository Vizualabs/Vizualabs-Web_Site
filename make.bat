@echo off
rem ============================================================================
rem  Vizualabs - Official Website  |  make.bat
rem
rem  Windows CMD replacement for the Makefile. Same commands:
rem    make.bat <command>
rem ============================================================================

setlocal
set "COMMAND=%~1"

if "%COMMAND%"==""             goto :help
if /i "%COMMAND%"=="help"      goto :help
if /i "%COMMAND%"=="start"     goto :start
if /i "%COMMAND%"=="install"   goto :install
if /i "%COMMAND%"=="dev"       goto :dev
if /i "%COMMAND%"=="build"     goto :build
if /i "%COMMAND%"=="preview"   goto :preview
if /i "%COMMAND%"=="routes"    goto :routes
if /i "%COMMAND%"=="typecheck" goto :typecheck
if /i "%COMMAND%"=="test"      goto :test
if /i "%COMMAND%"=="test-ui"   goto :test_ui
if /i "%COMMAND%"=="clean"     goto :clean
if /i "%COMMAND%"=="env"       goto :env

echo Unknown command: %COMMAND%
echo.
goto :help

:help
echo.
echo   Vizualabs - Official Website
echo   ================================================
echo   Usage: make.bat ^<command^>
echo.
echo   Commands:
echo     start        One-shot setup: install deps + env, then run dev
echo     install      Install dependencies (bun install)
echo     dev          Start the dev server (http://localhost:3000)
echo     build        Build the app for production
echo     preview      Preview the production build locally
echo     routes       Regenerate the TanStack Router route tree
echo     typecheck    Run TypeScript type checking (tsc --noEmit)
echo     test         Run Playwright end-to-end tests
echo     test-ui      Run Playwright tests in UI mode
echo     clean        Remove build artifacts (dist, test-results, .tanstack)
echo     env          Copy .env.example -^> .env (if missing)
echo.
exit /b 0

:start
if not exist node_modules (
  echo Installing dependencies...
  bun install
  if errorlevel 1 exit /b %errorlevel%
)
if not exist .env (
  echo Creating .env from .env.example
  copy .env.example .env
)
bun --bun run dev
exit /b %errorlevel%

:install
bun install
exit /b %errorlevel%

:dev
bun --bun run dev
exit /b %errorlevel%

:build
bun --bun run build
exit /b %errorlevel%

:preview
bun run preview
exit /b %errorlevel%

:routes
bun run generate-routes
exit /b %errorlevel%

:typecheck
bunx tsc --noEmit
exit /b %errorlevel%

:test
bun run test:e2e
exit /b %errorlevel%

:test_ui
bun run test:e2e:ui
exit /b %errorlevel%

:clean
if exist dist         rmdir /s /q dist
if exist test-results rmdir /s /q test-results
if exist .tanstack    rmdir /s /q .tanstack
echo Cleaned.
exit /b 0

:env
if exist .env (
  echo .env already exists.
) else (
  copy .env.example .env
  echo Created .env from .env.example
)
exit /b 0
