import { app } from "./app";
import { env } from "./env/env";

app.listen(Number(env.PORT), () => {
  console.log(`Property service is running on port ${env.PORT}`);
});
