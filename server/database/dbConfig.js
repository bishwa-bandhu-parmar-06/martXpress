const mongoose = require("mongoose");
const mongodb_Uri = process.env.MONGODB_URI;

const connectDb = () => {
  if (!mongodb_Uri) {
    console.log("Mongodb connection uri does not exist.");
    process.exit(1);
  }

  mongoose
    .connect(mongodb_Uri)
    .then(() => {
      console.log("✅ Mongodb connected Successfully");
    })
    .catch((err) => {
      console.log("Getting Error while connecting to Database: ", err);
      process.exit(1);
    });
};

module.exports = connectDb;