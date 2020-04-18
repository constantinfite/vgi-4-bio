<template>
  <v-app class="grey lighten-5">
    <PToolbar />

    <v-content>
      <router-view />
    </v-content>

    <PFooter />
  </v-app>
</template>

<script>
import PToolbar from "./components/PToolbar";
import PFooter from "./components/PFooter";

export default {
  name: "App",

  components: {
    PToolbar,
    PFooter
  },

  data: () => ({
    //
  })
};
</script>
