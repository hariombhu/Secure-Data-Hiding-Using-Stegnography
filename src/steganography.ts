import CryptoJS from 'crypto-js';

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const encryptMessage = (message: string, password: string): string => {
  return CryptoJS.AES.encrypt(message, password).toString();
};

const decryptMessage = (encrypted: string, password: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, password);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const encodeMessage = async (
  imageSrc: string,
  message: string,
  password: string
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Encrypt the message
  const encryptedMessage = encryptMessage(message, password);
  const binaryMessage = encryptedMessage.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');

  if (binaryMessage.length * 3 > data.length) {
    throw new Error('Message is too long for this image');
  }

  // Hide the message length at the start
  const messageLengthBinary = binaryMessage.length.toString(2).padStart(32, '0');
  
  let bitIndex = 0;

  // Hide message length
  for (let i = 0; i < 32; i++) {
    const bit = parseInt(messageLengthBinary[i]);
    data[i * 4] = (data[i * 4] & 254) | bit;
  }

  // Hide the message
  for (let i = 0; i < binaryMessage.length; i++) {
    const bit = parseInt(binaryMessage[i]);
    const position = (i + 32) * 4;
    data[position] = (data[position] & 254) | bit;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};

export const decodeMessage = async (
  imageSrc: string,
  password: string
): Promise<string> => {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Extract message length
  let messageLengthBinary = '';
  for (let i = 0; i < 32; i++) {
    messageLengthBinary += data[i * 4] & 1;
  }
  const messageLength = parseInt(messageLengthBinary, 2);

  // Extract the message
  let binaryMessage = '';
  for (let i = 0; i < messageLength; i++) {
    const position = (i + 32) * 4;
    binaryMessage += data[position] & 1;
  }

  // Convert binary to text
  const encryptedMessage = binaryMessage.match(/.{8}/g)?.map(byte => 
    String.fromCharCode(parseInt(byte, 2))
  ).join('');

  if (!encryptedMessage) {
    throw new Error('No message found in image');
  }

  try {
    return decryptMessage(encryptedMessage, password);
  } catch (error) {
    throw new Error('Invalid password or corrupted message');
  }
};