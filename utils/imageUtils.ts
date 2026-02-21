import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as FileSystem from 'expo-file-system';

export const createThumbnail = async (
  imageUri: string,
  width: number = 100,
  height: number = 100
): Promise<string> => {
  try {
    const resized = await ImageResizer.createResizedImage(
      imageUri,
      width,
      height,
      'JPEG',
      60
    );
    return resized.uri;
  } catch (error) {
    console.error('Error creating thumbnail:', error);
    throw error;
  }
};

export const saveImage = async (sourceUri: string): Promise<string> => {
  try {
    const fileName = `img_${Date.now()}.jpg`;
    const destinationUri = `${FileSystem.documentDirectory}images/${fileName}`;

    // Create images directory if it doesn't exist
    const imageDir = `${FileSystem.documentDirectory}images`;
    const dirInfo = await FileSystem.getInfoAsync(imageDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imageDir, { intermediates: true });
    }

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUri: string): Promise<void> => {
  try {
    if (imageUri.startsWith(FileSystem.documentDirectory || '')) {
      await FileSystem.deleteAsync(imageUri);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
