const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');



class Steinpilz extends Job {
    constructor() {
        const d = { name: "Steinpilz Collector", x: -276.792, y: 2208.614, z: 129.853, rot: 0, dim: 0 }
        super(d);
        this.posToDrop = {x: -280.192, y: 2200.601, z: 129.851};
        this.checkPoints = [
            {x: -297.111, y: 2202.747, z: 131.121 },
            {x: -297.233, y: 2196.905, z: 132.975 },
            {x: -294.572, y: 2192.999, z: 134.835 },
            {x: -299.676, y: 2188.585, z: 136.921 },
            {x: -295.985, y: 2182.775, z: 139.596 },
            {x: -288.998, y: 2178.823, z: 142.171 },
            {x: -297.187, y: 2175.126, z: 143.488 },
            {x: -317.635, y: 2173.74, z: 145.059 },
            {x: -323.275, y: 2175.935, z: 144.948 },
            {x: -329.168, y: 2169.262, z: 149.346 },
            {x: -337.982, y: 2169.882, z: 152.348 },
            {x: -341.559, y: 2168.364, z: 155.059 },
        ];
        this.treeMarkersList = [];


        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (!player.loggedIn || player.vehicle || !this.isPlayerWorksHere(player)) return;
                if (shape.steinpilzCollectorTree === player.job.activeTree) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sSteinpilz-EnteredTreeShape", 2400]);
                    }
                else if (shape === this.dropShape) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sSteinpilz-EnteredDropShape", 2400]);
                }
            },

            "sSteinpilz-EnteredTreeShape" : (player) => {
                this.enteredTreeShape(player);
            },

            "sSteinpilz-EnteredDropShape" : (player) => {
                this.enteredDropShape(player);
            },
        
            "sSteinpilz-StartWork" : (player) => {
                this.startWork(player);
            },
        
            "sSteinpilz-FinishWork" : (player) => {
                this.finishWork(player);
            },
        
        });

        this.createMenuToDrop();
        this.createCheckpoints();
    }

    setLocalSettings() {
        this.blip.model = 514;
        this.blip.color = 17;
    }

    createMenuToDrop() {
        this.dropMarker = mp.markers.new(1, new mp.Vector3(this.posToDrop.x, this.posToDrop.y, this.posToDrop.z - 1), 0.75,
        {
            color: [255, 165, 0, 100],
            visible: false,
        });
        this.dropShape = mp.colshapes.newSphere(this.posToDrop.x, this.posToDrop.y, this.posToDrop.z, 1);
    }

    createCheckpoints() {
        for (let i = 0; i < this.checkPoints.length; i++) {
            const marker = mp.markers.new(1, new mp.Vector3(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z - 1), 3,
            {
                color: [255, 165, 0, 50],
                visible: false,
            });
            marker.steinpilzCollectorTree = i;
            this.treeMarkersList.push(marker);
            const colshape = mp.colshapes.newSphere(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z, 3);
            colshape.steinpilzCollectorTree = i;
        }
    }

    pressedKeyOnMainShape(player) {
        let execute = '';
        if (player.job.name === this.name) execute = `app.loadFinish();`;
        player.call("cSteinpilz-OpenMainMenu", [player.lang, execute]);
    }

    startWork(player) {
        super.startWork(player);
        player.job = { name: this.name, collected: 0, activeTree: false };
        this.createRandomCheckPoint(player);
        this.dropMarker.showFor(player);
    }

    setWorkingClothesForMan(player) {
        player.setProp(0, 14, 0); // Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 15), 0); // Top
        player.setClothes(3, 14, 0, 0);
        player.setClothes(252, 0, 0, 0);
        player.setClothes(4, 0, misc.getRandomInt(0, 15), 0); // Legs
    }

    setWorkingClothesForWoman(player) {
        player.setProp(0, 14, 0); // Hat
        player.setClothes(11, 78, misc.getRandomInt(0, 7), 0); // Top
        player.setClothes(3, 9, 0, 0);
        player.setClothes(82, 0, 0, 0);
        player.setClothes(4, 1, misc.getRandomInt(0, 15), 0); // Legs
    }

    createRandomCheckPoint(player) {
        const i = misc.getRandomInt(0, this.checkPoints.length - 1)
        if (i === player.job.activeTree) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        this.treeMarkersList[i].showFor(player);
        player.job.activeTree = i;
        return i;
    }

    hideActiveCheckPoint(player) {
        const i = player.job.activeTree;
        if (typeof i !== "number") return;
        this.treeMarkersList[i].hideFor(player);
        player.job.activeTree = false;
    }

    enteredTreeShape(player) {
        player.stopAnimation();
        player.job.collected += misc.getRandomInt(1, 2);
        player.notify(`${i18n.get('svSteinpilzCollector', 'collected1', player.lang)} ~g~${player.job.collected} ~w~${i18n.get('svSteinpilzCollector', 'collected2', player.lang)}!`);
        if (player.job.collected < 20) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        player.notify(`~g~${i18n.get('svSteinpilzCollector', 'full', player.lang)}!`);
    }

    enteredDropShape(player) {
        player.stopAnimation();
        if (player.job.collected === 0) return player.notify(`${i18n.get('svSteinpilzCollector', 'empty', player.lang)}!`);
        const earnedMoney = player.job.collected * 19;
        player.changeMoney(earnedMoney);
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 50) player.addLoyality(player.job.collected / 10);
        misc.log.debug(`${player.name} earned $${earnedMoney} at Steinpilz collector job!`);
        player.job.collected = 0;
        if (!player.job.activeTree) this.createRandomCheckPoint(player);
    }

    finishWork(player) {
        super.finishWork(player);
        this.hideActiveCheckPoint(player);
        this.dropMarker.hideFor(player);
	playerSingleton.saveAccount(player);
    }

    
}
new Steinpilz();