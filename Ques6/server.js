import express from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/utilityDB")
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" Mongo Error:", err));

// Schema to store searched weather data
const WeatherSchema = new mongoose.Schema({
  city: String,
  temperature: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
});
const Weather = mongoose.model("Weather", WeatherSchema);

// Routes
app.get("/", (req, res) => {
  res.render("index", { weather: null });
});

app.get("/weather", async (req, res) => {
  try {
    let city = req.query.city || "London";

    // Call Open-Meteo API 
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await response.json();

    if (!geoData.results || geoData.results.length === 0) {
      return res.render("index", { weather: "City not found" });
    }

    const { latitude, longitude, name } = geoData.results[0];
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`);
    const weatherData = await weatherRes.json();

    const temperature = weatherData.current.temperature_2m;

    // Save to DB
    const weatherDoc = new Weather({ city: name, temperature, description: "Current Temp" });
    await weatherDoc.save();

    res.render("index", { weather: `${name} → ${temperature}°C` });

  } catch (err) {
    console.error(err);
    res.render("index", { weather: "Error fetching weather" });
  }
});

app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
