require("dotenv").config();
const express=require("express")

const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { HoldingsModel } = require("./model/HoldingsModel");
const { UserModel } = require("./model/UserModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { StocksModel } = require("./model/StocksModel");
const authRoute = require("./Routes/AuthRoute");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;



app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});


const corsOptions ={
  origin: ["https://dashboard-m9af.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);



app.get("/allHoldings", async (req, res) => {
    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  });
  
  app.get("/allPositions", async (req, res) => {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  });
app.get("/",(req,res)=>{
  res.send("hello i am backend")
})

  // app.get("/delUser", async (req, res) => {
  //   let allPositions = await UserModel.deleteAll({});
  //   res.send("deleted")
  // });


  // .........................................................................................
  

app.get("/addStocks", async (req, res) => {
  let tempStocks = [
    {
      name: "INFY",
      qty: 2,
      avg: 538.05,
      price: 541.15,
      net: "+0.58%",
      day: "+2.99%",
    },
    {
      name: "ONGC",
      qty: 2,
      avg: 1383.4,
      price: 1522.35,
      net: "+10.04%",
      day: "+0.11%",
    },
    {
      name: "TCS",
      qty: 1,
      avg: 2335.85,
      price: 2417.4,
      net: "+3.49%",
      day: "+0.21%",
    },
    {
      name: "KPITTECH",
      qty: 1,
      avg: 1350.5,
      price: 1555.45,
      net: "+15.18%",
      day: "-1.60%",
      isLoss: true,
    },
    {
      name: "QUICKHEAL",
      qty: 5,
      avg: 202.0,
      price: 207.9,
      net: "+2.92%",
      day: "+0.80%",
    },
    {
      name: "WIPRO",
      qty: 5,
      avg: 250.3,
      price: 266.45,
      net: "+6.45%",
      day: "+3.54%",
    },
    {
      name: "M&M",
      qty: 2,
      avg: 809.9,
      price: 779.8,
      net: "-3.72%",
      day: "-0.01%",
      isLoss: true,
    },
    {
      name: "RELIANCE",
      qty: 1,
      avg: 2193.7,
      price: 2112.4,
      net: "-3.71%",
      day: "+1.44%",
    },
    {
      name: "HUL",
      qty: 4,
      avg: 324.35,
      price: 430.2,
      net: "+32.63%",
      day: "-0.34%",
      isLoss: true,
    },

  ];

  tempStocks.forEach((item) => {
    let newStocks = new StocksModel({
      name: item.name,
      qty: item.qty,
      avg: item.avg,
      price: item.price,
      net: item.day,
      day: item.day,
    });

    newStocks.save();
  });
  res.send("Done!");
});

// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     {
//       product: "CNC",
//       name: "EVEREADY",
//       qty: 2,
//       avg: 316.27,
//       price: 312.35,
//       net: "+0.58%",
//       day: "-1.24%",
//       isLoss: true,
//     },
//     {
//       product: "CNC",
//       name: "JUBLFOOD",
//       qty: 1,
//       avg: 3124.75,
//       price: 3082.65,
//       net: "+10.04%",
//       day: "-1.35%",
//       isLoss: true,
//     },
//   ];

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });

//     newPosition.save();
//   });
//   res.send("Done!");
// });



app.post("/newOrder", async (req, res) => {

  console.log(req.body)
  
  
  let newOrder = new OrdersModel({
    
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  await newOrder.save();


  let buyHolding = await StocksModel.find({name: req.body.name});
  buyHolding=buyHolding[0];
  
  
   
  let newHolding = new HoldingsModel({
    name: req.body.name,
    qty: req.body.qty,
    avg: buyHolding.avg,
    price: req.body.price,
    net: buyHolding.net ,
    day: buyHolding.day,
  });

  await newHolding.save();
  




  res.send("Order saved!");
});

app.post("/removeOrder", async (req, res) => {
  
  
  let del=await HoldingsModel.deleteMany({name: req.body.name});

  
  
  

  res.send("Order saved!");
});
