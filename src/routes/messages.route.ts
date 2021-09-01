import express from "express";
var jwt = require("express-jwt");
import asyncHandler from "express-async-handler";
import { getMessages } from "../models/messages.model";

export const messagesRoutes = express();

messagesRoutes.get(
  "/find",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    const users = await getMessages();
    res.send(users);
  })
);
