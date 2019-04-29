const misc = require('../cMisc');

mp.events.add({
	"cCheapCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RageV/Browsers/Business/CheapCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	},

	"cCommercialCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RageV/Browsers/Business/CommercialCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	},

	"cSuperCarDealership-OpenBuyerMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RageV/Browsers/Business/SuperCarDealership/ccd.html", lang);
		misc.injectCef(inject);
	}
});