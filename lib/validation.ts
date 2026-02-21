import { z } from "zod";

export const regionOptions = ["MENA", "EU", "NA", "ASIA"] as const;
export const rankOptions = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Crown",
  "Ace",
  "Conqueror",
] as const;
export const roleOptions = [
  "IGL",
  "Entry",
  "Support",
  "Sniper",
  "Flex",
] as const;
export const contactOptions = ["WhatsApp", "Telegram"] as const;

const optionalField = z.string().trim().max(180, "القيمة طويلة جدًا").optional().or(z.literal(""));

export const applicationFormSchema = z
  .object({
    inGameName: z
      .string()
      .trim()
      .min(2, "يرجى إدخال اسم داخل اللعبة")
      .max(50, "اسم اللعبة طويل جدًا"),
    playerId: z
      .string()
      .trim()
      .regex(/^\d+$/, "رقم اللاعب يجب أن يحتوي أرقامًا فقط")
      .min(5, "رقم اللاعب قصير جدًا")
      .max(20, "رقم اللاعب طويل جدًا"),
    region: z.enum(regionOptions),
    age: z
      .number()
      .int("العمر يجب أن يكون رقمًا صحيحًا")
      .min(16, "العمر يجب أن يكون 16 أو أكثر")
      .max(80, "العمر غير صالح"),
    currentRank: z.enum(rankOptions),
    kd: z
      .number()
      .min(0, "KD لا يمكن أن تكون أقل من 0")
      .max(50, "KD لا يمكن أن تتجاوز 50"),
    roles: z.array(z.enum(roleOptions)).min(1, "اختر دورًا واحدًا على الأقل"),
    availability: z
      .string()
      .trim()
      .min(3, "يرجى توضيح أوقات التفرغ")
      .max(250, "النص طويل جدًا"),
    previousExperience: z
      .string()
      .trim()
      .min(8, "يرجى إضافة خبرتك السابقة")
      .max(1000, "الوصف طويل جدًا"),
    contactMethod: z.enum(contactOptions),
    whatsappNumber: optionalField,
    telegramUsername: optionalField,
    discord: optionalField,
    notes: z.string().trim().max(1000, "الملاحظات طويلة جدًا").optional().or(z.literal("")),
  })
  .superRefine((values, ctx) => {
    if (values.contactMethod === "WhatsApp") {
      const phone = values.whatsappNumber?.trim() ?? "";
      if (!phone) {
        ctx.addIssue({
          code: "custom",
          message: "رقم الواتساب مطلوب",
          path: ["whatsappNumber"],
        });
      } else if (!/^[+]?[\d\s-]{8,20}$/.test(phone)) {
        ctx.addIssue({
          code: "custom",
          message: "صيغة رقم الواتساب غير صحيحة",
          path: ["whatsappNumber"],
        });
      }
    }

    if (values.contactMethod === "Telegram") {
      const username = values.telegramUsername?.trim() ?? "";
      if (!username) {
        ctx.addIssue({
          code: "custom",
          message: "اسم مستخدم التليجرام مطلوب",
          path: ["telegramUsername"],
        });
      } else if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(username)) {
        ctx.addIssue({
          code: "custom",
          message: "اسم مستخدم التليجرام غير صحيح",
          path: ["telegramUsername"],
        });
      }
    }
  });

export const applicationSubmissionSchema = applicationFormSchema.extend({
  agreedToRules: z.boolean().refine((value) => value, {
    message: "يجب الموافقة على القواعد قبل التقديم",
  }),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type ApplicationSubmissionValues = z.infer<typeof applicationSubmissionSchema>;
