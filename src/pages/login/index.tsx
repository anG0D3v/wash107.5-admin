import React, { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../db';

export function Login() {
  const loadUsers = async () => {
    await getDocs(collection(db, 'userTable'))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(newData);
      })
      .catch((error) => {
        console.error('Error loading users:', error);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="text-primary">
      <h1>login</h1>
    </div>
  );
}
