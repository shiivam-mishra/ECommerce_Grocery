//require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51Q9p3NP1VFxK2tM79JYcHHsZoTMFTrESUaS0cIQpD43oCi57BMz2oISLZpw8MYFSQA26HF5uVH5KfSBcp5eJ7EjA0086j8a5cr"
);

app.use(express.json());
app.use(cors());

//checkout api
app.post("/api/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  // console.log(products);

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.dish,
        images: [product.imgdata],
      },
      unit_amount: product.price * 100,
    },
    quantity: product.qnty,
  }));

  // checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    // receipt_email: "https://billing.stripe.com/p/login/test_9AQ16267S8rvdCUfYY",
    success_url: "http://localhost:3000/sucess",
    // success_url:"/client/src/components/Home.js",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});
//login

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "signup",
});

app.get("/", (req, res) => {
  return res.json("check");
});
app.post("/signin", (req, res) => {
  // const sql = "INSERT INTO login('name','email','mobile','password' VALUES (?)";
  const sql = `INSERT INTO login(name,email,mobile,password) VALUES ('${req.body.name[0]}', '${req.body.email[0]}', ${req.body.mobile[0]},'${req.body.password[0]}')`;
  db.query(sql, (err, data) => {
    if (err) {
      // console.log(err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/signup", (req, res) => {
  // console.log(req.body);    // show id & psw in terminal.
  // const sql = "SELECT * FROM login WHERE email='?' AND password ='?'";
  const sql2 = `SELECT * FROM login WHERE email='${req.body.email[0]}' AND password ='${req.body.password[0]}'`;
  // console.log(sql2);
  db.query(sql2, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("Fail");
    }
  });
});

app.listen(7000, () => {
  console.log("server start");
});
