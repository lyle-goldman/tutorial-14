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
    var dealButton = document.getElementById("dealB");
    var drawButton = document.getElementById("drawB");
    var standButton = document.getElementById("standB");
    var resetButton = document.getElementById("resetB");
    var handValueText = document.getElementById("handValue");
    var betSelection = document.getElementById("bet");
    var bankBox = document.getElementById("bank");

    // Set the initial values of the pokerGame object.
    pokerGame.currentBank = 500;
    pokerGame.currentBet = 25;
 
    bankBox.value = pokerGame.currentBank;
    betSelection.onchange = function(e) {
        pokerGame.currentBet = parseInt(e.target.options[e.target.selectedIndex].value);
    };

    // Restart the game when the Reset button is clicked.
    resetButton.addEventListener("click", function() {
        pokerGame.currentBank = 500;
        bankBox.value = pokerGame.currentBank;
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton);
    });

    // Enable the Draw and Stand buttons after the deal.
    dealButton.addEventListener("click", function() {
        if(pokerGame.currentBank >= pokerGame.currentBet) {
            disableObj(dealButton);
            disableObj(betSelection);
            enableObj(drawButton);
            enableObj(standButton);
            bankBox.value = pokerGame.placeBet();
        }
        else {
            alert("Reduce the size of your bet.");
        }
    });

    // Enable the Deal and Bet options when the current hand ends.
    drawButton.addEventListener("click", function() {
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton)
    });
    standButton.addEventListener("click", function() {
        enableObj(dealButton);
        enableObj(betSelection);
        disableObj(drawButton);
        disableObj(standButton)
    })

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
