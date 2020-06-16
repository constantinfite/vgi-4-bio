<template>
  <nav>
    <v-app-bar color="#fff" elevation="1" height="120" app class="app-bar">
      <v-toolbar-title>
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="../assets/logo_VGI4Bio.png"
          transition="scale-transition"
          width="120px"
        />
      </v-toolbar-title>

      <v-spacer />
      <div class="d-none d-md-block">
        <v-btn
          v-for="(bouton, i) in boutons"
          :key="i"
          rounded
          class="black--text bouton-header font-weight-bold"
          text
          @click="$vuetify.goTo(bouton.tag, options)"
        >{{ bouton.text }}</v-btn>
      </div>
      <v-app-bar-nav-icon class="d-md-none ml-8" @click="drawer = !drawer" />
    </v-app-bar>
  </nav>
</template>

<script>
// import * as easings from "vuetify/es5/services/goto/easing-patterns";
//mdi-playlist-edit
export default {
  data() {
    return {
      drawer: false,
      options: {
        duration: 500,
        offset: 0,
        easing: "easeInOutCubic"
      },
      boutons: [
        {
          text: "Accueil",
          tag: "#home"
        },
        {
          text: "Vidéo",
          tag: "#video"
        },
        {
          text: "Formulaire",
          tag: "#form"
        }
      ]
    };
  },
  methods: {
    navigationPop(id, vuetify) {
      vuetify.goTo(id, this.options), (this.drawer = !this.drawer);
    }
  }
};
</script>

<style>
.app-bar {
  padding: 0 10%;
  display: flex;
}
</style>
