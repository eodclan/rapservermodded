const moneyAPI = require('./Money/sMoney');
const business = require('../Business/sBusiness');


class GPS {
	constructor () {
		mp.events.add('sGPS-CreateRoute', (player, str) => {
			const d = JSON.parse(str);
			let x, y;
			if (d.name === "Hospital") {
				x = -498.184;
				y = -335.741;
			}
			if (d.name === "LS Police Department") {
				x = -1107.097;
				y = -846.088;
			}
			if (d.name === "Prison") {
				x = 1846.283;
				y = 2585.906;
			}
			if (d.name === "Orange Collector") {
				x = 405.676;
				y = 6526.119;
			}
			if (d.name === "Steinpilz Collector") {
				x = -276.792;
				y = 2208.614;
			}
			if (d.name === "Tomaten Collector") {
				x = 1903.314;
				y = 4920.545;
			}
			if (d.name === "Trauben Collector") {
				x = -1692.072;
				y = 2246.438;
			}
			if (d.name === "Two Paints") {
				x = 236.13;
				y = -1852.157;
			}
			if (d.name === "Clickin Bell Delivery Courier") {
				x = -136.757;
				y = 6198.713;
			}
			if (d.name === "Two Paints") {
				x = 236.13;
				y = -1852.157;
			}
			if (d.name === "ATM") {
				const pos = moneyAPI.getNearestATM(player.position);
				x = pos.x;
				y = pos.y;
			}
			if (d.name === "Gas Station" || d.name === "Clothing Shop" || d.name === "Barber Shop") {
				const pos = business.getNearestBusiness(d.name, player.position);
				x = pos.x;
				y = pos.y;
			}
			if (d.name === "Business") {
				const pos = business.getBusinessPositionById(d.id);
				if (!pos) return;
				x = pos.x;
				y = pos.y;
			}
			if (d.name === "Find Vehicle") {
				const pos = mp.vehicles.at(d.id).position;
				if (!pos) return;
				x = pos.x;
				y = pos.y;
			}
			this.createRoute(player, x, y);
		});

	}

	createRoute(player, x, y) {
		player.call("cGPS-CreateRoute", [x, y]);
	}

}
new GPS();
