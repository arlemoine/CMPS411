# Tech Stack Concepts

## Purpose

The purpose of this document is to give a big picture understanding of the various technological tools we will be interacting with during the capstone project.

## AWS Bedrock

### What it is

**AWS Bedrock** is a **managed service that gives you API access to foundation AI models** (like Claude and Titan) **without you managing infrastructure or model hosting**.

We do not have to train models, run GPUs, or manage scaling. It is all accomplished by Bedrock.

### Use

Bedrock models from apps, **RAG** pipelines, or tools (like **MCP**).

It also runs Claude (for reasoning & responses) as well as Titan Embeddings (vector creation). 

We will primarily use Bedrock to generate answers and embeddings from documents for the RAG knowledge base.

### Bedrock Knowledge Base (KB)

KB is a custom, searchable store of documents that lets the AI answer questions with context.

#### How it works

1. Documents go in (PDFs, manuals, etc) and are uploaded to S3.
2. Documents get processed.
	1. Chunked into smaller sections. 
	2. Each chunk is converted into a **vector embedding** (numeric representation of meaning) using **Titan Embeddings**.
3. Stored in a vector database inside the KB
4. When you ask a question, the AI:
	1. Converts your query to a vector.
	2. Finds the closest matching document chunks.
	3. Returns answers with citations.

#### Why it matters

**AI doesn't just hallucinate**. It pulls info from your actual documents and makes RAG (retrieval-augmented generation) possible. This lets you scale to lots of documents without changing your model. 

## Vector embedding

**Vector embeddings** (aka "embeddings") are numeric representations of text (or other data) that capture **meaning** and not just words. An example of this might be the following:

*The sentences "The patient has a high fever" and "The patient's temperature is elevated" have different words but similar embeddings. Therefore, they are close in the vector space.*

### How we use them

1. Chunk your documents (PDFs, manuals, etc).
2. Convert each chunk to an embedding using **Titan Embeddings** (Bedrock).
3. Store those vectors in a **vector database**.

## Vector database

A **vector database** is a database optimized for fast similarity searches of vectors.

### How it works

1. Takes a query embedding
2. Finds the most "similar" document embeddings
3. Returns the corresponding document chunks

### Why it matters

Classical relational databases can't efficiently do similarity searches. Vector databases act as an efficient "memory lookup" for an AI.

## RAG (Retrieval-Augmented Generation)

**RAG** stands for retrieval-augmented generation. RAG is the process of letting an AI model **look up relevant information** before generating an answer. Instead of relying only on what the AI "remembers," it **augments its knowledge** with documents you provide (as if you asked for a citation).

### Sequence of events

1. User asks a question and the chat UI or API receives it.
2. The question is converted into a vector using **Titan Embeddings** (query embedding).
3. The query vector is sent to the vector database (Bedrock KB).
4. The closest matching document pieces are returned.
5. The Claude or Titan model in Bedrock uses these chunks to produce a response, including citations if needed.

### Why it matters

This technology reduces hallucinations since the AI is made to specifically reference real documents. This capability scales to hundreds or thousands of documents without retraining the model. 

It is also flexible. **MCP tools** can be integrated alongside **RAG** for combined knowledge and live data queries.  

## MCP (Model Context Protocol) and MCP server

**MCP** stands for Model Context Protocol. MCP is a **standardized** way for AI models to safely call external tools or services.

> For the purposes of our project, the MCP server exposes **database tools** as callable endpoints for the AI.

### Flow sequence

1. AI wants data (e.g. "Find all diabetic patients over 65 without a checkup in the last 6 months)
2. The query called by the AI goes to your MCP server, which hosts several database tools.
3. Each tool is pre-defined, scoped, and safe, allowing the query to run.
4. MCP server sends structured results back to the AI
5. AI combines data with RAG (retrieval-augmented generation), producing an answer referencing documents and live data.

## MCP server tools

**MCP server tools** are individual, pre-defined functions that the AI can call to retrieve or manipulate data. Each tool exposes a specific operation on the database. These tools are **scoped and safe**, meaning that the AI cannot run arbitrary queries. It can only query what the tool allows.

### What makes each tool different

- Purpose
	- Each tool answers a different question or performs a different type of operation.
	- Example: Demographic searches, lab results lookups, medication interactions, encounter history aggregation, etc. 
- Input parameters
	- Each tool expects certain structured inputs.
	- Example: get_lab_results(patient_id: int, start_date: str, end_date: str)
- Output structure
	- Each tool returns structured, predictable data.
	- Example: JSON with fields like {test_name, value, units, date}
- Database query or logic
	- Each tool contains the SQL or API logic needed to retrieve its results.
	- It may combine multiple tables, but the AI doesn't have to know SQL.
- Safety
	- Tools **cannot perform destructive operations**
	- They prevent the AI from making mistakes on live data, providing a boundary layer between the AI and the database.

## ECS (Elastic Container Service)

**ECS** (Elastic Container Service) is an AWS service to run **containers** at scale. It can be thought of like a managed server cluster for Docker containers.

### Key concepts

- Cluster
	- Logical group of machines that run your containers.
	- You don't manage the servers directly if you use **Fargate**.
- Task
	- One running instance of a container or set of containers defined in a task definition.  
- Service
	- Keeps tasks **running continuously** and optionally balances load.
	- Example: Your chat UI or MCP server stays online automatically.
- Task definition
	- JSON/YAML blueprint describing:
		- Which Docker image to run
		- CPU/memory requirements
		- Ports, environment variables, secrets
- Fargate vs EC2
	- Fargate: Serverless; AWS runs containers without managing EC2 instances.
	- EC2 launch type: You provide VMs; More control but more maintenance.

## Fargate

**Fargate** is a serverless compute engine for **ECS**. Instead of managing EC2 instances, you just tell AWS what containers to run and how much CPU/memory each needs. 

Since there are no servers to manage, AWS handles provisioning, scaling, patching, and OS maintenance. You only define containers and their resources.

Fargate runs tasks and services just like ECS normally does. Task definitions still define images, ports, and environment variables. 

Fargate automatically launches or stops containers based on demand if you configure autoscaling. This is ideal for **RAG ingestion** jobs, MCP servers, or chat UI that may see bursts of requests. 

Each Fargate task gets its own isolated runtime. This works seamlessly with IAM roles for service-to-service access (S3, Bedrock, DB).

### Why it matters

- You can focus on **containers and code**, not managing VMs.
- Makes it easier to replicate local Docker dev environments in the cloud.
- Reduces operational overhead.

## RAG Ingestion Pipeline

The goal of this pipeline is to take raw documents and turn them into **searchable vectors** in your **Bedrock KB**.

### Flow sequence

1. Upload documents to S3
	1. S3 = AWS object storage
	2. Each team has a bucket for RAG ingestion.
	3. Files are stored in a structured way (e.g. `docs/policies/insulin.pdf`)
	4. S3 can trigger events automatically when a new file is added.
2. Trigger Lambda function
	1. Lambda = serverless compute.
	2. When a document is uploaded, S3 triggers a Lambda function.
	3. Lambda runs your **ingestion code**:
		1. Reads the file
		2. Chunks it into smaller pieces to make embeddings manageable
		3. Sends each chunk to **Titan Embeddings (Bedrock)**
		4. Stores the resulting vectors in the vector database
3. Vector database storage
	1. Each chunk's embedding is stored with:
		1. Original document reference
		2. Chunk text
		3. Metadata (page number, section, date, etc)
	2. Vector DB allows **semantic search** later when the AI queries.
4. RAG queries
	1. When the AI receives a request:
		1. Converts the query into an embedding
		2. Searches the vector database for nearest neighbors (document chunks)
		3. Uses the retrieved chunks as context for generating the answer

### Why it matters

- **Fully automated**: New documents can be ingested without **manual intervention**.
- **Scalable**: Hundreds of documents can be processed quickly.
- **Accurate**: AI can cite the original chunk in responses.
