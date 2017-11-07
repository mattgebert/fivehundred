"use strict";
//---------------------------------------------------------------------
//Static Resource Server:
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/index.html');
});

// Server Setup for a new player:
var server = http.listen(3000, 'localhost', function() {
	var port = server.address().port;
	var ip = server.address().address;
	console.log('Server running at address %s', ip);
	console.log('Server running at port %s', port);
});

//Responses to clients:
io.on('connection', function(socket){
	console.log('User Connected');

	socket.on('joinGame', function(player) {
		console.log("Yep!");
		// console.log(player.id + ' joined the game');

		//Deal New Deck:
		var newdeck = new fivehundredDeck();
		var newhand = newdeck.dealRandomCards(10);
		socket.emit('addHand', newhand);

	});

	socket.on('disconnect', function(){
  	console.log('User Disconnected');
	});
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

function Card(rank,suit) {
	this._rank = rank;
	this._suit = suit;
}

Card.prototype = {
	get suit() {
		return this._suit;
	},
	get rank() {
		return this._rank;
	}
};

var jokerCard = Object.freeze(
	new Card(
		{val: 15, css: 'big joker'},
		{val: 4, css: ''} //No text for css
	)
);


var c = new Card({val: 13, css:'k'},{val: 3, css:'hearts'});
console.log(c.suit);

//Setup server decks
function fivehundredDeck() {

	//Add regular 3 player cards:
	this.cards = [];
	for (var suit in suitEnum) {
		for (var rank in rankEnum) {
			if (rankEnum[rank].val > 6){
				this.cards.push(new Card(rankEnum[rank], suitEnum[suit]));
			}
		}
	}
	this.cards.push(jokerCard);
};

fivehundredDeck.prototype = {
	//Deals out random cards:
	dealRandomCards: function(n) {
		var len = this.cards.length;
		//Remove random cards from the deck.
		var retCards = [];
		for (var i = 0; i < n; i++) {
			retCards.push(this.cards.splice(Math.floor(Math.random()*len), 1));
			len = len - 1;
			console.log(retCards[i].rank + " " + retCards[i].suit)
		};
		return retCards;
	}
};
