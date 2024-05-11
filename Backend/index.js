require('dotenv').config();
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import profileRoute from "./routes/profileRoute.js"
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';

const app = express();

app.use(session({
  secret: 'abhiram_authentication_api',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if your using https
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  },
  store: MongoStore.create({ mongoUrl: mongoDBURL }) // use connect-mongo to persist sessions
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // replace with the origin of your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.get("/", (request, response) => {
  console.log(request);
  return response
    .status(200)
    .send("Welcome to Enhanced Authentication API - Abhiram N");
});

app.use("/auth", authRoute);
app.use("/profile", profileRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to Database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
