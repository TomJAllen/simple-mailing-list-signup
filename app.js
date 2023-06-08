const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1JElF2GWs9Eim2dXEhQ3fMkY4KHFvUag",
  authDomain: "sellmy-b32dc.firebaseapp.com",
  projectId: "sellmy-b32dc",
  storageBucket: "sellmy-b32dc.appspot.com",
  messagingSenderId: "593354325300",
  appId: "1:593354325300:web:489b452220bddcdbb17961",
  measurementId: "G-HF1ZP00QPD"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(fbApp);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.listen(process.env.PORT || 3000, function () {
  console.log("Example app listening on port 3000")
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: "a121b5ec84f56a95da1a5a249483b1b5-us21",
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "us21"
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
  //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  //*****************************ENTER YOU LIST ID HERE******************************
  const listId = "3d3147ca13";
  //Creating an object with the users data
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };
  //Uploading the data to the server
  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
    //If all goes well logging the contact's id
    res.sendFile(__dirname + "/success.html")
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id
      }.`
    );
  }
  //Running the function and catching the errors (if any)
  // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
  // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
  run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
})





  // // const listID = "3d3147ca13";
  // // const url = `https://us21.api.mailchimp.com/3.0/lists/${listID}`;
  // // const apiKey = "a121b5ec84f56a95da1a5a249483b1b5-us21"
