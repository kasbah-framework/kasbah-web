all: restore public admin core

restore:
	dnu restore

public:
	dnu build --quiet src/Kasbah.Web.Public

admin:
	dnu build --quiet src/Kasbah.Web.Admin

ui:
	cd src/Kasbah.Web.Admin.UI; NODE_ENV=production npm run compile

core:
	dnu build --quiet src/Kasbah.Web
