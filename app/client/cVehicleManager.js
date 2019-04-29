let UI = null;
let vehSeat, Engine, Lock;
let state = 0;
let localPlayer = mp.players.local;

mp.events.add({

    'playerEnterVehicle': () => { },

    'doorControl': (door) => {
        if (localPlayer.vehicle) {
            if (localPlayer.vehicle.isDoorDamaged(door)) return mp.game.graphics.notify(`This Door is ~r~Damaged ~w~Please fix the Door.`);
            (localPlayer.vehicle.getDoorAngleRatio(door) > 0.1 ? localPlayer.vehicle.setDoorShut(door, false) : localPlayer.vehicle.setDoorOpen(door, false, false))
        }
    },

    'Set': (type, state) => {


        switch (type) {


            case 'seatbelt':
                if (state === 'true') {
                    localPlayer.setConfigFlag(32, false);
                    mp.game.graphics.notify('Sicherheitsgurt ~g~ANGELEGT')
                } else {
                    localPlayer.setConfigFlag(32, true);
                    mp.game.graphics.notify('Sicherheitsgurt ~r~ABGELEGT')
                }
                break;

            case 'engine':
                if (state === 'true') {
                    mp.game.graphics.notify('Motor ~g~AN')
                    localPlayer.vehicle.setEngineOn(true, true, false);
                } else {
                    mp.game.graphics.notify('Motor ~r~AUS')
                    localPlayer.vehicle.setEngineOn(false, true, true);
                }
                break;

            case 'lights':
                if (state === 'true') {
                    localPlayer.vehicle.setLights(0);
                    mp.game.graphics.notify('Licht ~g~AN')
                } else {
                    mp.game.graphics.notify('Licht ~r~AUS')
                    localPlayer.vehicle.setLights(1);
                }
        }
    }
})

mp.keys.bind(0x42, true, _ => {
    if (state === 0 && localPlayer.vehicle) {
        if (UI === null) {
            mp.gui.cursor.visible = true;
            UI = mp.browsers.new('package://RageV/Browsers/VehManager/Manager/VehManager.html')
            state = 1;
            updateStatus();
        } else {
            mp.gui.cursor.visible = true;
            state = 1
            UI.execute("$('body').fadeIn('fast')");
            updateStatus();
        }
    } else if (state === 1 && localPlayer.vehicle) {
        mp.gui.cursor.visible = false;
        state = 0;
        UI.execute("$('body').fadeOut('fast')");
    }

});

function updateStatus() {
    if (UI && localPlayer.vehicle) {
        Engine = localPlayer.vehicle.getIsEngineRunning() ? true : false;
        let {
            lightsOn,
            highbeamsOn
        } = localPlayer.vehicle.getLightsState(0, 0);
        let seatbelt = localPlayer.getConfigFlag(32, true);

        if (Engine) {
            UI.execute(`$('#engine').prop('checked', true)`)
        } else {
            UI.execute(`$('#engine').prop('checked', false)`)
        }

        if (lightsOn === 0) {
            UI.execute(`$('#lights').prop('checked', false)`)
        } else {
            UI.execute(`$('#lights').prop('checked', true)`)
        }

        if (seatbelt === 0) {
            UI.execute(`$('#seatbelt').prop('checked', true)`)
        } else {
            UI.execute(`$('#seatbelt').prop('checked', false)`)
        }
    }
}