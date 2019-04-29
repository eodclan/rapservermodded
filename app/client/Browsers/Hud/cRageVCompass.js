var text;
var zone;
var street;

function updateDirectionText() {
    let cam = mp.cameras.new("gameplay");
    var cameraDirection = cam.getDirection();

    if (0.3 < cameraDirection.x && 0.3 < cameraDirection.y) text = "NE";
    else if (cameraDirection.x < -0.3 && 0.3 < cameraDirection.y) text = "NW";
    else if (0.3 < cameraDirection.x && cameraDirection.y < -0.3) text = "SE";
    else if (cameraDirection.x < -0.3 && cameraDirection.y < -0.3) text = "SW";
    else if (-0.3 < cameraDirection.x && cameraDirection.x < 0.3 && cameraDirection.y < -0.3) text = "S";
    else if (cameraDirection.x < -0.3 && -0.3 < cameraDirection.y && cameraDirection.y < 0.3) text = "W";
    else if (0.3 < cameraDirection.x && -0.3 < cameraDirection.y && cameraDirection.y < 0.3) text = "E";
    else if (-0.3 < cameraDirection.x && cameraDirection.x < 0.3 && cameraDirection.y > 0.3) text = "N";
}

function updateValues() {
    zone = mp.game.zone.getNameOfZone(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z);
    let hashes = mp.game.pathfind.getStreetNameAtCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0, 0);
    street = mp.game.ui.getStreetNameFromHashKey(hashes.streetName);
    updateDirectionText();
}

setInterval(() => {
    updateValues();
}, 1000);

mp.events.add('render', () => {
    if (text) {
        mp.game.graphics.drawText(text, [0.225, 0.95], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.6, 0.6],
            outline: true
        });
    
        mp.game.graphics.drawText("|", [0.255, 0.95], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.6, 0.6],
            outline: true
        });
    
        mp.game.graphics.drawText(street, [0.320, 0.94925], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.3, 0.3],
            outline: true
        });
    
        mp.game.graphics.drawText(zone, [0.320, 0.97], {
            font: 0,
            color: [255, 255, 255, 185],
            scale: [0.25, 0.25],
            outline: true
        });
    }
});
