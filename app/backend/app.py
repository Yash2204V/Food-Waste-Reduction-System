from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/run_expiry_tracker', methods=['POST'])
def run_expiry_tracker():
    # Check if the POST request has the file part
    if 'csv_file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['csv_file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Save the uploaded CSV file
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    production_date = request.form['production_date']
    # Process the uploaded CSV file and production date (you can add your logic here)

    # For demonstration purposes, return a message indicating success
    return jsonify({'message': 'Expiry tracker ran successfully', 'expiry_report_cleared': True})

if __name__ == '__main__':
    app.run(debug=True)
