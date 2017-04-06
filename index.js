#!/usr/bin/env node

const 
    sqlite  = require("sqlite3").verbose(),
    express = require("express"),
    multer  = require("multer"),
    rg      = require("rangegen"),
    fs      = require("fs"),
    md5     = require("md5"),
    upld    = express(),
    pages   = __dirname + '/pages/'
    dbFile  = "files.db",
    upload_dir = pages + "f/",
    uploader = multer({
        dest : __dirname + "/pages/f",
        limits: {
            files:1
        }
    }),
    db
;

if (fs.existsSync(dbFile)) {
  db = new sqlite.Database(dbFile)
} else {
  console.error("Database file doesn't exist!")
  process.exit(1)
}

//check if the specified table exists
db.run("SELECT * FROM file", {}, (err, row) => {
  if (err) {
    db.run("CREATE TABLE file(file_name TEXT, file_location TEXT, file_hash TEXT)", {}, (err, row) => {
      if (err) throw err;
    })
})

//use express to generate an index page
upld.use('/', (req,res,next) => {
  next()
})

upld.use('/', express.static(pages, { extensions: ['html'] }))
upld.listen(5000)
upld.post('/api/upld', uploader.single('upldfile'), checkExists);

function checkExists(req,res) {
  //query the database for the hash
  let hash = md5(fs.readFileSync(req.file.path))
  console.log(`file hash before upload: ${hash}`)
  //woohoo, time to inject !
  let query = 'SELECT file_location FROM file WHERE file_hash = "' + hash + '";'

  db.get(query, {}, (err,row) => {

    if (err) console.error(`Error running select command: ${err})

    if (row == null) {
      uploadFile(req,res, hash)
    } else {
      res.redirect(200, row.file_location)
    }
  })
}

function uploadFile(req,res,hash) {
    
  //get the filename
  let filename = req.file.originalname
  let ext = filename.split(".")
  
  //get the file extension
  ext = ext[ext.length - 1]

  //remove any whitespace
  filename = filename.replace(/\W/g, "");
  let newName = genName(filename) + "." + ext
  
  //move the file
  let newArea = upload_dir + newName
  fs.rename(req.file.path, newArea, err => {
    if (err) {
      console.error("error moving file: " + err)
    } else {
      //input to Database
      console.log("success inserting "+newArea)
      db.run("INSERT INTO file VALUES ($name, $location, $hash)", {
        $name: newName,
        $location: "/f/" + newName,
        $hash: md5(fs.readFileSync(newArea))
      })
      res.redirect(200, ("/f/"+newName))
    }
  })
}

//generate a filename
function genName(name) {
  let 
    large = rg("a","z"),
    smol = rg("A", "Z"),
    nums = rg(0,9),
    notreallyentropy = name.split(""),
    letts = large.concat(smol),
    other = nums.concat(notreallyentropy),
    arr = other.concat(letts),
    newname = ""
  ;

  for (let i = 0; i<8;i++) {
    
    let ranNum = getRandomArbitrary(0,arr.length)
    if (arr[ranNum - 1] != null) {
      newname += arr[ranNum - 1]
    }
  }

  return newname
}


//thanks mdn
function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function presentFile() {

}
