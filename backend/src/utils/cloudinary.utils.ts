import '@/config/cloudinary.config';
import { InvalidMimeTypeError } from '@/errors/file.errors';
import { v2 as cloudinary } from 'cloudinary';
import mime from 'mime-types';

export const transformationsAvatar = {
    width: 400,
    height: 400,
    crop: 'thumb',
    gravity: 'face', // Focus on faces if detected
    radius: 'max'    // Apply circular crop for profile avatars
};

export const uploadAvatar = async (
    fileBuffer: Buffer, 
    folder: string, 
    filename: string,
): Promise<string> => {
    const mimeType = mime.lookup(filename);
    if (!mimeType || !mimeType.startsWith('image/')) {
        throw new InvalidMimeTypeError();
    }
    
    // Convert the buffer to Base64 and create a Data URI
    const base64String = fileBuffer.toString('base64');
    const dataUri = `data:${mimeType};base64,${base64String}`;

    // Upload to Cloudinary with transformations
    const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        transformation: [
            { ...transformationsAvatar }, // Apply transformations
            { quality: 'auto', fetch_format: 'auto' }, // Optimize image quality and format automatically
        ],
    });

    return result.secure_url;
};