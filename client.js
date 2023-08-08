import { io } from "socket.io-client";
import readline from "readline";
import {
  error,
  info,
  myMessage,
  success,
  message,
  errorDesc,
} from "./utils.js";

export const client = (options) => {
  if (!options.url) {
    error("Please specify a server URL");
    process.exit(1);
  }

  if (!options.name) {
    error("Please specify a nickname");
    process.exit(1);
  }

  options.name = options.name.toUpperCase();

  const url = options.url;
  const socket = io(url, { autoConnect: false, timeout: 5000 });

  info("Connecting to " + url + "...");

  socket.on("connect_error", (err) => {
    errorDesc(err.message);
    process.exit(1);
  });

  const _connect = (url) => {
    success("Connected to " + url);
    info("Awaiting approval from host...");
  };

  const _approve = (socket, nickname) => {
    success("You have been approved by the server");

    //@ts-ignore
    socket.nickname = nickname;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => {
      myMessage(input);
      //@ts-ignore
      socket.emit("chat message", input);
    });

    rl.on("close", () => {
      socket.disconnect();
      process.exit(0);
    });
  };

  const _deny = (socket) => {
    error("You have been denied/kicked by the server :(");
    socket.disconnect();
    process.exit(0);
  };

  const _message = (socket, msg) => {
    // console.log(msg.name, socket.nickname);
    //@ts-ignore
    if (msg.name === socket.nickname) {
      return;
    }
    message(msg.name, msg.message);
  };

  // socket event listeners
  socket.on("connect", () => _connect(url));
  socket.on("approved", (nickname) => _approve(socket, nickname));
  socket.on("denied", () => _deny(socket));
  socket.on("chat message", (msg) => _message(socket, msg));

  socket.on("disconnect", () => {
    error("Disconnected from server");
    process.exit(0);
  });

  socket.open();
  socket.emit("nickname", options.name);
};
