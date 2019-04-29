"use strict";

mp.events.add('render', () => {
    mp.game.graphics.drawText("Rage V: ~b~ALPHA ~w~www.ragev.de", [0.5, 0.97], { 
        font: 7, 
        color: [255, 255, 255, 185], 
        scale: [0.3, 0.3], 
        outline: true
    });
});
