"use server";

import { connectToDatabase } from "../database/connection/mongoose";
import { handleError } from "../utils";
import User from "../database/models/users.model";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import { CreateUserParams, UpdateUserParams } from "@/types";
import { processRecoveryCodeForSignin } from "./recovery-codes";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      handleError("User with this email already exists");
    }

    user["password"] = await hash(user.password, 10);

    const newUser = await User.create(user);

    return newUser;
  } catch (error) {
    handleError(error);
  }
}

export async function loginUser(email: string, password: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      handleError("Invalid email");
    }

    const validRecoveryCode = await processRecoveryCodeForSignin(
      email,
      password
    );

    console.log("🚀 ~ loginUser ~ validRecoveryCode:", validRecoveryCode);

    if (validRecoveryCode) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "3h",
      });

      return { token };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user?.password as string
    );

    if (!passwordMatch) {
      handleError("Invalid Credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "3h",
    });

    return { token };
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(
  userId: string,
  user: Partial<UpdateUserParams>
) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ _id: userId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}
