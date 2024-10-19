const mongoose = require("mongoose");
const fs = require("fs"); // Digunakan untuk membaca seed.json
require("dotenv").config();

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Define a schema for the collection
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;

    case "bulk-insert":
      await bulkInsert(Model);
      break;

    case "get-all":
      await getAll(Model);
      break;

    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();
  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

async function resetDatabase() {
  console.log("resetting the database...");
  try {
    await mongoose.connection.dropDatabase();
    console.log("Database reset successful!");
  } catch (err) {
    console.error("Database reset failed:", err);
  }
}

async function bulkInsert(Model) {
  console.log("bulk inserting data from seed.json...");
  try {
    const data = JSON.parse(fs.readFileSync("seed.json", "utf-8"));
    await Model.insertMany(data);
    console.log("Bulk insert successful!");
  } catch (err) {
    console.error("Bulk insert failed:", err);
  }
}

async function getAll(Model) {
  console.log("fetching all data...");
  try {
    const data = await Model.find({});
    console.log("All data:", data);
  } catch (err) {
    console.error("Fetching all data failed:", err);
  }
}

main();