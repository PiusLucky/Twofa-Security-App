import {
  delete2fa,
  generate2fa,
  getTwofaByUserId,
  verify2fa,
} from "@/lib/actions/twofa";
import { error_response, success_response, validateToken } from "@/lib/utils";

//NOTE: Generate2fa
export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const twofa = await generate2fa(validatedToken?.userId as string);

    return success_response(twofa, "2fa generated successfully", 201);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: Verify2fa
export async function PUT(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const body = await req.json();

    const twofa = await verify2fa(
      validatedToken?.userId as string,
      body?.token
    );

    return success_response(twofa, "2fa verified successfully", 201);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: Get2faByUserId
export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const twofa = await getTwofaByUserId(validatedToken?.userId as string);

    return success_response(twofa, "Twofa fetched successfully", 200);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: Delete2fa
export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("Authorization");

    const validatedToken = await validateToken(token);

    const twofa = await delete2fa(validatedToken?.userId as string);

    return success_response(twofa, "2fa deleted successfully", 201);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}
