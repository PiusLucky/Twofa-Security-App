"use server";

import speakeasy from "speakeasy";
import { connectToDatabase } from "../database/connection/mongoose";
import Twofa from "../database/models/twofa.model";
import User from "../database/models/users.model";

export async function generate2fa(
  userId: string
): Promise<{
  description: string;
  secretKey: string;
}> {
  await connectToDatabase();
  // Check if user already have 2FA activated
  const user2fa = await Twofa.findOne({
    userId,
    status: true,
  });

  if (user2fa) {
    throw new Error("User has already enabled two-factor-authentication (2FA)");
  }

  const secret = speakeasy.generateSecret();

  const userUnactivated2fa = await getTwofaByUserId(userId);

  if (userUnactivated2fa) {
    return {
      description: "Scan the QR code below to complete the process",
      secretKey: userUnactivated2fa.secret as string,
    };
  } else {
    await Twofa.create({
      userId,
      secret: secret.base32,
    });
  }

  return {
    description: "Scan the QR code below to complete the process",
    secretKey: secret.base32 as string,
  };
}

export async function verify2fa(userId: string, token: string) {
  await connectToDatabase();
  const user2fa = await Twofa.findOne({
    userId,
    status: { $ne: null },
  });

  if (!user2fa) {
    throw new Error("SecretKey is invalid");
  }

  // Verify the token against the secret
  const verified = await speakEasyVerify(user2fa.secret, token);
  if (!verified) {
    throw new Error("Invalid OTP, try again.");
  }

  await Twofa.findOneAndUpdate(
    { userId },
    {
      secret: user2fa.secret,
      status: true,
    }
  );

  return getTwofaByUserId(userId);
}

export async function verify2faToken(
  userId: string,
  token: string
): Promise<boolean> {
  await connectToDatabase();
  const user2fa = await Twofa.findOne({
    userId,
    status: {
      $ne: null,
    },
  });

  if (!user2fa) {
    throw new Error("SecretKey is invalid");
  }

  // Verify the token against the secret
  const verified = await speakEasyVerify(user2fa.secret, token);
  if (!verified) {
    throw new Error("Invalid OTP, try again.");
  }

  return true;
}

export async function verifyTwofaTokenByEmail(email: string, token: string) {
  await connectToDatabase();

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const user2fa = await Twofa.findOne({
    userId: user._id,
  });

  // Verify the token against the secret
  const verified = await speakEasyVerify(user2fa.secret, token);
  if (!verified) {
    throw new Error("Invalid OTP, try again.");
  }

  return true;
}

export async function delete2fa(userId: string): Promise<boolean> {
  await connectToDatabase();
  const user2fa = await getTwofaByUserId(userId);

  if (!user2fa) {
    throw new Error("You do not have 2FA enabled.");
  }

  await Twofa.deleteOne({
    userId,
  });

  return true;
}

export async function getTwofaByUserId(userId: string) {
  await connectToDatabase();
  return Twofa.findOne({
    userId,
  });
}

export async function getTwofaByEmail(email: string) {
  await connectToDatabase();

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  return Twofa.findOne({
    userId: user._id,
  });
}

export async function getActive2faByUserId(userId: string) {
  await connectToDatabase();
  return Twofa.findOne({
    userId,
    status: true,
  });
}

async function speakEasyVerify(
  secret: string,
  token: string
): Promise<boolean> {
  try {
    await connectToDatabase();
    return speakeasy.totp.verify({
      secret,
      encoding: "base32",
      token,
      window: 2,
    });
  } catch (error) {
    throw new Error(`speakEasyVerify: unable to perform OTP verification`);
  }
}
