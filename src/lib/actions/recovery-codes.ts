"use server";

import RecoveryCode from "../database/models/recovery-code.model";
import { v4 as uuidv4 } from "uuid";
import User from "../database/models/users.model";
import { connectToDatabase } from "../database/connection/mongoose";

export async function bulkCreateRecoveryCodes(userId: string) {
  try {
    const recoveryCodeData = generateRecoveryCodes(userId);
    await destroyUserExistingRecoveryCodes(userId);
    const recoverCodes = await RecoveryCode.insertMany(recoveryCodeData);
    return recoverCodes;
  } catch (error) {
    throw new Error("Failed to create recover codes");
  }
}

async function destroyUserExistingRecoveryCodes(userId: string) {
  await RecoveryCode.deleteMany({
    userId,
  });
}

export async function getRecoveryCodeById(recoveryCodeId: string) {
  try {
    const recoveryCode = await RecoveryCode.findById(recoveryCodeId);
    if (!recoveryCode) {
      throw new Error("Recovery code not found");
    }
    return recoveryCode;
  } catch (error) {
    throw new Error("Failed to get recovery code");
  }
}

export async function getUserRecoveryCodeByCode(code: string, userId: string) {
  await connectToDatabase();
  const recoveryCode = await RecoveryCode.findOne({
    userId,
    code,
  });

  if (!recoveryCode) {
    return null;
  }
  return recoveryCode;
}

export async function getAllUserRecoveryCodes(userId: string) {
  const results = await RecoveryCode.find({
    userId,
  });

  if (results.length > 0) return results;

  return bulkCreateRecoveryCodes(userId);
}

export async function updateRecoveryCode(
  recoveryCodeId: string,
  updatedData: any
) {
  try {
    const recoveryCode = await RecoveryCode.findById(recoveryCodeId);
    if (!recoveryCode) {
      return;
    }

    await RecoveryCode.findOneAndUpdate({ _id: recoveryCodeId }, updatedData);
  } catch (error) {
    throw new Error("Failed to update recovery code");
  }
}

export async function deleteRecoveryCode(recoveryCodeId: string) {
  const recoveryCode = await RecoveryCode.findById(recoveryCodeId);
  if (!recoveryCode) {
    throw new Error("Recovery code not found");
  }
  await RecoveryCode.deleteOne({
    _id: recoveryCodeId,
  });
}

export async function processRecoveryCodeForSignin(
  email: string,
  code: string
): Promise<boolean> {
  await connectToDatabase();
  const user = await User.findOne({
    email,
  });

  const recoveryCode = await RecoveryCode.findOne({
    userId: user?._id,
    code,
  });

  if (recoveryCode?._id) {
    if (!recoveryCode?.active) {
      // NOTE: This ensures as a singular code cannot be used multiple times, only ONCE.
      await RecoveryCode.findOneAndUpdate(
        { _id: recoveryCode?._id },
        {
          active: true,
        }
      );
    }
  }

  return !recoveryCode?.active;
}

export async function getRecoveryCodeForSignin(
  email: string,
  code: string
): Promise<boolean> {
  await connectToDatabase();
  const user = await User.findOne({
    email,
  });

  const recoveryCode = await RecoveryCode.findOne({
    userId: user?._id,
    code,
  });

  if (!recoveryCode) {
    return false;
  }

  return !recoveryCode?.active;
}

function generateRecoveryCodes(userId: string) {
  const codes = [];
  for (let i = 0; i < 16; i++) {
    codes.push({
      userId,
      code: generateRandomString(),
    });
  }
  return codes;
}

function generateRandomString(): string {
  const uuid = uuidv4().replace(/-/g, ""); // Remove hyphens from UUID
  const formattedUuid = uuid.slice(0, 5) + "-" + uuid.slice(5, 10);
  return formattedUuid;
}
