/**
 * Builds GREEN-API chatId for sending by recipient phone: `79991234567@c.us`.
 */
export function phoneToChatId(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    throw new Error("Укажите номер телефона");
  }

  let national: string;
  if (digits.length === 11 && digits.startsWith("8")) {
    national = `7${digits.slice(1)}`;
  } else if (digits.length === 11 && digits.startsWith("7")) {
    national = digits;
  } else if (digits.length === 10) {
    national = `7${digits}`;
  } else {
    national = digits;
  }

  return `${national}@c.us`;
}
