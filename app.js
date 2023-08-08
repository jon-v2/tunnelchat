import { program } from "commander";
import { client } from "./client.js";
import { server } from "./server.js";
import { titleScreen } from "./utils.js";

/*
 _                          _      _           _
| |                        | |    | |         | |
| |_ _   _ _ __  _ __   ___| | ___| |__   __ _| |_
| __| | | | '_ \| '_ \ / _ | |/ __| '_ \ / _` | __|
| |_| |_| | | | | | | |  __| | (__| | | | (_| | |_
\__|\__,_|_| |_|_| |_|\___|_|\___|_| |_|\__,_|\__|
*/

program
  .command("start")
  .requiredOption("-p, --port <port>", "Specify the server port")
  .action((options) => {
    titleScreen();
    server(options);
  });

program
  .command("connect")
  .requiredOption("-n, --name <name>", "Specify your nickname")
  .requiredOption("-u, --url <url>", "Specify the server URL")
  .action((options) => {
    titleScreen();
    client(options);
  });

program.parse(process.argv);
