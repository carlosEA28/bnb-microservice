import { app } from "./app";
import { env } from "./env/env";

app.listen(env.PORT, () => {
  console.log(`Booking service is running on port ${env.PORT}`);
});
