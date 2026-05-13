"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Lyle Goldman
   Date:   4/30/2026

   Filename: ag_cards.js


   Custom Object Classes
   
   pokerGame
      The pokerGame object contains properties and methods for the game
      of draw poker

   pokerDeck
      The pokerDeck object contains an array of poker cards and methods
      for shuffling and drawing cards from the deck.

   pokerHand
      The pokerHand object contains an array of poker cards drawn from a
      poker deck. The methods associated with the object include the ability 
      to calculate the value of the hand and to mark cards to be discarded,
      replaced with new cards from a poker deck.

   pokerCard
      The pokerCard object contains properties and methods associated with
      individual poker cards including the card rank, suit, and value.
   
	
*/

// The pokerGame object.
const pokerGame = {
    currentBank: null,
    currentBet: null,

    placeBet: function() {
        this.currentBank -= this.currentBet;
        return this.currentBank;
    },

    payout: function(odds) {
        this.currentBank += this.currentBet*odds;
        return this.currentBank;
    }
};

// Class for poker cards.
class pokerCard {
    constructor(cardSuit, cardRank) {
        this.suit = cardSuit;
        this.rank = cardRank;
        this.rankValue = null;
    }

    // Method to reference the image source file for a card.
    cardImage() {
        const suitAbbr = this.suit.substring(0, 1).toLowerCase();
        return suitAbbr + this.rankValue + ".png";
    }

    // Method to replace a card with one from the deck.
    replaceFromDeck(pokerDeck) {
        const newCard = pokerDeck.cards.shift();
        this.suit = newCard.suit;
        this.rank = newCard.rank;
        this.rankValue = newCard.rankValue;
    }
}



// Class for poker decks.
class pokerDeck {
    constructor() {
        this.cards = new Array(52);

        const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
        const ranks = [
            "2", "3", "4", "5", "6",
            "7", "8", "9", "10",
            "Jack", "Queen", "King", "Ace"
        ];

        let cardCount = 0;
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 13; j++) {
                const newCard = new pokerCard(suits[i], ranks[j]);
                newCard.rankValue = j + 2;
                this.cards[cardCount] = newCard;
                cardCount++;
            }
        }
    }

    // Method to randomly sort the deck.
    shuffle() {
        this.cards.sort(() => 0.5 - Math.random());
    }

    // Method to deal cards from the deck into a poker hand.
    dealTo(pokerHand) {
        for(let i = 0, len = pokerHand.cards.length; i < len; i++) {
            pokerHand.cards[i] = this.cards.shift();
        }
    };
}

// Class for poker hands.
class pokerHand {
    constructor(handLength) {
        this.cards = new Array(handLength);
    }

    // Return the highest ranked card in the hand.
    highCard() {
        return Math.max(
            this.cards[0].rankValue,
            this.cards[1].rankValue,
            this.cards[2].rankValue,
            this.cards[3].rankValue,
            this.cards[4].rankValue
        );
    }

    // Test for the presence of a flush.
    hasFlush() {
        const firstSuit = this.cards[0].suit;
        return this.cards.every(card => card.suit === firstSuit);
    }

    // Test for the presence of a straight.
    hasStraight() {
        this.cards.sort((a, b) => a.rankValue - b.rankValue);
        return this.cards.every((card, i, cards) =>
            (i <= 0) || (cards[i].rankValue - cards[i - 1].rankValue === 1)
        );
    }

    // Test for the presence of a straight flush.
    hasStraightFlush() {
        return this.hasFlush() && this.hasStraight();
    }

    // Test for the presence of a royal flush.
    hasRoyalFlush() {
        return this.hasStraightFlush() && this.highCard() === 14;
    }

    // Test for duplicates in the hand.
    hasSets() {
        // handSets summarizes the duplicates in the hand.
        const handSets = {};
        this.cards.forEach(card => {
            if(handSets.hasOwnProperty(card.rankValue)) {
                ++handSets[card.rankValue];
            }
            else {
                handSets[card.rankValue] = 1;
            }
        });

        let sets = "none";
        let pairRank;

        for(let cardRank in handSets) {
            const value = handSets[cardRank];
            if(value === 4) { sets = "Four of a Kind"; }
            else if(value === 3) {
                if(sets === "Pair") { sets = "Full House"; }
                else { sets = "Three of a Kind"; }
            }
            else if(value === 2) {
                if(sets === "Three of a Kind") { sets = "Full House"; }
                else if(sets === "Pair") { sets = "Two Pair"; }
                else { sets = "Pair"; pairRank = cardRank; }
            }
        }

        if(sets === "Pair" && pairRank >= 11) {
            sets = "Jacks or Better";
        }

        return sets;
    }

    // Returns the type of poker hand.
    handType() {
        if(this.hasRoyalFlush()) return "Royal Flush";
        if(this.hasStraightFlush()) return "Straight Flush";
        if(this.hasFlush()) return "Flush";
        if(this.hasStraight()) return "Straight";
        const sets = this.hasSets();
        if(sets === "Pair" || sets === "none") return "No Winner";
        return sets;
    }

    // Return the payout multiplier for each hand.
    handOdds() {
        switch(this.handType()) {
            case "Royal Flush": return 250;
            case "Straight Flush": return 50;
            case "Four of a Kind": return 25;
            case "Full House": return 9;
            case "Flush": return 6;
            case "Straight": return 4;
            case "Three of a Kind": return 3;
            case "Two Pair": return 2;
            case "Jacks or Better": return 1;
            default: return 0;
        }
    }
}
