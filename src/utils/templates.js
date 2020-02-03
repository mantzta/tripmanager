/**
 * @param {string} address
 * @param {string} date
 * @param {string} time
 * @return {string}
 */
export function getLocationMarkerTemplate (address, date, time) {
  return `<h1>${address}</h1>
    <div>At ${time}</div>
    <div>${date}</div>`
}

/**
 * @param {string} address
 * @param {string} date
 * @param {string} time
 * @param {number} price
 * @param {boolean} paid
 * @return {string}
 */
export function getStopMarkerTemplate (address, date, time, price, paid) {
  const paidString = paid ? `<div><b>You paid already!</b></div>` : ``

  return `<h1>${address}</h1>
    <div>Departs at ${time}</div>
    <div>Price: ${price.toFixed(2)}€</div>
    ${paidString}
    <div>${date}</div>`
}
