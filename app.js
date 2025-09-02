const express = require("express");
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('DB connected'))
.catch(err => console.error('DB connection error:', err));
const Listing= require("./models/listing");
const path=require("path");
const { title } = require("process");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const PORT = process.env.PORT || 8080;

const username = "yyyuvvvraj";
const rawPassword = "Yuvraj@2806";
const encodedPassword = encodeURIComponent(rawPassword); // Yuvraj%402806

const MONGO_ATLAS_URI = `mongodb+srv://${username}:${encodedPassword}@cluster0.4tqzhl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function main() {
  try {
    await mongoose.connect(MONGO_ATLAS_URI, {
      // Since useNewUrlParser and useUnifiedTopology are deprecated options in latest Mongoose versions,
      // you can safely omit them.
    });
    console.log("MongoDB connected");

    // Start the server only after DB is connected
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

main();



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi,I am root");
});
//Index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

function normalizeImageUrl(listingData) {
  if (listingData.image && listingData.image.url === "") {
    listingData.image.url = undefined;
  }
  return listingData;
}


//Create Route
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let { id }=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{ listing });
});

//Update Route
app.put("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
});


// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"A beautiful villa in the heart of the city",
//         price:12000,
//         location:"Almatty",
//         country:"Kazakhstan"
//     });
//     await sampleListing.save();
//     console.log("Listing saved");
//     res.send("Successfully added a new listing");
// });


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
