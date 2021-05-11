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
import FsLightbox from 'fslightbox-vue'
import ImagePagination from './ImagePagination.vue'
import { reloadImage } from '../service/image-service'
import { captureError } from '../service/sentry-service'

export default {
  name: 'PreviewImage',
  components: {
    FsLightbox,
    ImagePagination
  },
  props: {
    imageId: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
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
      error: false,
      reloadedSrc: false
    }
  },
  computed: {
    ts() {
      return [
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300',
        'https://picsum.photos/200/300'
      ]
    },
    _src() {
      if (this.reloadedSrc) {
        return this.reloadedSrc
      }

      if (this.error) {
        return require("@/assets/images/car_dummy_highres.jpg")
      }

      return this.src
    },
    _lazySrc() {
      if (this.error) {
        return require("@/assets/images/car_dummy_lowres.jpg")
      }

      return this.lazySrc
    },
    _clickable() {
      if (this.error) {
        return false
      }

      return !this.notClickable
    },
    _progress() {
      return this.progress === 0 ? "0" : this.progress
    }
  },
  watch: {
    fullscreen(newVal) {
      this.$emit('fullscreen', newVal)
    }
  },
  methods: {
    onClick() {
      if (this.error) {
        return
      }

      if (!this.notClickable) {
           this.fullscreen = true
      }

      this.$emit('click')
    },
    async onError(url) {
      // prevent endless loop
      if (this.error) {
        captureError('Won\'t retry. Error is set already.', { url })
        return
      }

      // if there are no image properties, we can not fetch again
      if (!this.imageId || !this.height) {
        captureError('Can\'t retry. Properties are missing.', {
          imageId: this.imageId,
          height: this.height,
          url
        })
        this.error = true
        return
      }

      // try to fetch new image
      reloadImage(this.imageId, this.height)
          .then(url => this.reloadedSrc = url)
          .catch(() => {
            this.error = true
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