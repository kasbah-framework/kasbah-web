@echo off
cd %~dp0

cd src\Kasbah.Web.Admin.UI
npm install
npm run deploy
cd ..\..
rimraf src\Kasbah.Web.Admin.UI
