"use strict";

const misc = require('../cMisc');

mp.events.add({
    "cTomatenCollector-OpenMainMenu" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RageV/Browsers/Jobs/TomatenCollector/collector.html", lang);
        misc.injectCef(inject);
    },
});       