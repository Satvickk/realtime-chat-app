# Real-Time Chat Application

This is a full-stack real-time chat application built using **React.js**, **Node.js**, **Express**, and **Socket.IO**. It enables users to exchange messages in real-time with a simple UI and responsive design.

---

## Project Structure

/real-time-chat-app 
│
├── backend # Node.js + Express server with Socket.IO 
├── frontend # React client app using Socket.IO client 
├── README.md 



---

## Features

- Real-time messaging using WebSockets (Socket.IO)
- Responsive chat UI (mobile & desktop)
- Chat history retention during session
- Auto-scroll to latest message
- User identification via `localStorage`
- Clean, scalable code structure

---

## Technologies Used

**Frontend**
- React.js
- Tailwind CSS
- Socket.IO-client

**Backend**
- Node.js
- Express
- Socket.IO

---

## Setup Instructions

### Prerequisites
Make sure you have Node.js and npm installed.

---

### 1. Backend Setup

```bash
cd backend
npm install
node index.js
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Architecture

## `ARCHITECTURE.md` (Product & Flow Document)

```md
# Architecture & Flow - Real-Time Chat Application

## 🧩 Overview

This application is a real-time messaging platform that connects multiple users and allows them to communicate instantly. It is built with a modular full-stack setup using WebSockets to achieve live message delivery.

---

## ⚙️ Backend - Node.js + Socket.IO

- Built with **Express.js**
- Handles WebSocket connections using **Socket.IO**
- Emits and receives messages via socket events
- Stores temporary message history in-memory (array)
- On new connection:
  - Sends chat history to the new user
- On message received:
  - Broadcasts message to all connected clients

**Key socket events:**

| Event            | Description                    |
|------------------|--------------------------------|
| `connection`     | Triggered when a user connects |
| `chat-history`   | Emits existing chat history    |
| `send-message`   | Receives new message from client |
| `receive-message`| Broadcasts new message to all clients |

---

## 🖥️ Frontend - React + Tailwind + Socket.IO-client

- React manages the chat UI and state
- Uses `socket.io-client` to connect to backend
- Stores and displays chat messages
- Messages are shown with:
  - Sender name
  - Timestamp
  - Message bubble styling
- Auto-scrolls to the latest message
- Uses `localStorage` to track current user

---

## 🔁 Data Flow

```plaintext
1. User sends message → frontend emits `send-message`
2. Backend receives it → broadcasts `receive-message`
3. All clients listen → update UI in real-time
```