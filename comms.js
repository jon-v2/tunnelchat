import { error, info, success } from "./utils.js";
import { initTunnel, stopTunnel } from "./tunnel.js";

export const approve = (
  nickname,
  socket,
  pendingConnections,
  connectedUsers
) => {
  if (socket) {
    success(`User ${nickname} approved`);
    socket.emit("approved", nickname); // Pass the nickname back to the client for approved event
    pendingConnections.delete(nickname);
    connectedUsers.set(nickname, socket);
  } else {
    error(`No user with nickname ${nickname}`);
  }
};

export const deny = (nickname, socket, pendingConnections) => {
  if (socket) {
    socket.emit("denied");
    error(`User ${nickname} denied`);
    socket.disconnect(true);
    pendingConnections.delete(nickname);
  } else {
    error(`No user with nickname ${nickname}`);
  }
};

export const kick = (nickname, socket, connectedUsers) => {
  if (socket) {
    socket.emit("denied");
    error(`User ${nickname} kicked`);
    socket.disconnect(true);
    connectedUsers.delete(nickname);
  } else {
    error(`No user with nickname ${nickname}`);
  }
};

export const list = (connectedUsers) => {
  info("Connected users:");
  info([...connectedUsers.keys()].join("\n"));
};

export const tunnel = (isTunneling, port) => {
  isTunneling
    ? console.log("Already tunneling")
    : initTunnel(port).then(() => (isTunneling = true));
};

export const endTunnel = (isTunneling) => {
  if (!isTunneling) {
    error("Not tunneling");
    return;
  }
  stopTunnel();
  isTunneling = false;
};
