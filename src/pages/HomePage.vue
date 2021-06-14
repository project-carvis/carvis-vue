<template>
  <div>
    <v-card
      class="mx-auto mt-12"
      max-width="374"
      elevation="5"
    >
      <v-img
        alt="Carvis"
        class="pa-4 ma-4"
        contain
        src="@/assets/images/logo_500px.png"
        lazy-src="@/assets/images/logo_250px.png"
      />

      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet pellentesque nisi vitae bibendum. Vestibulum vulputate magna non viverra tristique. Proin non lectus urna. Nullam faucibus justo nisl, ac sodales ante pharetra ut. Ut iaculis dapibus euismod. Morbi massa purus, ornare non dolor ac, faucibus convallis justo. Morbi non convallis nisi. Etiam sit amet dolor vel odio gravida luctus. Phasellus mattis, ante vitae fringilla auctor, magna ipsum facilisis massa, eget cursus nunc ante eget diam. Donec efficitur libero quis turpis euismod, in vehicula leo tempor.
      </v-card-text>
    </v-card>

    <NavigationCard
      :loading="isLoading"
      :items="navigationItems"
    />
  </div>
</template>

<script>
import NavigationCard from '../components/NavigationCard'

export default {
  components: {
    NavigationCard
  },
  computed: {
    isLoading() {
      return this.$auth.loading
    },
    isLoggedin() {
      return this.$auth.isAuthenticated
    },
    navigationItems() {
      if (this.isLoggedin) {
        return [
          { text: 'Fahrzeuge', color: 'primary', action: () => this.$router.push({ path: '/cars'}) },
          { text: 'Gesuche', color: 'primary', action: () => this.$router.push({ path: '/requests'} ) }
        ]
      } else {
        return [
          { text: 'Login', color: 'primary', action: () => this.$auth.loginWithRedirect() },
          { text: 'Registrieren', action: () => this.$auth.loginWithRedirect({ screen_hint: 'signup' }) }
        ]
      }
    }
  },
  // TODO create warmup lambda call
}
</script>
