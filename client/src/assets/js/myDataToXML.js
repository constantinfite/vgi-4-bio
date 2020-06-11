//function which take as argument the tablesData(data) and convert in to XML file
//store the XML file in the upload directory at the root

export default function myDataToXML(
  datas,
  mesure,
  name_firstname,
  HierarchyTab
) {
  console.log(HierarchyTab);
  if (datas.length > 0) {
    // if there is a dimesnsion create xml file else display a message in the console

    // create var file which is the file content
    var file =
      `<?xml version="1.0"?>\n\n` +
      `<Schema name="DWH">\n` +
      `\t<Cube name="Cube" defaultMeasure="new">\n\n\n` +
      `\t\t<Table name="${mesure}" />\n\n`;

    // the for loop allow the parcour of value in order to complete the var file
    for (var i = 0; i < datas.length; i++) {
      file += `\t\t\t<Dimension name="${datas[i].dim}" foreignKey="${datas[i].dim}_id">\n`;
      file += `\t\t\t\t<Hierarchy hasAll="true" primaryKey="${datas[i].dim}_id">\n`;
      file += `\t\t\t\t\t<Table name="${datas[i].dim}" />\n`;

      for (var j = 0; j < datas[i].level.length; j++) {
        file += `\t\t\t\t\t\t<Level name="${datas[i].level[j].name}" column="${datas[i].level[j].name}" uniqueMembers="false" />\n`;
      }

      file += `\t\t\t\t</Hierarchy>\n`;
      file += `\t\t\t</Dimension>\n\n`;
    }

    file += `\t\t<Measure name="${mesure}" column="${mesure}" aggregator="avg" formatString="#.#"/>\n`;
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
}
