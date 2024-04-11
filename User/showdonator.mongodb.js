
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");


// const app = express();
// app.use(express.static(__dirname));
// dotenv.config();

// const port = process.env.PORT || 3001;

// const username = process.env.MONGODB_USERNAME;
// const password = process.env.MONGODB_PASSWORD;

// mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.n7na6bb.mongodb.net/FWRS`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log("Connected to database");
//     return db.donators.find({ item_name: "makkan" });
//   })
//   .then((cursor) => {
//     return cursor.toArray();
//   })
//   .then((data) => {
//     const tableBody = document.querySelector("#donator-table tbody");
//     data.forEach((item) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${item.item_name}</td>
//         <td>${item.type}</td>
//         <td>${item.category}</td>
//         <td>${item.qtypp}</td>
//         <td>${item.email}</td>
//         <td>${item.phone}</td>
//         <td>${item.district}</td>
//         <td>${item.pickup_add}</td>
//       `;
//       tableBody.appendChild(row);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });