import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { saveApplication } from "@/lib/storage";
import { sendTelegramNotification } from "@/lib/telegram";
import { applicationSubmissionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = applicationSubmissionSchema.parse(body);
    const application = await saveApplication(validated);

    try {
      await sendTelegramNotification(application);
    } catch (telegramError) {
      console.error("Telegram notification failed:", telegramError);
    }

    return NextResponse.json({
      success: true,
      id: application.id,
      message: "Application saved successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Malformed JSON payload",
        },
        { status: 400 },
      );
    }

    console.error("Application submission failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.",
      },
      { status: 500 },
    );
  }
}
