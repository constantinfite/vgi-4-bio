export default function myDataToSQL(
  datas,
  mesure,
  arrayOfValues,
  name_firstname,
  HierarchyTab
) {
  console.log(HierarchyTab);
  if (datas.length > 0) {
    // if there is a dimesnsion create sql file else display a message in the console

    // create multiple var which will use to create the var file
    // we create multiple var to use the for loop once and maque the read easy
    var Tables = "";
    var linkTable =
      `CREATE TABLE IF NOT EXISTS ${mesure
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")} (\n` +
      `\t${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g, "_")} INTEGER,\n`;
    var allID = "";

    for (var i = 0; i < datas.length; i++) {
      Tables += `CREATE TABLE IF NOT EXISTS ${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;
      Tables += `\t${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

      for (var j = 0; j < datas[i].level.length; j++) {
        Tables += `\t${datas[i].level[j]
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;
      }

      Tables += `\tPRIMARY KEY (${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
      Tables += `);\n`;

      linkTable += `\t${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[i].dim
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

      allID += `${datas[i].dim
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
        var linkTable =   `CREATE TABLE IF NOT EXISTS ${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} (\n`+
                          `\t${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} INTEGER,\n`
        var allID = ''
        var allIDInsert = ''

        for(var i = 0; i < datas.length; i++){

          insert += `INSERT INTO ${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}`
          
          Tables += `CREATE TABLE IF NOT EXISTS ${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} (\n`
          Tables += `\t${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID SERIAL,\n`

          for(var j = 0; j < datas[i].level.length; j++){

            Tables += `\t${datas[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')} TEXT,\n`

            insert += `${datas[i].level[j].toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')},`

            

          }

          insert = insert.slice(0, -1) + `)  VALUES (`

          for(var k = 0; k < (insertTab.length - 1); k++){

            insert += `'$(insertTab[k]',`

          }

          insert = insert.slice(0, -1) + ');\n' 

          allIDInsert += `(SELECT MAX(${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID) FROM ${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}),`

          Tables += `\tPRIMARY KEY (${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID)\n`
          Tables += `);\n`

          linkTable += `\t${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID INTEGER REFERENCES ${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}(${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID),\n`

          allID += `${datas[i].dim.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}_ID,`

        }

        linkTable += `\tPRIMARY KEY (${allID.slice(0, -1)})\n`
        linkTable += `);\n\n`

        insert += `INSERT INTO ${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')}(${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g,'_')},${allID.slice(0, -1)}) VALUES (insertTab[insertTab.length - 1], ${allIDInsert.slice(0, -1)});\n\n`
        

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
      name_firstname +
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
}
