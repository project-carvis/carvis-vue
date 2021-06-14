<template>
  <v-container>
    <OverviewTable
      title="Fahrzeuge"
      search-placeholder-text="Porsche Carrera"
      :headers="headers"
      :items="_cars"
      :loading="loading"
      @row-clicked="viewCar"
      @create-clicked="createCar"
    >
      <template v-slot="item">
        <CarThumbnail
          :image-id="item.proxiedProps.previewImageId"
        />
      </template>
    </OverviewTable>
  </v-container>
</template>

<script>
import ListCars from '../apollo/queries/ListCars'
import CarThumbnail from '../components/CarThumbnail.vue'
import OverviewTable from '../components/OverviewTable.vue'
import { relativeTimeDifference } from '../utilities/time'

export default {
  components: {
    OverviewTable,
    CarThumbnail
  },
  data () {
    return {
      searchTerm: '',
      carThumbnails: [],
      headers: [
        {
          sortable: false,
          value: 'preview'
        },
        {
          text: 'Marke',
          value: 'brand',
        },
        {
          text: 'Typ',
          align: 'start',
          value: 'type',
        },
        {
          text: 'Modellreihe',
          value: 'modelSeries',
        },
        {
          text: 'Modelljahr',
          value: 'modelYear',
        },
        {
          text: 'Außenfarbe',
          value: 'colorExterior',
        },
        {
          text: 'Erstellt durch',
          value: 'ownerName',
        },
        {
          text: 'Zuletzt aktualisiert',
          sortable: false,
          value: 'lastChanged'
        }
      ]
    }
  },
  computed: {
    loading () {
      return this.$apollo.loading || this.$auth.loading
    },
    _cars () {
      if (!this.cars) {
        return []
      }

      return this.cars
        .map(car => {
          const lastChanged = relativeTimeDifference(car.updatedAt)
          const previewImageId = car.images ? car.images[0] : null
          return {
            previewImageId,
            lastChanged,
            ...car
          }
        })
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    }
  },
  methods: {
    viewCar (car) {
      this.$router.push({ path: `/cars/${car.id}`})
    },
    createCar () {
      this.$router.push({ path: '/cars/add' })
    }
  },
  apollo: {
    cars: {
      query: ListCars,
      update: data => data.listCars ? data.listCars.items : [],
      prefetch: true
    }
  }
}
</script>
