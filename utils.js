import colors from "colors";
import readline from "readline";

export const error = (/** @type {string} */ err) => {
  //log error in red
  console.log(`${err}`.red);
};

export const errorDesc = (/** @type {string} */ err) => {
  //log error in red
  console.log(`${err}`.red.italic);
};

export const success = (/** @type {string} */ msg) => {
  //log success in green
  console.log(`${msg}`.green);
};

export const info = (/** @type {string} */ msg) => {
  //log info in blue
  console.log(`${msg}`.blue);
};

export const message = (
  /** @type {string} */ user,
  /** @type {string} */ msg
) => {
  //log name in yellow and message in white
  console.log(`${user}: `.bgBlack.yellow, `${msg}`.white);
};

export const myMessage = (/** @type {string} */ msg) => {
  //log name in green and message in white
  readline.moveCursor(process.stdout, 0, -1);
  console.log(`YOU: `.bgBlack.green, `${msg}`.white);
};

export const commandInfo = (command, nickname) => {
  readline.moveCursor(process.stdout, 0, -1);

  console.log(`${command}`.magenta + (nickname ? ` ${nickname}`.blue : ""));
};

export const titleScreen = () => {
  console.log(" _                          _      _           _   ".rainbow);
  console.log("| |                        | |    | |         | |  ".rainbow);
  console.log("| |_ _   _ _ __  _ __   ___| | ___| |__   __ _| |_ ".rainbow);
  console.log(
    "| __| | | | '_ \\| '_ \\ / _ \\ |/ __| '_ \\ / _` | __|".rainbow
  );
  console.log("| |_| |_| | | | | | | |  __/ | (__| | | | (_| | |_ ".rainbow);
  console.log(
    " \\__|\\__,_|_| |_|_| |_|\\___|_|\\___|_| |_|\\__,_|\\__|".rainbow
  );
};
