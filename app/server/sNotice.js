module.exports.SendMessage = function(player, message, type, time = 1000, place = "bottomRight") {
    player.call('ReceiveNotification', message, type, time, place);
}

module.exports.SendMessageToAll = function(message, type, time = 1000, place = "bottomRight") {
    mp.players.forEach( (player, id) => { player.call('ReceiveNotification', message, type, time, place);  } );
}

module.exports.SendInfoMessage = function(player, message, time = 1000, place = "bottomRight") {
    player.call('ReceiveNotification', message, "info", time, place);
}

module.exports.SendErrorMessage = function(player, message, time = 1000, place = "bottomRight") {
    player.call('ReceiveNotification', message, "error", time, place);
}

module.exports.SendSuccessMessage = function(player, message, time = 1000, place = "bottomRight") {
    player.call('ReceiveNotification', message, "success", time, place);
}
module.exports.SendWarningMessage = function(player, message, time = 1000, place = "bottomRight") {
    player.call('ReceiveNotification', message, "warning", time, place);
}


module.exports.SendInfoMessageToAll = function(message, time = 1000, place = "bottomRight") {
    mp.players.forEach( (player, id) => { player.call('ReceiveNotification', message, "info", time, place);  } );
}

module.exports.SendErrorMessageToAll = function(message, time = 1000, place = "bottomRight") {
    mp.players.forEach( (player, id) => { player.call('ReceiveNotification', message, "error", time, place);  } );
}

module.exports.SendSuccessMessageToAll = function(message, time = 1000, place = "bottomRight") {
    mp.players.forEach( (player, id) => { player.call('ReceiveNotification', message, "success", time, place);  } );
}
module.exports.SendWarningMessageToAll = function(message, time = 1000, place = "bottomRight") {
    mp.players.forEach( (player, id) => { player.call('ReceiveNotification', message, "warning", time, place);  } );
}