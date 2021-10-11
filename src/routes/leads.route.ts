import express from "express";
var jwt = require("express-jwt");
import asyncHandler from "express-async-handler";
import { checkSchema } from "express-validator";
import { Binary } from "mongodb";
import { validateParams } from "../middlewares";
import {
  getHistory,
  createLead,
  LeadCreationParams,
} from "../models/lead.model";
import { CreateUserParams, findOne, saveUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import {
  startTransaction,
  finishTransaction,
  abortTransaction,
} from "../utils/DB";

export const leadsRoutes = express();

leadsRoutes.get(
  "/find",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    const users = await getHistory();
    res.send(users);
  })
);

export interface Lead {
  UserId: string;
}

leadsRoutes.post(
  "/create",
  validateParams(
    checkSchema({
      experience: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      age: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      maximumPrice: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      "coachingType.*": {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      "days.*": {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      "coachingTime.*": {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      "daysOfWeek.*": {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      web: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isBoolean: {
          errorMessage: "Must be Boolean",
        },
        trim: true,
      },
      userId: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
    })
  ),
  asyncHandler(async (req, res) => {
    const user = await findOne({ id: req.body.userId });
    if (!user) throw new ApiError("User not found");

    const leadParams: LeadCreationParams = {
      FullName: user.FullName,
      EmailID: user.EmailID,
      MobileNo: user.MobileNo,
      Location: req.body.location,
      Experience: req.body.experience,
      Age: req.body.age,
      MaximumPrice: req.body.maximumPrice,
      CoachingType: req.body.coachingType,
      Days: req.body.days,
      CoachingTime: req.body.coachingTime,
      DaysOfWeek: req.body.daysOfWeek,
      Web: req.body.web,
      UserId: user._id,
    };
    const users = await createLead(leadParams);
    res.send(users);
  })
);
