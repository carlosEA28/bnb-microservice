import { app } from "./app";
import { env } from "./env/env";

app.listen(env.PORT, () => {
  console.log(`Webhooks service is running on port ${env.PORT}`);
});
