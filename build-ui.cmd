cd src\Kasbah.Web.Admin.UI
cmd.exe /c npm install
cmd.exe /c npm run deploy
cd ..\..
cmd /c rimraf src\Kasbah.Web.Admin.UI
