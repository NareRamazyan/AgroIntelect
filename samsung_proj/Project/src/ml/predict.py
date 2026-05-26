import sys
import json
import pickle
import numpy as np
import os
import warnings
warnings.filterwarnings('ignore')  # ← silences the feature names warning

# Load the model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'notebooks', 'RandomForest.pkl')

with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

# Read input from Node.js (passed as JSON string argument)
input_data = json.loads(sys.argv[1])

N           = float(input_data['N'])
P           = float(input_data['P'])
K           = float(input_data['K'])
temperature = float(input_data['temperature'])
humidity    = float(input_data['humidity'])
ph          = float(input_data['ph'])
rainfall    = float(input_data['rainfall'])

data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

crop       = model.predict(data)[0]
proba      = model.predict_proba(data)[0]
confidence = round(float(np.max(proba)) * 100)

print(json.dumps({ "crop": crop, "confidence": confidence }))