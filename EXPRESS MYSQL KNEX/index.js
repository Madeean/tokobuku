const express = require("express");
var path = require("path");
var cors = require("cors");
const multer = require("multer");
const os = require("os");
const fs = require("fs");

const app = express();
app.use(cors());

const port = 3001;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: "100mb",
  })
);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "tokobuku",
  },
});
app.get("/buku", async (req, res) => {
  try {
    let buku = await knex("buku");
    const url = req.protocol + "://" + req.get("host");
    res.json({ data: buku, status: url }, 200);
    // res.json(buku);
  } catch (e) {
    console.log(e);
    res.json({ data: "buku tidak ada" }, 400);
  }
});

app.post(
  "/buku",
  multer({ dest: os.tmpdir() }).single("foto_buku"),
  async (req, res) => {
    try {
      let judul = req.body.judul;
      let sinopsis = req.body.sinopsis;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.join(__dirname, "public/uploads/" + filename);

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        const url =
          req.protocol + "://" + req.get("host") + "/uploads/" + filename;
        src.on("end", async () => {
          let id = await knex("buku").insert({
            judul: judul,
            sinopsis: sinopsis,
            foto_buku: url,
          });
          res.json({
            id: id[0],
            judul,
            sinopsis,
            foto_buku: url,
          });
        });
        src.on("error", async () => {
          res.json({ data: "gagal upload foto" }, 400);
        });
      } else {
        res.json({ data: "foto tidak ada" }, 400);
      }
    } catch (e) {
      console.log(e);
      res.json(e, 400);
    }
  }
);

app.put(
  "/buku/:id",
  multer({ dest: os.tmpdir() }).single("foto_buku"),
  async (req, res) => {
    try {
      let id = req.params.id;
      let judul = req.body.judul;
      let sinopsis = req.body.sinopsis;

      if (req.file) {
        let tmp_path = req.file.path;
        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];
        let filename = req.file.filename + "." + originalExt;
        let target_path = path.join(__dirname, "public/uploads/" + filename);

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        const url =
          req.protocol + "://" + req.get("host") + "/uploads/" + filename;
        src.on("end", async () => {
          await knex("buku").where("id", id).update({
            judul: judul,
            sinopsis: sinopsis,
            foto_buku: url,
          });
          return res.json({
            judul,
            sinopsis,
            foto_buku: url,
          });
        });
        src.on("error", async () => {
          return res.json({ data: "gagal upload foto" }, 400);
        });
      } else {
        await knex("buku").where("id", id).update({
          judul: judul,
          sinopsis: sinopsis,
        });
        return res.json({
          id,
          judul,
          sinopsis,
        });
      }
    } catch (e) {
      console.log(e);
      res.json(e, 400);
    }
  }
);

app.delete("/buku/:id", async (req, res) => {
  try {
    let id = req.params.id;
    await knex("buku").where("id", id).del();
    return res.json({ data: "berhasil delete" }, 200);
  } catch (e) {
    console.log(e);
    res.json(e, 400);
  }
});

app.get("/buku/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let buku = await knex("buku").where("id", id);
    return res.status(200).json({ data: buku });
  } catch (e) {
    console.log(e);
    res.json(e, 400);
  }
});
