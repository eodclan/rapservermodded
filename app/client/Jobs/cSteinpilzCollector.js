"use strict";

const misc = require('../cMisc');

mp.events.add({
    "cSteinpilz-OpenMainMenu" : (lang, inject) => {
        misc.prepareToCef();
        misc.openCef("package://RageV/Browsers/Jobs/SteinpilzCollector/collector.html", lang);
        misc.injectCef(inject);
    },
});       