const colog = (log, co, bco = 'default') => console.log(`${color[co]}${bcolor[bco]}${log}\x1b[0m`);
const cologn = (log, co, bco = 'default') => process.stdout.write(`${color[co]}${bcolor[bco]}${log}\x1b[0m`);

const color = {
  default: '\x1b[39m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  lgray: '\x1b[90m',
  lred: '\x1b[91m',
  lgreen: '\x1b[92m',
  lyellow: '\x1b[93m',
  lblue: '\x1b[94m',
  lmagenta: '\x1b[95m',
  lcyan: '\x1b[96m',
  lwhite: '\x1b[97m',
};

const bcolor = {
  default: '\x1b[49m',
  black: '\x1b[40m',
  red: '\x1b[41m',
  green: '\x1b[42m',
  yellow: '\x1b[43m',
  blue: '\x1b[44m',
  magenta: '\x1b[45m',
  cyan: '\x1b[46m',
  white: '\x1b[47m',
  lgray: '\x1b[100m',
  lred: '\x1b[101m',
  lgreen: '\x1b[102m',
  lyellow: '\x1b[103m',
  lblue: '\x1b[104m',
  lmagenta: '\x1b[105m',
  lcyan: '\x1b[106m',
  lwhite: '\x1b[107m',
}

module.exports = {
  color,
  bcolor,
  colog,
  cologn
}