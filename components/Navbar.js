import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

import { auth } from '../lib/firebase';

// Top navbar
export default function Navbar() {
  const { user, details } = useContext(UserContext);

  console.log(user);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Neighbhorhood</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {details && (
          <>
            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <button className="push-left" onClick={() => auth.signOut()}>
              Sign out
            </button>

            <li>
              <Link href="/">
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!details && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
