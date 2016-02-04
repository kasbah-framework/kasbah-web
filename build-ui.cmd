cd %APPVEYOR_BUILD_FOLDER%

cd src\Kasbah.Web.Admin.UI
npm install
npm run deploy
cd ..\..
rimraf src\Kasbah.Web.Admin.UI
