import { Server } from "./network/server";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT || isNaN(Number(process.env.PORT))) {
  throw new Error(
    `PORT environment variable is not properly set, current value: ${process.env.PORT}`,
  );
} else {
  new Server(Number(process.env.PORT));
}
