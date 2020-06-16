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
          Ce site vous permet de proposer un modèle pour vos données
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
  top: 12rem;
  color: #fff;
  text-align: left;
}

.title-heading {
  margin-bottom: 20px;
  font-size: 40px;
}
.title-sub-heading {
  font-size: 30px;
}
.title-heading span {
}
</style>
