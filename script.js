let Blackjack = function () {
  this.createDeck = function () {
    // Generates a full deck
    let suits = ["D", "C", "H", "S"];
    let values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];

    let deck = new Array();
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < values.length; j++) {
        let card = { value: values[j], suit: suits[i] };
        deck.push(card);
      }
    }
    return deck;
  };
  this.fullDeck = this.createDeck();
  this.human = {
    hand: [],
    total: 0,
    dom: "p",
    balance: 100,
  };
  this.computer = {
    hand: [],
    total: 0,
    dom: "c",
  };
  this.usedCards = this.human.hand.concat(this.computer.hand);

  this.init = function () {
    // Sets all starting variables to their initial state
    this.fullDeck = this.createDeck();
    this.human.hand = [];
    this.human.total = 0;
    this.computer.hand = [];
    this.computer.total = 0;

    // Dom
    document.getElementById("p-card-3").classList.add("visually-hidden");
    document.getElementById("p-card-4").classList.add("visually-hidden");
    document.getElementById("p-card-5").classList.add("visually-hidden");
    document.getElementById("p-card-6").classList.add("visually-hidden");
    // document.getElementById("c-suit-2").textContent = "";
    document.getElementById("c-value-2").textContent = "?";
    document.getElementById("c-card-3").classList.add("visually-hidden");
    document.getElementById("c-card-4").classList.add("visually-hidden");
    document.getElementById("c-card-5").classList.add("visually-hidden");
    document.getElementById("c-card-6").classList.add("visually-hidden");
    document.getElementById("hit-btn").disabled = true;
    document.getElementById("stay-btn").disabled = true;
    this.updateDom(this.human);
    this.updateDom(this.computer);
  };

  this.updateDom = function (player) {
    // Refresh the DOM

    document.getElementById(`${player.dom}-total`).textContent = player.total;
    document.getElementById("p-balance").textContent = "$" + this.human.balance;
    document.getElementById("p-bet").textContent = "$" + this.bet;
    // For each element in usedCards render card values
    player.hand.forEach((el, i) => {
      if (
        !document
          .getElementById(`${player.dom}-card-${i + 1}`)
          .classList.contains("visually-hidden")
      ) {
        document
          .querySelectorAll(`.${player.dom}-suit-${i + 1}`)
          .forEach((item) => {
            item.classList.remove("suit-C");
            item.classList.remove("suit-D");
            item.classList.remove("suit-S");
            item.classList.remove("suit-H");
            item.classList.add(`suit-${el.suit}`);
          });
        document.getElementById(`${player.dom}-value-${i + 1}`).textContent =
          el.value;
      }
    });
  };

  this.placeBet = function () {
    let bet = prompt(
      "What's your wager? It must be at least 10, and in increments of 10",
      ""
    );

    if (bet == null) {
      alert("Ok, maybe another time");
      this.bet = 0;
      this.updateDom(this.human);
    } else {
      bet = Number(bet);
      if (bet > this.human.balance) {
        alert("Thats more than your balance");
        return this.placeBet();
      } else if (bet <= 0) {
        alert("You have to bet something!");
        return this.placeBet();
      } else if (bet % 10 !== 0) {
        alert("Thats not an increment of 10");
        return this.placeBet();
      } else {
        this.bet = bet;
        this.human.balance -= this.bet;
        this.updateDom(this.human);
        return this.startGame();
      }
    }
  };

  this.createCard = function (player) {
    // Looks for a card combination and checks if used
    let index = Math.floor(Math.random() * this.fullDeck.length);
    let card = this.fullDeck[index];
    this.fullDeck.splice(index, 1);

    // Sorting the ace
    if (card.value == "A") {
      player.hand.push(card);
    } else {
      player.hand.unshift(card);
    }

    // Remove hidden class when creating another card
    document
      .getElementById(`${player.dom}-card-${player.hand.length}`)
      .classList.remove("visually-hidden");

    this.getTotal(player);
    if (this.human.total > 21) {
      return this.endGame();
    }
    return card;
  };

  this.offerNewGame = function () {
    if (confirm("Would you like to play again?")) {
      if (this.human.balance < 10) {
        alert("Sorry, You don't have funds to play, see you next time.");
        return null;
      } else {
        this.init();
        return this.placeBet();
      }
    } else {
      return;
    }
  };

  this.endGame = function () {
    //Process conditions to determine who the winner is

    // Checking for loss
    if (this.human.total > 21) {
      alert("You bust with " + this.human.total + " points!");
      return this.offerNewGame();
    } else if (this.computer.total > 21) {
      alert(
        "The dealer bust with " + this.computer.total + " points! You win!"
      );
      this.human.balance += this.bet * 2;
      return this.offerNewGame();
    }

    if (this.human.total === 21 || this.computer.total === 21) {
      if (this.human.total === this.computer.total) {
        alert("You both got blackjack! What a crazy tie!");
        this.human.balance += this.bet;
      } else if (this.human.total > this.computer.total) {
        alert("You got blackjack and won!");
        this.human.balance += this.bet * 2;
      } else {
        alert("Dealer got blackjack, you lost.");
      }
    } else if (this.human.total > this.computer.total) {
      alert("You won with " + this.human.total + " points!");
      this.human.balance += this.bet * 2;
    } else if (this.human.total < this.computer.total) {
      alert("You lost to the dealer's " + this.computer.total + " points!");
    } else if (this.human.total == this.computer.total) {
      alert("You both tied! None lost or gained..");
      this.human.balance += this.bet;
    }
    return this.offerNewGame();
  };

  this.getTotal = function (player) {
    // this function determines the total value of a hand
    var numOfAces = 0;
    var total = player.hand.reduce(function (acc, card) {
      switch (card.value) {
        case "J":
        case "Q":
        case "K":
          return acc + 10;
        case "A":
          numOfAces++;
          return acc + 11;
        default:
          return acc + Number(card.value);
      }
    }, 0);

    // the following will turn Aces value into 1 when the total value is larger than 21
    while (total > 21 && numOfAces > 0) {
      total = total - 10;
      numOfAces--;
    }

    player.total = total;
    return this.updateDom(player);
  };

  this.startGame = function () {
    // Run all the code to initialize a new game
    this.createCard(this.human);
    this.createCard(this.human);
    this.createCard(this.computer);
    this.getTotal(this.human);
    this.getTotal(this.computer);
    this.updateDom(this.human);
    document.getElementById("hit-btn").disabled = false;
    document.getElementById("stay-btn").disabled = false;
  };

  this.computerTurn = function () {
    let total = this.computer.total;
    alert("Dealer is at " + total + " points");

    if (total > 17) {
      if (total > 21) {
        alert("Bust!");
        return this.endGame();
      } else if (total >= 17) {
        alert("The dealer chose to stay, and...");
        return this.endGame();
      }
    } else {
      alert("The dealer draws a card and...");
      this.createCard(this.computer);
      return this.computerTurn();
    }
  };
};

let gameInstance = new Blackjack();

// The game buttons
let newGameBtn = document
  .getElementById("new-game-btn")
  .addEventListener("click", function () {
    gameInstance.init();
    gameInstance.placeBet();
  });

let hitBtn = document
  .getElementById("hit-btn")
  .addEventListener("click", function () {
    gameInstance.createCard(gameInstance.human);
  });

let stayBtn = document
  .getElementById("stay-btn")
  .addEventListener("click", function () {
    alert("You chose to stay at " + gameInstance.human.total + " points.");
    gameInstance.computerTurn();
  });
