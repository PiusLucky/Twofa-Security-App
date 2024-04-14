import {
  bulkCreateRecoveryCodes,
  getAllUserRecoveryCodes,
  getRecoveryCodeForSignin,
} from "@/lib/actions/recovery-codes";
import { error_response, success_response, validateToken } from "@/lib/utils";

//NOTE: BulkCreateRecoveryCodes
export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const twofa = await bulkCreateRecoveryCodes(
      validatedToken?.userId as string
    );

    return success_response(
      twofa,
      "Recovery codes generated successfully",
      201
    );
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: GetRecoveryCodeForSignin
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const recoveryCode = await getRecoveryCodeForSignin(
      body?.email,
      body?.code
    );

    return success_response(
      recoveryCode,
      "Recovery code status fetched successfully",
      200
    );
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: GetAllUserRecoveryCodes
export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const recoveryCodes = await getAllUserRecoveryCodes(
      validatedToken?.userId as string
    );

    return success_response(recoveryCodes, "Recovery codes successfully", 200);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}
