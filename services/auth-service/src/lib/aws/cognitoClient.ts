import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { env } from "../../env/env";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
