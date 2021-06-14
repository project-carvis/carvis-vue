<template>
  <v-card
    :loading="loading"
    class="mx-auto mt-4"
    max-width="374"
    elevation="5"
  >
    <v-card-actions>
      <v-container>
        <v-row>
          <v-col
            v-for="(item, index) in items"
            :key="item.text"
            :cols="columnCount"
            :align="align(index)"
          >
            <v-skeleton-loader
              v-if="loading"
              type="button"
            />
            <v-btn
              v-else
              :color="item.color"
              :text="!item.color"
              @click="item.action"
            >
              {{ item.text }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      defaut: false
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    columnCount() {
      if (!this.items) {
        return 0
      }
      return 12 / this.items.length
    }
  },
  methods: {
    align(index) {
      if (this.items.length <= 1) {
        return 'center'
      }
      return index < (this.items.length / 2) ? 'left' : 'right'
    }
  }
}
</script>
