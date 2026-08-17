@echo off
rem Double-click launcher: one command to start the full project.
rem Runs `make.bat start` (installs deps + .env if needed, then dev server).
cd /d "%~dp0"
call make.bat start
