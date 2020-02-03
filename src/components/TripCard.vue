<template>
  <li class="tripcard" v-on:click=onClick>
    <h2 class="tripcard__heading">
      {{trip.description}}
    </h2>
    <section>
      <div class="tripcard__info">
        Status: {{trip.status}}
      </div>
      <div class="tripcard__info">
        Origin: {{trip.origin.address}}
      </div>
      <div class="tripcard__info">
        Destination: {{trip.destination.address}}
      </div>
    </section>
  </li>
</template>

<script>
export default {
  name: 'TripCard',
  props: {
    tripIndex: Number,
    trip: Object
  },
  methods: {
    onClick () {
      this.$emit('show-trip', this.tripIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.tripcard {
  list-style: none;
  min-height: 100px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.089);
  cursor: pointer;
  padding: 15px;

  &:hover {
    background-color: rgb(177, 224, 255);
  }

  &--selected {
    background-color: rgb(205, 235, 255);
  }

  &__heading {
    font-size: 18px;
    margin-bottom: 5px;
  }

  &__info {
    margin-bottom: 2px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
