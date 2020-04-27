<template>
  <div justify="center">
    <h1>Board</h1>

    <!-- Board -->
    <table>
      <thead>
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

        <span v-for="(data, i) in datas" :key="i">
          <td v-for="(level, j) in datas[i].level" :key="j">
            <tr v-for="k in 3" :key="k">
              <v-text-field
                label="Entrez vos données"
                single-line
                solo
                flat
              ></v-text-field>
            </tr>
          </td>
        </span>

        <td>
          <tr v-for="k in 3" :key="k">
            <v-text-field
              label="Entrez vos données"
              single-line
              solo
              flat
            ></v-text-field>
          </tr>
        </td>
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

table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;
}
</style>
