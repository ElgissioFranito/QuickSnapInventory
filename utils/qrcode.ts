import * as Crypto from 'expo-crypto';

export const generateUniqueQRCode = async (): Promise<string> => {
  return await Crypto.randomUUID();
};

export const validateQRCode = (qrCode: string): boolean => {
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(qrCode);
};
