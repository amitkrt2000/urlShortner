const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToMongoDB(mongoURI) {
  return mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = {
  connectToMongoDB,
};