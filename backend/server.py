from flask import Flask, request, jsonify, json, send_from_directory
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv
from flask_cors import CORS

from llm_interface import describe_image, generate_embedding

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Database connection configuration
DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_NAME = os.getenv('DB_NAME', 'postgres')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'mysecretpassword')
DB_PORT = os.getenv('DB_PORT', '5432')

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        port=DB_PORT,
        cursor_factory=RealDictCursor
    )
    return conn

@app.route('/api/search', methods=['POST'])
def search():
    image_description = None
    query = None
    # multipart form data payload
    if 'image' in request.files:
        print(f"Searching based on file: {request.form.get("file")}")
        image_file = request.files['image']
        print(image_file)
        image_description = describe_image(image_file)
        print(f"this is the image description: {image_description}")
        # return jsonify({'error': 'No image file provided'}), 400
    else: 
        print("no image provided")
        
    # image = Image.open(image_file.stream)

    data = request.form.get('data')
    if data and 'query' in data:
        try:
            data = json.loads(data)
            query = data['query']
        except ValueError:
            return jsonify({'error': 'Invalid JSON data'}), 400
    else:
        print("no search query provided")

    if not image_description and not query:
        return jsonify({'error': 'No search query or image provided'}), 400

    embedding_query = (query or '') + " " + (image_description or '')
    print(f"embedding query: {embedding_query}")

    embedding = generate_embedding(embedding_query)

    print(f"this is the embedding: {embedding}")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Assuming there's a table named 'items' with a column 'name'
        cursor.execute("SELECT id, name, description, instructions, image_url FROM recipes ORDER BY embeddings <=> %s::vector  LIMIT 10", (embedding,))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({'results': results, 'image_description': image_description or None})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/static/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/images', filename)

if __name__ == '__main__':
    app.run(debug=True)