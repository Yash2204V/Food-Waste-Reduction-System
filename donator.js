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
      <table border = "2" style="background-color:#8a8aef;">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Type</th>
            <th>Category</th>
            <th>Quantity per Pack</th>
            <th>Email</th>
            <th>Phone</th>
            <th>District</th>
            <th>Pickup Address</th>
            <th colspan = "2">How's the food?</th>
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              <td>${item.item_name}</td>
              <td>${item.type}</td>
              <td>${item.category}</td>
              <td>${item.qtypp}</td>
              <td>${item.email}</td>
              <td>${item.phone}</td>
              <td>${item.district}</td>
              <td>${item.pickup_add}</td>
              <td><button >GOOD</button></td>
              <td><button >BAD</button></td>
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

// // fetch the data from the database
// app.get("/fetch", async (req, res) => {
//   try {
//     // Fetch all documents from the Donator collection
//     const data = await Donator.find({});

//     // Create an HTML table with the fetched data
//     const table = `
//       <table border = "2">
//         <thead>
//           <tr>
//             <th>Item Name</th>
//             <th>Type</th>
//             <th>Category</th>
//             <th>Quantity per Pack</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>District</th>
//             <th>Pickup Address</th>
//             <th colspan = "2">How's the food?</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${data
//             .map(
//               (item) => `
//             <tr>
//               <td>${item.item_name}</td>
//               <td>${item.type}</td>
//               <td>${item.category}</td>
//               <td>${item.qtypp}</td>
//               <td>${item.email}</td>
//               <td>${item.phone}</td>
//               <td>${item.district}</td>
//               <td>${item.pickup_add}</td>
//               <td><button >GOOD</button></td>
//               <td><button >BAD</button></td>
//             </tr>
//           `
//             )
//             .join("")}
//         </tbody>
//       </table>
//     `;

//     // Send the HTML table as the response
//     res.send(table);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// app.get("/existingUser", (req,res)=>{
//     res.redirect("");
// })

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
