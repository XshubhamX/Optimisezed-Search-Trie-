require("dotenv").config();
const express = require("express");
const { seedData, searchQuery } = require("./Trie");
const { connectDB } = require("./db");

const app = express();

app.get("/", async (req, res, next) => {
  return res.json({ status: "Healthy" });
});

app.get("/search", async (req, res, next) => {
  let { query, limit, pgNo } = req.query;

  if (!query) return res.json({ data: [], totalPages: 0 });
  if (limit < 0 || !limit) limit = 10;
  if (pgNo <= 0 || !pgNo) pgNo = 1;
  const { data, totalPages } = searchQuery(query.toLowerCase(), limit, pgNo);

  return res.json({ data, totalPages });
});

(async () => {
  await connectDB();
  await seedData();
  app.listen(5000, () => {
    console.log("Server up in running!");
  });
})();
