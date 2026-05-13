"use strict";

/*
   New Perspectives on HTML5, CSS3, and JavaScript 6th Edition
   Tutorial 14
   Tutorial Case

   Author: Lyle Goldman
   Date:   4/30/2026
   
   Filename: ag_poker.js

*/

window.addEventListener("load", playDrawPoker);

function playDrawPoker() {
    const dealButton = document.getElementById("dealB");
    const drawButton = document.getElementById("drawB");
    const standButton = document.getElementById("standB");
    const resetButton = document.getElementById("resetB");
    const handValueText = document.getElementById("handValue");
    const betSelection = document.getElementById("bet");
    const bankBox = document.getElementById("bank");
    const cardImages = document.querySelectorAll("img.cardImg");

    // Set the initial values of the pokerGame object.
    pokerGame.currentBank = 500;
    pokerGame.currentBet = 25;
 
    // Create a new deck of cards and shuffle it.
    let myDeck = new pokerDeck();
    myDeck.shuffle();

    // Create a pokerHand object.
    const myHand = new pokerHand(5);

    bankBox.value = pokerGame.currentBank;
    betSelection.onchange = (e) => {
        const sel = e.target;
        pokerGame.currentBet = parseInt(sel.options[sel.selectedIndex].value);
    };

    // Restart the game when the Reset button is clicked.
    resetButton.addEventListener("click", () => {
        pokerGame.currentBank = 500;
        bankBox.value = pokerGame.currentBank;
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton);
    });

    // Enable the Draw and Stand buttons after the deal.
    dealButton.addEventListener("click", () => {
        if(pokerGame.currentBank >= pokerGame.currentBet) {
            handValueText.textContent = "";
            disableObj(dealButton);
            disableObj(betSelection);
            enableObj(drawButton);
            enableObj(standButton);
            bankBox.value = pokerGame.placeBet();

            // Deal cards into the poker hand after confirming
            // there are at ;east 10 cards in the deck.
            if(myDeck.cards.length < 10) {
                myDeck = new pokerDeck();
                myDeck.shuffle();
            }
            myDeck.dealTo(myHand);

            // Display the card images on the table.
            for(let i = 0, len = cardImages.length; i < len; i++) {
                const img = cardImages[i];
                img.src = myHand.cards[i].cardImage();

                // Event handler for each card image.
                img.index = i;
                img.onclick = (e) => {
                    const card = e.target;
                    if(card.discard !== true) {
                        card.discard = true;
                        card.src = "ag_cardback.png";
                    }
                    else {
                        card.discard = false;
                        card.src = myHand.cards[card.index].cardImage();
                    }
                };
            }
        }
        else {
            alert("Reduce the size of your bet.");
        }
    });

    // Enable the Deal and Bet options when the current hand ends.
    drawButton.addEventListener("click", () => {
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton);

        // Replace the cards selected for discarding.
        for(let i = 0, len = cardImages.length; i < len; i++) {
            const img = cardImages[i];
            if(img.discard) {
                myHand.cards[i].replaceFromDeck(myDeck);
                img.src = myHand.cards[i].cardImage();
                img.discard = false;
            }
            img.onclick = null;
        }

        // Evaluate the hand drawn by user.
        handValueText.textContent = myHand.handType();

        // Pay off the final hand.
        bankBox.value = pokerGame.payout(myHand.handOdds());
    });

    standButton.addEventListener("click", () => {
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton);

        // Evaluate the hand drawn by user.
        handValueText.textContent = myHand.handType();

        // Pay off the final hand.
        bankBox.value = pokerGame.payout(myHand.handOdds());
    });

    // Disable Poker Button.
    function disableObj(obj) {
        obj.disabled = true;
        obj.style.opacity = 0.25;
    }
    
    // Enable Poker Button.
    function enableObj(obj) {
        obj.disabled = false;
        obj.style.opacity = 1;
    }
}
