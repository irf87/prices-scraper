const transform = (param) => {
  if (typeof param === 'string') {
    return `'${param}'`;
  }
  return param;
}

const cleanString = (str) => {
  if (typeof str !== 'string') return `''`;
  return `'${str}'`;
}

const booleanToNumber = (bool) => {
  if (typeof bool === 'boolean' && bool) return 1;
  if (typeof bool === 'boolean' && !bool) return 0;
  if (typeof bool === 'string' && bool.toLocaleLowerCase() === 'true') return 1;
  if (typeof bool === 'string' && bool.toLocaleLowerCase() === 'false') return 0;
  return 0;
}

module.exports = {
  transform,
  cleanString,
  booleanToNumber,
};