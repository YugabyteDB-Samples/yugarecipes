import sys
import os
import pandas as pd

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.llm_interface import generate_embedding

# Load the CSV file
csv_path = './database/cuisines.csv'
df = pd.read_csv(csv_path)

# Generate embeddings for each description in the CSV
df['embeddings'] = df['description'].apply(generate_embedding, args=(True,))

# Save the DataFrame with embeddings to a new CSV file
output_csv_path = './database/output_with_embeddings_openai.csv'
df.to_csv(output_csv_path, index=False)

print(f"Embeddings generated and saved to {output_csv_path}")