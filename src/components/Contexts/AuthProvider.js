import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import React, { useContext, useState, useEffect } from "react"
import { auth, db, gProvider, fProvider } from "../../firebase"
import { doc, setDoc} from 'firebase/firestore/lite'

const AuthContext = React.createContext()

export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) 
{
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  const authWithGoogle = () =>
  {
    return signInWithPopup(auth, gProvider)
    .then(result =>
      {
      async function setDocument() 
      {
        await setDoc(doc(db,'users',result.user.uid),
        {
            url:result.user.photoURL,
            id: result.user.uid
        },
        { 
          merge: true
        });
      }
      setDocument();
    })
  }

  
  const authWithFacebook = () =>
  {
    return signInWithPopup(auth, fProvider)
      .then(result =>
      {
        async function setDocument() 
        {
          await setDoc(doc(db,'users',result.user.uid),
          {
              url:result.user.photoURL,
              id: result.user.id
            },
            { 
              merge: true
            });
        }
        setDocument();
      })
  }

  const signup = ( email, password ) => createUserWithEmailAndPassword( auth, email, password );
   
  const login = ( email, password ) => signInWithEmailAndPassword(auth ,email, password);

  const signInGoogle = () => signInWithPopup(auth, gProvider);

  const signInFacebook = () => signInWithPopup(auth, fProvider);

  const logout = () => auth.signOut();

  const resetPassword = ( email ) => auth.sendPasswordResetEmail(email);

  const updateEmail = ( email ) => currentUser.updateEmail(email);

  const updatePassword = ( password ) => currentUser.updatePassword(password);


  useEffect(() => 
  {
    const unsubscribe = auth.onAuthStateChanged( user => 
    { 
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = 
  {
    currentUser,
    authWithGoogle,
    authWithFacebook,
    signInGoogle,
    signInFacebook,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

