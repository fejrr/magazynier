import "dotenv/config.js";

const { PORT } = process.env;

import express from "express";
import cors from "cors";
import colors from "colors";
import connectDB from "./config/database.js";
import Location from "./models/Location.js";
import Item from "./models/Item.js";

import fetch from "node-fetch";
import e from "express";

const port = PORT || 5005;
const app = express();

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

app.post("/api/restart", async (req, res) => {
  res.json({ message: "Restarting", status: "success" });
  process.exit();
});

app.get("/api/items/:item", async (req, res) => {
  await connectDB();

  const { item } = req.params;

  let response = null;

  if (item === "locations") {

    response = await Location.find({});
  } else if (item === "items") {
    response = await Item.find({});

  } else {
    const locations = await Location.find({});
    const items = await Item.find({});

    response = { locations, items };
  }

  res.json(response);

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// SINGLE ITEM
app.get("/api/item/:type/:search_type/:search", async (req, res) => {
  await connectDB();

  const { type, search_type, search } = req.params;

  let item = null;

  if (type === "location") {

    if (search_type === "name") {
      item = await Location.find({ search });
    } else if (search_type === "id") {
      item = await Location.findById(search);
    }

  } else if (type === "item") {

    if (search_type === "name") {
      item = await Item.find({ search });
    } else if (search_type === "id") {
      item = await Item.findById(search)
    }

  }

  res.json(item);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////


app.put("/api/items/:item/:id", async (req, res) => {
  await connectDB();

  const { item, id } = req.params;
  const { name, state, image } = req.body;

  let items = null;

  if (item === "location") {
    items = await Location.findByIdAndUpdate(id, { name, state, image });
  } else if (item === "item") {
    items = await Item.findByIdAndUpdate(id, { name, quantity, location, image, tags });
  }

  res.json(items);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////


app.delete("/api/items/:item/:id", async (req, res) => {
  await connectDB();

  const { item, id } = req.params;

  if (item === "location") {
    await Location.findByIdAndDelete(id);
  } else if (item === "item") {
    await Item.findByIdAndDelete(id);
  }
  
  res.json({ message: "Item deleted" });
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/api/items/:item", async (req, res) => {
  await connectDB();

  const { item } = req.params;
  let items = null;

  if (item === "location") {
    const { name, state, image } = req.body;
    items = await Location.create({ name, state, image });
  } else if (item === "item") {
    const { name, quantity, location, image, tags } = req.body;
    items = await Item.create({ name, quantity, location, image, tags });
  }

  res.json(items);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, async () => {
  console.log(
    `✅ ${colors.bgGreen(` App listening at http://localhost:${port} `)}`
  );
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
