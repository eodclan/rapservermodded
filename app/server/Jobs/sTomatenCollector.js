const misc = require('../sMisc');
const i18n = require('../sI18n');
const Job = require('./sJob');



class TomatenCollector extends Job {
    constructor() {
        const d = { name: "Tomaten Collector", x: 1903.314, y: 4920.545, z: 48.756, rot: 0, dim: 0 }
        super(d);
        this.posToDrop = {x: 1897.958, y: 4922.064, z: 48.83};
        this.checkPoints = [
            { x: 1904.96, y: 4887.13, z: 47.5 },
            { x: 1906.363, y: 4885.543, z: 47.2 },
            { x: 1907.65, y: 4884.274, z: 47.1 },
            { x: 1923.946, y: 4868.79, z: 47.1 },
            { x: 1924.739, y: 4867.403, z: 47.1 },
            { x: 1926.405, y: 4865.672, z: 47.2 },
            { x: 1928.373, y: 4864.325, z: 47.2 },
            { x: 1932.915, y: 4868.615, z: 47.0 },
            { x: 1931.464, y: 4870.739, z: 47.0 },
            { x: 1929.529, y: 4872.755, z: 47.0 },
            { x: 1928.021, y: 4874.282, z: 47.0 },
            { x: 1912.925, y: 4888.732, z: 47.4 },
            { x: 1911.624, y: 4890.453, z: 47.6 },
            { x: 1908.741, y: 4893.1, z: 47.7 },
        ];
        this.treeMarkersList = [];


        mp.events.add({
            "playerEnterColshape" : (player, shape) => {
                if (!player.loggedIn || player.vehicle || !this.isPlayerWorksHere(player)) return;
                if (shape.tomatenCollectorTree === player.job.activeTree) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sTomatenCollector-EnteredTreeShape", 2400]);
                    }
                else if (shape === this.dropShape) {
                    player.playAnimation('anim@mp_snowball', 'pickup_snowball', 1, 47);
                    player.call("cMisc-CallServerEvenWithTimeout", ["sTomatenCollector-EnteredDropShape", 2400]);
                }
            },

            "sTomatenCollector-EnteredTreeShape" : (player) => {
                this.enteredTreeShape(player);
            },

            "sTomatenCollector-EnteredDropShape" : (player) => {
                this.enteredDropShape(player);
            },
        
            "sTomatenCollector-StartWork" : (player) => {
                this.startWork(player);
            },
        
            "sTomatenCollector-FinishWork" : (player) => {
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
            marker.tomatenCollectorTree = i;
            this.treeMarkersList.push(marker);
            const colshape = mp.colshapes.newSphere(this.checkPoints[i].x, this.checkPoints[i].y, this.checkPoints[i].z, 3);
            colshape.tomatenCollectorTree = i;
        }
    }

    pressedKeyOnMainShape(player) {
        let execute = '';
        if (player.job.name === this.name) execute = `app.loadFinish();`;
        player.call("cTomatenCollector-OpenMainMenu", [player.lang, execute]);
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
        player.notify(`${i18n.get('sTomatenCollector', 'collected1', player.lang)} ~g~${player.job.collected} ~w~${i18n.get('sTomatenCollector', 'collected2', player.lang)}!`);
        if (player.job.collected < 20) return this.createRandomCheckPoint(player);
        this.hideActiveCheckPoint(player);
        player.notify(`~g~${i18n.get('sTomatenCollector', 'full', player.lang)}!`);
    }

    enteredDropShape(player) {
        player.stopAnimation();
        if (player.job.collected === 0) return player.notify(`${i18n.get('sTomatenCollector', 'empty', player.lang)}!`);
        const earnedMoney = player.job.collected * 19;
        player.changeMoney(earnedMoney);
        player.notify(`${i18n.get('basic', 'earned1', player.lang)} ~g~$${earnedMoney}! ~w~${i18n.get('basic', 'earned2', player.lang)}!`);
        if (player.loyality < 50) player.addLoyality(player.job.collected / 10);
        misc.log.debug(`${player.name} earned $${earnedMoney} at Tomaten collector job!`);
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
new TomatenCollector();