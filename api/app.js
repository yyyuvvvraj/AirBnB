// /api/app.js

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const app = express();

// Connect to MongoDB Atlas using environment variable
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// Serve static files (such as styles and scripts)
app.use(express.static(path.join(__dirname, "../public")));

// Root route
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Listings index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New listing form route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show listing details
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// Create listing route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

// Edit listing route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// Update listing route
app.put("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete listing route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  res.redirect("/listings");
});

// Export for Vercel serverless function
module.exports = app;
