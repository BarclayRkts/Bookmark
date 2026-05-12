# 🔖 Bookmark Manager

A high-performance, full-stack application designed for efficient link organization and rapid data retrieval. This tool focuses on providing a centralized hub for managing a curated library of resources with sub-millisecond response times.

---

## 🔗 Live Demo
> **IMPORTANT** :
> If the site has not been active recently, you may encounter initial loading delays or connectivity issues. This is often due to the sleep cycles of free-tier hosting services. Please allow a moment for the instance to wake up and refresh the page if the content does not load immediately.

You can view the project live here: **[bookmark-sigma-two.vercel.app](https://bookmark-sigma-two.vercel.app/)**

---

## 🛠️ Tech Stack

The architecture leverages a robust set of technologies to ensure scalability, performance, and type safety:

*   **Backend:** Java 21 with Spring Boot 3
*   **Frontend:** React, utilizing TypeScript for type safety and Tailwind CSS for a minimalist, responsive UI
*   **Database:** AWS DynamoDB, implemented with a **Single Table Design** for optimized storage and retrieval
*   **Infrastructure:** AWS SDK for cloud-native integration and scalability

---

## 🚀 Deployment Steps

### 1. Database Configuration
*   Create a DynamoDB table within your AWS account.
*   Define your Partition Key (PK) and Sort Key (SK) according to the Single Table Design schema used in the project.

### 2. Backend Setup
*   Define your AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) as environment variables on your hosting provider.
*   Package the Spring Boot application into a JAR file using Maven.
*   Deploy the resulting JAR to your preferred service (e.g., AWS Elastic Beanstalk or Render).

### 3. Frontend Setup
*   Install project dependencies using `npm install`.
*   Generate a production-ready bundle with `npm run build`.
*   Deploy the static assets to a hosting service such as Vercel, Netlify, or AWS S3/CloudFront.

---

## 📡 API Endpoints

The backend provides a comprehensive RESTful API for bookmark management:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/bookmark/create` | Save a new bookmark to the database. |
| `GET` | `/bookmark/all/{userId}` | Retrieve all bookmarks for a specific user ID. |
| `GET` | `/bookmark/{id}` | Fetch detailed data for a single bookmark. |
| `PUT` | `/bookmark/update/{id}` | Update an existing bookmark's information. |
| `DELETE` | `/bookmark/delete/{id}` | Permanently remove a link from your collection. |
| `GET` | `/bookmark/search` | Search and filter through saved links. |
| `PATCH` | `/bookmark/archive/{id}` | Move a bookmark to the archive status. |
| `PATCH` | `/bookmark/increment-views/{id}` | Track engagement by incrementing view counts. |

---

## 📂 Project Structure

```text
Bookmark/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App Router pages and layouts
│   ├── components/          # Reusable React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and shared logic
│   ├── public/              # Static assets (images, icons)
│   └── next.config.ts       # Next.js configuration
├── src/                     # Java backend source code
│   ├── main/                # Application source (Spring Boot)
│   └── test/                # Unit and integration tests
├── pom.xml                  # Maven project configuration
└── Dockerfile               # Containerization instructions