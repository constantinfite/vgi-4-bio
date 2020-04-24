<template>
  <nav>
    <v-app-bar color="transparent" elevation="0" height="150" class="app-bar">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        src="../assets/logo_VGI4Bio.png"
        transition="scale-transition"
        width="150px"
      />

      <v-spacer />
      <div class="d-none d-md-block">
        <v-btn
          v-for="(bouton, i) in boutons"
          :key="i"
          rounded
          class="black--text bouton-header font-weight-bold"
          text
          @click="$vuetify.goTo(bouton.tag, options)"
          >{{ bouton.text }}</v-btn
        >
      </div>
      <v-app-bar-nav-icon class="d-md-none ml-8" @click="drawer = !drawer" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app class="indigo" right>
      <v-list>
        <v-list-item v-for="link in links" :key="link.text">
          <v-btn
            class="white--text"
            text
            @click="navigationPop(link.id, $vuetify)"
            >{{ link.text }}</v-btn
          >
          <!--
          <v-list-item-icon>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-icon>
          //-->
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
          tag: "#parcours"
        },
        {
          text: "Vidéo",
          tag: "#experience"
        },
        {
          text: "Questionnaire",
          tag: "#avis"
        }
      ],
      links: [
        { icon: "mdi-school", text: "Mon parcours", id: "#parcours" },
        { icon: "mdi-teach", text: "Mon expérience", id: "#experience" },
        { icon: "mdi-card-text-outline", text: "Voir mes avis", id: "#avis" },
        { icon: "mdi-account-box", text: "Contactez moi", id: "#contact" }
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
}
</style>
