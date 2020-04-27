<template>
  <div justify="center">
    <h1>Board</h1>

    <!-- Board -->
    <v-row>
      <!-- Left part of the Board -->
      <v-col class="cardleft" cols="11" md="9" lg="9" xl="9">
        <v-row justify="end">
          <!-- Dimensions -->
          <v-col
            v-for="(data, i) in datas"
            :key="i"
            cols="11"
            :md="`${lenData}`"
            :lg="`${lenData}`"
            :xl="`${lenData}`"
            class="table pb-0"
          >
            <p>{{ data.value }}</p>
            <v-row align="end" justify="center">
              <!-- Levels -->
              <v-col
                v-for="(data, j) in datas[i].level"
                :key="j"
                cols="11"
                :md="`${lenlevels(i)}`"
                :lg="`${lenlevels(i)}`"
                :xl="`${lenlevels(i)}`"
                class="level withoutpad"
                ><p>{{ data }}</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <!-- Right part of the Board -->
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
      type: String,
    },
    datas: {
      type: Array,
    },
  },
  computed: {
    lenData: function() {
      return parseInt(12 / this.datas.length);
    },
  },
  methods: {
    lenlevels(i) {
      return parseInt(12 / this.datas[i].level.length);
    },
  },
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
  border: solid;
}
.withoutpad {
}
.level {
  border: solid;
}
</style>
