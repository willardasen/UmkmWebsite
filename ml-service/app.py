from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json

app = Flask(__name__)
CORS(app)  

model = joblib.load('model.pkl')        
scaler = joblib.load('scaler.pkl')     
with open('features.json') as f:
    features = json.load(f)           


cluster_to_eligible = {
    0: "APPROVED",   
    1: "APPROVED",   
    2: "REJECTED"    
}
@app.route('/', methods=['GET'])
def appRun():
    return jsonify({"message": "ML Service is running."})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        missing = [f for f in features if f not in data]
        if missing:
            return jsonify({'error': f'Missing features: {missing}'}), 400

        df = pd.DataFrame([data])[features]
        df_scaled = scaler.transform(df)
        cluster_pred = model.predict(df_scaled)[0]
        eligible = cluster_to_eligible.get(cluster_pred, "REJECTED")
        return jsonify({
            'predicted_cluster': int(cluster_pred),
            'eligible': eligible
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)  
