import type { PersistedApplication } from "@/lib/storage";

const buildTelegramMessage = (application: PersistedApplication) => {
  const contactValue =
    application.contactMethod === "WhatsApp"
      ? application.whatsappNumber ?? "-"
      : application.telegramUsername ?? "-";

  return [
    "🔥 New Titan Core Application",
    `Name: ${application.inGameName}`,
    `Player ID: ${application.playerId}`,
    `Age: ${application.age}`,
    `Rank: ${application.currentRank}`,
    `KD: ${application.kd}`,
    `Role: ${application.roles.join(", ")}`,
    `Server: ${application.region}`,
    `Contact Method: ${application.contactMethod}`,
    `WhatsApp/Telegram: ${contactValue}`,
    `Availability: ${application.availability}`,
    `Previous Experience: ${application.previousExperience}`,
    `Discord: ${application.discord ?? "-"}`,
    `Notes: ${application.notes ?? "-"}`,
    `CreatedAt: ${application.createdAt.toISOString()}`,
  ].join("\n");
};

export const sendTelegramNotification = async (application: PersistedApplication) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { success: false, skipped: true, reason: "Missing Telegram credentials" };
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const text = buildTelegramMessage(application);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Telegram API error (${response.status}): ${details}`);
  }

  return { success: true };
};
