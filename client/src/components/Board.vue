<template>
  <div justify="center" v-if="datas.length > 0 || this.mesure.length > 0">
    <h1>Board</h1>
    <!-- add table -->
    <table>
      <!-- add head table -->
      <thead>
        <th
          v-for="(data, i) in datas"
          :key="i"
          :colspan="data.level.length"
          class="font-weight-medium"
        >
          {{ data.dim }}
        </th>
        <th class="font-weight-medium" rowspan="2">{{ this.mesure }}</th>

        <tr>
          <th class="font-weight-medium" v-for="(level, i) in levels" :key="i">
            {{ level }}
          </th>
        </tr>
      </thead>
      <!-- add body table -->
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
      <!-- add foot table with add/delete lign buttons -->
      <tfoot>
        <td :colspan="this.levels.length + 1" align="center">
          <v-btn
            x-small
            color="light-blue accent-3"
            class="ma-2 white--text"
            @click="
              insertTab();
              addLign();
              insertTab();
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
              insertTab();
            "
            :disabled="nbline < 4"
            >Suprimer une ligne</v-btn
          >
          <!-- add v-dialog to secure the lign deleting -->
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
                    insertTab();
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
          levels.push(this.datas[i].level[j].name);
        }
      }
      return levels;
    },
  },
  data() {
    return {
      dialog: false,
      nbline: 3,
      arrayOfValues: [],
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
      if (this.arrayOfValues[this.arrayOfValues.length - 1].join("") != "") {
        this.dialog = true;
      } else {
        this.delLign();
      }
    },
    insertTab: function() {
      this.arrayOfValues = [];
      for (var i = 1; i <= this.nbline; i++) {
        var lign_value = [];
        for (var j = 1; j <= this.levels.length + 1; j++) {
          var str_id = `textfield:${i};${j}`;
          var sting_val = document.getElementById(str_id).value;
          while (sting_val[sting_val.length - 1] == " ") {
            sting_val = sting_val.slice(0, -1);
          }
          lign_value.push(sting_val);
        }
        this.arrayOfValues.push(lign_value);
      }
      this.$emit("updateArrayOfValues", this.arrayOfValues);
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
