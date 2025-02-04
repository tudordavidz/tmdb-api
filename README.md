
# TMDB Movie API

This is a RESTful API application built with **NestJS** that integrates with **The Movie Database (TMDB)** to fetch and store movie data. The API allows users to list, search, filter, rate movies, and retrieve detailed information about movies. It also includes **JWT-based authentication** to secure access to protected endpoints.

---

## **Features**
- **List Movies**: Fetch and display paginated lists of movies.
- **Search Movies**: Search for movies by title or overview.
- **Filter Movies**: Filter movies by genre (e.g., Action, Thriller).
- **Rate Movies**: Allow authenticated users to rate movies and calculate average ratings.
- **Detailed Movie Information**: Retrieve detailed information about a specific movie, including its average rating.
- **User Registration**: Register new users via the `/auth/register` endpoint.
- **JWT Authentication**: Secure access to protected endpoints using JSON Web Tokens (JWT).

---

## **Endpoints**

### **Movies**
- `GET /movies`: List movies with pagination.
- `GET /movies/search?query=action`: Search movies by title or overview.
- `GET /movies/filter/:id`: Filter movies by genre ID.
- `POST /movies/:id/rate`: Rate a movie (requires authentication with Bearer token).
  - You need to include in the Authorization header as a Bearer token when making requests to protected routes like rating a movie
    
   **Body**: 
    ```json
    {
      "userId": "1",
      "rating": "5"
    }
- `GET /movies/:id`: Get details of a specific movie (requires authentication with Bearer token).

### **Authentication**
- `POST /auth/register`: Register a new user.
 
  **Body**:
    ```json
    {
      "id": "1",
      "username": "test",
      "password": "password",
    }
    ```
- `POST /auth/login`: Obtain a JWT token for authentication.
  
    **Body**:
    ```json
    {
      "username": "test",
      "password": "password"
    }
    ```

---

## **Prerequisites**

Before running the application, ensure you have the following installed:
- **Node.js** (v18+)
- **Docker** (for containerized deployment)
- **PostgreSQL** (optional, if not using Docker)
- **npm** or **yarn**

---

## **Setup Instructions**

### **Local Setup**
1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-repo/tmdb-api.git
    cd tmdb-api
    ```

2. **Set Environment Variables**
    ```bash
    # Database Configuration
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=postgres
    DATABASE_PASSWORD=password
    DATABASE_NAME=movie_db

    # TMDB API Configuration
    TMDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  # Your API Key from https://www.themoviedb.org/settings/api
    TMDB_BASEURL=https://api.themoviedb.org/3
    ```

3. **Start the Application**
    ```bash
    npm run start:dev
    ```
    Access the API at: `http://localhost:3000`

4. **Populate the Database**
    To populate the database with movies from TMDB, call the `fetchAndStoreMovies` method by sending the following request:
    ```bash
    GET http://localhost:3000/movies?page=1&limit=10
    ```

5. **Run Tests**
    ```bash
    npm run test:watch
    ```

---

### **Docker Setup**
1. **Build and Run Containers**
    ```bash
    docker-compose up --build
    ```

---

