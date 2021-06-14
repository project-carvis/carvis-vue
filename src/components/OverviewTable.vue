<template>
  <div>
    <span class="text-h2">{{ title }}</span>
    <v-text-field
      v-model="searchTerm"
      :placeholder="searchPlaceholderText"
      prepend-icon="mdi-magnify"
      class="mt-12 mb-4"
      outlined
      clearable
    />

    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="20"
      :loading="loading"
      :mobile-breakpoint="0"
      :search="searchTerm"
      class="elevation-5"
      @click:row="onRowClicked"
    >
      <template #[`item.preview`]="{ item }">
        <slot :proxiedProps="item" />
      </template>
    </v-data-table>

    <FloatingButton
      :loading="loading"
      @create-clicked="onCreateClicked"
    />
  </div>
</template>

<script>
import FloatingButton from './FloatingButton'

export default {
  components: {
    FloatingButton
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    searchPlaceholderText: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      loading: false
    }
    // previewSlot: {
    //   type: Component,
    //   default: null
    // }
  },
  data() {
    return {
      searchTerm: '',
    }
  },
  methods: {
    onRowClicked(car) {
      this.$emit('row-clicked', car)
    },
    onCreateClicked() {
      this.$emit('create-clicked')
    }
  }
}
</script>