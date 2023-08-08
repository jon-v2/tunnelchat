import { program } from "commander";
import { client } from "./client.js";
import { server } from "./server.js";

program
  .command("start")
  .requiredOption("-p, --port <port>", "Specify the server port")
  .action((options) => {
    server(options);
  });

program
  .command("connect")
  .requiredOption("-n, --name <name>", "Specify your nickname")
  .requiredOption("-u, --url <url>", "Specify the server URL")
  .action((options) => {
    client(options);
  });

program.parse(process.argv);
