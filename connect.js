const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToMongoDB(mongoURI) {
  return mongoose.connect(mongoURI);  // No need for deprecated options
}

module.exports = {
  connectToMongoDB,
};
