mp.events.add('radiochange', (player, vehicle_data) => {
	player.vehicle.setVariable('radio', vehicle_data);
	player.notify("Radio Sync: " + vehicle_data);
});