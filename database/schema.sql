CREATE EXTENSION IF NOT EXISTS vector;

CREATE table
    recipes (
        id SERIAL PRIMARY KEY,
        name text,
        image_url text,
        description text,
        cuisine text,
        course text,
        diet text,
        prep_time text,
        ingredients text,
        instructions text,
        embeddings vector (768)
    );