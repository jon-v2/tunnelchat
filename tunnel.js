import { tunnel } from "cloudflared";

export let stopTunnel;

export const initTunnel = async (port) => {
  const { url, connections, child, stop } = tunnel({
    "--url": "http://localhost:" + port,
  });

  stopTunnel = stop;

  console.log("LINK:", await url);

  const conns = await Promise.all(connections);

  console.log("Connections Ready!", conns);

  process.on("exit", () => {
    console.log("Stopping tunnel");
    stop();
  });

  child.on("exit", (code) => {
    console.log("tunnel process exited with code", code);
  });
};
