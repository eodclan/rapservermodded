"use strict";

const misc = require('../cMisc');

mp.events.add({
	"cBusinnes-ShowMenu" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RageV/Browsers/Business/business.html", lang);
		misc.injectCef(inject);
	}
});
