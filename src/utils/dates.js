/**
 * @param {string} isoDate
 * @return {string}
 */
export function getDateString (isoDate) {
  const date = new Date(isoDate)
  const day = date.getUTCDay()
  const month = date.getUTCMonth() + 1 // months start from 0 (0 = January)
  const year = date.getUTCFullYear()

  return `${day}.${month}.${year}`
}

/**
 * @param {string} isoDate
 * @return {string}
 */
export function getTimeString (isoDate) {
  const date = new Date(isoDate)
  const hour = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours()
  const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes()

  return `${hour}:${minutes}`
}
