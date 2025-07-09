# 🛠️ Public Utility Request Management System

A full-stack web application that allows users to submit service requests for public utilities (e.g., water, electricity, waste management), and enables administrators to manage, track, and resolve those requests.

---

## 📌 Features

- ✅ User registration and login (with role-based access)
- ✅ Submit and track service requests
- ✅ Admin dashboard to filter, sort, and update request statuses
- ✅ Delete functionality for users (only on pending/in-progress requests)
- ✅ Status filtering, date filtering, pagination
- ✅ Spring Boot & MySQL backend, React frontend
- ✅ Authentication with Spring Security (HTTP Basic)

---

## 🔧 Technologies Used

### ⚙ Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- Lombok

### 💻 Frontend

- React.js
- Axios
- Tailwind CSS
- React Toastify
- Day.js

---

## 🗂️ Project Structure

```
public-utility-request-system/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── utility/
│   │       │           └── requestmanager/
│   │       │               ├── controller/
│   │       │               ├── model/
│   │       │               ├── repository/
│   │       │               ├── service/
│   │       │               └── config/
│   │       └── resources/
│   │           └── application.properties
├── request-manager-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   ├── tailwind.config.js
│   ├── public/
│   └── package.json
```

---

## 🚀 Getting Started

### 🔙 Backend Setup

1. **Navigate to the backend directory**  
   ```bash
   cd backend
   ```

2. **Create a MySQL database named `utility_db`**  
   Update the following credentials in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/utility_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

3. **Run the Spring Boot application**  
   Either using an IDE (like IntelliJ) or command line:
   ```bash
   ./mvnw spring-boot:run
   ```

✅ The backend will run at: `http://localhost:8080`

> 🔐 **Important:** When the backend runs for the first time, you must manually insert an **Admin user** in the database with the role `ROLE_ADMIN`.



### 🌐 Frontend Setup

1. **Navigate to the frontend directory**  
   ```bash
   cd request-manager-frontend
   ```

2. **Install frontend dependencies**  
   ```bash
   npm install
   ```

3. **Start the frontend server**  
   ```bash
   npm start
   ```

✅ The frontend will run at: `http://localhost:3000`

> 🧑‍💻 Users can self-register through the frontend UI and are assigned the role `ROLE_USER`.

---

## 👤 User Roles

### 👩‍💻 User

- Register and login
- Submit service requests
- View submitted requests
- Delete request (if status is `PENDING`, `IN_PROGRESS`, or `ON_HOLD`)

### 👨‍💼 Admin

- Login using DB-created credentials
- View all requests from all users
- Filter and sort requests
- Update request statuses
- Cannot delete requests

---

## 🏗️ Architecture Overview

```
             +----------------------+
             |   React Frontend    |
             +----------+----------+
                        |
                        | Axios HTTP Requests
                        |
             +----------v----------+
             | Spring Boot Backend |
             +----------+----------+
                        |
                 +------v------+ 
                 |   MySQL DB  |
                 +-------------+
```

---

## 🔄 Data Flow

- User fills request form (category, description)
- Frontend sends data to backend via POST `/api/requests`
- Backend stores request with metadata (`createdBy`, `createdAt`)
- Admin updates status → `updatedAt` is automatically updated
- UI fetches data based on role and displays dashboards

---

## 📡 API Endpoints

### 🔐 Auth

- `POST /api/users/register` — Register new user
- `GET /api/users/login` — Login with HTTP Basic Auth

### 👩‍💻 User APIs

- `POST /api/requests` — Submit request
- `GET /api/user/requests` — View own requests
- `DELETE /api/requests/{id}` — Delete own request (if allowed)

### 👨‍💼 Admin APIs

- `GET /api/requests` — Get all requests
- `PUT /api/requests/{id}/status?status=...` — Update request status

---

## 🔐 Authentication

- Spring Security with HTTP Basic Auth
- Passwords stored using BCrypt
- Role-based access:
  - `ROLE_USER` – via frontend registration
  - `ROLE_ADMIN` – inserted manually into DB

---

## 🧪 Sample Users

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| User  | user1    | user123   |

> ⚠️ Admin user will be automatically created in DB with encrypted password and `ROLE_ADMIN`.

---

## 🙋‍♀️ Contact

Feel free to open issues or submit pull requests on the GitHub repository.
