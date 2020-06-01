<template>
  <section class="hero">
    <v-container>
      <div class="title">
        <h1 class="title-heading">
          Bienvenue sur
          <span elevation="3" class="font-weight-bold"
            >VGI4Bio tool for volunteers</span
          >
        </h1>
        <p class="title-sub-heading">
          Ce site a pour but de récupérer les données que vous voulez voir
        </p>
      </div>
    </v-container>
  </section>
</template>

<script>
export default {};
</script>

<style scoped>
.hero {
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  background-image: url("../assets/flamingo.jpg");
}
.title {
  position: absolute;
  top: 20rem;
  color: #fff;
  text-align: left;
}

.title-heading {
  font-size: 30px;
}
.title-sub-heading {
  font-size: 20px;
}
.title-heading span {
}
</style>
