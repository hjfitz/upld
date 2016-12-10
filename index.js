#!/usr/bin/env node

var sqlite = require("sqlite3").verbose()
var express = require("express");
var multer = require("multer");
var rg = require("rangegen");
var fs = require("fs");
var md5 = require("md5");
var dbFile = "files.db";
var db;

if (fs.existsSync(dbFile)) {
  db = new sqlite.Database(dbFile);
} else {
  console.error("Database file doesn't exist!");
  process.exit(1);
}

//check if the specified table exists
db.run("SELECT * FROM file", {}, function(err, row) {
  if (err) {
    db.run("CREATE TABLE file(file_name TEXT, file_location TEXT, file_hash TEXT)", {}, function(err, row) {
      if (err) throw err;
    });

  } else {
    //console.log(row);
  }
});

//use express to generate an index page
var upld = express();
var pages = __dirname + "/pages/";
upld.use('/', function(req,res,next) {
  //console.log(req.method, req.url);
  next();
});
upld.use('/', express.static(pages, { extensions: ['html'] }));
upld.listen(5000);

//handle upload
var upload_dir = pages + "f/";
var uploader = multer({
  dest : __dirname + "/pages/f",
  limits: {
    files:1
  }
});

upld.post('/api/upld', uploader.single('upldfile'), checkExists);

function checkExists(req,res) {
  //query the database for the hash
  var hash = md5(fs.readFileSync(req.file.path));
  console.log("file hash before upload: "+hash);
  db.get('SELECT file_location FROM file where file_hash = $hash', {
    $hash: '"' + hash + '"'
  },
  function(err,row) {
    if (err) console.error("Error running select command: " + err);
    console.log("select cmd returns: "+row);
  });
  //if it doesn't exist, upload it
  uploadFile(req,res, hash);
  //if it exists, return the url
  //getFile();
  res.redirect("/");
}

function uploadFile(req,res, hash) {
  var filename = req.file.originalname;
  var ext = filename.split(".");
  ext = ext[ext.length - 1]; //can't have anything on my gh without spaghetti code
  filename = filename.replace(/\W/g, "");
  var newName = genName(filename) + "." + ext;
  //move the file
  var newArea = upload_dir + newName
  fs.rename(req.file.path, newArea, function(err) {
    if (err) {
      console.error("error moving file: " + err);
    } else {
      //input to Database
      console.log("success inserting "+newArea);
      db.run("INSERT INTO file VALUES ( $name, $location, $hash)", {
        $name: newName,
        $location: upload_dir + newName,
        $hash: md5(fs.readFileSync(newArea))
      })
    }
  });
}

//generate a filename
function genName(name) {
  var large = rg("a","z");
  var smol = rg("A", "Z");
  var nums = rg(0,9);
  var notreallyentropy = name.split("");
  var letts = large.concat(smol);
  var other = nums.concat(notreallyentropy);
  var arr = other.concat(letts);
  var newname = "";
  for (var i = 0; i<8;i++) {
    var ranNum = getRandomArbitrary(0,arr.length);
    if (arr[ranNum - 1] != null) {
      newname += arr[ranNum - 1];
    }
  }
  return newname
}
//thanks mdn
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function presentFile() {

}
