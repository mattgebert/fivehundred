"use strict";
//---------------------------------------------------------------------
//Static Resource Server:
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/www'));

var server = app.listen(8082, '127.0.0.5', function() {
	var port = server.address().port;
	var ip = server.address().address;
	console.log('Server running at address %s', ip);
	console.log('Server running at port %s', port);
});

//---------------------------------------------------------------------
//Object Definitions
var suitEnum = Object.freeze({
	H : {val: 3, css:'hearts'},
	D : {val: 2, css:'diams'},
	C : {val: 1, css:'clubs'},
	S : {val: 0, css:'spades'},
});

var rankEnum = Object.freeze({
	two : 	{val: 2, css:'2'},
	three : {val: 3, css:'3'},
	four : 	{val: 4, css:'4'},
	five : 	{val: 5, css:'5'},
	six : 	{val: 6, css:'6'},
	seven : {val: 7, css:'7'},
	eight : {val: 8, css:'8'},
	nine : 	{val: 9, css:'9'},
	ten : 	{val: 10, css:'10'},
	jack : 	{val: 11, css:'j'},
	queen : {val: 12, css:'q'},
	king : 	{val: 13, css:'k'},
	ace : 	{val: 14, css:'a'},
});

class card {
	constructor(rank, suit){
		this.rank = rank;
		this.suit = suit;
	}
}
var jokerCard = Object.freeze(
	new card(
		{val: 15, css: 'big joker'},
		{val: 4, css: ''} //No text for css
	)
);

//Setup server decks
class fivehundredDeck {
	constructor(){ //n = number players
		n=3; //TODO: Remove Constant

		//Add regular 3 player cards:
		this.cards = [];
		for (var suit in suitEnum) {
			for (var rank in rankEnum) {
				if (rank.val > 6)
					this.cards.push(new card(rank, suit));
			}
		}
		this.cards.push(jokerCard);

		//Dealing Hand Tracking:
		this.handsLeft = n;
	}

	//Deals out random cards:
	dealRandomCards(n) {
		var len = this.cards.length;
		//Remove random cards from the deck.
		var retCards = [];
		for (var i = 0; i < n; i++) {
			retCards.push(this.cards.splice(Math.floor(Math.random()*len), 1));
			len = len - 1;
		};
		return retCards;
	}
};


//Server Setup for a new player:
var io = require('socket.io').listen(server);
io.on('connnection', function(client){
	console.log('User Connected');

	client.on('joinGame', function(player) {
		console.log("Yep!");
		//console.log(player.id + ' joined the game');

		//Deal New Deck:
		var newdeck = new fivehundredDeck();
		var newhand = newdeck.dealRandomCards();

		client.emit('addHand', {id: player.id, isLocal: true, hand: newhand});
		//client.broadcast.emit('addTank', {id: tank.id, type: tank.type, isLocal: false, x:initX, y:initY, hp: TANK_INIT_HP});
		//game.addTank({id:tank.id type: tank.type, hp: TANK_INIT_HP});
	});
});
