import os
import logging
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv

from api.qobuz_service import QobuzService
from api.config import Config

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get environment variables
FLASK_HOST = os.getenv('FLASK_HOST', '127.0.0.1')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
CORS_ALLOW_ORIGINS = os.getenv('CORS_ALLOW_ORIGINS', '*').split(',')

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
if CORS_ALLOW_ORIGINS[0] == '*':
    CORS(app)  # Enable CORS for all origins
else:
    CORS(app, resources={r"/api/*": {"origins": CORS_ALLOW_ORIGINS}})

# Initialize configuration
config = Config()

# Initialize Qobuz service
qobuz_service = QobuzService(config)

@app.route('/api/auth', methods=['POST'])
def authenticate():
    """Authenticate with Qobuz"""
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    try:
        result = qobuz_service.authenticate(email, password)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search():
    """Search for music on Qobuz"""
    query = request.args.get('query')
    item_type = request.args.get('type', 'album')
    limit = int(request.args.get('limit', 10))

    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400

    try:
        results = qobuz_service.search(query, item_type, limit)
        return jsonify(results)
    except Exception as e:
        logger.error(f"Search error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    """Download music from Qobuz"""
    data = request.json
    urls = data.get('urls', [])
    quality = int(data.get('quality', 6))
    directory = data.get('directory', 'Qobuz Downloads')
    embed_art = data.get('embed_art', False)

    if not urls:
        return jsonify({'error': 'URLs are required'}), 400

    try:
        result = qobuz_service.download(urls, quality, directory, embed_art)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Download error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Get application settings"""
    try:
        settings = config.get_settings()
        return jsonify(settings)
    except Exception as e:
        logger.error(f"Error getting settings: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Update application settings"""
    data = request.json
    try:
        config.update_settings(data)
        return jsonify({'message': 'Settings updated successfully'})
    except Exception as e:
        logger.error(f"Error updating settings: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/status', methods=['GET'])
def download_status():
    """Get download status"""
    try:
        status = qobuz_service.get_download_status()
        return jsonify(status)
    except Exception as e:
        logger.error(f"Error getting download status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/zip', methods=['GET'])
def download_zip():
    """Download the zip file of downloaded content"""
    try:
        zip_path = qobuz_service.get_zip_file()
        if not zip_path or not os.path.exists(zip_path):
            return jsonify({'error': 'Zip file not found'}), 404

        # Get the filename from the path
        filename = os.path.basename(zip_path)

        # Send the file as an attachment
        return send_file(
            zip_path,
            mimetype='application/zip',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        logger.error(f"Error downloading zip file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/clear', methods=['POST'])
def clear_downloads():
    """Clear downloaded files and reset download status"""
    try:
        result = qobuz_service.clear_downloads()
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error clearing downloads: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=FLASK_DEBUG)
