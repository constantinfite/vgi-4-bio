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
              @click="
                myDataToXML(tablesData);
                myDataToSQL(tablesData);
              "
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
    Board,
  },
  data() {
    return {
      rawData: donnee.Tables, //the entire data of the json file
      mesure: "", // mesure typed in the v-select mesure
      tablesData: [], // a array of the values fill in the form [{dim1,[level1,level2]},{dim2,[level1,level2]} ...]
      name: "",
      firstname: "",
      forceRecomputeCounter: 0, //just a data used to refresh a computed data
    };
  },
  methods: {
    //function which take as argument the tablesData(data) and convert in to XML file
    //store the XML file in the upload directory at the root
    myDataToXML(value1) {
      if (value1.length > 0) {
        // if there is a dimesnsion create xml file else display a message in the console

        // create var file which is the file content
        var file =
          `<?xml version="1.0"?>\n\n` +
          `<Schema name="DWH">\n` +
          `\t<Cube name="Cube" defaultMeasure="new">\n\n\n` +
          `\t\t<Table name="${this.mesure}" />\n\n`;

        // the for loop allow the parcour of value in order to complete the var file
        for (var i = 0; i < value1.length; i++) {
          file += `\t\t\t<Dimension name="${value1[i].value}" foreignKey="${value1[i].value}_id">\n`;
          file += `\t\t\t\t<Hierarchy hasAll="true" primaryKey="${value1[i].value}_id">\n`;
          file += `\t\t\t\t\t<Table name="${value1[i].value}" />\n`;

          for (var j = 0; j < value1[i].level.length; j++) {
            file += `\t\t\t\t\t\t<Level name="${value1[i].level[j]}" column="${value1[i].level[j]}" uniqueMembers="false" />\n`;
          }

          file += `\t\t\t\t</Hierarchy>\n`;
          file += `\t\t\t</Dimension>\n\n`;
        }

        file += `\t\t<Measure name="${this.mesure}" column="${this.mesure}" aggregator="avg" formatString="#.#"/>\n`;
        file += `\t</Cube>\n`;
        file += `</Schema>\n`;

        // create a Blob var which content the var file and arrage it as a xml file
        const blob = new Blob([file], { type: "text/xml" });

        // create a var which will be send by the "fetch".
        // it create via the blob var the name we have from the form and the date, and with an id for the API
        var fd = new FormData();
        fd.append(
          "xml",
          blob,
          this.name +
            "_" +
            this.firstname +
            "_" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            "-" +
            (new Date().getYear() + 1900) +
            "_" +
            new Date().getHours() +
            "-" +
            new Date().getMinutes() +
            ".xml"
        );

        fetch("http://localhost:4000/api/xml", {
          method: "POST",
          body: fd,
        })
          // display in the console the responce of the fetch
          .then((response) => console.log(response))
          // if we have an error with the fetch it display it
          .catch(function(error) {
            console.log(
              "Il y a eu un problème avec l'opération fetch: " + error.message
            );
          });
      } else {
        console.log("auccune dimenssion ne sont écrite");
      }
    },

    myDataToSQL(value1) {
      if (value1.length > 0) {
        // if there is a dimesnsion create sql file else display a message in the console

        // create multiple var which will use to create the var file
        // we create multiple var to use the for loop once and maque the read easy
        var Tables = "";
        var linkTable =
          `CREATE TABLE IF NOT EXISTS ${this.mesure
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} (\n` +
          `\t${this.mesure
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} INTEGER,\n`;
        var allID = "";

        for (var i = 0; i < value1.length; i++) {
          Tables += `CREATE TABLE IF NOT EXISTS ${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;
          Tables += `\t${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

          for (var j = 0; j < value1[i].level.length; j++) {
            Tables += `\t${value1[i].level[j]
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;
          }

          Tables += `\tPRIMARY KEY (${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
          Tables += `);\n`;

          linkTable += `\t${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ${value1[
            i
          ].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

          allID += `${value1[i].value
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID,`;
        }

        linkTable += `\tPRIMARY KEY (${allID.slice(0, -1)})\n`;
        linkTable += `);\n\n`;

        // create var file which is the file content
        var file = Tables + linkTable;

        /*
          // if we use value insertion we must replace the loop up for the one down
          // we have to create a tab of the insertion values !!! we call it "insertTab"
          
          var insert = ''
          var Tables = ''
          var linkTable =   `CREATE TABLE IF NOT EXISTS ${this.mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} (\n`+
                            `\t${this.mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} INTEGER,\n`
          var allID = ''
          var allIDInsert = ''

          for(var i = 0; i < value1.length; i++){

            insert += `INSERT INTO ${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}`
            
            Tables += `CREATE TABLE IF NOT EXISTS ${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} (\n`
            Tables += `\t${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID SERIAL,\n`

            for(var j = 0; j < value1[i].level.length; j++){

              Tables += `\t${value1[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} TEXT,\n`

              insert += `${value1[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')},`

              

            }

            insert = insert.slice(0, -1) + `)  VALUES (`

            for(var k = 0; k < (insertTab.length - 1); k++){

              insert += `'$(insertTab[k]',`

            }

            insert = insert.slice(0, -1) + ');\n' 

            allIDInsert += `(SELECT MAX(${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID) FROM ${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}),`

            Tables += `\tPRIMARY KEY (${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID)\n`
            Tables += `);\n`

            linkTable += `\t${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID INTEGER REFERENCES ${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}(${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID),\n`

            allID += `${value1[i].value.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID,`

          }

          linkTable += `\tPRIMARY KEY (${allID.slice(0, -1)})\n`
          linkTable += `);\n\n`

          insert += `INSERT INTO ${this.mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}(${this.mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')},${allID.slice(0, -1)}) VALUES (insertTab[insertTab.length - 1], ${allIDInsert.slice(0, -1)});\n\n`
          

          var file = Tables + linkTable + insert
        
        */

        // create a Blob var which content the var file and arrage it as a xml file
        const blob = new Blob([file], { type: "text/sql" });

        // create a var which will be send by the "fetch".
        // it create via the blob var the name we have from the form and the date, and with an id for the API
        var fd = new FormData();
        fd.append(
          "sql",
          blob,
          this.name +
            "_" +
            this.firstname +
            "_" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            "-" +
            (new Date().getYear() + 1900) +
            "_" +
            new Date().getHours() +
            "-" +
            new Date().getMinutes() +
            ".sql"
        );

        fetch("http://localhost:4000/api/sql", {
          method: "POST",
          body: fd,
        })
          // display in the console the responce of the fetch
          .then((response) => console.log(response))
          // if we have an error with the fetch it display it
          .catch(function(error) {
            console.log(
              "Il y a eu un problème avec l'opération fetch: " + error.message
            );
          });
      } else {
        console.log("auccune dimenssion ne sont écrite");
      }
    },
    addNewDim() {
      this.tablesData.push({
        value: "",
        level: [""],
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

      console.log(tablesLevel);
      return tablesLevel;
    },
  },
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
