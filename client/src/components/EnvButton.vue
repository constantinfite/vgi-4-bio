<template>
  <div justify="center">
    <!-- Send data to XML  -->
    <v-btn
      v-if="datas.length > 0 || this.mesure.name.length > 0"
      small
      color="light-blue accent-3"
      class="ma-2 white--text"
      @click="dialog = true"
    >
      Envoyer
      <v-icon right dark>mdi-send</v-icon>
    </v-btn>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar flat color="primary" align="center" single-line="true">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>

          <v-switch dark v-model="dynamic" label="Dynamic Table"></v-switch>
        </v-toolbar>
        <v-col class="board-position ml-8">
          <v-row justify="center" class="main-row" v-if="!this.dynamic">
            <TablePopUP
              :datas="this.datas"
              :mesure="this.mesure"
              :arrayOfValues="this.correctArray()"
            ></TablePopUP>
          </v-row>
          <v-row justify="center" class="main-row" v-if="this.dynamic">
            <TablePopUPDinamic
              :datas="this.datas"
              :mesure="this.mesure"
              :arrayOfValues="this.correctArray()"
              @updateHierarchyTab="updateHierarchyTab"
            ></TablePopUPDinamic>
          </v-row>
          <v-row justify="center" class="main-row">
            <v-btn
              color="light-blue darken-1"
              text
              @click="
                toXML();
                toSQL();
                dialog = false;
              "
              >Envoyer</v-btn
            >
            <v-btn color="light-gray darken-1" text @click="dialog = false"
              >Annuler</v-btn
            >
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TablePopUP from "@/components/TablePopUP.vue";
import TablePopUPDinamic from "@/components/TablePopUPDinamic.vue";
import myDataToXML from "@/assets/js/myDataToXML.js";
import myDataToSQL from "@/assets/js/myDataToSQL.js";

export default {
  components: {
    TablePopUP,
    TablePopUPDinamic,
  },
  props: {
    mesure: {
      type: String,
    },
    datas: {
      type: Array,
    },
    arrayOfValues: {
      type: Array,
    },
    name_firstname: {
      type: String,
    },
  },
  data() {
    return {
      dialog: false,
      dynamic: false,
      HierarchyTab: [],
    };
  },
  methods: {
    updateHierarchyTab(e) {
      //console.log(e);
      this.HierarchyTab = e;
    },
    toXML: function() {
      this.dynamic = true;
      console.log("XML ok");
      myDataToXML(
        this.datas,
        this.mesure,
        this.name_firstname,
        this.HierarchyTab
      );
    },
    toSQL: function() {
      this.dynamic = true;
      console.log("sql ok");
      myDataToSQL(
        this.datas,
        this.mesure,
        this.arrayOfValues,
        this.name_firstname,
        this.HierarchyTab
      );
    },
    correctArray: function() {
      for (var i = 0; i < this.arrayOfValues.length; i++) {
        if (this.arrayOfValues[i].join("") == "") {
          this.arrayOfValues.splice(i, 1);
        }
      }
      return this.arrayOfValues;
    },
  },
};
</script>
