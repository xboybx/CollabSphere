# CollabSphere - Create Dev Projects with Prompts

CollabSphere is a collaborative development platform designed to help developers connect, create projects, and work together efficiently. It integrates AI capabilities within a group chat environment to assist developers in their tasks and its a Mini bolt.new.


[Click to view the project](https://collabsphere-client.onrender.com)
## Key Features
of the App`
- **User Authentication**: Allows users to register, log in, and log out securely.
- **Project Management**: Users can create and manage their projects within the platform.
- **Real-time Group Chat**: Facilitates real-time communication among developers working on the same project.
- **AI Integration**: Provides AI assistance in the chat to help developers with coding and project-related queries.
- **In-browser Code Execution**: Uses WebContainer API to enable code execution directly in the browser (frontend).

## Project Structure

The project is divided into two main parts:

1. **Frontend (React)**
2. **Backend (Express.js)**

### Frontend

Located in the `frontend` directory, the frontend is built with React and uses Vite as the build tool.

#### Key Technologies and Libraries

- **React**: A JavaScript library for building user interfaces.
- **React Router**: For navigation between different sections of the application.
- **Socket.IO Client**: For real-time communication.
- **Axios**: For making HTTP requests to the backend API.
- **Tailwind CSS**: For styling the application.
- **@webcontainer/api**: For in-browser code execution.

#### Main Components

- **Authentication**: Handles user registration, login, and logout.
- **Project Dashboard**: Displays a list of projects and allows users to create new projects.
- **Chat Interface**: Provides real-time group chat functionality with AI integration.
- **Code Editor**: Allows users to write and execute code snippets directly in the browser.

### Backend

Located in the `backend` directory, the backend is built with Express.js and uses MongoDB as the database.

#### Key Technologies and Libraries

- **Express.js**: A web application framework for Node.js.
- **MongoDB**: A NoSQL database for storing user and project data.
- **Mongoose**: An ORM for MongoDB.
- **Socket.IO**: For real-time communication.
- **JWT**: For secure user authentication.
- **bcrypt**: For hashing passwords.
- **Google's Generative AI**: For AI integration in the chat.

#### Main Components

- **User Authentication**: Provides endpoints for user registration, login, and logout.
- **Project Management**: Provides endpoints for creating and managing projects.
- **Chat Functionality**: Provides real-time chat capabilities using Socket.IO.
- **AI Integration**: Integrates Google's Generative AI to assist developers in the chat.

