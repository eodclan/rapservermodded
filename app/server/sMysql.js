"use strict"

const mysql = require("mysql");
const connection =  mysql.createPool({
	host			:	"localhost",       
	user			: 	"xxxx",
	password		: 	"xxxx",
	database		:	"r4g3v",
});

connection.getConnection(function(e) {
	if (e) 	{
		console.log("DATABASE IS NOT WORKING");
		throw e;
	}
	else 	{
		console.log(`DATABASE IS WORKING`);
	}
});

module.exports = connection;
