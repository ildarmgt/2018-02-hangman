// main body of javascript code

class Game {
  constructor (inWordBank, inHintBank, inLetterBank) {
    // list of all the properties of the class

    // words to use
    this.wordBank = inWordBank.join().toUpperCase().split(','); // array[string]
    // hints to use
    this.hintBank = inHintBank; // array[string]

    // alphabet to use
    this.alphabet = inLetterBank.join().toUpperCase().split(','); // array[string]

    this.randomIndex = null; // random word's index in wordBank // integer
    this.randomWord = []; // random word itself // array[string]
    this.randomHint = ''; // the hint for rnd word // string
    this.revealedLetterInWord = []; // status for each letter in word // array( bool)
    this.lastMatches = []; // indecies of matches for last guess in Word // array[int]
    this.lastGuess = ''; // last guess for easy access // String

    this.usedLetterInAbcs = []; // alphabet letters used // array[bool]

    // select an active word
    this.selectActiveWord(); // no return

    // draw the view and sit and wait for clicks
    this.refreshUI(); // no return

    console.log(timeStamp() + ': New game created!');
    // stand by mode
  }

  selectActiveWord () {
    // selection of word goes here
    this.randomIndex = this.getRnd(this.wordBank.length); // random word's index
    this.randomWord = this.wordBank[this.randomIndex].split(''); // random word itself
    this.randomHint = this.hintBank[this.randomIndex]; // the hint for rnd word
    this.revealedLetterInWord = Array(this.randomWord.length).fill(false); // reset status
    this.usedLetterInAbcs = Array(this.alphabet.length).fill(false); // reset status

    console.log(timeStamp() + ': rnd = ' + this.randomIndex);
    console.log(timeStamp() + ': word is ' + this.wordBank[this.randomIndex]);
    console.log(timeStamp() + ': hint is ' + this.hintBank[this.randomIndex]);
  }

  guessLetter (inAbcLetter, inAbcIndex) {
    // logic for checking if the guess is win or loss
    // called from mouse click on input buttons
    // comes back and refreshes UI in mouse click event
    // Input letter already marked as used,
    // letters in active word not marked yet.

    this.lastGuess = inAbcLetter;
    console.log(timeStamp() + ': guess= ' + inAbcLetter + ' #' + inAbcIndex);

    // test the current word against the inLetter
    // -1 means not found. 0+ is index in array
    let findLetters = returnAllIndexesOfMatch(this.randomWord, inAbcLetter);
    console.log(timeStamp() + ': matches indecies = ' + findLetters.join());

    // for each index where match was found, mark letter in word revealed

    findLetters.forEach((matchedIndex) => {
      this.revealedLetterInWord[matchedIndex] = true;
    });
  }

  getRnd (inNumber) {
    // return Math.floor(Math.abs(sjcl.random.randomWords(1, 2) * (new Date()).getSeconds() % inNumber));
    return Math.floor(Math.random() * inNumber); // 0 .. 1 .. to (Number - 1)
  }

  isRevealedIndexInWord (indexInWord) {
    // return true if this index in word has a revealed letter
    console.log(timeStamp() + ': isRevealedIndexInWord(' + indexInWord);
    return this.revealedLetterInWord[indexInWord];
  }

  isSpaceAtThisIndexInWord (indexInWord) {
    // return true if this index in word has a space

    return this.randomWord[indexInWord] === ' ';
  }

  refreshUI () {
    // make the letters for active WORD appear
    main__word.innerHTML = '';
    var self = this; // in case need extra scope for events
    this.randomWord.forEach((elementInWord, indexInWord) => {
      var divWordLetter = document.createElement('div');
      main__word.appendChild(divWordLetter);

      if (this.revealedLetterInWord[indexInWord]) {
        // revealed letter
        divWordLetter.innerHTML = elementInWord;

        console.log(timeStamp() + ': true <- isRevealedIndexInWord(' + indexInWord);
        divWordLetter.setAttribute('class', 'main__word_revealed');
      } else if (this.isSpaceAtThisIndexInWord(indexInWord)) {
        // is blank space
        console.log(timeStamp() + ': true <- isSpaceAtThisIndexInWord(' + indexInWord);
        divWordLetter.setAttribute('class', 'main__word_space');
      } else {
        // hidden letter
        console.log(timeStamp() + ': Still hidden: ' + elementInWord);
        divWordLetter.setAttribute('class', 'main__word_hidden');
      }
    });

    // make buttons in main__input
    main__input.innerHTML = ''; // clear div
    // and now redraw it letter by letter
    // var self = this;
    this.alphabet.forEach((element, index) => {
      var thisButton = document.createElement('div');

      if (this.usedLetterInAbcs[index]) {
        thisButton.setAttribute('class', 'main__input__btnLetter_used');
        // console.log(timeStamp() + ': used letter');
      } else {
        thisButton.setAttribute('class', 'main__input__btnLetter');
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
  }
}

var game = new Game(wordBank, hintBank, letterBank);
console.log(game);
