
const business = require('./sBusiness');
const misc = require('../sMisc');
const i18n = require('../sI18n');
const carDealership = require('./sSCarDealership');



class SuperCarDealership extends carDealership {
	
	setLocalSettings() {
		this.blip.model = 225;
		this.blip.name = `Super Car Dealership`;
		this.blip.color = 31;
	}

	openBuyerMenu(player) {
		if (player.vehicle) return;
		let execute = `app.id = ${this.id};`;
		execute += `app.margin = ${this.margin};`;

		player.call("cSuperCarDealership-OpenBuyerMenu", [player.lang, execute]);
		misc.log.debug(`${player.name} enter a cheap car dealership menu`);
	}
	
}

async function loadShops() {
	const d = await misc.query("SELECT * FROM business INNER JOIN supercardealership ON business.id = supercardealership.id");
	for (let i = 0; i < d.length; i++) {
		new SuperCarDealership(d[i]);
	}
}
loadShops();


mp.events.addCommand({
	'createsupercardealership' : async (player, enteredprice) => {
		if (player.adminLvl < 1) return;
		const id = business.getCountOfBusinesses() + 1;
		const coord = misc.getPlayerCoordJSON(player);
		const price = Number(enteredprice.replace(/\D+/g,""));
		const query1 = misc.query(`INSERT INTO business (title, coord, price) VALUES ('Super Car Dealership', '${coord}', '${price}');`);
		const query2 = misc.query(`INSERT INTO supercardealership (id) VALUES ('${id}');`);	
		await Promise.all([query1, query2]);
		player.outputChatBox("!{#4caf50} Super Car Dealership successfully created!");
		player.outputChatBox("!{#4caf50} Now do /setbusbuyermenu [id] and other commands!");
	},	

	'setcsupercardealernewcarcoord' : async (player, id) => {
		if (player.adminLvl < 1) return;
		if (!player.vehicle) return player.notify(`~r~You're not in vehicle!`);
		const coord = misc.getPlayerCoordJSON(player);
		await misc.query(`UPDATE supercardealership SET newCarCoord = '${coord}' WHERE id = ${id}`);
		player.notify(`~g~${i18n.get('basic', 'success', player.lang)}`);

	},	

});
