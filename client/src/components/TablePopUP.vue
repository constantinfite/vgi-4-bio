<template>
  <div justify="center">
    <table>
      <!-- add head table -->
      <thead>
        <th
          v-for="(data, i) in datas"
          :key="i"
          :colspan="data.level.length"
          class="font-weight-medium"
        >
          {{ data.dim }}
        </th>
        <th class="font-weight-medium" rowspan="2">{{ this.mesure }}</th>

        <tr>
          <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">
            {{ level }}
          </th>
        </tr>
      </thead>
      <!-- add body table -->
      <tbody>
        <!-- fill of values -->
        <tr
          v-for="values in this.arrayOfValues"
          :key="values"
          class="text-center"
        >
          <td v-for="value in values" :key="value">{{ value }}</td>
        </tr>
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
    arrayOfValues: {
      type: Array,
    },
  },
  computed: {
    levels: function() {
      var levels = [];
      for (var i = 0; i < this.datas.length; i++) {
        for (var j = 0; j < this.datas[i].level.length; j++) {
          levels.push(this.datas[i].level[j]);
        }
      }
      return levels;
    },
  },
};
</script>
<style scoped>
.line {
  border: 2px solid green;
}

table {
  border-collapse: collapse;
  background-color: #ffffff;
}

tfoot td {
  border: none;
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
  padding: 5px;
}

td {
  border: 2px solid black;
  min-width: 120px;
  padding: 5px;
}
</style>
