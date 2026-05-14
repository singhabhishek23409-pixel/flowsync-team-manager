const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();


// MODELS
const Message = require("./models/Message");


// ROUTES
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/teamRoutes");
const userRoutes = require("./routes/userRoutes");


// APP
const app = express();


// HTTP SERVER
const server = http.createServer(app);


// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://daring-youth-production-230b.up.railway.app",
];


// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});


// MIDDLEWARE
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());


// ROUTES
app.use("/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend server is running");
});


// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // JOIN TEAM ROOM
  socket.on("join_team", async (teamId) => {

    try {

      socket.join(teamId);

      console.log(`Joined room: ${teamId}`);

      // LOAD OLD MESSAGES
      const oldMessages = await Message.find({
        teamId,
      }).sort({
        createdAt: 1,
      });

      socket.emit("load_messages", oldMessages);

    } catch (error) {

      console.log(error);

    }

  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    try {

      // SAVE MESSAGE
      const newMessage = await Message.create({
        teamId: data.teamId,
        sender: data.sender,
        text: data.text,
      });

      // MESSAGE OBJECT
      const messagePayload = {
        _id: newMessage._id,
        teamId: newMessage.teamId,
        sender: newMessage.sender,
        text: newMessage.text,
        createdAt: newMessage.createdAt,
      };

      console.log("Broadcasting message:", messagePayload);

      // TEAM CHAT ROOM
      io.to(data.teamId).emit(
        "receive_message",
        messagePayload
      );

      // GLOBAL NOTIFICATION
      io.emit("global_notification", {
        teamId: data.teamId,
      });

    } catch (error) {

      console.log(error);

    }

  });

  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("User disconnected:", socket.id);

  });

});


// DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected");

  })
  .catch((error) => {

    console.log(error);

  });


// SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});