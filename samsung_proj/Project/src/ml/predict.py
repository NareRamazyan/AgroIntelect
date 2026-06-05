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

proba      = model.predict_proba(data)[0]
classes    = model.classes_
top5_idx   = proba.argsort()[::-1][:5]

top5 = [
    {"crop": classes[i], "confidence": round(float(proba[i]) * 100)}
    for i in top5_idx
]

print(json.dumps({
    "crop":        top5[0]["crop"],
    "confidence":  top5[0]["confidence"],
    "alternatives": top5[1:]   # 4 alternatives
}))