<template>
  <v-container fluid class="main">
    <v-row justify="center">
      <v-col lg="6" xl="5" class="colonne">
        <v-form>
          <v-row align="center" justify="start">
            <v-col cols="11" md="12" lg="12" xl="12">
              <v-row>
                <v-col cols="11" md="10" lg="6" xl="6">
                  <v-text-field v-model="name" label="Nom"></v-text-field>
                </v-col>
                <v-col cols="11" md="10" lg="6" xl="6">
                  <v-text-field v-model="firstname" label="Prénom"></v-text-field>
                </v-col>                
              </v-row>

              <v-text-field
                v-model="mesure"
                label="Nom de la mesure"
              ></v-text-field>
            </v-col>
          </v-row>

          <div justify="center" align="center" class="mb-5">
            <v-btn class="mr-5" @click="addNewDim" color="primary" small
              >Ajouter une dimension</v-btn
            >
          </div>

          <v-row align="center">
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
          <v-row justify="center">
            <v-btn
              small
              color="light-blue accent-3"
              class="ma-2 white--text"
              @click="myDataToXML(tablesData)"
            >
              Envoyer
              <v-icon right dark>mdi-send</v-icon>
            </v-btn>
          </v-row>
        </v-form>
      </v-col>
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
      rawData: donnee.Tables,
      mesure: "",
      tablesData: [],
      name: "",
      firstname: "",
      forceRecomputeCounter: 0
    };
  },
  methods: {
    myDataToXML(value1) {
      var file
      value1.length > 0 ? file = `<?xml version="1.0"?>
      <Schema name="DWH">
      \t<Cube name="Cube" defaultMeasure="new">
      \t\t<Table name=${value1[0].value} />
      \t\t\t<some-tag> ${value1} </some-tag><some-tag> ${value1} </some-tag>
      \t\t<Measure name=${value1} column=${value1} aggregator="avg" formatString="#.#"/>+
      \t</Cube>\n</Schema>`
      : file = `<?xml version="1.0"?> <Schema> la table est vide mais ça fonctionne </Schema>`;

      console.log("----> "+file)
      //var rand = Math.random()
      //  .toString(36)
      //  .substr(2);
      
      const blob = new Blob([file], { type: "text/xml" });
      
      var fd = new FormData();
      
      fd.append("upl", blob, this.name + "_" + this.firstname + ".xml");
      console.log(fd)


      fetch('http://localhost:4000/api/test', {
        method: "POST",
        body: fd
      })
      .then(response => console.log(response))
      .catch(function(error) {
      console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message); 
      })     

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
    tableTitre() {
      return this.rawData.map(itemY => {
        return itemY.titre;
      });
    },
    tableLevel() {
      var levels = [];
      this.rawData.map(item =>
        item.champs.map(level => {
          levels.push(level);
        })
      );
      return levels;
    },
    dimSelected() {
      return this.tablesData.map(itemTable => {
        return itemTable.value;
      });
    },
    /*levelSelected() {
      var tablesLevelSelected = [];
      for (var i = 0; i < this.tablesData.length; i++) {
        var level = [];
        this.tablesData[i].level.map(item => {
          level.push(item);
        });
        tablesLevelSelected.push(level);
      }
      return tablesLevelSelected;
    },*/
    computedDims() {
      return this.tableTitre.map(item => {
        return {
          text: item,
          disabled: this.dimSelected.includes(item)
        };
      });
    },
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

</style>
