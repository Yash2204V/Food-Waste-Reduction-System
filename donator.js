const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
app.use(express.static(__dirname));
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.n7na6bb.mongodb.net/FWRS`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const donatorSchema = new mongoose.Schema({
  item_name: String,
  type: String,
  category: String,
  qtypp: Number,
  email: String,
  phone: Number,
  district: String,
  pickup_add: String,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

const donator = mongoose.model("donator", donatorSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/donator", async (req, res) => {
  try {
    const {
      item_name,
      type,
      category,
      qtypp,
      email,
      phone,
      district,
      pickup_add,
    } = req.body;
    const donatorData = new donator({
      item_name,
      type,
      category,
      qtypp,
      email,
      phone,
      district,
      pickup_add,
    });
    await donatorData.save();
    res.redirect("/success");
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/User/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/User/error.html");
});


const registrationSchema = new mongoose.Schema({
  name:String,
  email:String,
  phone:Number,
  alt_phone:Number,
  password:String,
});

const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


// form submission record in the USER & ADMIN module.
app.post("/register", async (req, res) => {
    try {
      const { name, email, phone, alt_phone, password } = req.body;
      const registrationData = new Registration({
        name,
        email,
        phone,
        alt_phone,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  });

app.get("/success", (req,res)=>{
    res.sendFile(__dirname+"/User/success.html");
})
app.get("/error", (req,res)=>{
    res.sendFile(__dirname+"/User/error.html");
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/User/index.html");
});

app.listen(port,()=>{
    console.log(`server running ${port}`);
})