var jsbApp = {};

jsbApp.pcards = document.getElementById('pcards');
jsbApp.dcards = document.getElementById('dcards');
jsbApp.hitButton = document.getElementById('hit');
jsbApp.stayButton = document.getElementById('stay');
jsbApp.playButton = document.getElementById('play');
jsbApp.textUpdates = document.getElementById('textUpdates');
jsbApp.buttonBox = document.getElementById('buttonBox');
jsbApp.phandtext = document.getElementById('phand');
jsbApp.dhandtext = document.getElementById('dhand');
jsbApp.tracker = document.getElementById('tracker');
jsbApp.newgame = document.getElementById('newgame');
jsbApp.choice = document.getElementById('choice');

jsbApp.playerHand = [];
jsbApp.dealerHand = [];
jsbApp.deck = [];
jsbApp.suits = ['clubs <span class="bold">&#9827</span>', 'diamonds <span class="redcard">&#9830</span>', 'hearts <span class="redcard">&#9829</span>', 'spades <span class="bold">&#9824</span>'];
jsbApp.values = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King"];
jsbApp.gameStatus = 0; 
jsbApp.wins = 0; 
jsbApp.draws = 0; 
jsbApp.losses = 0; 
jsbApp.games = 0; 


function card(suit, value, name) {
    this.suit = suit;
    this.value = value; 
    this.name = name; 
};


var newGame = function () {
  
    jsbApp.newgame.classList.add("hidden");
    
    jsbApp.dcards.innerHTML = "";
    jsbApp.dcards.innerHTML = "";
    jsbApp.playerHand = [];
    jsbApp.dealerHand = [];
    jsbApp.gameStatus = 0;


    jsbApp.deck = createDeck();

    jsbApp.playerHand.push(jsbApp.deck.pop());
    jsbApp.playerHand.push(jsbApp.deck.pop());

    if (handTotal(jsbApp.playerHand) === 21)
    {
        jsbApp.wins += 1;
        jsbApp.games += 1;        
        jsbApp.gameStatus = 1; 
        drawHands();
        jsbApp.textUpdates.innerHTML = "You won! You got 21 on your initial hand!";
        track();
        jsbApp.gameStatus = 2; 
        return;
    }

    jsbApp.dealerHand.push(jsbApp.deck.pop());
    jsbApp.dealerHand.push(jsbApp.deck.pop());
  
    if (handTotal(jsbApp.dealerHand) === 21)
    {
        jsbApp.games += 1;
        jsbApp.losses += 1;
        jsbApp.gameStatus = 1; 
        drawHands();
        jsbApp.textUpdates.innerHTML = "You lost! The dealer had 21 on their initial hand.";
        track();
        jsbApp.gameStatus = 2; 
        return;
    }

    drawHands();
    advise();
    jsbApp.buttonBox.classList.remove("hidden"); 
    jsbApp.textUpdates.innerHTML = "The initial hands are dealt!";
    
};

var createDeck = function () {
    var deck = [];
    for (var a = 0; a < jsbApp.suits.length; a++) {
        for (var b = 0; b < jsbApp.values.length; b++) {
            var cardValue = b + 1;
            var cardTitle = "";            
            if (cardValue > 10){
                cardValue = 10;
            }
            if (cardValue != 1) {
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + ")");
            }
            else
            {
                cardTitle += (jsbApp.values[b] + " of " + jsbApp.suits[a] + " (" + cardValue + " or 11)");
            }
            var newCard = new card(jsbApp.suits[a], cardValue, cardTitle);
            deck.push(newCard);
            

        }
    }

    deck = shuffle(deck);
    return deck;
};
var drawHands = function () {    
    var htmlswap = "";
    var ptotal = handTotal(jsbApp.playerHand);
    var dtotal = handTotal(jsbApp.dealerHand);
    htmlswap += "<ul>";
    for (var i = 0; i < jsbApp.playerHand.length; i++)
    {
        htmlswap += "<li>" + jsbApp.playerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.pcards.innerHTML = htmlswap;
    jsbApp.phandtext.innerHTML = "Your Hand (" + ptotal + ")"; 
    if (jsbApp.dealerHand.length == 0)
    {
        return;
    }

    htmlswap = "";
    if (jsbApp.gameStatus === 0)
    {
        htmlswap += "<ul><li>[Hidden Card]</li>";
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + jsbApp.dealerHand[1].value + " + hidden card)"; 
    }

    else
    {
        jsbApp.dhandtext.innerHTML = "Dealer's Hand (" + dtotal + ")"; 
    }
    
    for (var i = 0; i < jsbApp.dealerHand.length; i++) {
        if (jsbApp.gameStatus === 0)
        {
            i += 1;
        }
        htmlswap += "<li>" + jsbApp.dealerHand[i].name + "</li>";
    }
    htmlswap += "</ul>"
    jsbApp.dcards.innerHTML = htmlswap;

};

var handTotal = function (hand) {

    var total = 0;
    var aceFlag = 0; 
    for (var i = 0; i < hand.length; i++) {

        total += hand[i].value;
        if (hand[i].value == 1)
        {
            aceFlag += 1;
        }
    }
    for (var j = 0; j < aceFlag; j++)
    {
        if (total + 10 <= 21)
        {
            total +=10;
        }
    }

    return total;
}

var shuffle = function (deck) {

    var shuffledDeck = [];
    var deckL = deck.length;
    for (var a = 0; a < deckL; a++)
    {
        var randomCard = getRandomInt(0, (deck.length));        
        shuffledDeck.push(deck[randomCard]);
        deck.splice(randomCard, 1);        
    }
    return shuffledDeck;
}

var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min)) + min;

}

var deckPrinter = function (deck) {
    for (var i = 0; i < deck.length; i++)
    {
        console.log(deck[i].name);
    }
    return
}

jsbApp.playButton.addEventListener("click", newGame);

jsbApp.hitButton.addEventListener("click", function () {
 
    if (jsbApp.gameStatus === 2)
    {
        console.log("Hit clicked when game was over or already clicked.");
        return;
    }

    jsbApp.playerHand.push(jsbApp.deck.pop());
    drawHands();
   

    var handVal = handTotal(jsbApp.playerHand);
    if (handVal > 21)
    {
        bust();
        advise();
        return;
    }
    else if (handVal === 21)
    {
        victory();
        advise();
        return;
    }
    advise();
    jsbApp.textUpdates.innerHTML = "Hit or stay?</p>";
    return;      
});

jsbApp.stayButton.addEventListener("click", function stayLoop() {

    if (jsbApp.gameStatus === 2)
    {
        console.log("Stay clicked when game was over or already clicked.");
        return;
    }
    else if (jsbApp.gameStatus === 0) 
    {
        
        jsbApp.buttonBox.classList.add("hidden");
        var handVal = handTotal(jsbApp.dealerHand);
        jsbApp.gameStatus = 1; 
        advise(); 
        jsbApp.textUpdates.innerHTML = "The dealer reveals their hidden card";
        drawHands();
        setTimeout(stayLoop, 750); 
    }
    else if (jsbApp.gameStatus === 1) {    

    var handVal = handTotal(jsbApp.dealerHand);
    if (handVal > 16 && handVal <= 21) 
    {
        drawHands();
        var playerVal = handTotal(jsbApp.playerHand);
        if (playerVal > handVal)
        {            
            victory();
            return;
        }
        else if (playerVal < handVal)
        {            
            bust();
            return;
        }
        else
        {            
            tie();
            return;
        }
    }
    if (handVal > 21)
    {
        victory();
        return;
    }
    else 
    {
        jsbApp.textUpdates.innerHTML = "Dealer hits!";
        jsbApp.dealerHand.push(jsbApp.deck.pop());
        drawHands();
        setTimeout(stayLoop, 750);
        return;
    }   
    }
});

var victory = function () {
    jsbApp.wins += 1;
    jsbApp.games += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; 
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal === 21)
    {
        explanation = "Your hand's value is 21!";
    }
    else if (dealerTotal > 21)
    {
        explanation = "Dealer busted with " + dealerTotal + "!";
    }
    else
    {
        explanation = "You had " + playerTotal + " and the dealer had " + dealerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You won!<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var bust = function () {
    jsbApp.games += 1;
    jsbApp.losses += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; 
    var playerTotal = handTotal(jsbApp.playerHand);
    var dealerTotal = handTotal(jsbApp.dealerHand);
    if (playerTotal > 21)
    {
        explanation = "You busted with " + playerTotal + ".";
    }
    jsbApp.textUpdates.innerHTML = "You lost.<br>" + explanation + "<br>Press 'New Game' to play again.";
    track();
}

var tie = function () {    
    jsbApp.games += 1;
    jsbApp.draws += 1;
    var explanation = "";
    jsbApp.gameStatus = 2; 
    var playerTotal = handTotal(jsbApp.playerHand);
    jsbApp.textUpdates.innerHTML = "It's a tie at " + playerTotal + " points each.<br>Press 'New Game' to play again.";
    track();
}

var track = function () {
    jsbApp.tracker.innerHTML = "<p>Wins: " + jsbApp.wins + " Draws: " + jsbApp.draws + " Losses: " + jsbApp.losses + "</p>";
    jsbApp.newgame.classList.remove("hidden");
    jsbApp.buttonBox.classList.add("hidden");
}

var softCheck = function (hand) {    
    var total = 0;
    var aceFlag = 0; 
    for (var i = 0; i < hand.length; i++) {
   
        total += hand[i].value;
        if (hand[i].value == 1) {
            aceFlag += 1;
        }
    }

    for (var j = 0; j < aceFlag; j++) {
        if (total + 10 <= 21) {
            return true; 
        }
    }    
    return false; 
}

var advise = function () {
    if (jsbApp.gameStatus > 0)
    {
        jsbApp.choice.innerHTML = "";
        return;
    } 
    var playerTotal = handTotal(jsbApp.playerHand);
    var soft = softCheck(jsbApp.playerHand);
    console.log("Soft: " + soft);
    var dealerUp = jsbApp.dealerHand[1].value;
    if (dealerUp === 1)
    {
        dealerUp = 11;
    }

    if (playerTotal <= 11 && !soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp <= 6 && !soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 16 && dealerUp >= 7 && !soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 17 && playerTotal <= 21 && !soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else if (playerTotal >= 12 && playerTotal <= 18 && soft)
    {
        jsbApp.choice.innerHTML = "[Hit!]";
    }
    else if (playerTotal >= 19 && playerTotal <= 21 && soft)
    {
        jsbApp.choice.innerHTML = "[Stay]";
    }
    else
    {
        jsbApp.choice.innerHTML = "Massive error, unexpected scenario, idk";
        console.log("Error: Player's hand was " + playerTotal + " and dealer's faceup was " + dealerUp + ".");
    }
    return;
}