const express = require("express");
const { connectToMongoDB } = require("./connect");
const staticRoute = require("./routes/staticRouter")
const path = require("path")
const urlRoute = require("./routes/url");
const URL = require("./models/url");
require('dotenv').config(); 
const { name } = require("ejs");

const app = express();
const PORT = process.env.PORT || 8005; 

connectToMongoDB(process.env.MONGODB_URL).then(() =>
  console.log("Mongodb connected")
);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'styles')));



app.use("/",staticRoute);
app.use("/url", urlRoute);


app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));