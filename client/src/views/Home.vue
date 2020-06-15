<template>
  <div>
    <div id="home">
      <Explanation />
    </div>

    <v-divider class="my-8"></v-divider>
    <v-container id="video">
      <v-row justify="center">
        <Video />
      </v-row>
    </v-container>

    <v-divider class="my-8"></v-divider>
    <v-container fluid class="main" id="form">
      <v-row justify="center" class="main-row">
        <!-- Left part form -->

        <v-col lg="3" xl="3" class="colonne">
          <v-form>
            <!-- Select Name First_Name-->
            <v-row align="center" justify="start">
              <v-col cols="11" md="12" lg="12" xl="12">
                <v-row jusify="center">
                  <h2>Formulaire</h2>
                </v-row>
                <v-row>
                  <v-col cols="11" md="10" lg="6" xl="6">
                    <v-text-field v-model="name" label="Nom"></v-text-field>
                  </v-col>
                  <v-col cols="11" md="10" lg="6" xl="6">
                    <v-text-field v-model="firstname" label="Prénom"></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field v-model="mesure" label="Nom de la mesure"></v-text-field>
              </v-col>
            </v-row>
            <!-- Add dimension -->
            <div justify="center" align="center" class="mb-5">
              <v-btn class="mr-5 white--text font-weight-bold" @click="addNewDim" color="#95C35A">
                Ajouter une dimension
                <v-icon right dark>mdi-plus</v-icon>
              </v-btn>
            </div>

            <v-row>
              <!------------- -Dimensions  --------------------------------->
              <v-col
                v-for="(table, i) in tablesData"
                :key="i"
                cols="11"
                md="12"
                lg="12"
                xl="12"
                class="card ma-3"
              >
                <v-card class="d-flex space-between" flat color="rgb(243, 243, 243)">
                  <div class="d-flex flex-column align-content-center justify-center flex-wrap">
                    <v-icon v-if="i > 0" class="mx-1" @click="upDim(tablesData, i)">mdi-arrow-up</v-icon>
                    <v-icon
                      v-if="i != tablesData.length - 1"
                      class="mx-1"
                      @click="downDim(tablesData, i)"
                    >mdi-arrow-down</v-icon>
                  </div>
                  <h1>Dimension {{ i + 1 }}</h1>
                  <v-spacer />

                  <v-icon large @click="deleteDim(i)">mdi-trash-can-outline</v-icon>
                </v-card>
                <v-col xl="12" lg="12">
                  <v-text-field
                    v-if="!table.modifyDim"
                    v-model="table.dim"
                    persistent-hint
                    hint="modifier le nom de la dimension"
                    append-outer-icon="mdi-close-circle-outline"
                    clearable
                    outlined
                    label="Nom de la dimension"
                    type="text"
                    @click:append-outer="editDimension(i)"
                  ></v-text-field>
                  <v-card class="d-flex space-between" color="rgb(243, 243, 243)" flat>
                    <v-select
                      v-if="table.modifyDim"
                      :items="computedDims"
                      @change="changeValueDim($event, i)"
                      :value="table.dim"
                      label="Liste des dimensions"
                    ></v-select>
                    <v-icon v-if="table.modifyDim" class="mx-3" @click="editDimension(i)">mdi-pencil</v-icon>
                  </v-card>
                </v-col>

                <!-------------- Levels -------------------->
                <h2>Niveau</h2>
                <v-row justify="center">
                  <v-col
                    cols="11"
                    md="10"
                    lg="12"
                    xl="12"
                    v-for="(level, j) in tablesData[i].level"
                    :key="j"
                  >
                    <v-card elevation="1" class="d-flex justify-space-between">
                      <div class="d-flex flex-column align-content-center justify-center flex-wrap">
                        <v-icon
                          v-if="j > 0"
                          class="mx-1"
                          @click="upLevel(tablesData, i, j)"
                        >mdi-arrow-up</v-icon>
                        <v-icon
                          v-if="j != tablesData[i].level.length - 1"
                          class="mx-1"
                          @click="downLevel(tablesData, i, j)"
                        >mdi-arrow-down</v-icon>
                      </div>
                      <v-text-field
                        v-if="!level.modifyLevel"
                        v-model="level.name"
                        persistent-hint
                        class="mt-2"
                        hint="modifier le nom du niveau"
                        append-outer-icon="mdi-close-circle-outline"
                        clearable
                        outlined
                        :label="'Niveau ' + (j + 1)"
                        type="text"
                        @click:append-outer="editDimensionLevel(i, j)"
                      ></v-text-field>

                      <v-select
                        v-if="level.modifyLevel"
                        class="ml-2"
                        :items="computedLevels[i]"
                        @change="changeValueLevel($event, i, j)"
                        :value="level.name"
                        :label="'Niveau ' + (j + 1)"
                      ></v-select>
                      <div
                        class="d-flex flex-column align-content-center justify-center flex-wrap mx-2"
                      >
                        <v-icon class="mb-2" @click="deleteLevel(i, j)">mdi-trash-can-outline</v-icon>
                        <v-icon
                          v-if="level.modifyLevel"
                          @click="editDimensionLevel(i, j)"
                        >mdi-pencil</v-icon>
                      </div>
                    </v-card>
                  </v-col>
                  <v-row justify="center">
                    <v-btn small color="#EE8700" class="ma-2 white--text" @click="addLevel(i)">
                      Ajouter un niveau
                      <v-icon right dark>mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <!-- Right part Board -->
        <v-col
          class="board-position ml-8"
          lg="8"
          xl="8"
          v-if="this.tablesData.length > 0 || this.mesure.length > 0"
        >
          <v-row justify="center" class="board-position">
            <Board
              :mesure="mesure"
              :datas="tablesData"
              :refresh="forceRecomputeCounter"
              @updateArrayOfValues="updateArrayOfValues"
            />
          </v-row>
          <v-row justify="center" class="mt-3">
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
import Explanation from "@/components/Explanation.vue";
import donnee from "../Choix.json";

export default {
  name: "Home",
  components: {
    EnvButton,
    Board,
    Video,
    Explanation
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
      focus: false
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
        modifyDim: true,
        level: [{ name: "", modifyLevel: true }],
        values: [[]]
      });
      this.addLevel();
    },
    deleteDim(index) {
      this.tablesData.splice(index, 1);
    },
    changeValueDim(value, i) {
      this.tablesData[i].dim = value;
    },
    addLevel(indexDim) {
      this.tablesData[indexDim].level.push({ name: "", modifyLevel: true });
    },
    changeValueLevel(value, i, j) {
      this.tablesData[i].level[j].name = value;
      this.forceRecomputeCounter++;
    },
    deleteLevel(indexDim, indexLevel) {
      this.tablesData[indexDim].level.splice(indexLevel, 1);
    },
    changeFocus() {
      this.focus = true;
    },
    editDimension(indexDim) {
      if (this.tablesData[indexDim].modifyDim) {
        this.tablesData[indexDim].modifyDim = false;
      } else {
        this.tablesData[indexDim].modifyDim = true;
        this.tablesData[indexDim].dim = "";
      }
    },

    editDimensionLevel(indexDim, indexLevel) {
      if (this.tablesData[indexDim].level[indexLevel].modifyLevel) {
        this.tablesData[indexDim].level[indexLevel].modifyLevel = false;
      } else {
        this.tablesData[indexDim].level[indexLevel].modifyLevel = true;
        this.tablesData[indexDim].level[indexLevel].name = "";
      }
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
    upDim(tableData, indexDim) {
      var element = tableData[indexDim];
      tableData.splice(indexDim, 1);
      tableData.splice(indexDim - 1, 0, element);
    },
    downDim(tableData, indexDim) {
      var element = tableData[indexDim];
      tableData.splice(indexDim, 1);
      tableData.splice(indexDim + 1, 0, element);
    }
  },
  computed: {
    //data with only the titre of the json file : [titre1, titre2, titre3 ...]
    //type array
    tableDim() {
      return this.rawData.map(itemY => {
        return itemY.titre;
      });
    },
    //data with only the level of the json file : [level1, level2, level3 ...]
    //type array
    tableLevel() {
      var levels = [];
      this.rawData.map(item =>
        item.champs.map(level => {
          levels.push(level);
        })
      );
      return levels;
    },
    //data with all the dimension selected in the v-select
    //type array
    dimSelected() {
      return this.tablesData.map(itemTable => {
        return itemTable.dim;
      });
    },
    levelSelected() {
      var tablesLevel = [];
      for (var i = 0; i < this.tablesData.length; i++) {
        var level = [];
        console.log(this.tablesData[i].level);
        this.tablesData[i].level.map(item => {
          level.push(item.name);
        });

        tablesLevel.push(level);
      }
      return tablesLevel;
    },
    //Dimensions filtered if already selected
    // [{titre1, false}, {titre2, true}, {titre3, true} ...]
    computedDims() {
      return this.tableDim.map(item => {
        return {
          text: item,
          disabled: this.dimSelected.includes(item)
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
        this.tableLevel.map(item => {
          level.push({
            text: item,
            disabled: this.levelSelected[i].includes(item)
          });
        });

        tablesLevel.push(level);
      }

      //console.log(tablesLevel);
      return tablesLevel;
    }
  }
};
</script>

<style>
.board-position {
  position: sticky;
  top: 120px;
}

.main-row {
  align-items: flex-start;
  position: relative;
}

.card {
  background-color: rgb(243, 243, 243);
}
.main {
  margin-left: 0;
  margin-right: 0;
}
.col-right {
  position: relative;
}
</style>
