// declarations of global variables takes place here

// current inputs for game
var wordBank = ['GOKU', 'VEGETA', 'GOHAN', 'BULMA', 'TRUNKS', 'MAJIN BOO'];
var hintBank = [
  'Strongest',
  'Prince of all saiyans',
  'Son of strongest',
  'Married prince of all saiyans',
  'Kid of prince of all saiyans',
  'Pink bad guy'];
var letterBank = 'abcdefghijklmnopqrstuvwxyz'.split('');

// html elements
var main = document.getElementsByClassName('main')[0];
var main__title = document.getElementsByClassName('main__title')[0];
var main__word = document.getElementsByClassName('main__word')[0];
var main__drawingArea = document.getElementsByClassName('main__drawingArea')[0];
var main__input = document.getElementsByClassName('main__input')[0];
