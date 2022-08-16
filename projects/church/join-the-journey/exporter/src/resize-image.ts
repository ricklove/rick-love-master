import sharp from 'sharp';

export const resizeImage = async (image: ArrayBuffer, width: number): Promise<ArrayBuffer> => {
  const result = await sharp(Buffer.from(image)).rotate().resize(width).jpeg({ mozjpeg: true }).toBuffer();
  return result.buffer;
};
