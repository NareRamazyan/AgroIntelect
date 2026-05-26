require('reflect-metadata');
const { AppDataSource } = require('./data-source');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { predict } = require('./predict');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Քո ռաուտները ---
app.use("/auth", authRoutes);
app.use("/history", historyRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/predict', async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;
  if ([N, P, K, temperature, humidity, ph, rainfall].some(v => v === undefined)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await predict({ N, P, K, temperature, humidity, ph, rainfall });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed', details: err.message });
  }
});

app.get('/api/sensor-data', async (req, res) => {
  try {
    const csvPath = path.resolve(process.env.CSV_PATH_SENSOR || './data/sensor_data.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const rows = parse(content, { columns: true, trim: true });
    if (!rows.length) return res.status(404).json({ error: 'No data found' });

    const row = rows[0];
    const params = {
      N: parseFloat(row.N), 
      P: parseFloat(row.P), 
      K: parseFloat(row.K),
      temperature: parseFloat(row.temperature), 
      humidity: parseFloat(row.humidity),
      ph: parseFloat(row.ph), 
      rainfall: parseFloat(row.rainfall),
    };
    const prediction = await predict(params);
    res.json({ ...params, ...prediction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Բազայի միացում և սերվերի գործարկում ---
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log("❌ DB Connection Error:", error));