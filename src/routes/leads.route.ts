import express from "express";
var jwt = require("express-jwt");
import asyncHandler from "express-async-handler";
import { getHistory } from "../models/lead.model";

export const leadsRoutes = express();

leadsRoutes.get(
  "/find",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    const users = await getHistory();
    res.send(users);
  })
);
