function printDate() {
  let date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let hour = date.getHours();
  let min = date.getMinutes();

  if (day < 10) day = '0' + day;
  if (month < 10) month = '0' + month;

  if (hour < 10) hour = '0' + hour;
  if (min < 10) min = '0' + min;

  const formatedDate = `${day}/${month}/${year} ${hour}:${min}`;
  console.log(formatedDate);
}

module.exports.printDate = printDate;