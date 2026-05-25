import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connect.js";

await connectDatabase(env.mongodbUri);

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});
