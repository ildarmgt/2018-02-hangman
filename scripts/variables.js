// declarations of global variables takes place here

// current inputs for game

// var wordBank = [
//   'GOKU',
//   'VEGETA'];
//
// var hintBank = [
//   'Strongest',
//   'Prince of all saiyans'];

var wordBank = [
  'GOKU',
  'VEGETA',
  'GOHAN',
  'BULMA',
  'TRUNKS',
  'Majin Buu',
  'BROLLY',
  'Frieza',
  'Krillin',
  'Videl',
  'Shenron'];

var hintBank = [
  'Strongest',
  'Prince of all saiyans',
  'Son of strongest',
  'Married prince of all saiyans',
  'Kid of prince of all saiyans',
  'Pink bad guy',
  'Legendary super saiyan',
  'Destroyed planet Vegeta',
  'Strongest human',
  'Mother of Gotenks',
  'Earth\'s dragon'];

var letterBank = 'abcdefghijklmnopqrstuvwxyz'.split('');

// html elements
var main = document.getElementsByClassName('main')[0];
var main__title = document.getElementsByClassName('main__title')[0];
var main__word = document.getElementsByClassName('main__word')[0];
var main__drawingArea = document.getElementsByClassName('main__drawingArea')[0];
var main__input = document.getElementsByClassName('main__input')[0];
var main__hint = document.getElementsByClassName('main__hint')[0];
var main__results = document.getElementsByClassName('main__results')[0];
var main__results__stats = document.getElementsByClassName('main__results__stats')[0];
var main__results__btnOk = document.getElementsByClassName('main__results__btnOk')[0];
var main__drawingArea = document.getElementsByClassName('main__drawingArea')[0];
var main__drawingArea_2d = main__drawingArea.getContext('2d');
var main__score = document.getElementsByClassName('main__score')[0];
var main__lives = document.getElementsByClassName('main__lives')[0];


const MAX_LENGTH = 12; // longest word
