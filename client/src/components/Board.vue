<template>
  <div justify="center">
    <h1>Board</h1>

    <!-- Board -->
    <table>
      <thead>
        <!-- do a th for dimension with a for loop -->
        <!-- do a tr for levels with a for loop inside th -->
        <!-- do th dfor Mesure -->
        <th v-for="(data, i) in datas" :key="i">
          {{ data.value | capitalize }}

          <tr>
            <th v-for="(level, j) in datas[i].level" :key="j">
              {{ level | capitalize }}
            </th>
          </tr>
        </th>

        <th>
          {{ mesure | capitalize }}
        </th>
      </thead>
      <tbody>
        <!-- fill of jtext fields -->
      </tbody>
    </table>
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
