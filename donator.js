const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// const { exec } = require("child_process");

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

// home page 
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});
//donato server!!
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
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/User/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/User/error.html");
});

// user server
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  alt_phone: Number,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// form submission record in the USER & ADMIN module.
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await Registration.findOne({email: email});
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        phone,
        password,
      });
      await registrationData.save();
      res.send("Hello! Click on Already Exist"); 
    }
    else{
      res.redirect("/fetch");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

app.get("/fetch", async (req, res) => {
  try {
    // Fetch all documents from the Donator collection
    const data = await donator.find({});

    // Create an HTML table with the fetched data
    const table = `
    <table border="2" style="background-color:#8a8aef; width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #4d4dff; color: white;">
          <th style="padding: 10px;">Item Name</th>
          <th style="padding: 10px;">Type</th>
          <th style="padding: 10px;">Category</th>
          <th style="padding: 10px;">Quantity per Pack</th>
          <th style="padding: 10px;">Email</th>
          <th style="padding: 10px;">Phone</th>
          <th style="padding: 10px;">District</th>
          <th style="padding: 10px;">Pickup Address</th>
          <th colspan="2" style="padding: 10px;">How's the food?</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (item, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f2f2f2' : 'white'};">
              <td style="padding: 10px;">${item.item_name}</td>
              <td style="padding: 10px;">${item.type}</td>
              <td style="padding: 10px;">${item.category}</td>
              <td style="padding: 10px;">${item.qtypp}</td>
              <td style="padding: 10px;">${item.email}</td>
              <td style="padding: 10px;">${item.phone}</td>
              <td style="padding: 10px;">${item.district}</td>
              <td style="padding: 10px;">${item.pickup_add}</td>
              <td style="padding: 10px;"><button style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">GOOD</button></td>
              <td style="padding: 10px;"><button style="background-color: #f44336; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">BAD</button></td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
  `;
  

    // Send the HTML table as the response
    res.send(table);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define route to execute Python script
// app.get("/execute-python", (req, res) => {
//   // Execute Python script as a child process
//   exec("python your_script.py arg1 arg2", (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing Python script: ${error.message}`);
//       return res.status(500).send("Internal Server Error");
//     }
//     if (stderr) {
//       console.error(`Python script error: ${stderr}`);
//       return res.status(500).send("Internal Server Error");
//     }
//     // Send output of Python script as response
//     res.send(stdout);
//   });
// });

app.get("/existAlready", (req,res)=>{
    res.sendFile(__dirname+"/User/ExistAlready.html");
})


// user login combine!
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/User/index.html");
});


app.listen(port, () => {
  console.log(`server running ${port}`);
});
