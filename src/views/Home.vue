<template>
  <div class="home mt-12">
    <v-container>
      <v-form>
        <v-row justify="center" align="center">
          <v-col cols="11" md="10" lg="7" xl="4">
            <v-row>
              <v-col cols="11" md="10" lg="7" xl="6">
                <v-text-field label="Prénom"></v-text-field>
              </v-col>
              <v-col cols="11" md="10" lg="7" xl="6">
                <v-text-field label="Nom"></v-text-field>
              </v-col>
            </v-row>

            <v-text-field label="Nom de la mesure"></v-text-field>
          </v-col>
        </v-row>

        <div justify="center" align="center" class="mb-5">
          <v-btn class="mr-5" @click="addNewDim" color="primary"
            >Ajouter une dimension</v-btn
          >
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
            <h2>dimension {{ i }}</h2>
            <v-select
              hide-selected
              :items="computedItems"
              @change="changeValue($event, i)"
              :value="table.value"
              label="Dimension"
            ></v-select>
            <v-icon @click="addLevel(i)">+</v-icon>
            <v-row>
              <v-col
                cols="11"
                md="10"
                lg="7"
                xl="4"
                v-for="(table, j) in tablesData[i].level"
                :key="j"
              >
                <v-select :items="tableChamp" label="Niveau"></v-select>
              </v-col>
            </v-row>
            <v-icon @click="deleteDim(i)">X</v-icon>
          </v-col>
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
    addNewDim() {
      this.tablesData.push({
        value: "",
        level: [""]
      });
    },
    deleteDim(index) {
      this.tablesData.splice(index, 1);
    },
    changeValue(value, i) {
      this.tablesData[i].value = value;
    },
    addLevel(indexDim) {
      console.log(indexDim);
      this.tablesData[indexDim].level.push("");
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
  background-color: rgb(223, 223, 223);
}
</style>
