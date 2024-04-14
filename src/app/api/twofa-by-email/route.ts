import { getTwofaByEmail, verifyTwofaTokenByEmail } from "@/lib/actions/twofa";
import { error_response, success_response } from "@/lib/utils";

//NOTE: GetTwofaByEmail
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const twofa = await getTwofaByEmail(body.email as string);

    return success_response(twofa, "Twofa fetched successfully", 200);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}

//NOTE: VerifyTwofaTokenByEmail
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const twofa = await verifyTwofaTokenByEmail(body?.email, body?.token);

    return success_response(twofa, "2fa verified successfully", 201);
  } catch (err) {
    return error_response((err as any)?.message, 400);
  }
}
