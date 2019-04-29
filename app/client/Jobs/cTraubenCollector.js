"use strict";

const misc = require('../cMisc');

mp.events.add({
    "cTraubenCollector-OpenMainMenu" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RageV/Browsers/Jobs/TraubenCollector/collector.html", lang);
        misc.injectCef(inject);
    },
});       