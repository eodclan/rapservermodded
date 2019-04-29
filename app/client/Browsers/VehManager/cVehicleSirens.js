let vehicle, state, vehSeat = null;
let data = new Map();

mp.events.add('PlayerEnterVehicle', (player, vehicle, seat) => {

    vehicle = vehicle;

    if (classchecker()) {
        if (seat == 0) {
            vehSeat = 0;
            if (data.get(vehicle) === undefined) {
                data.set(vehicle, false);
            }
        }
    }
})


mp.keys.bind(0x42, true, _ => {
    if (vehicle && vehSeat == 0) {
        if (data.get(vehicle) == false) {
            data.set(vehicle, true);
            mp.game.graphics.notify(`Der Silent-Modus ist aktiviert.`);
            vehicle.setSirenSound(true);
        } else if (data.get(vehicle) == true) {
            data.set(vehicle, false);
            mp.game.graphics.notify(`Der Silent-Modus ist deaktiviert.`);
            vehicle.setSirenSound(false);
        }
    }
})

function classchecker() {

    let vehClass = vehicle.getClass();

    if (vehClass !== 18) {
        return false;
    }

    return true;

}