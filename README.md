## YugaRecipes

<img width="1135" alt="app_screenshot" src="https://github.com/YugabyteDB-Samples/yugarecipes/assets/2041330/1bcdec08-b11c-4a58-900a-e136070202a8">

## Prerequisites

- Install Python 3+
- Install Node.js 18+
- Install Ollama or obtain OpenAI API Key
- Install Docker

## Set up the Database

This application can be run using a single-node PostgreSQL instance or a 3-node YugabyteDB cluster running in Docker.

### Set up PostgreSQL with pgvector

```
docker pull pgvector/pgvector:pg16
docker run --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=postgres -p 5432:5432 -d pgvector/pgvector:pg16
```

### Set up YugabyteDB

Start a 3-node YugabyteDB cluster in Docker (or feel free to use another deployment option):

```sh
# NOTE: if the ~/yb_docker_data already exists on your machine, delete and re-create it
mkdir ~/yb_docker_data

docker network create custom-network

docker run -d --name yugabytedb-node1 --net custom-network \
    -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
    -v ~/yb_docker_data/node1:/home/yugabyte/yb_data --restart unless-stopped \
    yugabytedb/yugabyte:latest \
    bin/yugabyted start \
    --base_dir=/home/yugabyte/yb_data --background=false

docker run -d --name yugabytedb-node2 --net custom-network \
    -p 15434:15433 -p 7002:7000 -p 9002:9000 -p 5434:5433 \
    -v ~/yb_docker_data/node2:/home/yugabyte/yb_data --restart unless-stopped \
    yugabytedb/yugabyte:latest \
    bin/yugabyted start --join=yugabytedb-node1 \
    --base_dir=/home/yugabyte/yb_data --background=false

docker run -d --name yugabytedb-node3 --net custom-network \
    -p 15435:15433 -p 7003:7000 -p 9003:9000 -p 5435:5433 \
    -v ~/yb_docker_data/node3:/home/yugabyte/yb_data --restart unless-stopped \
    yugabytedb/yugabyte:latest \
    bin/yugabyted start --join=yugabytedb-node1 \
    --base_dir=/home/yugabyte/yb_data --background=false
```

The database connectivity settings are provided in the `{project_dir}/.env` file and do not need to be changed if you started the cluster with the preceding command.

## Load the schema and seed data

This application requires a database table with information about news stories. This schema includes a `news_stories` table.

### PostgreSQL

1. Copy the schema to the first node's Docker container.

   ```sh
   docker cp {project_dir}/database/schema.sql postgres:/home/database
   ```

2. Copy the seed data file to the Docker container.

   ```sh
   docker cp {project_dir}/output_with_embeddings.csv postgres:/home/database
   ```

3. Execute the SQL files against the database.

   ```sh
   docker exec -it postgres bin/psql -U postgres -f /home/database/schema.sql
   docker exec -it postgres bin/psql -U postgres -c "\COPY recipes(name,image_url,description,cuisine,course,diet,prep_time,ingredients,instructions,embeddings) from '/home/database/output_with_embeddings.csv' DELIMITER ',' CSV HEADER;"
   ```

### YugabyteDB

1. Copy the schema to the first node's Docker container.

   ```sh
   docker cp {project_dir}/database/schema.sql yugabytedb_node1:/home/database
   ```

2. Copy the seed data file to the Docker container.

   ```sh
   docker cp {project_dir}/output_with_embeddings.csv yugabytedb_node1:/home/database
   ```

3. Execute the SQL files against the database.
   ```sh
   docker exec -it yugabytedb-node1 bin/ysqlsh -h yugabytedb-node1 -f /home/database/schema.sql
   docker exec -it yugabytedb-node1 bin/ysqlsh -h yugabytedb-node1 -c "\COPY recipes(name,image_url,description,cuisine,course,diet,prep_time,ingredients,instructions,embeddings) from '/home/database/output_with_embeddings.csv' DELIMITER ',' CSV HEADER;"
   ```

## Starting the Application

This application is comprised of a Flask API Server and a React Frontend.

### Backend

1. Install backend dependencies.
   ```
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Start the server.
   ```
   python server.py
   ```

### Frontend

1. Install frontend dependencies.
   ```
   npm install
   ```
2. Start frontend.
   ```
   npm run dev
   ```

## Sample multipart form CURL request

```
curl -X POST http://127.0.0.1:5000/api/search -H "Content-Type: multipart/form-data" -F 'data={"query": "tomato"}' -F "image=@/Users/bhoyer/Projects/indian-recipes/backend/static/images/1.Thayir_Curd_Semiya_recipe_Yogurt_Vermicelli_South_indian_Lunch_recipe-4.jpg"
```
