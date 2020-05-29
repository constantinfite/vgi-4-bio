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
        >{{ data.dim }}</th>
        <th class="font-weight-medium" rowspan="2">{{ this.mesure }}</th>

        <tr>
          <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">{{ level }}</th>
        </tr>
      </thead>
      <!-- add body table -->
      <tbody>
        <!-- fill of values -->
        <tr v-for="values in sortedArray" :key="values">
          <td v-for="value in values" :key="value">{{value}}</td>
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
    arrayOfValues: {
      type: Array
    }
  },
  data() {
    return {
      Array: []
    };
  },
  computed: {
    levels: function() {
      console.log("levels démare");
      var levels = [];
      for (var i = 0; i < this.datas.length; i++) {
        for (var j = 0; j < this.datas[i].level.length; j++) {
          levels.push(this.datas[i].level[j]);
        }
      }
      return levels;
    },
    sortedArray: function() {
      console.log("sortedArray démare");
      var arr = this.arrayOfValues.slice();
      console.log(arr);

      var linked = [];
      for (var linkedInd = 0; linkedInd < arr.length; linkedInd++) {
        linked.push(false);
      }

      var col = 0;
      for (var indim = 0; indim < this.datas.length + 1; indim++) {
        var change = false;
        console.log("indim=" + indim);
        var i = 0;
        if (typeof this.datas[indim] === "undefined") {
          console.log("undefined");
          i = 1;
        } else {
          console.log("not undefined");
          i = this.datas[indim].level.length - 1;
        }
        for (i; i >= 0; i--) {
          console.log("i=" + i);
          for (var n = 1; n <= i; n++) {
            console.log("n=" + n);
            for (var j = 0; j < arr.length; j++) {
              console.log("j=" + j);
              for (var k = j + 1; k < arr.length; k++) {
                console.log("k=" + k);
                if (arr[j][col + i] == arr[k][col + i]) {
                  console.log("c'est true");
                  if (i - n >= 0) {
                    if (
                      arr[j][col + i - n] == arr[k][col + i - n] &&
                      linked[k] == false &&
                      linked[j] == false
                    ) {
                      arr.splice(j, 0, arr.splice(k, 1)[0]);
                      linked.splice(j, 1, true);
                      linked.splice(k, 1, true);
                    } else if (linked[j + 1] == false) {
                      arr.splice(j + 1, 0, arr.splice(k, 1)[0]);
                      linked.splice(j + 1, 1, true);
                      linked.splice(k, 1, true);
                    }
                  } else if (linked[j] == false) {
                    arr.splice(j, 0, arr.splice(k, 1)[0]);
                    linked.splice(j, 1, true);
                    linked.splice(k, 1, true);
                  }
                  change = true;
                }
              }
            }
          }

          if (change) {
            break;
          }
        }
        col =
          typeof this.datas[indim] === "undefined"
            ? col + 1
            : col + this.datas[indim].level.length;
      }

      return arr;
    }
  },
  methods: {}
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