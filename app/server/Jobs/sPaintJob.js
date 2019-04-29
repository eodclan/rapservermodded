const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');


class PaintJob extends Job {
    constructor() {
        const d = { name: "Two Paints", x: 236.13, y: -1852.157, z: 26.771, rot: 12.26, dim: 0 }
        super(d);
        this.getOrderCoord = { x: 225.806, y: -1847.725, z: 26.987, rot: 195.55 };
        this.deliveryPoints = [
            {x: -198.063, y: 6234.902, z: 31.5 },
            {x: -298.398, y: 6191.967, z: 31.489 },
            {x: -342.872, y: 6098.942, z: 31.332 },
            {x: -381.071, y: 6061.897, z: 31.5},
            {x: -395.839, y: 6077.874, z: 31.5 },
            {x: -366.815, y: 6101.681, z: 35.44 },
            {x: -269.945, y: 6400.332, z: 31.342 },


        ];
        this.deliveryPointsList = [];

        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (player.vehicle || !player.loggedIn || !this.isPlayerWorksHere(player)) return;
                if (shape === this.getOrderColshape) this.playerEntersGetOrderShape(player);
                else if (typeof player.job.currentOrder === "number" && shape === this.deliveryPointsList[player.job.currentOrder].colshape) {
                   this.successDeliver(player);
                }
            },
        
            "playerExitColshape" : (player, shape) => {
                if (!player.loggedIn) return;
                if (shape === this.getOrderColshape) this.playerExitsGetOrderShape(player);
            },
        
            "sKeys-E" : (player) => {
                if (!player.loggedIn || !player.job.canGetNewOrder) return;
                this.playerPressedKeyOnNewOrderShape(player);
            },
        
            "playerQuit" : (player, exitType, reason) => {
                if (!player.loggedIn) return;
		playerSingleton.saveAccount(player);
                if (this.isPlayerWorksHere(player)) this.finishWork(player);
            },
        
        });

        this.createEntities();
    }

    setLocalSettings() {
        this.blip.model = 616;
        this.blip.color = 60;
    }

    createEntities() {
        this.getOrderColshape = mp.colshapes.newSphere(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z, 0.5);

        this.getOrderMarker = mp.markers.new(1, new mp.Vector3(this.getOrderCoord.x, this.getOrderCoord.y, this.getOrderCoord.z - 1), 0.75,
        {
            color: [255, 165, 0, 255],
            visible: false,
        });

        for (const pos of this.deliveryPoints) {
            const marker = mp.markers.new(1, new mp.Vector3(pos.x, pos.y, pos.z - 1), 0.75, {
                color: [255, 165, 0, 25],
                visible: false,
            });
            const colshape = mp.colshapes.newSphere(pos.x, pos.y, pos.z, 1);
            const blip = mp.blips.new(1, new mp.Vector3(pos.x, pos.y, pos.z), {	
                shortRange: true,
                scale: 0,
                color: 60,
            });
            const obj = { blip, marker, colshape }
            this.deliveryPointsList.push(obj);
        }

    }

    enteredMainShape(player) {
        if (this.isPlayerWorksHere(player)) {
            player.notify(`${i18n.get('sPaintJob', 'uninvite', player.lang)}!`);
            if (typeof player.job.currentOrder === "number") player.outputChatBox(`!{225, 0, 0}${i18n.get('sPaintJob', 'haveUndeliveredOrder', player.lang)}!`);
        }
        else player.notify(`${i18n.get('sPaintJob', 'invite', player.lang)}!`);
    }

    pressedKeyOnMainShape(player) {
        if (this.isPlayerWorksHere(player)) this.finishWork(player);
        else if (this.isPlayerWorksOnOtherJob(player)) player.notify(`~r~${i18n.get('basic', 'workingOnOtherJob', player.lang)}!`);
        else this.startWork(player);
    }

    finishWork(player) {
        if (typeof player.job.currentOrder === "number") {
            player.newFine(500, `Two Paints - ${i18n.get('sPaintJob', 'undelivered', player.lang)}`);
            player.removeLoyality(10);
        }
        this.cancelCurrentOrder(player);
        super.finishWork(player);
    }

    startWork(player) {
        if (player.loyality < 1) return player.notify(`~r~${i18n.get('basic', 'needMoreLoyality1', player.lang)} 5 ${i18n.get('basic', 'needMoreLoyality2', player.lang)}!`);
        super.startWork(player);
        player.job = { name: this.name, currentOrder: false, canGetNewOrder: false };
        this.getOrderMarker.showFor(player);
    }

    playerEntersGetOrderShape(player) {
        if (!this.isPlayerWorksHere(player)) return;
        if (typeof player.job.currentOrder === "number") return player.notify(`~r~${i18n.get('sPaintJob', 'cantGetNewOrder', player.lang)}!`);
        player.job.canGetNewOrder = true;
        player.notify(`${i18n.get('sPaintJob', 'getNewOrder', player.lang)}!`);
    }

    playerPressedKeyOnNewOrderShape(player) {
        player.notify(`~g~${i18n.get('sPaintJob', 'deliver', player.lang)}!`);
        this.generateNewOrder(player);
    }

    generateNewOrder(player) {
        const i = misc.getRandomInt(0, this.deliveryPointsList.length - 1)
        if (i === player.job.currentOrder) return this.generateNewOrder(player);
        this.cancelCurrentOrder(player);
        this.deliveryPointsList[i].marker.showFor(player);
        this.deliveryPointsList[i].blip.routeFor(player, 60, 0.7);
        player.job.currentOrder = i
        return i;
    }

    cancelCurrentOrder(player) {
        if (typeof player.job.currentOrder !== "number") return;
        const i = player.job.currentOrder;
        this.deliveryPointsList[i].marker.hideFor(player);
        this.deliveryPointsList[i].blip.unrouteFor(player);
        player.job.currentOrder = false;
    }

    playerExitsGetOrderShape(player) {
        player.job.canGetNewOrder = false;
    }

    successDeliver(player) {
        const prize = misc.getRandomInt(0, 100);
        const earnedMoney = 290 + prize;
        player.changeMoney(earnedMoney);
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 150) player.addLoyality(1);
        this.cancelCurrentOrder(player);
        misc.log.debug(`${player.name} earned $${earnedMoney}`);
    }
    
}
new PaintJob();