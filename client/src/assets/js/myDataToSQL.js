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
    var linkTable =
      `CREATE TABLE IF NOT EXISTS ${mesure
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]/g, "_")} (\n` +
      `\t${mesure.toUpperCase().replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER,\n`;

    var Tables = "";
    var allID = "";
    var insertion = "";

    for (var i = 0; i < datas.length; i++) {
      var MtMFH = false;
      var col_MtMFH = null;
      var NSFH = false;
      var col_NSFH = null;
      //var MtMNSFH = false;
      //var col_MtMNSFH = null;

      for (var lign = 0; lign < HierarchyTab.length; lign++) {
        if (typeof HierarchyTab[lign][i] !== "undefined") {
          if (HierarchyTab[lign][i].value == "Non-strick Fact") {
            NSFH = true;
            col_NSFH = HierarchyTab[lign][i].colOFdim - 1;
          }
          if (HierarchyTab[lign][i].value == "Many-to-Many Fact") {
            MtMFH = true;
            col_MtMFH = HierarchyTab[lign][i].colOFdim + 1;
          }
          if (HierarchyTab[lign][i].value == "Non-strick & Many-to-Many Fact") {
            NSFH = false;
            col_NSFH = HierarchyTab[lign][i].colOFdim - 1;
            MtMFH = false;
            col_MtMFH = HierarchyTab[lign][i].colOFdim + 1;
          }
        }
      }

      if (MtMFH || NSFH) {
        for (var j = 0; j < datas[i].level.length; j++) {
          Tables += `CREATE TABLE IF NOT EXISTS ${datas[i].level[j].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;
          Tables += `\t${datas[i].level[j].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

          Tables += `\t${datas[i].level[j].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;

          if (
            MtMFH &&
            col_MtMFH == j // || (NSFH && col_NSFH == j)
          ) {
            Tables +=
              `\t${datas[i].level[j - 1].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ` +
              `${datas[i].level[j - 1].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(` +
              `${datas[i].level[j - 1].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;
          } // */

          Tables += `\tPRIMARY KEY (${datas[i].level[j].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
          Tables += `);\n`;
        }
      } else {
        Tables += `CREATE TABLE IF NOT EXISTS ${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;
        Tables += `\t${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

        for (var indixLev = 0; indixLev < datas[i].level.length; indixLev++) {
          Tables += `\t${datas[i].level[indixLev].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;
        }

        Tables += `\tPRIMARY KEY (${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
        Tables += `);\n`;

        allID += `${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID,`;

        linkTable += `\t${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[i].dim
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;
      }

      if (MtMFH) {
        Tables += `CREATE TABLE IF NOT EXISTS list_${datas[i].level[
          col_MtMFH
        ].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;

        Tables += `\tlist_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID SERIAL,\n`;

        Tables += `\tlist_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} TEXT,\n`;

        Tables += `\tPRIMARY KEY (list_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
        Tables += `);\n`;

        allID += `list_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID,`;

        linkTable += `\tlist_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES list_${datas[
          i
        ].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}(list_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

        Tables += `CREATE TABLE IF NOT EXISTS join_list_${datas[i].level[
          col_MtMFH
        ].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;

        Tables +=
          `\tlist_${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ` +
          `list_${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(` +
          `list_${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

        Tables +=
          `\t${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ` +
          `${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(` +
          `${datas[i].level[col_MtMFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

        Tables += `\tPRIMARY KEY (list_${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${datas[i].level[col_MtMFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID )\n`;
        Tables += `);\n`;
      }

      if (NSFH) {
        Tables += `CREATE TABLE IF NOT EXISTS join_${datas[i].level[
          col_NSFH
        ].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_${datas[i].level[col_NSFH + 1].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")} (\n`;

        Tables +=
          `\t${datas[i].level[col_NSFH + 1].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ` +
          `${datas[i].level[col_NSFH + 1].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(` +
          `${datas[i].level[col_NSFH + 1].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

        Tables +=
          `\t${datas[i].level[col_NSFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ` +
          `${datas[i].level[col_NSFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}(` +
          `${datas[i].level[col_NSFH].name
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;

        Tables += `\tPRIMARY KEY (${datas[i].level[col_NSFH].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${datas[i].level[
          col_NSFH + 1
        ].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID)\n`;
        Tables += `);\n`;

        allID += `${datas[i].level[datas[i].level.length - 1].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID,`;

        linkTable += `\t${datas[i].level[datas[i].level.length - 1].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID INTEGER REFERENCES ${datas[
          i
        ].level[datas[i].level.length - 1].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[i].level[
          datas[i].level.length - 1
        ].name
          .toUpperCase()
          .replace(/[^a-zA-Z0-9]/g, "_")}_ID),\n`;
      }
    }

    linkTable += `\tPRIMARY KEY (${allID.slice(0, -1)})\n`;
    linkTable += `);\n\n`;

    //---------------------------------------------------------------------------------
    // Création insertion
    //---------------------------------------------------------------------------------

    insertion = "";

    var values_lign = 0;
    var col = 0;
    var deb_dim = 0;
    var diff_ID = 0;

    for (values_lign = 0; values_lign < arrayOfValues.length; values_lign++) {
      deb_dim = 0;
      for (col = 0; col < datas.length; col++) {
        //insertion += `-- ligne = ${values_lign}\n`;
        //insertion += `-- ${datas[col].dim}\n`;
        MtMFH = false;
        col_MtMFH = null;
        NSFH = false;
        col_NSFH = null;
        //var MtMNSFH = false;
        //var col_MtMNSFH = null;
        var lign_eff_NSFH = null;
        var nb_lign_eff_NSFH = null;
        var lign_eff_MtMFH = null;
        var nb_lign_eff_MtMFH = null;

        for (lign = 0; lign < HierarchyTab.length; lign++) {
          if (typeof HierarchyTab[lign][col] !== "undefined") {
            if (HierarchyTab[lign][col].value == "Non-strick Fact") {
              NSFH = true;
              col_NSFH = HierarchyTab[lign][col].colOFdim - 1;
              lign_eff_NSFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_NSFH = HierarchyTab[lign][col].nb_lign_eff - 1;
            }
            if (HierarchyTab[lign][col].value == "Many-to-Many Fact") {
              MtMFH = true;
              col_MtMFH = HierarchyTab[lign][col].colOFdim + 1;
              lign_eff_MtMFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_MtMFH = HierarchyTab[lign][col].nb_lign_eff - 1;
            }
            if (
              HierarchyTab[lign][col].value == "Non-strick & Many-to-Many Fact"
            ) {
              NSFH = false;
              col_NSFH = HierarchyTab[lign][col].colOFdim - 1;
              lign_eff_NSFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_NSFH = HierarchyTab[lign][col].nb_lign_eff - 1;
              MtMFH = false;
              col_MtMFH = HierarchyTab[lign][col].colOFdim + 1;
              lign_eff_MtMFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_MtMFH = HierarchyTab[lign][col].nb_lign_eff - 1;
            }
          }
        }
        if (MtMFH || NSFH) {
          for (var lev = 0; lev < datas[col].level.length; lev++) {
            if (
              col_NSFH == lev &&
              (values_lign <= lign_eff_MtMFH ||
                values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH ||
                MtMFH)
            ) {
              //insertion += `-- insert NSFH\n`;
              insertion += `INSERT INTO ${datas[col].level[col_NSFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[col].level[
                col_NSFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}) VALUES ('${
                arrayOfValues[values_lign][col_NSFH + deb_dim]
              }');\n`;
            } else if (
              col_MtMFH == lev &&
              (values_lign <= lign_eff_NSFH ||
                values_lign > lign_eff_NSFH + nb_lign_eff_NSFH ||
                NSFH)
            ) {
              //insertion += `-- insert MtMFH\n`;
              insertion += `INSERT INTO ${datas[col].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[col].level[
                col_MtMFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}, ${datas[col].level[
                col_MtMFH - 1
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) VALUES ('${
                arrayOfValues[values_lign][col_MtMFH + deb_dim]
              }', (SELECT MAX(${datas[col].level[col_MtMFH - 1].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM ${datas[col].level[
                col_MtMFH - 1
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}));\n`;
            } else if (
              col_MtMFH != lev &&
              col_NSFH != lev &&
              (values_lign <= lign_eff_MtMFH ||
                values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH) &&
              (values_lign <= lign_eff_NSFH ||
                values_lign > lign_eff_NSFH + nb_lign_eff_NSFH)
            ) {
              //insertion += `-- insert other\n`;
              insertion += `INSERT INTO ${datas[col].level[lev].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(${datas[col].level[lev].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}) VALUES ('${
                arrayOfValues[values_lign][lev + deb_dim]
              }');\n`;
            } // */
          }

          if (
            MtMFH &&
            (values_lign <= lign_eff_NSFH ||
              values_lign > lign_eff_NSFH + nb_lign_eff_NSFH ||
              NSFH)
          ) {
            if (
              values_lign <= lign_eff_MtMFH ||
              values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH
            ) {
              insertion += `INSERT INTO list_${datas[col].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(list_${datas[col].level[
                col_MtMFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}) VALUES ('${
                arrayOfValues[values_lign][col_MtMFH + deb_dim]
              }');\n`;
            } else {
              insertion += `UPDATE list_${datas[col].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")} SET list_${datas[col].level[
                col_MtMFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")} = CONCAT((SELECT list_${datas[
                col
              ].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")} FROM list_${datas[col].level[
                col_MtMFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")} WHERE list_${datas[col].level[
                col_MtMFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID = (SELECT MAX(list_${datas[
                col
              ].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM list_${datas[
                col
              ].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")})), ',' , '${
                arrayOfValues[values_lign][col_MtMFH + deb_dim]
              }') WHERE list_${datas[col].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID = (SELECT MAX(list_${datas[
                col
              ].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM list_${datas[
                col
              ].level[col_MtMFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")});\n`;
            }
            insertion += `INSERT INTO join_list_${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}(list_${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )}_ID) VALUES ((SELECT MAX(list_${datas[col].level[col_MtMFH].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM list_${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}), (SELECT MAX(${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM ${datas[col].level[
              col_MtMFH
            ].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}) );\n`;
          }

          if (
            NSFH &&
            (values_lign <= lign_eff_MtMFH ||
              values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH ||
              MtMFH)
          ) {
            insertion +=
              `INSERT INTO join_${datas[col].level[col_NSFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_${datas[col].level[
                col_NSFH + 1
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}(` +
              `${datas[col].level[col_NSFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${datas[col].level[
                col_NSFH + 1
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID)` +
              `VALUES (` +
              `(SELECT MAX(${datas[col].level[col_NSFH].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM ${datas[col].level[
                col_NSFH
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}), ` +
              `(SELECT MAX( ${datas[col].level[col_NSFH + 1].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID) FROM  ${datas[col].level[
                col_NSFH + 1
              ].name
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")})` +
              `);\n`;
          }
          if (
            col + deb_dim == arrayOfValues[values_lign].length - 1 &&
            (values_lign <= lign_eff_MtMFH ||
              values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH) &&
            (values_lign <= lign_eff_NSFH ||
              values_lign > lign_eff_NSFH + nb_lign_eff_NSFH)
          ) {
            insertion +=
              `INSERT INTO ${mesure
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}( ${mesure
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${allID.slice(0, -1)})` +
              ` VALUES (${
                arrayOfValues[values_lign][
                  arrayOfValues[values_lign].length - 1
                ]
              },`;

            for (
              diff_ID = 0;
              diff_ID < allID.split(",").length - 1;
              diff_ID++
            ) {
              insertion += ` (SELECT MAX(${
                allID.split(",")[diff_ID]
              }) FROM ${allID.split(",")[diff_ID].slice(0, -3)}),`;
            }

            insertion = insertion.slice(0, -1) + `);\n\n`;
          } else {
            insertion += `\n`;
          }
        } else {
          insertion += `INSERT INTO ${datas[col].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}( `;

          var levels_insert = "";
          var values_insert = "";

          for (indixLev = 0; indixLev < datas[col].level.length; indixLev++) {
            levels_insert += ` ${datas[col].level[indixLev].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")},`;
          }

          for (
            var values_col = 0;
            values_col < datas[col].level.length;
            values_col++
          ) {
            values_insert += ` '${
              arrayOfValues[values_lign][values_col + deb_dim]
            }',`;
          }

          insertion += `${levels_insert.slice(
            0,
            -1
          )}) VALUES (${values_insert.slice(0, -1)});\n`;

          if (
            col + deb_dim == arrayOfValues[values_lign].length - 1 &&
            (values_lign <= lign_eff_MtMFH ||
              values_lign > lign_eff_MtMFH + nb_lign_eff_MtMFH) &&
            (values_lign <= lign_eff_NSFH ||
              values_lign > lign_eff_NSFH + nb_lign_eff_NSFH)
          ) {
            insertion +=
              `INSERT INTO ${mesure
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}( ${mesure
                .toUpperCase()
                .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${allID.slice(0, -1)})` +
              ` VALUES (${
                arrayOfValues[values_lign][
                  arrayOfValues[values_lign].length - 1
                ]
              },`;

            for (
              diff_ID = 0;
              diff_ID < allID.split(",").length - 1;
              diff_ID++
            ) {
              insertion += ` (SELECT MAX(${
                allID.split(",")[diff_ID]
              }) FROM ${allID.split(",")[diff_ID].slice(0, -3)}),`;
            }

            insertion = insertion.slice(0, -1) + `);\n\n`;
          }
        }
        deb_dim += datas[col].level.length;
      }
      /*
      deb_dim = 0;
      for (col = 0; col < datas.length; col++) {
        MtMFH = false;
        col_MtMFH = null;
        NSFH = false;
        col_NSFH = null;
        //var MtMNSFH = false;
        //var col_MtMNSFH = null;

        for (lign = 0; lign < HierarchyTab.length; lign++) {
          if (typeof HierarchyTab[lign][col] !== "undefined") {
            if (HierarchyTab[lign][col].value == "Non-strick Fact") {
              NSFH = true;
              col_NSFH = HierarchyTab[lign][col].colOFdim - 1;
            }
            if (HierarchyTab[lign][col].value == "Many-to-Many Fact") {
              MtMFH = true;
              col_MtMFH = HierarchyTab[lign][col].colOFdim + 1;
            }
            if (
              HierarchyTab[lign][col].value == "Non-strick & Many-to-Many Fact"
            ) {
              NSFH = true;
              col_NSFH = HierarchyTab[lign][col].colOFdim - 1;
              lign_eff_NSFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_NSFH = HierarchyTab[lign][col].nb_lign_eff - 1;
              MtMFH = true;
              col_MtMFH = HierarchyTab[lign][col].colOFdim + 1;
              lign_eff_MtMFH = HierarchyTab[lign][col].lign_eff;
              nb_lign_eff_MtMFH = HierarchyTab[lign][col].nb_lign_eff - 1;
            }
          }
        }
        if (!(MtMFH || NSFH)) {
          insertion += `INSERT INTO ${datas[col].dim
            .toUpperCase()
            .replace(/[^a-zA-Z0-9]/g, "_")}( `;

          levels_insert = "";
          values_insert = "";

          for (indixLev = 0; indixLev < datas[col].level.length; indixLev++) {
            levels_insert += ` ${datas[col].level[indixLev].name
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")},`;
          }

          for (
            var values_col = 0;
            values_col < datas[col].level.length;
            values_col++
          ) {
            values_insert += ` '${
              arrayOfValues[values_lign][values_col + deb_dim]
            }',`;
          }

          insertion += `${levels_insert.slice(
            0,
            -1
          )}) VALUES (${values_insert.slice(0, -1)});\n`;

          insertion +=
            `INSERT INTO ${mesure
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}( ${mesure
              .toUpperCase()
              .replace(/[^a-zA-Z0-9]/g, "_")}_ID, ${allID.slice(0, -1)})` +
            ` VALUES (${
              arrayOfValues[values_lign][arrayOfValues[values_lign].length - 1]
            },`;

          for (diff_ID = 0; diff_ID < allID.split(",").length - 1; diff_ID++) {
            insertion += ` SELECT MAX(${
              allID.split(",")[diff_ID]
            }) FROM ${allID.split(",")[diff_ID].slice(0, -3)}),`;
          }

          insertion = insertion.slice(0, -1) + `);\n\n`;
        }
        deb_dim += datas[col].level.length;
      }// */
    }

    // create var file which is the file content
    var file = Tables + linkTable + insertion;

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
