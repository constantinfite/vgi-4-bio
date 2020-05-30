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
        <tr v-for="values in this.test()" :key="values">
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
      var arr = this.arrayOfValues.slice(0);
      console.log(arr.slice());

      var linked = [];
      for (var linkedInd = 0; linkedInd < arr.length; linkedInd++) {
        linked.push(false);
      }
      var linkedVal = [];
      for (var linkedValInd = 0; linkedValInd < arr.length; linkedValInd++) {
        linkedVal.push("");
      }

      for (var indexMes = 0; indexMes < arr.length; indexMes++) {
        for (
          var othIndexMes = indexMes + 1;
          othIndexMes < arr.length;
          othIndexMes++
        ) {
          if (
            arr[indexMes][arr[0].length - 1] ==
            arr[othIndexMes][arr[0].length - 1]
          ) {
            arr.splice(indexMes, 0, arr.splice(othIndexMes, 1)[0]);
          }
        }
      }

      var col = 0;
      for (var indim = 0; indim < this.datas.length; indim++) {
        var change = false;
        //console.log("indim=" + indim);

        for (var i = this.datas[indim].level.length - 1; i >= 0; i--) {
          //console.log("i=" + i);

          for (var n = i == 0 ? 0 : 1; n <= i; n++) {
            //console.log("n=" + n);
            for (var j = 0; j < arr.length; j++) {
              //console.log("j=" + j);
              for (var k = j + 1; k < arr.length; k++) {
                //console.log("k=" + k);
                //console.log(arr[j][col + i] == arr[k][col + i]);
                //console.log(arr[j][col + i]);
                //console.log(arr[k][col + i]);
                //console.log(arr.slice());

                if (
                  arr[j][col + i] == arr[k][col + i] &&
                  arr[j][arr[0].length - 1] == arr[k][arr[0].length - 1]
                ) {
                  /*console.log(i - n > 0);
                  console.log(
                    arr[j][col + i - n] == arr[k][col + i - n] &&
                      ((linked[k] == false &&
                        (linked[j] == false ||
                          linkedVal[j] == indim + "_" + arr[k][col + i])) ||
                        linkedVal[k] == linkedVal[j])
                  );
                  console.log(
                    linked[j + 1] == false || linkedVal[k] == linkedVal[j + 1]
                  );
                  console.log(
                    linked[j + 1] == false ||
                      (linkedVal[k] == linkedVal[j + 1] && k != j + 1)
                  );
                  console.log(linked);
                  console.log(linkedVal);*/

                  if (i - n > 0) {
                    if (
                      arr[j][col + i - n] == arr[k][col + i - n] &&
                      ((linked[k] == false &&
                        (linked[j] == false ||
                          linkedVal[j] == indim + "_" + arr[k][col + i])) ||
                        linkedVal[k] == linkedVal[j])
                    ) {
                      arr.splice(j, 0, arr.splice(k, 1)[0]);
                      linked.splice(j, 0, linked.splice(k, 1)[0]);
                      linked.splice(j, 1, true);
                      linked.splice(j + 1, 1, true);
                      linkedVal.splice(j, 0, linkedVal.splice(k, 1)[0]);
                      linkedVal.splice(j, 1, indim + "_" + arr[j][col + i]);
                      linkedVal.splice(
                        j + 1,
                        1,
                        indim + "_" + arr[j + 1][col + i]
                      );
                    } else if (
                      linked[j + 1] == false ||
                      (linkedVal[k] == linkedVal[j + 1] && k != j + 1)
                    ) {
                      arr.splice(j + 1, 0, arr.splice(k, 1)[0]);
                      linked.splice(j + 1, 0, linked.splice(k, 1)[0]);
                      linked.splice(j, 1, true);
                      linked.splice(j + 1, 1, true);
                      linkedVal.splice(j + 1, 0, linkedVal.splice(k, 1)[0]);
                      linkedVal.splice(j, 1, indim + "_" + arr[j][col + i]);
                      linkedVal.splice(
                        j + 1,
                        1,
                        indim + "_" + arr[j + 1][col + i]
                      );
                    }
                  } else if (
                    linked[j + 1] == false ||
                    (linkedVal[k] == linkedVal[j + 1] && k != j + 1)
                  ) {
                    arr.splice(j + 1, 0, arr.splice(k, 1)[0]);
                    linked.splice(j + 1, 0, linked.splice(k, 1)[0]);
                    linked.splice(j, 1, true);
                    linked.splice(j + 1, 1, true);
                    linkedVal.splice(j + 1, 0, linkedVal.splice(k, 1)[0]);
                    linkedVal.splice(j, 1, indim + "_" + arr[j][col + i]);
                    linkedVal.splice(
                      j + 1,
                      1,
                      indim + "_" + arr[j + 1][col + i]
                    );
                  } else if (
                    linked[j] == true &&
                    linked[j + 1] == true &&
                    linkedVal[j] == linkedVal[j + 1] &&
                    j + 2 == k
                  ) {
                    arr.splice(j + 1, 0, arr.splice(j, 1)[0]);
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
        col = col + this.datas[indim].level.length;
      }

      return arr;
    }
  },
  methods: {
    test: function() {
      return this.sortedArray;
    }
  }
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