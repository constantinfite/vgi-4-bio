<template>
  <div class="home mt-12">
    <v-container>
      <v-form>
        <v-row justify="center" align="center">
          <v-col cols="11" md="10" lg="7" xl="4">
            <v-row>
              <v-col cols="11" md="10" lg="6" xl="6">
                <v-text-field label="Prénom"></v-text-field>
              </v-col>
              <v-col cols="11" md="10" lg="6" xl="6">
                <v-text-field label="Nom"></v-text-field>
              </v-col>
            </v-row>

            <v-text-field label="Nom de la mesure"></v-text-field>
          </v-col>
        </v-row>

        <div justify="center" align="center" class="mb-5">
          <v-btn class="mr-5" @click="addNewDim" color="primary">Ajouter une dimension</v-btn>
        </div>

        <v-row justify="center" align="center">
          <v-col
            v-for="(table, i) in tablesData"
            :key="i"
            cols="11"
            md="10"
            lg="7"
            xl="7"
            class="card ma-3"
          >
            <v-card class="d-flex justify-space-between mb-3" color="rgb(243, 243, 243)" outlined>
              <h2>dimension {{ i }}</h2>
              <v-icon large @click="deleteDim(i)">mdi-trash-can-outline</v-icon>
            </v-card>

            <v-select
              class="select-dim"
              hide-selected
              :items="computedItems"
              @change="changeValueDim($event, i)"
              :value="table.value"
              label="Dimension"
            ></v-select>
            <v-row>
              <v-btn
                small
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
                lg="7"
                xl="4"
                v-for="(table, j) in tablesData[i].level"
                :key="j"
              >
                <v-select
                  :items="tableChamp"
                  label="Niveau"
                  @change="changeValueLevel($event, i, j)"
                ></v-select>
                <v-icon @click="deleteLevel(i, j)">mdi-trash-can-outline</v-icon>
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
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
//import SelectComponent from "@/components/SelectComponent.vue";
import donnee from "../Choix.json";
export default {
  name: "Home",
  data() {
    return {
      rawData: donnee.Tables,
      tablesData: []
    };
  },
  methods: {
    myDataToXML(value1) {
      var file = `<?xml version="1.0"?> 
      <Schema name="DWH">
      \t<Cube name="Cube" defaultMeasure="new">
      \t\t<Table name=${value1[0].value} />
      \t\t\t<some-tag> ${value1} </some-tag><some-tag> ${value1} </some-tag>
      \t\t<Measure name=${value1} column=${value1} aggregator="avg" formatString="#.#"/>+
      \t</Cube>\n</Schema>`;
      var rand = Math.random()
        .toString(36)
        .substr(2);
      const blob = new Blob([file], { type: "text/xml" });

      var fd = new FormData();

      fd.append("upl", blob, rand + ".xml");

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
    dimSelected() {
      return this.tablesData.map(itemTable => {
        return itemTable.value;
      });
    },
    computedItems() {
      return this.tableTitre.map(item => {
        return {
          text: item,
          disabled: this.dimSelected.includes(item)
        };
      });
    },
    tableChamp() {
      return this.rawData.map(itemY => {
        return itemY.champs;
      });
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
</style>
