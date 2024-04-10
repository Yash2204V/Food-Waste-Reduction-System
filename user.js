const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.n7na6bb.mongodb.net/FWRS` ,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    alt_phone:Number,
    password:String,
});

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/User/index.html");
})

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


app.listen(port,()=>{
    console.log(`server running ${port}`);
})

