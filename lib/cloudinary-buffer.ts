// lib/cloudinary-buffer.ts
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
    success: boolean;
    uploadedUrls: string[];
    publicIds: string[];
    failedFile?: string;
    error?: string;
}

interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    format: string;
    resource_type: string;
}

/**
 * Upload a single file buffer to Cloudinary
 */
async function uploadBufferToCloudinary(
    buffer: Buffer,
    fileName: string,
    folder: string
): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder,
                public_id: fileName.replace(/\.[^/.]+$/, ''), // Remove extension
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' }
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve(result as CloudinaryResponse);
                } else {
                    reject(new Error('Upload failed with no result'));
                }
            }
        );

        uploadStream.end(buffer);
    });
}

/**
 * Validates if a file is an image based on MIME type
 */
function isValidImageType(mimeType: string): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(mimeType);
}

/**
 * Validates file size (max 10MB)
 */
function isValidFileSize(size: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
}

/**
 * Uploads multiple image files to Cloudinary with rollback on failure
 * @param files - Array of File objects from FormData
 * @param folder - Cloudinary folder name (default: 'ecommerce_mini')
 * @returns Upload result with URLs or error information
 */
export async function uploadFilesToCloudinary(
    files: File[],
    folder: string = 'ecommerce_mini'
): Promise<CloudinaryUploadResult> {
    const uploadedUrls: string[] = [];
    const publicIds: string[] = [];

    // Validate all files before uploading
    for (const file of files) {
        if (!isValidImageType(file.type)) {
            return {
                success: false,
                uploadedUrls: [],
                publicIds: [],
                failedFile: file.name,
                error: `Invalid file type for ${file.name}. Only JPEG, PNG, GIF, and WebP are allowed.`,
            };
        }

        if (!isValidFileSize(file.size)) {
            return {
                success: false,
                uploadedUrls: [],
                publicIds: [],
                failedFile: file.name,
                error: `File ${file.name} exceeds maximum size of 10MB.`,
            };
        }
    }

    try {
        // Upload each file sequentially
        for (const file of files) {
            try {
                // Convert File to Buffer
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Upload to Cloudinary
                const result = await uploadBufferToCloudinary(buffer, file.name, folder);

                uploadedUrls.push(result.secure_url);
                publicIds.push(result.public_id);
            } catch (uploadError) {
                // Rollback: delete all previously uploaded images
                await rollbackCloudinaryUploads(publicIds);

                const errorMessage = uploadError instanceof Error 
                    ? uploadError.message 
                    : 'Unknown upload error';

                return {
                    success: false,
                    uploadedUrls: [],
                    publicIds: [],
                    failedFile: file.name,
                    error: `Failed to upload ${file.name}. Error: ${errorMessage}`,
                };
            }
        }

        return {
            success: true,
            uploadedUrls,
            publicIds,
        };
    } catch (error) {
        // Cleanup any uploaded images in case of unexpected error
        await rollbackCloudinaryUploads(publicIds);

        const errorMessage = error instanceof Error 
            ? error.message 
            : 'Unknown error during upload process';

        return {
            success: false,
            uploadedUrls: [],
            publicIds: [],
            error: errorMessage,
        };
    }
}

/**
 * Deletes images from Cloudinary (used for rollback)
 */
export async function rollbackCloudinaryUploads(
    publicIds: string[]
): Promise<void> {
    if (publicIds.length === 0) return;

    try {
        await Promise.all(
            publicIds.map(publicId =>
                cloudinary.uploader.destroy(publicId, {
                    resource_type: 'image',
                }).catch(err => {
                    console.error(`Failed to delete ${publicId}:`, err);
                })
            )
        );
    } catch (error) {
        console.error('Error during rollback:', error);
    }
}

export default cloudinary;