<template>
  <div justify="center">
    <h1>Board</h1>
    <v-row>
      <v-col class="cardleft" cols="11" md="9" lg="9" xl="9">
        <v-row>
          <v-col
            v-for="(data, i) in datas"
            :key="i"
            cols="11"
            md="12"
            lg="3"
            xl="3"
            class="table withoutpad"
          >
            <p>{{ data.value }}</p>
            <v-row>
              <v-col
                v-for="(data, j) in datas[i].level"
                :key="j"
                cols="11"
                md="12"
                lg="3"
                xl="3"
                class="level withoutpad"
                ><p>{{ data }}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="card" cols="11" md="3" lg="3" xl="3">
        <p>{{ mesure }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    mesure: {
      type: String
    },
    datas: {
      type: Array
    }
  }
};
</script>

<style scoped>
.card {
  background-color: rgb(243, 243, 243);
}
.cardleft {
  background-color: rgb(224, 224, 224);
}
.table {
  background-color: rgb(206, 206, 206);
}
.withoutpad{
    padding:0 0;
}
.level{
   background-color: rgb(12, 117, 238); 
}
</style>
