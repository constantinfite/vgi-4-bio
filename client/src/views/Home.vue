<template>
  <v-container fluid class="main">
    <v-row justify="center">
      <!-- Left part form -->
      <v-col lg="6" xl="6" class="colonne">
        <v-form>
          <!-- Select Name First_Name-->
          <v-row align="center" justify="start">
            <v-col cols="11" md="12" lg="12" xl="12">
              <v-row>
                <v-col cols="11" md="10" lg="6" xl="6">
                  <v-text-field v-model="prenom" label="Prénom"></v-text-field>
                </v-col>
                <v-col cols="11" md="10" lg="6" xl="6">
                  <v-text-field v-model="nom" label="Nom"></v-text-field>
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
                class="d-flex justify-space-between mb-3"
                color="rgb(243, 243, 243)"
                outlined
              >
                <h2>dimension {{ i }}</h2>
                <v-icon large @click="deleteDim(i)"
                  >mdi-trash-can-outline</v-icon
                >
              </v-card>

              <v-select
                class="select-dim"
                :items="computedDims"
                @change="changeValueDim($event, i)"
                :value="table.value"
                label="Dimension"
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
                  lg="4"
                  xl="4"
                  v-for="(table, j) in tablesData[i].level"
                  :key="j"
                >
                  <v-card flat class="d-flex justify-space-between">
                    <v-select
                      class="mx-3"
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

          <!-- Send data to XML  -->
          <v-row justify="center">
            <v-btn
              small
              color="light-blue accent-3"
              class="ma-2 white--text"
              @click="myDataToXML(tablesData, prenom, nom)"
            >
              Envoyer
              <v-icon right dark>mdi-send</v-icon>
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
      <!-- Right part Board -->
      <v-col lg="6" xl="6">
        <Board :datas="tablesData" :mesure="mesure" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Board from "@/components/Board.vue";
import donnee from "../Choix.json";
export default {
  name: "Home",
  components: {
    Board
  },
  data() {
    return {
      prenom: "",
      nom: "",
      rawData: donnee.Tables, //the entire data of the json file
      mesure: "", // mesure typed in the v-select mesure
      tablesData: [], // a array of the values fill in the form [{dim1,[level1,level2]},{dim2,[level1,level2]} ...]
      forceRecomputeCounter: 0 //just a data used to refresh a computed data
    };
  },
  methods: {
    //function which take as argument the tablesData(data) and convert in to XML file
    //store the XML file in the upload directory at the root
    myDataToXML(value1, prenom, nom) {
      var file = `<?xml version="1.0"?> 
      <Schema name="DWH">
      \t<Cube name="Cube" defaultMeasure="new">
      \t\t<Table name=${value1[0].value} />
      \t\t\t<some-tag> ${value1} </some-tag><some-tag> ${value1} </some-tag>
      \t\t<Measure name=${value1} column=${value1} aggregator="avg" formatString="#.#"/>+
      \t</Cube>\n</Schema>`;

      const blob = new Blob([file], { type: "text/xml" });

      var fd = new FormData();

      fd.append("upl", blob, prenom + nom + ".xml");

      fetch("http://localhost:4000/api/test", {
        method: "post",
        body: fd
      });
    },
    addNewDim() {
      this.tablesData.push({
        value: "",
        level: [""]
      });
    },
    deleteDim(index) {
      this.tablesData.splice(index, 1);
    },
    changeValueDim(value, i) {
      this.tablesData[i].value = value;
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
    }
  },
  computed: {
    //data with only the titre of the json file : [titre1, titre2, titre3 ...]
    //type array
    tableTitre() {
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
        return itemTable.value;
      });
    },
    //Dimensions filtered if already selected
    // [{titre1, false}, {titre2, true}, {titre3, true} ...]
    computedDims() {
      return this.tableTitre.map(item => {
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
            disabled: this.tablesData[i].level.includes(item)
          });
        });

        tablesLevel.push(level);
      }

      console.log(tablesLevel);
      return tablesLevel;
    }
  }
};
</script>

<style>
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
.colonne {
}
</style>
