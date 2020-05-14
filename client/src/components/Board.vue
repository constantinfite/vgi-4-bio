<template>
  <div justify="center">
    <h1>Board</h1>
    <!-- Board -->
    <table v-if="datas.length > 0 || mesure.length > 0">
      <thead>
        <th
          v-for="(data, i) in datas"
          :key="i"
          :colspan="data.level.length"
          class="font-weight-medium"
        >
          {{ data.value }}
        </th>
        <th class="font-weight-medium" rowspan="2">{{ mesure }}</th>

        <tr>
          <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">
            {{ level }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- fill of jtext fields -->
        <tr v-for="k in nbline" :key="k">
          <td v-for="(level, j) in levels" :key="level">
            <v-text-field
              :id="'textfield:' + k + ';' + (j + 1)"
              label="Entrez vos données"
              solo
              flat
              hide-details="True"
              @change="insertTab"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              :id="'textfield:' + k + ';' + (levels.length + 1)"
              label="Entrez vos données"
              solo
              flat
              hide-details="True"
              @change="insertTab"
            ></v-text-field>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <td :colspan="this.levels.length + 1" align="center">
          <v-btn
            x-small
            color="light-blue accent-3"
            class="ma-2 white--text"
            @click="
              insertTab();
              addLign();
            "
            :disabled="nbline > 14"
          >
            Ajouter une ligne
            <v-icon right dark>mdi-plus</v-icon>
          </v-btn>

          <v-btn
            x-small
            color="red accent-3"
            class="ma-2 white--text"
            @click="
              insertTab();
              verifLastLign();
            "
            :disabled="nbline < 4"
            >Suprimer une ligne</v-btn
          >
          <v-dialog v-model="dialog" persistent max-width="350">
            <v-card>
              <v-card-title class="headline">Attention !</v-card-title>
              <v-card-text>
                <p>Un champs de la dernière ligne n'est pas vide.</p>
                <p class="font-weight-bold">
                  Êtes vous sûr de vouloir supprimer la ligne?
                </p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red darken-1"
                  text
                  @click="
                    dialog = false;
                    delLign();
                  "
                  >Suprimer</v-btn
                >
                <v-btn color="light-blue darken-1" text @click="dialog = false"
                  >Annuler</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </tfoot>
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
    refresh: {
      type: Number,
    },
  },
  computed: {
    levels: function() {
      this.refresh;
      var levels = [];
      for (var i = 0; i < this.datas.length; i++) {
        for (var j = 0; j < this.datas[i].level.length; j++) {
          levels.push(this.datas[i].level[j]);
        }
      }
      return levels;
    },
  },
  data() {
    return {
      dialog: false,
      nbline: 3,
      textFieldsValues: [],
    };
  },
  methods: {
    addLign() {
      return (this.nbline += 1);
    },
    delLign() {
      return (this.nbline -= 1);
    },
    verifLastLign() {
      console.log(
        this.textFieldsValues[this.textFieldsValues.length - 1].join("")
      );
      if (
        this.textFieldsValues[this.textFieldsValues.length - 1].join("") != ""
      ) {
        this.dialog = true;
      } else {
        this.delLign();
      }
    },
    insertTab: function() {
      var insertTab = [];
      [];
      for (var i = 1; i <= this.nbline; i++) {
        var lign_value = [];
        for (var j = 1; j <= this.levels.length + 1; j++) {
          var str_id = `textfield:${i};${j}`;
          lign_value.push(document.getElementById(str_id).value);
        }
        insertTab.push(lign_value);
      }
      this.textFieldsValues = insertTab;
      return this.textFieldsValues;
    },
  },
};
</script>

<style scoped>
.line {
  border: 2px solid green;
}
.v-text-field {
  background-color: transparent;
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
}

td {
  border: 2px solid black;
  min-width: 120px;
}
</style>
