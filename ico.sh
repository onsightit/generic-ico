#!/bin/bash
echo "*** Starting web-wallet..."
#sudo npm install supervisor -g
supervisor --watch ico.js,lib,public,routes,views ico.js
