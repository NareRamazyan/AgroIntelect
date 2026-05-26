const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const { parse } = require('csv-parse/sync');
const { predict } = require('./predict');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Prediction endpoint (manual input)
app.post('/api/predict', async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

  if ([N, P, K, temperature, humidity, ph, rainfall].some(v => v === undefined)) {
    return res.status(400).json({ error: 'Missing required fields: N, P, K, temperature, humidity, ph, rainfall' });
  }

  try {
    const result = await predict({ N, P, K, temperature, humidity, ph, rainfall });
    res.json(result);
  } catch (err) {
    console.error('Prediction error:', err.message);
    res.status(500).json({ error: 'Prediction failed', details: err.message });
  }
});

// Sensor data endpoint (reads from CSV + predicts)
app.get('/api/sensor-data', async (req, res) => {
  try {
    const csvPath = path.resolve(process.env.CSV_PATH_SENSOR || './data/sensor_data.csv');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const rows    = parse(content, { columns: true, trim: true });

    if (!rows.length) {
      return res.status(404).json({ error: 'No sensor data found in CSV' });
    }

    const row = rows[0];
    const params = {
      N:           parseFloat(row.N),
      P:           parseFloat(row.P),
      K:           parseFloat(row.K),
      temperature: parseFloat(row.temperature),
      humidity:    parseFloat(row.humidity),
      ph:          parseFloat(row.ph),
      rainfall:    parseFloat(row.rainfall),
    };

    const prediction = await predict(params);
    res.json({ ...params, ...prediction });
  } catch (err) {
    console.error('Sensor data error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});