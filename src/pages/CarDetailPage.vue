<template>
  <v-container>
    <WaitingLayer v-if="loading" />
    <div v-else>
      <span class="text-h2">{{ title }}</span>
      <CarDetailForm
        :car="car"
        @submit="updateCar"
      />
    </div>
  </v-container>
</template>

<script>
import notificationService from '../service/notification-service'
import CarDetailForm from '../components/CarDetailForm.vue'
import WaitingLayer from '../components/WaitingLayer.vue'
import carService from '../service/car-service'
import userService from '../service/user-service'
import router from '../router'

export default {
  components: {
    CarDetailForm,
    WaitingLayer
  },
  props: {
    carId: {
      type: String,
      default: null
    }
  },
  data: () => {
    return {
      loading: false,
      car: null
    }
  },
  computed: {
    canEdit () {
      return this.car && this.car.ownerUsername === userService.getUsername()
    },
    title () {
      return this.canEdit ? 'Fahrzeug bearbeiten' : 'Fahrzeug anzeigen'
    }
  },
  methods: {
    updateCar (car) {
      carService.updateCar(car)
        .then(() => this.$router.push({ path: '/' }))
        .then(() => notificationService.success('Fahrzeug erfolgreich bearbeitet.'))
        .catch(() => notificationService.error('Fehler beim Bearbeiten des Fahrzeugs. Bitte versuche es erneut.'))
    }
  },
  async beforeRouteEnter (to, from, next) {
     next(vm => {
      vm.loading = true
      const carId = to.params.carId
      carService.getCar(carId)
        .then(car => vm.car = car)
        // this.$router is not available
        .catch(() => {
          notificationService.error('Fehler beim Laden des Fahrzeugs. Bitte versuche es erneut.')
          router.push({ name: 'NotFound' })
        })
        .finally(() => vm.loading = false)
    })
  }
}
</script>
