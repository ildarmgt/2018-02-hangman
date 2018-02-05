// main body of javascript code

class Game {
  constructor (inWordBank, inHintBank, inLetterBank) {
    // words to use
    this.initialWordBank = inWordBank.join().toUpperCase().split(','); // array[string]
    // hints to use
    this.initialHintBank = inHintBank; // array[string]
    // alphabet to use
    this.initialAlphabetBank = inLetterBank.join().toUpperCase().split(','); // array[string]

    // reset the game with initial parameters (reusable!)
    // slice passes by value (shallow)
    this.gameReset(this.initialWordBank.slice(0), this.initialHintBank.slice(0), this.initialAlphabetBank.slice(0));

    // draw the view and sit and wait for clicks
    this.refreshUI(); // no return

    console.log(timeStamp() + ': New game created!');
    // stand by mode
  }

  gameReset (inWordBank2, inHintBank2, inLetterBank2, inLives = 6, inPoints = 0) {
    this.livesLeft = inLives;
    this.points = inPoints;

    this.wordBank = inWordBank2.join().toUpperCase().split(','); // array[string]
    // hints to use
    this.hintBank = inHintBank2; // array[string]
    // alphabet to use
    this.alphabet = inLetterBank2.join().toUpperCase().split(','); // array[string]

    this.currentIndex = null; // random word's index in wordBank // integer
    this.word = []; // random word itself // array[string]
    this.hint = ''; // the hint for rnd word // string
    this.revealedLetterInWord = []; // status for each letter in word // array( bool)
    this.lastMatches = []; // indecies of matches for last guess in Word // array[int]
    this.lastGuess = ''; // last guess for easy access // String

    this.usedLetterInAbcs = []; // alphabet letters used // array[bool]

    // select an active word
    this.selectActiveWord(); // no return
  }

  selectActiveWord () {
    // selection of word goes here
    console.log('########what word bank Im using #######');
    console.log(this.wordBank);
    this.currentIndex = this.getRnd(this.wordBank.length); // random word's index
    this.word = this.wordBank[this.currentIndex].split(''); // random word itself
    this.hint = this.hintBank[this.currentIndex]; // the hint for rnd word
    this.revealedLetterInWord = Array(this.word.length).fill(false); // reset status
    this.usedLetterInAbcs = Array(this.alphabet.length).fill(false); // reset status

    console.log(timeStamp() + ': this.currentIndex = ' + this.currentIndex);
    console.log(timeStamp() + ': word is ' + this.word);
    console.log(timeStamp() + ': hint is ' + this.hint);
  }

  guessLetter (inAbcLetter, inAbcIndex) {
    // logic for checking if the guess is win or loss
    // called from mouse click on input buttons
    // comes back and refreshes UI in mouse click event
    // Input letter already marked as used,
    // letters in active word are marked here

    this.lastGuess = inAbcLetter;
    console.log(timeStamp() + ': guess= ' + inAbcLetter + ' #' + inAbcIndex);

    // test the current word against the inLetter
    // -1 means not found. 0+ is index in array
    this.lastMatches = returnAllIndexesOfMatch(this.word, inAbcLetter);
    console.log(timeStamp() + ': matches indecies = ' + (this.lastMatches.join() || 'n/a'));

    // for each index where match was found, mark letter in word revealed
    this.lastMatches.forEach((matchedIndex) => {
      this.revealedLetterInWord[matchedIndex] = true;
    });

    // game rules that respond to correct or incorrect guesses

    this.checkGameProgress(); // udate game based on rules
  }

  checkGameProgress () {
    // first update lives and points

    let nMatches = this.lastMatches.length;
    if (nMatches) {
      this.correctAnswer(nMatches, 1);
    } else {
      this.wrongAnswer(1);
    }

    // check for loss
    if (this.isGameOver()) {
      console.log(timeStamp() + ': Game over');
      this.endGame();
    }

    // check for game won
    if (this.isRoundWon()) {
      // this round is over
      if (this.isLastRound()) {
        // if all the rounds are over, say it's done
        console.log(timeStamp() + ': Game won with ' + this.points + ' points!');
        this.beatGame();
      } else {
        // if the round is over, let user move onto next round
        console.log(timeStamp() + ': Round won with ' + this.points + ' points!');
        this.continueGame();
      }
    }
  }

  isRoundWon () {
    // check if any letters left to solve
    let won = true;
    this.word.forEach((eaLetter, eaIndex) => {
      if (!this.isSpaceAtThisIndexInWord(eaIndex) && !this.isRevealedIndexInWord(eaIndex)) {
        // looking for at least 1 letter not yet solved
        // if this letter is not a space AND not solved/revealed, it's not a win
        won = false;
      }
    });
    // if it goes through loop and finds no unsolved letters that aren't spaces, win
    return won;
  }

  isLastRound () {
    // check if more rounds left
    return (this.wordBank.length <= 1);
  }

  isGameOver () {
    // if 1 or more lives, not game over, otherwise game over
    return Boolean(this.livesLeft <= 0);
  }

  endGame () {
    // game over result
    main__results.style.display = 'block'; // show it
    main__results__stats.classList.add('main__results__stats_loss');
    main__results__btnOk.classList.add('main__results__btnOk_loss');
    main__results__stats.innerHTML = '<br><b>Game Over</b><br><br>' +
      'Points: ' + this.points + '<br><br>' +
      'Restart the game when ready';
    main__results__btnOk.innerHTML = 'Restart';

    // reset events & addd new one
    var self = this;
    var btnOkOnclick = function () {
      // go back to initial settings
      self.gameReset(self.initialWordBank, self.initialHintBank, self.initialAlphabetBank);
      // draw the view and sit and wait for clicks
      self.refreshUI(); // no return

      console.log(timeStamp() + ': Game reset, new game on!');

      main__results.style.display = 'none'; // make game over screen go away
      main__results__stats.classList.remove('main__results__stats_loss');
      main__results__btnOk.classList.remove('main__results__btnOk_loss');
      main__results__btnOk.removeEventListener('click', btnOkOnclick);
    };
    main__results__btnOk.addEventListener('click', btnOkOnclick);
  }

  continueGame () {
    main__results.style.display = 'block'; // show it

    main__results__stats.innerHTML = '<br><b>Round beat!</b><br><br>' +
      'Points: ' + this.points + '<br><br>' +
      'Continue the game when ready';
    main__results__btnOk.innerHTML = 'Continue';

    // reset events & addd new one
    var self = this;
    var btnOkOnclick = function () {
      // remove the current word from bank and reset
      // remove current word & related
      self.wordBank.splice(self.currentIndex, 1);
      self.hintBank.splice(self.currentIndex, 1);

      // reset game with new parameters
      self.gameReset(self.wordBank, self.hintBank, self.alphabet, undefined, self.points);
      // draw the view and sit and wait for clicks
      self.refreshUI(); // no return

      console.log(timeStamp() + ': Game reset, new game on!');

      main__results.style.display = 'none'; // make game over screen go away
      main__results__btnOk.removeEventListener('click', btnOkOnclick);
    };
    main__results__btnOk.addEventListener('click', btnOkOnclick);
  }

  beatGame () {
    main__results.style.display = 'block'; // show it

    main__results__stats.innerHTML = '<br><b>Game beat!</b><br><br>' +
      'Points: ' + this.points + '<br><br>' +
      'Done! Reset game to try again.';
    main__results__btnOk.innerHTML = 'Reset';

    // reset events & addd new one
    var self = this;
    var btnOkOnclick = function () {
      // reset game with new parameters
      self.gameReset(self.initialWordBank, self.initialHintBank, self.initialAlphabetBank);
      // draw the view and sit and wait for clicks
      self.refreshUI(); // no return

      console.log(timeStamp() + ': Game reset, new game on!');

      main__results.style.display = 'none'; // make game over screen go away
      main__results__btnOk.removeEventListener('click', btnOkOnclick);
    };
    main__results__btnOk.addEventListener('click', btnOkOnclick);
  }

  correctAnswer (inMatches, inPoints = 1) {
    // win
    this.points += inMatches * inPoints;
    console.log(timeStamp() + ': Found! Points = ' + this.points);
  }

  wrongAnswer (inLives = 1) {
    // loss
    this.livesLeft -= inLives;
    console.log(timeStamp() + ': Not found! Lives = ' + this.livesLeft);
  }

  getRnd (inNumber) {
    // return Math.floor(Math.abs(sjcl.random.words(1, 2) * (new Date()).getSeconds() % inNumber));
    return Math.floor(Math.random() * inNumber); // 0 .. 1 .. to (Number - 1)
  }

  isRevealedIndexInWord (indexInWord) {
    // return true if this index in word has a revealed letter
    // console.log(timeStamp() + ': isRevealedIndexInWord(' + indexInWord);
    return this.revealedLetterInWord[indexInWord];
  }

  isSpaceAtThisIndexInWord (indexInWord) {
    // return true if this index in word has a space

    return this.word[indexInWord] === ' ';
  }

  drawTheWordPart () {
    // make the letters for active WORD appear

    this.word.forEach((elementInWord, indexInWord) => {
      var divWordLetter = document.createElement('div');
      main__word.appendChild(divWordLetter);

      if (this.revealedLetterInWord[indexInWord]) {
        // revealed letter
        divWordLetter.innerHTML = elementInWord;

        // console.log(timeStamp() + ': true <- isRevealedIndexInWord(' + indexInWord);
        divWordLetter.setAttribute('class', 'main__word__tile main__word__tile_revealed');
      } else if (this.isSpaceAtThisIndexInWord(indexInWord)) {
        // is blank space
        // console.log(timeStamp() + ': true <- isSpaceAtThisIndexInWord(' + indexInWord);
        divWordLetter.setAttribute('class', 'main__word__tile');
      } else {
        // hidden letter
        // console.log(timeStamp() + ': Still hidden: ' + elementInWord);
        divWordLetter.setAttribute('class', 'main__word__tile main__word__tile_hidden');
      }
    });
  }

  drawHangman () {
    let hangmanX = 200;
    let hangmanY = 70;
    // https://www.w3schools.com/tags/ref_canvas.asp
    // clear and set settings
    main__drawingArea_2d.clearRect(0, 0, main__drawingArea.width, main__drawingArea.height);
    main__drawingArea_2d.beginPath(); // start design
    main__drawingArea_2d.lineWidth = 2;
    main__drawingArea_2d.lineCap = 'round';
    main__drawingArea_2d.strokeStyle = '#3A91D0';

    if (this.livesLeft < 6) {
      // draw head
      // arc( centerX, centerY, radius, radians from right, clockwise/counterclockwise)
      main__drawingArea_2d.arc(hangmanX, hangmanY, 20, 0, 2 * Math.PI);
    }

    if (this.livesLeft < 5) {
      // draw body
      main__drawingArea_2d.rect(hangmanX, hangmanY + 20, 0, 80); // rect(x,y,width,height)
    }

    if (this.livesLeft < 4) {
      // draw left leg
      main__drawingArea_2d.moveTo(hangmanX, hangmanY + 100); // move pen here
      main__drawingArea_2d.lineTo(hangmanX - 30, hangmanY + 100 + 70); // draw line to here
    }

    if (this.livesLeft < 3) {
      // draw right leg
      main__drawingArea_2d.moveTo(hangmanX, hangmanY + 100); // move pen here
      main__drawingArea_2d.lineTo(hangmanX + 30, hangmanY + 100 + 70); // draw line to here
    }
    if (this.livesLeft < 2) {
      // draw left arm
      main__drawingArea_2d.moveTo(hangmanX, hangmanY + 20); // move pen here
      main__drawingArea_2d.lineTo(hangmanX - 30, hangmanY + 20 + 70); // draw line to here
    }
    if (this.livesLeft < 1) {
      // draw right arm
      main__drawingArea_2d.moveTo(hangmanX, hangmanY + 20); // move pen here
      main__drawingArea_2d.lineTo(hangmanX + 30, hangmanY + 20 + 70); // draw line to here
      main__drawingArea_2d.stroke();
    }

    // draw rope
    main__drawingArea_2d.moveTo(hangmanX, hangmanY - 20); // move pen here
    main__drawingArea_2d.lineTo(hangmanX, hangmanY - 20 - 20); // draw line to here
    // draw top plank
    main__drawingArea_2d.lineTo(hangmanX + 100, hangmanY - 20 - 20); // draw line to here
    // draw upward plank
    main__drawingArea_2d.lineTo(hangmanX + 100, hangmanY + 200);
    // draw bottom plank
    main__drawingArea_2d.lineTo(hangmanX - 100, hangmanY + 200);

    // actually write the drawing
    main__drawingArea_2d.stroke(); // draw
  }

  drawKeyBoard () {
    // make buttons in main__input

    // and now redraw it letter by letter
    // var self = this;
    var self = this; // in case need extra scope for events
    this.alphabet.forEach((element, index) => {
      var thisButton = document.createElement('div');

      if (this.usedLetterInAbcs[index]) {
        thisButton.setAttribute('class', 'main__input__btnLetter main__input__btnLetter_used');
        // console.log(timeStamp() + ': used letter');
      } else {
        thisButton.setAttribute('class', 'main__input__btnLetter main__input__btnLetter_ready');
        thisButton.addEventListener('click', () => thisButtonOnClick(element, index));
        // console.log(timeStamp() + ': avail letter');
      }

      // add click event here on every available button
      function thisButtonOnClick (inElement, inIndex) {
        console.log(timeStamp() + ': click event activated for letter ' + inElement);
        self.usedLetterInAbcs[index] = true; // mark letter as used
        self.guessLetter(inElement, inIndex);
        self.refreshUI(); // this calls for a refresh
      }

      thisButton.innerHTML = element; // writes letter on button
      main__input.appendChild(thisButton); // puts it into the input div
    });
    console.log(timeStamp() + ': UI refreshed');
    console.log(' ');
  }

  drawTheWideBlock (inWidth) {
    for (let i = 0; i < inWidth; i++) {
      var divBoard = document.createElement('div');
      divBoard.setAttribute('class', 'main__word__tile main__word__tile_board');
      main__word.appendChild(divBoard);
    }
  }

  refreshText () {
    main__hint.innerHTML = 'Hint: ' + this.hint;
    main__score.innerHTML = 'Score: ' + this.points;
    main__lives.innerHTML = 'Lives: ' + this.livesLeft;
  }

  refreshUI () {
    // inputs first
    main__input.innerHTML = ''; // clear div
    this.drawKeyBoard();

    // draw the word section
    main__word.innerHTML = ''; // clear word area
    this.drawTheWideBlock(MAX_LENGTH + 2); // fill top row
    main__word.innerHTML += '<br>';
    this.drawTheWideBlock(1); // fill to left of word
    this.drawTheWordPart(); // word itself;
    this.drawTheWideBlock(MAX_LENGTH + 1 - this.word.length); // fill to right of word
    main__word.innerHTML += '<br>';
    this.drawTheWideBlock(MAX_LENGTH + 2); // fill bottom row

    // refresh hint, lives, and score
    this.refreshText();

    // draw hangman
    this.drawHangman();
  }
}

var game = new Game(wordBank, hintBank, letterBank);
console.log(game);
