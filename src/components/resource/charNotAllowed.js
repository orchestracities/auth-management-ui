
export default function charNotAllowed  (toControl) {
const characters=[
      '!',
      '# ',
      '$',
      '%',
      '&',
      "'",
      '(',
      ')',
      '*',
      '+',
      ',',
      '.',
      '/',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      ': ',
      ';',
      '<',
      '=',
      '>',
      '?',
      '@',
      '[',
      '/',
      ']',
      '^',
      '`',
      '{',
      '|',
      '}',
      '~',
      '£',
      'Ø',
      '×',
      'ª',
      'º',
      '¿',
      '®',
      '¬',
      '½',
      '¼',
      '¡',
      '«',
      '»',
      '░',
      '▒',
      '▓',
      '│',
      '┤',
      '©',
      '╣',
      '║',
      '╗',
      '╝',
      '¢',
      '¥',
      '┐',
      '└',
      '┴',
      '┬',
      '├',
      '─',
      '┼',
      '╚',
      '╔',
      '╩',
      '╦',
      '╠',
      '═',
      '╬',
      '¤',
      'ı ',
      'Í',
      'Î',
      'Ï',
      '┘',
      '┌',
      '█',
      '▄',
      '¦',
      'Ì',
      '▀',
      '¯',
      '´',
      '≡',
      '±',
      '‗',
      '¾',
      '¶',
      '§',
      '÷',
      '¸',
      '°',
      '¨',
      '·',
      '¹',
      '³',
      '²',
      '■',
      'nbsp',
      'ñ',
      'Ñ',
      '@',
      '¿',
      '?',
      '¡',
      '!',
      ':',
      '/',
      '½',
      '¼',
      '¾',
      '¹',
      '³',
      '²',
      'ƒ',
      '±',
      '×',
      '÷',
      '$',
      '£',
      '¥',
      '¢',
      '¤',
      '®',
      '©',
      'ª',
      'º',
      '°',
      "'",
      "'",
      '(',
      ')',
      '[',
      ']',
      '{',
      '}',
      '«',
      '»',
  ];
  
 let result;
 for (let string of characters){

    console.log(toControl.indexOf(string));

    if(toControl.indexOf(string)>-1)
   { return true}
    else{result=false;}
 }
 return result;

}