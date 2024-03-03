function parseToMiliseconds(time, unit) {
  const milisecondsPerDay = 24 * 60 * 60 * 1000;
  const milisecondsPerHours = 60 * 60 * 1000;
  const milisecondsPerMinutes = 60 * 1000;

  let equivalence;

  switch (unit.toLowerCase()) {
    case 'day':
    case 'days':
      equivalence = time * milisecondsPerDay;
      break;
    case 'hour':
    case 'hours':
      equivalence = time * milisecondsPerHours;
      break;
    case 'minute':
    case 'minutes':
      equivalence = time * milisecondsPerMinutes;
      break;
    default:
      equivalence = time
  }
  return equivalence;
}

module.exports.parseToMiliseconds = parseToMiliseconds;
