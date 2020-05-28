<template>
  <div justify="center">
    <!-- Send data to XML  -->
    <v-btn
      v-if="datas.length > 0 || this.mesure.name.length > 0"
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
  </div>
</template>

<script>
export default {
  props: {
    mesure: {
      type: Object
    },
    datas: {
      type: Array
    }
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
          `\t\t<Table name="${this.mesure.name}" />\n\n`;

        // the for loop allow the parcour of value in order to complete the var file
        for (var i = 0; i < value1.length; i++) {
          file += `\t\t\t<Dimension name="${value1[i].dim}" foreignKey="${value1[i].dim}_id">\n`;
          file += `\t\t\t\t<Hierarchy hasAll="true" primaryKey="${value1[i].dim}_id">\n`;
          file += `\t\t\t\t\t<Table name="${value1[i].dim}" />\n`;

          for (var j = 0; j < value1[i].level.length; j++) {
            file += `\t\t\t\t\t\t<Level name="${value1[i].level[j]}" column="${value1[i].level[j]}" uniqueMembers="false" />\n`;
          }

          file += `\t\t\t\t</Hierarchy>\n`;
          file += `\t\t\t</Dimension>\n\n`;
        }

        file += `\t\t<Measure name="${this.mesure.name}" column="${this.mesure.name}" aggregator="avg" formatString="#.#"/>\n`;
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
          body: fd
        })
          // display in the console the responce of the fetch
          .then(response => console.log(response))
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
          `CREATE TABLE IF NOT EXISTS ${this.mesure.name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} (\n` +
          `\t${this.mesure.name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} INTEGER,\n`;
        var allID = "";

        for (var i = 0; i < value1.length; i++) {
          Tables += `CREATE TABLE IF NOT EXISTS ${value1[i].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;
          Tables += `\t${value1[i].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

          for (var j = 0; j < value1[i].level.length; j++) {
            Tables += `\t${value1[i].level[j]
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;
          }

          Tables += `\tPRIMARY KEY (${value1[i].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
          Tables += `);\n`;

          linkTable += `\t${value1[i].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ${value1[
            i
          ].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(${value1[i].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

          allID += `${value1[i].dim
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

            insert += `INSERT INTO ${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}`
            
            Tables += `CREATE TABLE IF NOT EXISTS ${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} (\n`
            Tables += `\t${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID SERIAL,\n`

            for(var j = 0; j < value1[i].level.length; j++){

              Tables += `\t${value1[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} TEXT,\n`

              insert += `${value1[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')},`

              

            }

            insert = insert.slice(0, -1) + `)  VALUES (`

            for(var k = 0; k < (insertTab.length - 1); k++){

              insert += `'$(insertTab[k]',`

            }

            insert = insert.slice(0, -1) + ');\n' 

            allIDInsert += `(SELECT MAX(${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID) FROM ${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}),`

            Tables += `\tPRIMARY KEY (${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID)\n`
            Tables += `);\n`

            linkTable += `\t${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID INTEGER REFERENCES ${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}(${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID),\n`

            allID += `${value1[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID,`

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
          body: fd
        })
          // display in the console the responce of the fetch
          .then(response => console.log(response))
          // if we have an error with the fetch it display it
          .catch(function(error) {
            console.log(
              "Il y a eu un problème avec l'opération fetch: " + error.message
            );
          });
      } else {
        console.log("auccune dimenssion ne sont écrite");
      }
    }
  }
};
</script>