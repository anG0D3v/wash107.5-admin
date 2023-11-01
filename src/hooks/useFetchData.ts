/* eslint-disable no-useless-catch */
import { db } from '../db';
import { collection, getDocs } from 'firebase/firestore';

export const fetchData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return newData;
  } catch (error) {
    throw error;
  }
};
