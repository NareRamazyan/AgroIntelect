const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const PYTHON_PATH  = process.env.PYTHON_PATH || 'python';
const PREDICT_SCRIPT = path.resolve(__dirname, 'ml', 'predict.py');

function predict(params) {
  return new Promise((resolve, reject) => {
    const input = JSON.stringify(params);
    const py = spawn(PYTHON_PATH, [PREDICT_SCRIPT, input]);

    let output = '';
    let errorOutput = '';

    py.stdout.on('data', (data) => { output += data.toString(); });
    py.stderr.on('data', (data) => { errorOutput += data.toString(); });

    py.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python error: ${errorOutput}`));
      }
      try {
        const result = JSON.parse(output.trim());
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse Python output: ${output}`));
      }
    });
  });
}

module.exports = { predict };