<template>
  <div>
    <v-img
      :height="height"
      :max-height="maxHeight"
      :width="width"
      :max-width="maxWidth"
      :src="_src"
      :lazy-src="_lazySrc"
      :contain="contain"
      :class="{ 'clickable': _clickable }"
      @click="onClick"
      @error="onError"
    >
      <ImagePagination
        :current-image-position="currentImagePosition"
        :images-count="imagesCount"
      />
      <template #placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            v-if="progress"
            :value="progress"
            color="primary"
          >
            {{ progress }}
          </v-progress-circular>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
          />
        </v-row>
      </template>
    </v-img>

    <FullscreenImageModal
      v-if="fullscreen"
      :image-id="imageId"
      :lazy-src="src"
      @cancel="fullscreen = false"
    />
  </div>
</template>

<script>
import FullscreenImageModal from '../modals/FullscreenImageModal.vue'
import ImagePagination from './ImagePagination.vue'
import imageService from '../service/image-service'
import sentryService from '../service/sentry-service'

export default {
  name: 'PreviewImage',
  components: {
    FullscreenImageModal,
    ImagePagination
  },
  props: {
    height: {
      type: String,
      required: true
    },
    imageId: {
      type: String,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    src: {
      type: [String, Object],
      default: null
    },
    notClickable: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: null
    },
    maxWidth: {
      type: String,
      default: null,
    },
    maxHeight: {
      type: String,
      default: null,
    },
    lazySrc: {
      type: String,
      default: null
    },
    contain: {
      type: Boolean,
      default: false
    },
    imagesCount: {
      type: Number,
      default: 0
    },
    currentImagePosition: {
      type: Number,
      default: 0
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      fullscreen: false,
      internalError: false,
      reloadedSrc: false
    }
  },
  computed: {
    _src() {
      if (this.reloadedSrc) {
        return this.reloadedSrc
      }

      if (this._error) {
        return require("@/assets/images/car_dummy_highres.jpg")
      }

      return this.src
    },
    _lazySrc() {
      if (this._error) {
        return require("@/assets/images/car_dummy_lowres.jpg")
      }

      return this.lazySrc
    },
    _clickable() {
      if (this._error) {
        return false
      }

      return !this.notClickable
    },
    _progress() {
      return this.progress === 0 ? "0" : this.progress
    },
    _error() {
      return this.error || this.internalError
    }
  },
  watch: {
    fullscreen(newVal) {
      this.$emit('fullscreen', newVal)
    }
  },
  methods: {
    onClick() {
      if (this._error) {
        return
      }

      if (!this.notClickable) {
           this.fullscreen = true
      }

      this.$emit('click')
    },
    async onError(url) {
      // prevent endless loop
      if (this.internalError) {
        sentryService.captureError('Won\'t retry. Error is set already.', { url })
        return
      }

      // if there are no image properties, we can not fetch again
      if (!this.imageId || !this.height) {
        sentryService.captureError('Can\'t retry. Properties are missing.', {
          imageId: this.imageId,
          height: this.height,
          url
        })
        this.internalError = true
        return
      }

      // try to fetch new image
      imageService.reloadImage(this.imageId, this.height)
          .then(url => this.reloadedSrc = url)
          .catch(() => {
            this.internalError = true
            this.reloadedSrc = null
          })
    }
  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer
}
</style>