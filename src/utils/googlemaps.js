const API_KEY = 'AIzaSyBMGih8dtJIFhg5v1787_kIig8E6TdBZm4'
const CALLBACK_NAME = 'googlemaps'

let initialized = !!window.google
let resolveInitPromise
let rejectInitPromise

const initPromise = new Promise((resolve, reject) => {
  resolveInitPromise = resolve
  rejectInitPromise = reject
})

/**
 * @return {promise}
 */
export default function init () {
  if (initialized) return initPromise

  initialized = true
  window[CALLBACK_NAME] = () => resolveInitPromise(window.google)

  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${CALLBACK_NAME}&libraries=geometry`
  script.onerror = rejectInitPromise
  document.querySelector('head').appendChild(script)

  return initPromise
}
