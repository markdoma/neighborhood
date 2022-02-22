import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';

import { useEffect, useState, useCallback, useContext } from 'react';
import debounce from 'lodash.debounce';

export default function Enter(props) {
  const { user, details } = useContext(UserContext);

  console.log(`context ${user}`);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? (
        !details ? (
          <>
            <UsernameForm />
            <SignOutButton />
          </>
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} width="30px" /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// Username form
function UsernameForm() {
  const [inputValues, setInputValues] = useState({
    firstName: '',
    lastName: '',
  });
  // const [isValid, setIsValid] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [detailsComplete, setDetailsComplete] = useState(false);
  const { user, details } = useContext(UserContext);

  console.log(`form ${details}`);
  console.log(`user ${user}`);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    // const usernameDoc = firestore.doc(`usernames/${formValue}`);
    const userDetailsDoc = firestore.doc(`details/${user.uid}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      // username: formValue,
      details: true,
      photoURL: user.photoURL,
      displayName: user.displayName,
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
    });
    batch.set(userDetailsDoc, {
      uid: user.uid,
      firstName: inputValues.firstName,
      lastName: inputValues.lastName,
    });

    await batch.commit();
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  // console.log(inputValues.firstName);

  //

  // useEffect(() => {
  //   checkUsername(formValue);
  // }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // const checkUsername = useCallback(
  //   debounce(async (username) => {
  //     if (username.length >= 3) {
  //       const ref = firestore.doc(`usernames/${username}`);
  //       const { exists } = await ref.get();
  //       console.log('Firestore read executed!');
  //       setIsValid(!exists);
  //       setLoading(false);
  //     }
  //   }, 500),
  //   []
  // );

  return (
    !details && (
      <section>
        <h3>Profile Details</h3>
        <form onSubmit={onSubmit}>
          <input
            name="firstName"
            placeholder="FirstName"
            // value={}
            onChange={onChange}
          />
          <input
            name="lastName"
            placeholder="LastName"
            // value={inputValues}
            onChange={onChange}
          />
          {/* <UsernameMessages
            username={formValue}
            isValid={isValid}
            loading={loading}
          /> */}
          <button type="submit" className="btn-green">
            Save Profile
          </button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
