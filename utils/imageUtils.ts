import { Directory, File, Paths } from 'expo-file-system';
import ImageResizer from 'react-native-image-resizer';

// Utilisation de Paths.document pour le répertoire de base
const IMAGE_DIR = new Directory(Paths.document, 'images');

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
      60,
      0,
      undefined // Utilise le cache par défaut
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
    const destinationFile = new File(IMAGE_DIR, fileName);

    if (!IMAGE_DIR.exists) {
      IMAGE_DIR.create(); 
    }

    const sourceFile = new File(sourceUri);
    sourceFile.copy(destinationFile);

    return destinationFile.uri;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUri: string): Promise<void> => {
  try {
    const fileToDelete = new File(imageUri);
    
    if (fileToDelete.exists && imageUri.startsWith(IMAGE_DIR.uri)) {
      fileToDelete.delete();
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};
