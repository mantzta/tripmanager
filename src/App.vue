<template>
  <section class="app">
    <section class="app__trips">
      <ul class="app__tripsList">
          <TripCard v-for="(trip, index) in trips" v-bind:key="index" v-bind:trip="trip"
            v-bind:tripIndex="index" v-on:show-trip="onShowTrip"
            v-bind:class="getSelectClass(index)"></TripCard>
      </ul>
    </section>
    <Map v-bind:trip="shownTrip"></Map>
  </section>
</template>

<script>
import Map from './components/Map'
import TripCard from './components/TripCard'
import { getTrips } from './utils/api'

export default {
  name: 'App',
  components: {
    Map,
    TripCard
  },
  data () {
    return {
      trips: [],
      shownTrip: null,
      shownTripIndex: -1
    }
  },
  methods: {
    /**
     * @param {number} tripIndex
     */
    onShowTrip: function (tripIndex) {
      this.shownTrip = this.trips[tripIndex]
      this.shownTripIndex = tripIndex
    },
    /**
     * @param {number} index
     * @return {Object<string, boolean>}
     */
    getSelectClass: function (index) {
      return {
        'tripcard--selected': index === this.shownTripIndex
      }
    }
  },
  created () {
    getTrips().then((result) => {
      this.trips = result.data
    }).catch((error) => {
      console.log(error)
    })
  }
}
</script>

<style lang="scss">
html, body, ul, h1, h2 {
  margin: 0;
  padding: 0;
}

.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  width: 100vw;
  height: 100vh;

  &__trips {
    width: 50%;
    min-width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }
}
</style>
