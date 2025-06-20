# app.py
"""
Flask server for inclusivity analysis of UI screenshots.

This application provides a REST API for uploading UI screenshots, analyzing them
for inclusivity issues using different personas, and generating PDF reports.
The analysis is performed using a custom InclusivityPipeline that evaluates
screenshots against predefined decision rules.

Dependencies:
    - Flask: Web framework for creating REST API endpoints
    - Flask-CORS: Cross-origin resource sharing for frontend integration
    - werkzeug: WSGI utilities (secure_filename for file handling)
    - pandas: Data manipulation for reading and processing CSV decision rules
    - uuid: Generating unique session identifiers for reports
    - json: Parsing JSON data from form requests
    - os: Operating system interface for file and directory operations
    - shutil: High-level file operations for cleanup functionality
    - time: Time-related functions for timestamp generation
    - Custom pipeline module: InclusivityPipeline for UI analysis

Author: 
    Rudrajit Choudhuri
    Date: 2025-20-06

Version: 1.0
"""

import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import uuid
import shutil
import json
import pandas as pd
from werkzeug.utils import secure_filename
from pipeline import InclusivityPipeline  # Import your existing pipeline

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all origins with credentials support
# This allows the frontend to make requests from any domain
CORS(app, origins="*", supports_credentials=True)

# ============================================================================
# CONFIGURATION CONSTANTS
# ============================================================================

# Directory paths for file storage (relative to the server directory)
UPLOAD_FOLDER = os.path.join('images', 'screenshots')  # Where uploaded screenshots are stored
REPORT_FOLDER = 'reports'                              # Where generated PDF reports are saved
RULES_CSV = 'Decision Rules.csv'                       # CSV file containing inclusivity decision rules

# Default persona for analysis (can be overridden by API requests)
persona_id = 'ABI'  # Default persona identifier

# Ensure required directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORT_FOLDER, exist_ok=True)

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def cleanup_folder(folder, keep_file=None):
    """
    Clean up files and directories in a specified folder.
    
    This function removes all items in a folder except for an optionally specified
    file to keep. Used to maintain clean storage by removing old uploads and reports.
    
    Args:
        folder (str): Path to the folder to clean up
        keep_file (str, optional): Name of file to preserve during cleanup
        
    Returns:
        None
    """        
    try:
        # Iterate through all items in the specified folder        
        for item in os.listdir(folder):
            # Skip the file we want to keep
            if item != keep_file:
                item_path = os.path.join(folder, item)
                # Remove directory recursively or single file based on type
                (shutil.rmtree if os.path.isdir(item_path) else os.remove)(item_path)
                print(f"Deleted: {item_path}")
    except Exception as e:
        print(f"Cleanup error in {folder}: {e}")
            
# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/save-image', methods=['POST'])
def save_image():
    """
    Save a single uploaded image file to the server.
    
    This endpoint handles file uploads from the frontend, validates the file,
    generates a secure filename, and saves it to the designated upload folder.
    
    Expected Request:
        - Method: POST
        - Content-Type: multipart/form-data
        - Files: 'image' - The image file to upload
        - Form data: 'fileName' (optional) - Custom filename
        
    Returns:
        JSON response with:
        - success (bool): Whether the operation succeeded
        - message (str): Status message
        - filePath (str): Full path where file was saved (on success)
        - fileName (str): Name of the saved file (on success)
        - error (str): Error details (on failure)
        
    HTTP Status Codes:
        - 200: File saved successfully
        - 400: Bad request (no file or invalid file)
        - 500: Server error during file saving
    """
    # Validate that an image file was uploaded
    if 'image' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'}), 400
    
    print("Received request to save image")

    file = request.files['image']

    # Check if a file was actually selected
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    
    try:        
        # Ensure the upload directory exists
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        
        # Get the filename from the request or generate a timestamp-based one
        if request.form.get('fileName'):
            filename = secure_filename(request.form.get('fileName'))
        else:
            # Generate unique filename using timestamp and original filename
            filename = f"{int(time.time())}-{secure_filename(file.filename)}"
        
        print("Saving file:", filename)

        # Save the uploaded file to the designated folder
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # Return success response with file details
        return jsonify({
            'success': True,
            'message': 'File saved successfully',
            'filePath': file_path,
            'fileName': filename
        })
    
    except Exception as e:
        # Handle any errors during file saving
        return jsonify({
            'success': False, 
            'message': 'Error saving file', 
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_images():
    """
    Analyze uploaded images for inclusivity bugs using a specified persona.
    
    This endpoint processes multiple uploaded images through the inclusivity
    analysis pipeline, generates a PDF report, and returns analysis results.
    The analysis is performed based on predefined decision rules and the
    selected persona's perspective.
    
    Expected Request:
        - Method: POST
        - Content-Type: multipart/form-data
        - Files: 'images' - One or more image files
        - Form data: 'persona' - JSON string containing persona information
        
    Returns:
        JSON response with:
        - success (bool): Whether analysis completed successfully
        - report_id (str): Unique identifier for the generated report
        - report_filename (str): Name of the generated PDF report
        - analysis_results (dict): Detailed analysis results from pipeline
        - error (str): Error message (on failure)
        
    HTTP Status Codes:
        - 200: Analysis completed successfully
        - 400: Bad request (missing images or persona)
        - 500: Server error during analysis
    """
    # Validate required inputs    
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    if 'persona' not in request.form:
        return jsonify({'error': 'No persona selected'}), 400

    # Extract persona information from form data
    persona_name = json.loads(request.form.get('persona')).get('name')

    # Generate unique session ID for this analysis    
    session_id = str(uuid.uuid4())

    # Update global persona ID for use in other endpoints
    global persona_id    
    persona_id = persona_name.upper()
    
    try:
        # Initialize the inclusivity analysis pipeline
        pipeline = InclusivityPipeline()

        # Generate unique report filename and path
        report_filename = f'inclusivity_report_{session_id}.pdf'
        report_path = os.path.join(REPORT_FOLDER, report_filename)
        
        # Run the analysis pipeline with provided parameters
        results = pipeline.run_pipeline(
            persona=persona_name,
            rules_csv_path=RULES_CSV,
            screenshots_dir="screenshots",  # Relative path used by pipeline
            output_path=report_path
        )

        # Clean up storage: remove uploaded files and old reports
        cleanup_folder(UPLOAD_FOLDER)  # Delete all uploaded files
        cleanup_folder(REPORT_FOLDER, report_filename)  # Keep only current report

        # Return successful analysis results
        return jsonify({
            'success': True,
            'report_id': session_id,
            'report_filename': report_filename,
            'analysis_results': results
        })
        
    except Exception as e:
        # Handle any errors during analysis
        return jsonify({'error': str(e)}), 500

        
@app.route('/api/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """
    Retrieve a generated PDF report by its unique identifier.
    
    This endpoint serves PDF reports that were generated by the analysis
    pipeline. Reports are identified by their session ID.
    
    Args:
        report_id (str): Unique identifier for the report (from URL path)
        
    Returns:
        - PDF file download (on success)
        - JSON error response (if report not found)
        
    HTTP Status Codes:
        - 200: Report found and served successfully
        - 404: Report not found
        
    Content-Type:
        - application/pdf (on success)
        - application/json (on error)
    """
    # Construct expected report filename from report ID
    report_filename = f'inclusivity_report_{report_id}.pdf'
    report_path = os.path.join(REPORT_FOLDER, report_filename)
    
    # Check if report file exists and serve it
    if os.path.exists(report_path):
        return send_file(report_path, mimetype='application/pdf')
    else:
        return jsonify({'error': 'Report not found'}), 404


@app.route('/api/images/<path:filename>', methods=['GET'])
def get_image(filename):
    """
    Serve uploaded image files by filename.
    
    This endpoint provides access to uploaded screenshot images for
    display or download purposes. Images are served from the upload folder.
    
    Args:
        filename (str): Name of the image file to retrieve (from URL path)
        
    Returns:
        - Image file (on success)
        - JSON error response (if image not found)
        
    HTTP Status Codes:
        - 200: Image found and served successfully
        - 404: Image not found
        
    Content-Type:
        - Determined by file type (on success)
        - application/json (on error)
    """
    # Construct full path to requested image
    image_path = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(image_path):
        return send_file(image_path)
    else:
        return jsonify({'error': 'Image not found'}), 404

@app.route('/api/rules', methods=['GET'])
def get_rules():
    """
    Retrieve decision rules for the current persona in JSON format.
    
    This endpoint reads the CSV file containing inclusivity decision rules
    for the currently selected persona and returns them as JSON data for
    frontend display and reference.
    
    Returns:
        JSON response with:
        - List of rule objects (on success)
        - error (str): Error message (on failure)
        
    HTTP Status Codes:
        - 200: Rules retrieved successfully
        - 500: Error reading rules file
        
    Dependencies:
        - Global persona_id: Used to determine which rules file to read
        
    File Format:
        Expected CSV filename format: "{PERSONA_ID}_{RULES_CSV}"
        Example: "ABI_Decision Rules.csv"
    """
    try:
        # Construct persona-specific rules filename
        rules_file = f"{persona_id}_{RULES_CSV}"

        # Read CSV file into pandas DataFrame
        rules_df = pd.read_csv(rules_file)
        print("Reading rules from CSV file:", rules_file)

        # Convert DataFrame to list of dictionaries for JSON serialization        
        rules_data = rules_df.to_dict('records')
        
        return jsonify(rules_data)

    except Exception as e:
        # Handle errors in file reading or processing        
        return jsonify({'error': f'Error reading rules: {str(e)}'}), 500

# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    """
    Start the Flask development server.
    
    Configuration:
        - Debug mode: Enabled for development
        - Port: 5000 (default Flask port)
        - Host: localhost (default)
    """
    app.run(debug=True, port=5000)