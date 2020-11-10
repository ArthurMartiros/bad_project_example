module.exports = (
  orderCount,
  tableNumber,
  client_name,
  call = false,
  fee = false
) => {
  console.log("orderCount: ", orderCount, " tebleNumber: ", tableNumber);
  let str = tableNumber.toString();
  let strRes = str[str.length - 1];
  let res;
  let out;

  if (str[str.length - 2] == 1) {
    strRes = 4;
  }

  switch (+strRes) {
    case 1:
      res = "st";
      break;
    case 2:
      res = "nd";
      break;
    case 3:
      res = "rd";
      break;
    default:
      res = "th";
      break;
  }
  if (fee) {
    return `${client_name ||
      "Unknown Client"}, asked a bill from table - ${tableNumber}`;
  }
  if (call) {
    return `You have called from ${tableNumber}${res} table.`;
  }
  if (orderCount == 1) {
    return `You have ${orderCount} new order from ${tableNumber}${res} table.`;
  }
  return `You have ${orderCount} new orders from ${tableNumber}${res} table.`;
};
