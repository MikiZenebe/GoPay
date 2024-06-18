import { Request, Response } from "express";
import zod from "zod";
import { ResponseStatus } from "../types/statusCode";
import { User } from "../models/userModel";
import { Account } from "../models/accountModel";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import bcrypt from "bcrypt";

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

//Signup
export const signup = async (req: Request, res: Response) => {
  const { success } = signupBody.safeParse(req.body);

  if (!success) {
    return res.status(ResponseStatus.InputError).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  }).select("-password");

  if (existingUser) {
    return res.status(ResponseStatus.InputError).json({
      message: "Email already taken",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    username: req.body.username,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;

  //creating a new account
  const acc = await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId,
    },
    env.JWT_SECRET
  );
  console.log(token);
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(ResponseStatus.Success)
    .json({
      message: "User created successfully!",
      token: token,
      balance: acc.balance,
    });
};

//signin
export const signin = async (req: Request, res: Response) => {
  const { success } = signinBody.safeParse(req.body);
  try {
    if (!success) {
      return res.status(ResponseStatus.InputError).json({
        message: "Incorrect Inputs",
      });
    }

    const user = await User.findOne({
      username: req.body.username,
    }).select("-password");
    if (!user) {
      return res.status(ResponseStatus.Error).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        env.JWT_SECRET
      );
      console.log(token);
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(ResponseStatus.Success).json({
        token: token,
        message: "Login successful",
      });
    }

    return res.status(ResponseStatus.Error).json({
      message: "Incorrect Password",
    });
  } catch (error) {
    res.status(ResponseStatus.Error).json({
      message: "Error while logging in!",
    });
  }
};
