# app.py
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import shutil
import json
import base64
from werkzeug.utils import secure_filename
from pipeline import InclusivityPipeline  # Import your existing pipeline

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5000"]}})
# With this:
CORS(app, origins="*", supports_credentials=True)
# Configuration
UPLOAD_FOLDER = '/Users/rudrajit/Documents/fairUX/server/images/screenshots'
REPORT_FOLDER = '/Users/rudrajit/Documents/fairUX/server/reports'
RULES_CSV = 'Decision Rules.csv'  # Path to your rules CSV file
persona_id = 'ABI' # Default persona, can be overridden by request

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# Cleanup uploaded images and old reports
def cleanup_folder(folder, keep_file=None):
    try:
        for item in os.listdir(folder):
            if item != keep_file:
                item_path = os.path.join(folder, item)
                (shutil.rmtree if os.path.isdir(item_path) else os.remove)(item_path)
                print(f"Deleted: {item_path}")
    except Exception as e:
        print(f"Cleanup error in {folder}: {e}")
            
# Endpoint to save a single image (equivalent to the Node.js server endpoint)
@app.route('/api/save-image', methods=['POST'])
def save_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'}), 400
    
    print("Received request to save image")

    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    
    try:        
        # Create the directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Get the filename from the request or generate a timestamp-based one
        if request.form.get('fileName'):
            filename = secure_filename(request.form.get('fileName'))
        else:
            filename = f"{int(time.time())}-{secure_filename(file.filename)}"
        
        print("Saving file:", filename)
        # Save the file
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Return success response
        return jsonify({
            'success': True,
            'message': 'File saved successfully',
            'filePath': file_path,
            'fileName': filename
        })
    
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': 'Error saving file', 
            'error': str(e)
        }), 500

# app.py - Update the analyze_images function
@app.route('/api/analyze', methods=['POST'])
def analyze_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    if 'persona' not in request.form:
        return jsonify({'error': 'No persona selected'}), 400
    
    persona_name = json.loads(request.form.get('persona')).get('name')
    session_id = str(uuid.uuid4())

    global persona_id    
    persona_id = persona_name.upper()
    
    try:
        # Generate report
        pipeline = InclusivityPipeline()
        report_filename = f'inclusivity_report_{session_id}.pdf'
        report_path = os.path.join(REPORT_FOLDER, report_filename)
        
        results = pipeline.run_pipeline(
            persona=persona_name,
            rules_csv_path=RULES_CSV,
            screenshots_dir="screenshots",
            output_path=report_path
        )

        cleanup_folder(UPLOAD_FOLDER)  # Delete all uploaded files
        cleanup_folder(REPORT_FOLDER, report_filename)  # Delete old reports, keep current

        return jsonify({
            'success': True,
            'report_id': session_id,
            'report_filename': report_filename,
            'analysis_results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    report_filename = f'inclusivity_report_{report_id}.pdf'
    report_path = os.path.join(REPORT_FOLDER, report_filename)
    
    if os.path.exists(report_path):
        return send_file(report_path, mimetype='application/pdf')
    else:
        return jsonify({'error': 'Report not found'}), 404


# Serve the uploaded images
@app.route('/api/images/<path:filename>', methods=['GET'])
def get_image(filename):
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(image_path):
        return send_file(image_path)
    else:
        return jsonify({'error': 'Image not found'}), 404

@app.route('/api/rules', methods=['GET'])
def get_rules():
    """Serve the decision rules for frontend display"""
    try:
        import pandas as pd
        rules_file = f"{persona_id}_{RULES_CSV}"
        rules_df = pd.read_csv(rules_file)
        print("Reading rules from CSV file:", rules_file)
        rules_data = rules_df.to_dict('records')
        return jsonify(rules_data)
    except Exception as e:
        return jsonify({'error': f'Error reading rules: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)