import crypto from "crypto";

export const PORT = process.env.PORT || 5555;

export const mongoDBURL =
  "mongodb+srv://narayananabhiram:AuthenticationAPI@authenticationapiabhira.rifttpx.mongodb.net/AuthenticationAPICollection?retryWrites=true&w=majority&appName=AuthenticationAPIAbhiramN";

const secretKey = crypto.randomBytes(32).toString("hex");

export const JWT_SECRET = secretKey;
