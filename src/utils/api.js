const axios = require('axios')
const APIBase = `https://europe-west1-metropolis-fe-test.cloudfunctions.net/api`

/**
 * @return {promise}
 */
export function getTrips () {
  return axios.get(`${APIBase}/trips`)
}

/**
 * @param {number} stopID
 * @return {promise}
 */
export function getStop (stopID) {
  return axios.get(`${APIBase}/stops/${stopID}`)
}
