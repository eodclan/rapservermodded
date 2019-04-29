const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');



class TraubenCollector extends Job {
    constructor() {
        const d = { name: "Trauben Collector", x: -1692.072, y: 2246.438, z: 82.489, rot: 0, dim: 0 }
        super(d);
        this.posToDrop = {x: -1705.194, y: 2253.79, z: 79.615};
        this.checkPoints = [
            { x: -1684.297, y: 2255.325, z: 79.932 },
            { x: -1672.969, y: 2256.353, z: 79.172 },
            { x: -1666.679, y: 2248.271, z: 82.248 },
            { x: -1680.458, y: 2259.773, z: 77.802 },
            { x: -1684.656, y: 2264.835, z: 75.402 },
            { x: -1686.572, y: 2260.02, z: 77.507 },
            { x: -1678.865, y: 2250.985, z: 81.561 },
            { x: -1660.87, y: 2247.701, z: 82.406 },
            { x: -1665.43, y: 2253.098, z: 80.381 },
            { x: -1670.308, y: 2259.444, z: 77.819 },
        ];
        this.treeMarkersList = [];


        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (!player.loggedIn || player.vehicle || !this.isPlayerWorksHere(player)) return;
                if (shape.traubenCollectorTree === player.job.activeTree) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sTraubenCollector-EnteredTreeShape", 2400]);
                    }
                else if (shape === this.dropShape) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sTraubenCollector-EnteredDropShape", 2400]);
                }
            },

            "sTraubenCollector-EnteredTreeShape" : (player) => {
                this.enteredTreeShape(player);
            },

            "sTraubenCollector-EnteredDropShape" : (player) => {
                this.enteredDropShape(player);
            },
        
            "sTraubenCollector-StartWork" : (player) => {
                this.startWork(player);
            },
        
            "sTraubenCollector-FinishWork" : (player) => {
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
            marker.traubenCollectorTree = i;
            this.treeMarkersList.push(marker);
            const colshape = mp.colshapes.newSphere(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z, 3);
            colshape.traubenCollectorTree = i;
        }
    }

    pressedKeyOnMainShape(player) {
        let execute = '';
        if (player.job.name === this.name) execute = `app.loadFinish();`;
        player.call("cTraubenCollector-OpenMainMenu", [player.lang, execute]);
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
        player.notify(`${i18n.get('sTraubenCollector', 'collected1', player.lang)} ~g~${player.job.collected} ~w~${i18n.get('sTraubenCollector', 'collected2', player.lang)}!`);
        if (player.job.collected < 20) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        player.notify(`~g~${i18n.get('sTraubenCollector', 'full', player.lang)}!`);
    }

    enteredDropShape(player) {
        player.stopAnimation();
        if (player.job.collected === 0) return player.notify(`${i18n.get('sTraubenCollector', 'empty', player.lang)}!`);
        const earnedMoney = player.job.collected * 16;
        player.changeMoney(earnedMoney);
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 50) player.addLoyality(player.job.collected / 10);
        misc.log.debug(`${player.name} earned $${earnedMoney} at Trauben collector job!`);
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
new TraubenCollector();