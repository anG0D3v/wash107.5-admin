import { db } from "../db";
import { collection,getDocs } from 'firebase/firestore';

export const fetchInventory = async (collectionName: string) =>{
    try {
        const querySnapshot = await getDocs(collection(db,collectionName))
        const newData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))
        console.log(newData)
        return newData;
    } catch (error) {
        console.log('Error reading Inventory list',error)
    }
}