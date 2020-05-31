<template>
  <div>
    <v-container>
      <v-row justify="center">
        <Video />
      </v-row>
    </v-container>

    <v-divider class="my-8"></v-divider>
    <v-container fluid class="main">
      <v-row justify="center" class="main-row">
        <!-- Left part form -->
        <v-col lg="3" xl="6" class="colonne">
          <v-form>
            <!-- Select Name First_Name-->
            <v-row align="center" justify="start">
              <v-col cols="11" md="12" lg="12" xl="12">
                <v-row>
                  <v-col cols="11" md="10" lg="6" xl="6">
                    <v-text-field v-model="name" label="Nom"></v-text-field>
                  </v-col>
                  <v-col cols="11" md="10" lg="6" xl="6">
                    <v-text-field
                      v-model="firstname"
                      label="Prénom"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="mesure"
                  label="Nom de la mesure"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Add dimension -->
            <div justify="center" align="center" class="mb-5">
              <v-btn class="mr-5" @click="addNewDim" color="primary" small
                >Ajouter une dimension</v-btn
              >
            </div>

            <v-row align="center">
              <!-- Dimensions  -->
              <v-col
                v-for="(table, i) in tablesData"
                :key="i"
                cols="11"
                md="12"
                lg="12"
                xl="12"
                class="card ma-3"
              >
                <v-card
                  class="mb-3 d-flex space-between"
                  flat
                  color="rgb(243, 243, 243)"
                >
                  <h1>Dimension {{ i }}</h1>
                  <v-spacer />

                  <v-icon large @click="deleteDim(i)"
                    >mdi-trash-can-outline</v-icon
                  >
                </v-card>
                <v-text-field
                  v-model="table.dim"
                  persistent-hint
                  hint="modifier le nom de la dimension"
                  :append-outer-icon="focus ? '' : 'mdi-pencil'"
                  clearable
                  outlined
                  label="Nom de la dimension"
                  type="text"
                  ref="field"
                  @focus="changeFocus"
                  @click:append-outer="editDimension"
                  @blur="focus = false"
                ></v-text-field>

                <v-select
                  class="select-dim"
                  :items="computedDims"
                  @change="changeValueDim($event, i)"
                  :value="table.dim"
                  label="Liste des dimensions"
                ></v-select>

                <v-row>
                  <v-btn
                    x-small
                    color="light-blue accent-3"
                    class="ma-2 white--text"
                    @click="addLevel(i)"
                  >
                    Ajouter un niveau
                    <v-icon right dark>mdi-plus</v-icon>
                  </v-btn>
                </v-row>
                <!-- Levels -->
                <v-row>
                  <v-col
                    cols="11"
                    md="10"
                    lg="10"
                    xl="10"
                    v-for="(table, j) in tablesData[i].level"
                    :key="j"
                  >
                    <v-card flat class="d-flex justify-space-between">
                      <v-icon
                        v-show="j > 0"
                        class="mx-3"
                        @click="upLevel(tablesData, i, j)"
                        >mdi-arrow-up</v-icon
                      >
                      <v-icon
                        v-show="j != tablesData[i].level.length - 1"
                        class="mx-3"
                        @click="downLevel(tablesData, i, j)"
                        >mdi-arrow-down</v-icon
                      >
                      <v-select
                        class="ml-3 mr-6"
                        :items="computedLevels[i]"
                        @change="changeValueLevel($event, i, j)"
                        :value="table"
                        label="Niveau"
                      ></v-select>
                      <v-icon class="mr-3" @click="deleteLevel(i, j)"
                        >mdi-trash-can-outline</v-icon
                      >
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <!-- Right part Board -->
        <v-col
          class="board-position ml-8"
          lg="8"
          xl="6"
          v-if="this.tablesData.length > 0 || this.mesure.length > 0"
        >
          <v-row justify="center" class="main-row">
            <Board
              :mesure="mesure"
              :datas="tablesData"
              :refresh="forceRecomputeCounter"
              @updateArrayOfValues="updateArrayOfValues"
            />
          </v-row>
          <v-row justify="center" class="main-row">
            <EnvButton
              :datas="this.tablesData"
              :mesure="this.mesure"
              :arrayOfValues="arrayOfValues"
              :name_firstname="this.name + '_' + this.firstname"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Board from "@/components/Board.vue";
import EnvButton from "@/components/EnvButton.vue";
import Video from "@/components/Video.vue";
import donnee from "../Choix.json";
export default {
  name: "Home",
  components: {
    EnvButton,
    Board,
    Video,
  },
  data() {
    return {
      rawData: donnee.Tables, //the entire data of the json file
      mesure: "", // mesure typed in the v-select mesure
      tablesData: [], // a array of the values fill in the form [{dim1,[level1,level2]},{dim2,[level1,level2]} ...]
      arrayOfValues: [],
      name: "",
      firstname: "",
      forceRecomputeCounter: 0, //just a data used to refresh a computed data
      focus: false,
    };
  },

  methods: {
    updateArrayOfValues(e) {
      //console.log(e);
      this.arrayOfValues = e;
    },
    addNewDim() {
      this.tablesData.push({
        dim: "",
        level: [""],
      });
    },
    deleteDim(index) {
      this.tablesData.splice(index, 1);
    },
    changeValueDim(value, i) {
      this.tablesData[i].dim = value;
    },
    addLevel(indexDim) {
      this.tablesData[indexDim].level.push("");
    },
    changeValueLevel(value, i, j) {
      this.tablesData[i].level[j] = value;
      this.forceRecomputeCounter++;
    },
    deleteLevel(indexDim, indexLevel) {
      this.tablesData[indexDim].level.splice(indexLevel, 1);
    },
    changeFocus() {
      this.focus = true;
    },
    editDimension() {
      this.$refs.field[0].focus();
      this.focus = true;
    },
    upLevel(tableData, indexDim, indexLevel) {
      var element = tableData[indexDim].level[indexLevel];
      tableData[indexDim].level.splice(indexLevel, 1);
      tableData[indexDim].level.splice(indexLevel - 1, 0, element);
    },
    downLevel(tableData, indexDim, indexLevel) {
      var element = tableData[indexDim].level[indexLevel];
      tableData[indexDim].level.splice(indexLevel, 1);
      tableData[indexDim].level.splice(indexLevel + 1, 0, element);
    },
  },
  computed: {
    //data with only the titre of the json file : [titre1, titre2, titre3 ...]
    //type array
    tableTitre() {
      return this.rawData.map((itemY) => {
        return itemY.titre;
      });
    },
    //data with only the level of the json file : [level1, level2, level3 ...]
    //type array
    tableLevel() {
      var levels = [];
      this.rawData.map((item) =>
        item.champs.map((level) => {
          levels.push(level);
        })
      );
      return levels;
    },
    //data with all the dimension selected in the v-select
    //type array
    dimSelected() {
      return this.tablesData.map((itemTable) => {
        return itemTable.value;
      });
    },
    //Dimensions filtered if already selected
    // [{titre1, false}, {titre2, true}, {titre3, true} ...]
    computedDims() {
      return this.tableTitre.map((item) => {
        return {
          text: item,
          disabled: this.dimSelected.includes(item),
        };
      });
    },
    //Levels filtered if already selected if number of dimension = 3
    // [[{level1, false}, {level2,true} ...], [{level1, true}, {level2,true} ...], [{level1, false}, {level2,true} ...]]
    computedLevels() {
      this.forceRecomputeCounter;
      var tablesLevel = [];

      for (var i = 0; i < this.tablesData.length; i++) {
        var level = [];
        this.tableLevel.map((item) => {
          level.push({
            text: item,
            disabled: this.tablesData[i].level.includes(item),
          });
        });

        tablesLevel.push(level);
      }

      //console.log(tablesLevel);
      return tablesLevel;
    },
  },
};
</script>

<style>
.board-position {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.main-row {
  align-items: flex-start;
}

.card {
  background-color: rgb(243, 243, 243);
}

.v-select-item__disabled {
  color: red;
}

.main {
  margin-left: 0;
  margin-right: 0;
}
</style>
