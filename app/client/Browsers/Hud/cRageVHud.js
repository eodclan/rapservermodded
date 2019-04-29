const misc = require('../../cMisc');

mp.events.add('render', () => {
	"cMoney-Update" : (lang, inject) => {
		misc.prepareToCef(500);
		misc.openCef("package://RageV/Browsers/Hud/hud.html", lang);
		misc.injectCef(inject);
	}
});
