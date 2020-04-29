<template>
  <div justify="center">
    <h1>Board</h1>

    <!-- Board -->
    <table v-if="datas.length > 0 || mesure.length > 0">
      <thead>
        <th
          v-for="(data, i) in datas"
          :key="i"
          :colspan="data.level.length"
          class="font-weight-medium"
        >
          {{ data.value }}
        </th>
        <th class="font-weight-medium" rowspan="2">{{ mesure }}</th>

        <tr>
          <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">
            {{ level }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- fill of jtext fields -->
        <tr v-for="k in nbline" :key="k">
          <td v-for="level in levels" :key="level">
            <v-text-field
              label="Entrez vos données"
              single-line
              solo
              flat
              hide-details="True"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              label="Entrez vos données"
              single-line
              solo
              flat
              hide-details="True"
            ></v-text-field>
          </td>
        </tr>
      </tbody>
    </table>
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
    },
    refresh: {
      type: Number
    }
  },
  computed: {
    levels: function() {
      this.refresh;
      var levels = [];
      for (var i = 0; i < this.datas.length; i++) {
        console.log("dim");
        for (var j = 0; j < this.datas[i].level.length; j++) {
          console.log("lev");
          levels.push(this.datas[i].level[j]);
        }
      }
      return levels;
    }
  },
  data() {
    return {
      nbline: 3
    };
  },
  methods: {
    lenlevels(i) {
      return parseInt(12 / this.datas[i].level.length);
    }
  }
};
</script>

<style scoped>
.line {
  border: 2px solid green;
}
.v-text-field {
  background-color: transparent;
}

table {
  border-collapse: collapse;
  border: 1px solid #1976d2;
  background-color: #f3f3f3;
}

th {
  background-color: #1976d2;
  color: white;
  border: 2px solid black;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  border: 2px solid black;
  min-width: 120px;
}
</style>
