import "dotenv/config.js";

const { PORT } = process.env;

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import cors from "cors";
import colors from "colors";
import connectDB from "./config/database.js";

import Location from "./models/Location.js";
import Item from "./models/Item.js";

import fetch from "node-fetch";

const port = PORT || 5008;
const app = express();

const __dirname = path.resolve();
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const destination = file.originalname.includes('item_') ? 'items' : 'locations';
    cb(null, `uploads/${destination}`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const prefix = file.originalname.replace('.jpg', '').toLowerCase()
    let fileName  = prefix + '-' + uniqueSuffix + path.extname(file.originalname)
    fileName = Buffer.from(fileName, 'latin1').toString('utf8');
    cb(null, fileName.toLowerCase());
  },

});

const upload = multer({ storage });

app.use('/api/public', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Request-Private-Network", "true");
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});

app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/api", async (req, res) => {
  res.json({ message: "API is running...", status: "success" });
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.json({ message: "No file uploaded", status: "error" });
  }
  res.json({ message: "File uploaded", status: "success", file });
});

app.post("/api/restart", async (req, res) => {
  res.json({ message: "Restarting", status: "success" });
  process.exit();
});

app.get("/api/items/:item", async (req, res) => {

  const { item } = req.params;

  let response = null;

  if (item === "locations") {
    response = await Location.find({});
  } else if (item === "items") {
    response = await Item.find({}).populate("location");
  } else {
    const locations = await Location.find({});
    const items = await Item.find({}).populate("location");
    response = { locations, items };
  }

  res.json(response);

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// SINGLE ITEM
app.get("/api/item/:type/:search_type/:search", async (req, res) => {

  const { type, search_type, search } = req.params;
  let data = null;

  if (type === "location") {

    if (search_type === "name") {
      data = {
        location: await Location.find({ search }),
        items: await Item.find({ location: search })
      };

    } else if (search_type === "id") {

      data = {
        location: await Location.findById(search),
        items: await Item.find({ location: search }),
      }
    }
  } else if (type === "item") {

    if (search_type === "name") {
      data = await Item.find({ search })
    } else if (search_type === "id") {

      data = {
        item : await Item.findById(search),
        locations : await Location.find({}),
      }
    }
  }

  res.json({ data, status: data ? "success" : "error" });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE ITEM
app.put("/api/items/:item/:id", async (req, res) => {

  const { item, id } = req.params;
  
  let items = null;
  
  if (item === "location") {
    const { name, state, image } = req.body;
    items = await Location.findByIdAndUpdate(id, { name, state, image });
  } else if (item === "item") {
    const { name, quantity, location, image, tags } = req.body;
    items = await Item.findByIdAndUpdate(id, { name, quantity, location, image, tags });
  }

  res.json(items);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE ITEM
app.delete("/api/items/:item/:id", async (req, res) => {

  const { item, id } = req.params;
  const { imageName } = req.body;

  let response = null;

  if (item === "location") {
    response = await Location.findByIdAndDelete(id);
    // update items with location id
    await Item.updateMany ({ location: id }, { location: null });
    if (imageName && fs.existsSync(`uploads/locations/${imageName}`)) {
      fs.unlinkSync(`uploads/locations/${imageName}`);
    }
  } else if (item === "item") {
    response = await Item.findByIdAndDelete(id);
    if (imageName && fs.existsSync(`uploads/items/${imageName}`)) {
      fs.unlinkSync(`uploads/items/${imageName}`)
    }
  }
  
  if (!response) {
    return res.json({ message: "Item not found", status: "error" });
  } 

  res.json({ message: "Item deleted", status: "success" });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/api/items/:item", async (req, res) => {

  const { item } = req.params;
  let items = null;

  if (item === "location") {
    const { name, state, image } = req.body;
    console.log(image)
    items = await Location.create({ name, state, image });
  } else if (item === "item") {
    const { name, quantity, location, image, tags } = req.body;
    items = await Item.create({ name, quantity, location, image, tags });
  }

  res.json(items);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, async () => {

  await connectDB();

  console.log(
    `✅ ${colors.bgGreen(` App listening at http://localhost:${port} `)}`
  );
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
