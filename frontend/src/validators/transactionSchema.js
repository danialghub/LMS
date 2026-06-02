import { z } from "zod";

export const cardSchema = z.object({
    cardNumber: z
        .string()
        .min(1, "شماره کارت الزامی است")
        .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "فرمت شماره کارت نامعتبر است (۱۲۳۴ ۵۶۷۸ ۹۰۱۲ ۳۴۵۶)"),

    expiryMonth: z
        .string()
        .min(1, "ماه انقضا الزامی است")
        .regex(/^(0[1-9]|1[0-2])$/, "ماه باید بین 01 تا 12 باشد"),

    expiryYear: z
        .string()
        .min(1, "سال انقضا الزامی است")
        .regex(/^\d{2}$/, "سال باید ۲ رقم باشد")
,

    cvv2: z
        .string()
        .min(1, "رمز CVV2 الزامی است")
        .regex(/^\d{3,4}$/, "رمز CVV2 باید ۳ یا ۴ رقم باشد"),
});
