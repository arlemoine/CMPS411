# Working with Docker

> **NOTE**: This document may be ignored for now, as this workflow may not even be entirely useful for this particular project. It is only staged here in the event that it is useful in the future.

This document outlines how our team will use Docker for development, including starting and stopping services, using the VS Code plugin, and reporting new dependency needs.


## Managing Dependencies / Updating Containers

- If you discover that your code requires a new library or dependency, **do not modify `requirements.txt` or rebuild containers yourself**.  

- Instead, log what dependency is needed and notify Adriean Lemoine. He will update the dependency file and rebuild the container so all team members have a consistent environment, minimizing single-user issues.

- Users can still test dependencies inside the running container if desired as demonstrated below:

```bash
docker container exec -it capstone-backend bash
```

```bash
pip install new_library_name
exit
```

- **Do not commit or push changes** from inside the container. These changes will only be temporary and local to you.

### Notes

- Docker images are built from the Dockerfile; the image exists locally once built.  
- All dependency updates are handled centrally by Adriean Lemoine to ensure consistency.

## Starting All Services

To start all services (backend, frontend, database) locally, use either method below.

### From Docker Desktop GUI

Click the “up” button in the Docker Desktop GUI (Windows/Mac).

### From the CLI

Open a terminal, navigate to the `docker` folder, and run:

```bash
docker compose up -d
```

- The `-d` flag runs containers in detached mode (in the background).  
- You can check that containers are running with:

"""
docker container ps
"""

## Shutting Down All Services

To stop all services and remove running containers (from the docker folder) if not using Docker Desktop GUI:

```bash
docker compose down
```

- This stops and removes containers, but volumes and images remain intact unless explicitly removed.

## Using VS Code Dev Containers (Optional)

For team members who prefer a GUI-based workflow or are new to Docker:

1. Install **Docker Desktop** (Windows/Mac) or Docker Engine (Linux).

2. Install **VS Code** and the **Dev Containers extension** (official Microsoft extension).

3. Open the repo in VS Code.

4. VS Code will prompt: **“Reopen in Container?”**  

5. Click **Yes**. VS Code will:

   - Build or pull Docker images (lead developer only if rebuilding is needed)
   - Start containers
   - Attach the editor to the running container
   - Mount the workspace so code changes are live in the container

**Benefits:**

- No need to type Docker commands for starting/stopping containers
- Automatic environment consistency
- Recommended for developers unfamiliar with Docker CLI

## Notes / Tips

- Backend changes are visible inside containers automatically if you mount your local folder via volumes.  
- Frontend static files are mounted into the Nginx container for hot-reload during development.  
- All services share a network (`capstone`), so backend can communicate with the database by its service name (`capstone-database`).  
- For any persistent data, volumes are mapped to local folders (`../database/milvus` for the vector DB).  
- If you need a new dependency, **do not attempt to install it yourself**; notify the lead developer.
