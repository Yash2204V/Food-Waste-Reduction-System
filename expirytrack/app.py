from flask import Flask, request, jsonify, render_template, send_from_directory
import csv
import os
from datetime import datetime, timedelta
from tabulate import tabulate

app = Flask(__name__, template_folder='templates')

class ErrorMessage:
    @staticmethod
    def file_not_found(file_path):
        return f"Error: File '{file_path}' not found."

    @staticmethod
    def invalid_date_format(date):
        return f"Error: Invalid date format: {date}"

    @staticmethod
    def no_data_found():
        return "Error: No data found in the CSV file."

class ExpiryTracker:
    def __init__(self):
        self.shelf_life_data = {}

    def load_shelf_life_data(self, shelf_life_file='./test.csv'):
        try:
            with open(shelf_life_file, 'r') as shelf_life_file:
                reader = csv.reader(shelf_life_file)
                next(reader)  # Skip header row
                for row in reader:
                    sku = row[0]
                    name, brand, shelf_life = row[1], row[3], int(row[4])
                    self.shelf_life_data[sku] = (name, brand, shelf_life)

                #self.shelf_life_data = {row[0]: (row[1], row[2], datetime(row[3]),int(row[4])) for row in reader}
        except FileNotFoundError:
            return ErrorMessage.file_not_found(shelf_life_file)

    def calculate_expiration_date(self, production_date, shelf_life):
        return production_date + timedelta(days=shelf_life)

expiry_tracker = ExpiryTracker()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_csv():
    if request.method == 'POST':
        csv_file = request.files['csv_file']
        production_date_str = request.form['production_date']
        days = int(request.form['days'])

        # Convert production_date to datetime.date object
        production_date = datetime.strptime(production_date_str, "%Y-%m-%d").date()

        # Save the CSV file to a temporary location
        csv_file.save('uploaded.csv')

        # Load shelf life data
        result = expiry_tracker.load_shelf_life_data()
        if result is not None:
            return jsonify({'error': result})

        # Process the CSV file using ExpiryTracker
        history_data = []
        try:
            with open('uploaded.csv', 'r') as csv_file:
                reader = csv.reader(csv_file)
                next(reader)
                for row in reader:
                    sku = row[0]
                    name, brand, shelf_life = expiry_tracker.shelf_life_data.get(sku, ("Unknown", "Unknown", 0))
                    expiration_date = expiry_tracker.calculate_expiration_date(production_date, shelf_life)
                    data = [sku, name, brand, production_date.strftime("%Y-%m-%d"), expiration_date.strftime("%Y-%m-%d")]
                    history_data.append(data)
        except FileNotFoundError:
            return jsonify({'error': ErrorMessage.file_not_found('uploaded.csv')})

        if not history_data:
            return jsonify({'error': ErrorMessage.no_data_found()})
        else:
            return render_template('result.html', history_data=history_data)

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True)