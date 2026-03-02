import { app } from "./app";
import { env } from "./env/env";

app.listen(env.PORT, () => {
  console.log("Auth service is running on port 3000");
});
