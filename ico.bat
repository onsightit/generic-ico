@echo off
echo *** Starting web-wallet...
REM npm install supervisor -g
start /min supervisor --watch ico.js,lib,public,routes,views ico.js
timeout 5 > NUL
start "" http://localhost:8181/
exit
