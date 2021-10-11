import express from "express";
var jwt = require("express-jwt");
import asyncHandler from "express-async-handler";
import { checkSchema } from "express-validator";
import { sign } from "jsonwebtoken";
import { validateParams } from "../middlewares/routeValidation.middleware";
import { ApiError } from "../utils/ApiError";
import * as userController from "../models/user.model";

const userData = {
  role: "SUPER_ADMIN",
  email: "super_admin@nextlevel.com",
  name: "Admin",
};

export const userRoutes = express();

userRoutes.post(
  "/login",
  validateParams(
    checkSchema({
      email: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      password: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
    })
  ),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email != "info@nextlevelfootballtraining.co.uk")
      throw new ApiError("Wrong email or password");
    if (password != "Adminpassword10")
      throw new ApiError("Wrong email or password");

    var token = sign(userData, process.env.JWT_SECRET || "aa", {
      expiresIn: "9999 years",
    });
    res.send({ ...userData, token });
  })
);

userRoutes.get(
  "/find/:type?",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    const users = await userController.getUsers();
    res.send(users);
  })
);

userRoutes.delete(
  "/delete",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    await userController.deleteUser(req.body.id);
    res.send({ usccess: "User deleted" });
  })
);

userRoutes.post(
  "/verify",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    await userController.setVerify(
      req.body.id,
      req.body.isVerified,
      req.body.entity
    );
    res.send({ usccess: "User deleted" });
  })
);

userRoutes.get(
  "/get",
  jwt({ secret: process.env.JWT_SECRET || "aa", algorithms: ["HS256"] }),
  asyncHandler(async (req, res) => {
    res.send(userData);
  })
);

userRoutes.post(
  "/create",
  validateParams(
    checkSchema({
      fullName: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      mobileNo: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      address: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      state: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      deviceType: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      emailID: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isEmpty: {
          errorMessage: "Missing field",
          negated: true,
        },
        trim: true,
      },
      role: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        isIn: {
          options: [["Coach", "Player"]],
          errorMessage: "Role must one one of: Coach, Role",
        },
        trim: true,
      },
      lat: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
      lng: {
        in: ["body"],
        exists: {
          errorMessage: "Missing field",
        },
        trim: true,
      },
    })
  ),
  asyncHandler(async (req, res) => {
    const userParams: userController.CreateUserParams = {
      FullName: req.body.fullName,
      Address: req.body.address,
      DeviceType: req.body.deviceType,
      EmailID: req.body.emailID,
      MobileNo: req.body.mobileNo,
      Role: req.body.role,
      Lat: req.body.lat,
      Lng: req.body.lng,
      State: req.body.state,
    };
    const user = await userController.saveUser(userParams);
    if (user === null) {
      throw new ApiError("Could not create user");
    }
    res.send(user);
  })
);
