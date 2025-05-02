# ================================================================
# 📦 app.py - Flask API untuk Prediksi Eligibility UMKM
# ================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import json

# ================================================================
# 🔹 Inisialisasi Flask App
# ================================================================
app = Flask(__name__)
CORS(app)  # Mengizinkan request dari frontend lain (misalnya Next.js di port 3000)

# ================================================================
# 🔹 Load Model, Scaler, dan Daftar Fitur Input
# ================================================================
model = joblib.load('model.pkl')        # Model RandomForestClassifier
scaler = joblib.load('scaler.pkl')      # StandardScaler yang digunakan saat training
with open('features.json') as f:
    features = json.load(f)             # Daftar fitur yang harus diisi oleh user/frontend

# ================================================================
# 🔹 Mapping dari Cluster hasil model → Eligible (1) atau Not Eligible (0)
# (disesuaikan dengan jumlah cluster, misal 3)
# ================================================================
cluster_to_eligible = {
    0: "APPROVED",   # Eligible
    1: "APPROVED",   # Eligible
    2: "REJECTED"    # Not Eligible
}
@app.route('/', methods=['GET'])
def appRun():
    return jsonify({"message": "ML Service is running."})

# ================================================================
# 🔹 Endpoint utama: /predict
# Method: POST
# ================================================================
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil data input dari request JSON
        data = request.get_json()
         # Cek apakah semua fitur tersedia
        missing = [f for f in features if f not in data]
        if missing:
            return jsonify({'error': f'Missing features: {missing}'}), 400

        # Konversi ke DataFrame dan urutkan kolom sesuai fitur training
        df = pd.DataFrame([data])[features]

        # Scaling fitur input
        df_scaled = scaler.transform(df)

        # Prediksi cluster dari model
        cluster_pred = model.predict(df_scaled)[0]

        # Mapping ke status eligibility
        eligible = cluster_to_eligible.get(cluster_pred, "REJECTED")

        # Return hasil sebagai JSON
        return jsonify({
            'predicted_cluster': int(cluster_pred),
            'eligible': eligible
        })

    except Exception as e:
        # Jika ada error, kirim response error
        return jsonify({'error': str(e)}), 500
    

# ================================================================
# 🔹 Main entry point untuk menjalankan server
# ================================================================
if __name__ == '__main__':
    app.run(debug=True)  # debug=True untuk development, ganti False saat production
