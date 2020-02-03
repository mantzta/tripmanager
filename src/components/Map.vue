<template>
  <section class="map">
  </section>
</template>

<script>
import googleMapsInit from '../utils/googlemaps'
import { getStop } from '../utils/api'
import { getDateString, getTimeString } from '../utils/dates'
import { getLocationMarkerTemplate, getStopMarkerTemplate } from '../utils/templates'

export default {
  name: 'Map',
  data () {
    return {
      google: null,
      map: null,
      markers: [],
      shownTripPath: null
    }
  },
  props: {trip: (Object | null)},
  /**
   * Create Google Map initially
   */
  async mounted () {
    try {
      // store object in data to have access in other functions
      this.google = await googleMapsInit()
      // Initially set a polyline for a trip without path
      this.shownTripPath = new this.google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3
      })
      const geocoder = new this.google.maps.Geocoder()
      const map = new this.google.maps.Map(this.$el)

      geocoder.geocode({ address: 'Barcelona, Spain' }, (results, status) => {
        if (status !== 'OK' || !results[0]) {
          throw new Error(status)
        }

        map.setCenter(results[0].geometry.location)
        map.fitBounds(results[0].geometry.viewport)
      })

      this.map = map
    } catch (error) {
      console.error(error)
    }
  },
  watch: {
    /**
     * Once the map gets a value for trip passed, it has to draw the trip line and stop markers
     */
    trip: function () {
      const latlngArray = this.google.maps.geometry.encoding.decodePath(this.trip.route)

      if (latlngArray.length > 0) {
        // bounds needed to show only the part of the map of the trip
        let bounds = new this.google.maps.LatLngBounds()
        // Show stops that are on the bus route
        const stops = this.getActualStops(latlngArray, this.trip.stops)

        // In case if a map with markers has been shown already, delete it
        this.deleteAllStops()

        // Marker for origin and add to bounds, so that the map is zoomed properly to see the point
        this.createMarker(this.trip.origin.point._latitude, this.trip.origin.point._longitude, {
          address: this.trip.origin.address,
          isoDate: this.trip.startTime
        }, false)
        bounds = bounds.extend(new this.google.maps.LatLng(this.trip.origin.point._latitude, this.trip.origin.point._longitude))

        // Marker for destination
        this.createMarker(this.trip.destination.point._latitude,
          this.trip.destination.point._longitude, {
            address: this.trip.destination.address,
            isoDate: this.trip.endTime
          }, false)
        bounds = bounds.extend(new this.google.maps.LatLng(this.trip.destination.point._latitude, this.trip.destination.point._longitude))

        // Add markers for all stops on the map
        stops.length > 0 && this.setStopsOnMap(stops)

        stops.forEach((stop) => {
          // Add each stops latitude/longitude to set the bound accordingly
          bounds = bounds.extend(new this.google.maps.LatLng(stop.point._latitude, stop.point._longitude))
        })

        this.map.fitBounds(bounds)
        // Delete previous path
        this.shownTripPath.setMap(null)
        // Set path of newly clicked trip
        this.shownTripPath.setPath(latlngArray)
        // Show path on map
        this.shownTripPath.setMap(this.map)
      }
    }
  },
  methods: {
    /**
     * Create a marker on the map with an info window popping up on click
     * @param {number} lat
     * @param {number} lng
     * @param {object|string} info we want to show in the info window of the marker
     * @param {boolean} isStop
     */
    createMarker (lat, lng, info, isStop) {
      const latlng = new this.google.maps.LatLng(lat, lng)
      const marker = new this.google.maps.Marker({
        position: latlng,
        map: this.map
      })

      const infoWindow = new this.google.maps.InfoWindow()

      if (isStop) {
        marker.addListener(`click`, this.showStopInfo.bind(this, infoWindow, marker, info))
      } else {
        marker.addListener(`click`, this.showLocationInfo.bind(this, infoWindow, marker,
          info.address, info.isoDate))
      }

      this.markers.push(marker)
    },
    /**
     * Delete markers on the map
     */
    deleteAllStops () {
      this.markers.forEach((marker) => {
        marker.setMap(null)
      })

      this.markers = []
    },
    /**
     * In case there are stops retrieved that are not on the bus route, return only relevant stops
     * @param {Array<object>} points
     * @param {Array<object>} stops
     * @return {Array<object>}
     */
    getActualStops (points, stops) {
      const actualStops = []

      stops.forEach((stop) => {
        let actualStop

        if (stop.point && stop.point._latitude && stop.point._longitude) {
          for (let i = 0, len = points.length; i < len; i++) {
            if ((Math.round(points[i].lat() * 100) === Math.round(stop.point._latitude * 100) &&
            Math.round(points[i].lng() * 100) === Math.round(stop.point._longitude * 100))) {
              actualStop = stop
            }
          }
        }

        actualStop && actualStops.push(actualStop)
      })

      return actualStops
    },
    /**
     * Create markers for every stop in Array
     * @param {Array<object>}
     */
    setStopsOnMap (stops) {
      stops.forEach((stop) => {
        if (stop.point) {
          this.createMarker(stop.point._latitude, stop.point._longitude, stop.id, true)
        }
      })
    },
    /**
     * Shows info on click of location marker, which can be either origin or destination (since there is
     * not as much information as for a stop, another function to create the info windows content is needed)
     * @param {object} infoWindow
     * @param {object} marker
     * @param {string} address
     * @param {string} isoDate
     */
    showLocationInfo (infoWindow, marker, address, isoDate) {
      const content = getLocationMarkerTemplate(address, getDateString(isoDate), getTimeString(isoDate))
      infoWindow.setContent(content)
      infoWindow.open(this.map, marker)
    },
    /**
     * Show info on click of stop marker
     * @param {object} infoWindow
     * @param {object} marker
     * @param {number} stopID
     */
    showStopInfo (infoWindow, marker, stopID) {
      getStop(stopID).then((result) => {
        const stop = result.data
        const content = getStopMarkerTemplate(stop.address, getDateString(stop.stopTime),
          getTimeString(stop.stopTime), stop.price, stop.paid)
        infoWindow.setContent(content)
        infoWindow.open(this.map, marker)
      }).catch((error) => {
        infoWindow.setContent(`Sorry, no data available.`)
        infoWindow.open(this.map, marker)
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.map {
  height: 100vh;
  width: 100%;
}
</style>
