// helper general functions

function timeStamp () {
  let time = new Date();
  return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' +
    time.getHours() + ':' + time.getMinutes() + ':' +
    time.getSeconds() + '.' + time.getMilliseconds();
}

function returnAllIndexesOfMatch (searchInThisArray, searchForThisChar) {
  // takes array and search char
  // returns array of all indecies of it
  // returns length of 0 array if no match

  let temp = searchInThisArray.map((element, index) => {
    // for every ~letter in ~word
    console.log(timeStamp() + ': comparing ' + element + ' and ' + searchForThisChar);
    if (element === searchForThisChar) {
      // replace each value with its index if match
      return index;
    } else {
      // replace with null if not a match
      return '';
    }
  }).filter(
      // create array from only non empty values
      (eaValue) => !(eaValue === '')
  );
  return temp; // done
}
