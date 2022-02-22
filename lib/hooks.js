import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      // console.log(user);
      unsubscribe = ref.onSnapshot((doc) => {
        setDetails(doc.data()?.details);
        console.log(`unsub ${doc.data()?.details}`);
      });
    } else {
      setDetails(false);
    }
    // console.log('unsubscribe');
    return unsubscribe;
  }, [user]);

  console.log(`ito - ${details}`);
  return { user, details };
}
