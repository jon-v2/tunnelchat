import { tunnel } from "cloudflared";
import { error, success, info } from "./utils";

export let stopTunnel;

export const initTunnel = async (port) => {
  info("Starting tunnel...");
  const { url, connections, child, stop } = tunnel({
    "--url": "http://localhost:" + port,
  });

  stopTunnel = stop;

  await url.then((url) => {
    success("Your tunnel is ready!");
    info("Tunnel URL: " + url);
  });

  const conns = await Promise.all(connections);

  process.on("exit", () => {
    error("Stopping tunnel");
    stop();
  });

  child.on("exit", (code) => {
    error("tunnel process exited with code " + code);
  });
};
