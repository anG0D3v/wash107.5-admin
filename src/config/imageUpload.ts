import { ref, uploadBytes, getDownloadURL  } from 'firebase/storage';
import { storage } from '../db';

export async function uploadImageToStorage(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const modifiedURL = downloadURL + `?alt=media&token=${snapshot.metadata.fullPath}`;
    return modifiedURL;
  } catch (error) {
    throw error;
  }
}