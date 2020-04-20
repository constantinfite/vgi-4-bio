const express = require('express'); //make express available
const app = express(); //invoke express
const multer  = require('multer') //use multer to upload blob data
//const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs'); //use the file system so we can save files
var cors = require("cors");
const upload = multer();

app.use(cors());

app.use(express.static("public")); // for serving the HTML file


app.post("/api/test", upload.single("upl"), function (req, res) {
  let uploadLocation = __dirname + "/uploads/" + req.file.originalname;
  fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok
  console.log(req.body);
  console.log(req.file);
  // do stuff with file
});

/*app.post("/form", function (req, res) {


  let uploadLocation = __dirname + "/public/uploads/" + req.file.originalname; // where to save the file to. make sure the incoming name has a .wav extension

  fs.writeFileSync(
    uploadLocation,
    Buffer.from(new Uint8Array(req.file.buffer))
  ); // write the blob to the server as a file
  res.sendStatus(200); //send back that everything went ok
});*/

app.listen(4000, function () {
  console.log("Example app listening on port 4000!");
});
