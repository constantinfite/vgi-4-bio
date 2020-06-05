<template lg="10" xl="10">
  <div justify="center">
    <v-row>
      <table>
        <!-- add head table -->
        <thead>
          <th
            v-for="data in datas"
            :key="data"
            :colspan="data.level.length"
            class="font-weight-medium"
          >{{ data.dim }}</th>
          <th class="font-weight-medium" rowspan="2">{{ this.mesure }}</th>

          <th
            v-for="dim in this.dimHieTab()"
            :key="dim"
            rowspan="2"
            class="font-weight-medium"
          >{{ dim }}</th>

          <tr>
            <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">{{ level.name }}</th>
          </tr>
        </thead>

        <!-- add body table -->
        <tbody>
          <!-- fill of values -->

          <tr v-for="values in this.dinamicWthHierarc()" :key="values">
            <td
              v-for="value in values"
              :key="value"
              :rowspan="value[1]"
              class="text-center"
            >{{ value[0] }}</td>
          </tr>
        </tbody>
      </table>
    </v-row>
    <v-row>
      <v-switch v-model="typeHierarchy" label="Type of hierarchy"></v-switch>
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
    },
    arrayOfValues: {
      type: Array
    }
  },
  data() {
    return {
      typeHierarchy: false
    };
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
    sortedArray: function() {
      var arr = this.arrayOfValues.slice(0);

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

        for (var i = this.datas[indim].level.length - 1; i >= 0; i--) {
          for (var n = i == 0 ? 0 : 1; n <= i; n++) {
            for (var j = 0; j < arr.length; j++) {
              for (var k = j + 1; k < arr.length; k++) {
                if (
                  arr[j][col + i] == arr[k][col + i] &&
                  arr[j][arr[0].length - 1] == arr[k][arr[0].length - 1]
                ) {
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
    dinamicTab: function(withDelVal = true) {
      var vueTab = [];

      for (var lignSA = 0; lignSA < this.sortedArray.length; lignSA++) {
        var lignArr = [];
        for (var colSA = 0; colSA < this.sortedArray[lignSA].length; colSA++) {
          lignArr.push([this.sortedArray[lignSA][colSA], 0]);
        }
        vueTab.push(lignArr);
      }

      for (var colVT = 0; colVT < vueTab[0].length; colVT++) {
        for (var lignVT = 0; lignVT < vueTab.length; ) {
          const valTest = vueTab[lignVT][colVT][0];
          var cmpRowSpan = 1;
          var indexSup = 1;
          while (
            lignVT + indexSup < vueTab.length &&
            vueTab[lignVT + indexSup][colVT][0] == valTest &&
            vueTab[lignVT + indexSup][vueTab[0].length - 1][0] ==
              vueTab[lignVT][vueTab[0].length - 1][0]
          ) {
            cmpRowSpan++;
            indexSup++;
          }
          vueTab[lignVT][colVT].splice(1, 1, cmpRowSpan);
          lignVT += indexSup;
        }
      }
      if (withDelVal) {
        for (var lign = 0; lign < vueTab.length; lign++) {
          for (var col = 0; col < vueTab[lign].length; col++) {
            if (vueTab[lign][col][1] == 0) {
              vueTab[lign].splice(col, 1);
              col--;
            }
          }
        }
      }
      return vueTab;
    },
    dimHieTab: function() {
      var dimHieTab = [];

      if (this.typeHierarchy) {
        for (var i = 0; i < this.datas.length; i++) {
          dimHieTab.push(this.datas[i].dim);
        }
      }

      return dimHieTab;
    },
    hierarchy: function() {
      var tab = this.dinamicTab(false);
      var hierarchyTab = [];
      for (var nbLign = 0; nbLign < tab.length; nbLign++) {
        var lignFT = [];
        for (var colFT = 0; colFT < this.datas.length; colFT++) {
          lignFT.push(["", 0, 0]);
        }
        hierarchyTab.push(lignFT);
      }
      var endLev = 0;
      for (var indexdim = 0; indexdim < this.datas.length; indexdim++) {
        for (var col = this.datas[indexdim].level.length - 1; col >= 0; col--) {
          for (var lignTAB = 0; lignTAB < tab.length; lignTAB++) {
            var NoOH = false;
            var NoCH = false;
            var NoSFH = false;
            var MtMFH = false;

            var index = lignTAB + tab[lignTAB][tab[lignTAB].length - 1][1];
            for (var lign1 = lignTAB; lign1 < index; lign1++) {
              if (
                tab[lign1][this.datas[indexdim].level.length - 1 + endLev][0] ==
                ""
              ) {
                NoOH = true;
              }
              if (tab[lign1][col + endLev][0] == "") {
                NoCH = true;
              }
              if (col > 0) {
                if (
                  tab[lign1][col + endLev][1] != 1 &&
                  tab[lign1][col + endLev - 1][1] != tab[lign1][col + endLev][1]
                ) {
                  NoSFH = true;
                }
              }
              if (
                col == 0 &&
                tab[lign1][col + endLev][1] != 1 &&
                tab[lign1][col + endLev + 1][1] != tab[lign1][col + endLev][1]
              ) {
                MtMFH = true;
              }
            }
            if (
              NoOH &&
              (hierarchyTab[lignTAB][indexdim][0] == "Ordinary" ||
                hierarchyTab[lignTAB][indexdim][0] == "")
            ) {
              hierarchyTab[lignTAB].splice(indexdim, 1, [
                "Non-Onto",
                tab[lignTAB][tab[lignTAB].length - 1][1],
                col + endLev
              ]);
            } else if (
              NoCH &&
              (hierarchyTab[lignTAB][indexdim][0] == "Ordinary" ||
                hierarchyTab[lignTAB][indexdim][0] == "")
            ) {
              hierarchyTab[lignTAB].splice(indexdim, 1, [
                "Non-Covering",
                tab[lignTAB][tab[lignTAB].length - 1][1],
                col + endLev
              ]);
            } else if (
              NoSFH &&
              (hierarchyTab[lignTAB][indexdim][0] == "Ordinary" ||
                hierarchyTab[lignTAB][indexdim][0] == "")
            ) {
              hierarchyTab[lignTAB].splice(indexdim, 1, [
                "Non-strick Fact",
                tab[lignTAB][tab[lignTAB].length - 1][1],
                col + endLev
              ]);
            } else if (
              MtMFH &&
              (hierarchyTab[lignTAB][indexdim][0] == "Ordinary" ||
                hierarchyTab[lignTAB][indexdim][0] == "")
            ) {
              hierarchyTab[lignTAB].splice(indexdim, 1, [
                "Many-to-Many Fact",
                tab[lignTAB][tab[lignTAB].length - 1][1],
                col + endLev
              ]);
            } else if (hierarchyTab[lignTAB][indexdim][0] == "") {
              hierarchyTab[lignTAB].splice(indexdim, 1, [
                "Ordinary",
                tab[lignTAB][tab[lignTAB].length - 1][1],
                col + endLev
              ]);
            }
          }
        }
        endLev += this.datas[indexdim].level.length;
      }

      for (var i = 0; i < hierarchyTab.length; i++) {
        for (var j = 0; j < hierarchyTab[i].length; j++) {
          if (hierarchyTab[i][j][1] == 0) {
            hierarchyTab[i].splice(j, 1);
            j--;
          }
        }
      }

      return hierarchyTab;
    },
    dinamicWthHierarc: function() {
      var dinamicWthHierarc = [];
      var tab = this.hierarchy();
      this.$emit("updateHierarchyTab", tab);
      if (this.typeHierarchy) {
        for (var i = 0; i < this.dinamicTab().length; i++) {
          dinamicWthHierarc.push(this.dinamicTab()[i].concat(tab[i]));
        }
      } else {
        dinamicWthHierarc = this.dinamicTab();
      }
      return dinamicWthHierarc;
    }
  }
};
</script>
<style scoped>
table {
  border-collapse: collapse;
  background-color: #ffffff;
}

tfoot td {
  border: none;
}
th {
  background-color: #c61469;
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
