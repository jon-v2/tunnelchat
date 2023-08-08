import { Server } from "socket.io";
import readline from "readline";
import * as comms from "./comms.js";
import {
  error,
  success,
  info,
  message,
  myMessage,
  commandInfo,
} from "./utils.js";

export const server = (options) => {
  const port = options.port || 3000;
  const serverIO = new Server(port);
  const pendingConnections = new Map();
  const connectedUsers = new Map();

  let isTunneling = false;

  info(`Server started on port ${port}`);

  const _nickname = (socket, nickname) => {
    if (!nickname) {
      socket.disconnect(true);
      error("A user tried to connect without a nickname");
    } else if (
      connectedUsers.has(nickname) ||
      pendingConnections.has(nickname)
    ) {
      socket.disconnect(true);
      info(`Nickname ${nickname} is already in use`);
    } else {
      info(`User ${nickname} is trying to connect`);
      pendingConnections.set(nickname, socket);
    }
  };

  const _disconnect = (socket) => {
    const nickname = [...pendingConnections.entries()].find(
      ([name, s]) => s.id === socket.id
    )?.[0];
    if (nickname) {
      pendingConnections.delete(nickname);
      info(`User ${nickname} disconnected`);
    }
  };

  const _approve = (socket, nickname) => {
    success(`User ${nickname} approved`);
    pendingConnections.delete(nickname);
    connectedUsers.set(nickname, socket); // Store the connected user's socket reference
    socket.broadcast.emit(
      "chat message",
      `User ${nickname} has joined the chat.`
    );
  };

  const _message = (socket, msg) => {
    const senderNickname = [...connectedUsers.entries()].find(
      ([name, s]) => s.id === socket.id
    )?.[0];

    if (senderNickname) {
      message(senderNickname, msg);
      serverIO.emit("chat message", { name: senderNickname, message: msg }); // Broadcast to all clients, including the sender
    }
  };

  // socket event listeners
  serverIO.on("connection", (socket) => {
    socket.on("nickname", (nickname) => _nickname(socket, nickname));
    socket.on("disconnect", () => _disconnect(socket));
    socket.on("approved", (nickname) => _approve(socket, nickname));
    socket.on("chat message", (msg) => _message(socket, msg));
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (input) => {
    let parts;
    let command;
    let nickname;

    if (input.startsWith("/")) {
      parts = input.split(" ");
      command = parts[0];
      parts.length > 1 && (nickname = parts[1].toUpperCase());
      commandInfo(command, nickname);
    } else {
      myMessage(input);
      serverIO.emit("chat message", { name: "HOST", message: input });
      return;
    }

    // Handle commands
    switch (command) {
      case "/approve": {
        comms.approve(
          nickname,
          pendingConnections.get(nickname),
          pendingConnections,
          connectedUsers
        );
        break;
      }
      case "/deny": {
        comms.deny(
          nickname,
          pendingConnections.get(nickname),
          pendingConnections
        );
        break;
      }
      case "/kick": {
        comms.kick(nickname, connectedUsers.get(nickname), connectedUsers);
        break;
      }
      case "/list": {
        comms.list(connectedUsers);
        break;
      }
      case "/tunnel": {
        comms.tunnel(isTunneling, port);
        break;
      }
      case "/stoptunnel": {
        comms.endTunnel(isTunneling);
        break;
      }
      default: {
        error("Unknown command");
        break;
      }
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
};
