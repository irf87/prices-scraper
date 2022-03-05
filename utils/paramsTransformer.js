const transform = (param) => {
  if (typeof param === 'string') {
    return `'${param}'`;
  }
  return param;
}

module.exports = {
  transform
};