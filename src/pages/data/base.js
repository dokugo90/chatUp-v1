// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import React, { useEffect, useRef, useState } from 'react';
import "src/app/globals.css";
import { useRouter } from 'next/navigation';
import { TextField } from '@mui/material';

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
//import 'firebase/messaging';
import { firebaseConfig } from 'firebaseconfig';
import Link from 'next/link';

export default function Home() {
  "use client";
  const [info, setInfo] = useState([]);
  const arr = useRef([]);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [email, setEmail] = useState("");
  const [uuid, setUuid] = useState("");
  const [offline, isOffline] = useState(false);
  const router = useRouter();
  const timer = useRef();
  const [signedIn, isSignedIn] = useState(false);


  const firestore = getFirestore();
  //const usersRef = firestore.collection("users")

  function createUser() {
    addDoc(collection(firestore, 'user',), {
      user: username,
      pfp: profilePic,
      usermail: email,
      uniqueId: uuid,
      name: text,
      time: serverTimestamp()
    }).catch((err) => {
      alert(err)
    })
  }

  function deleteUser(userDoc) {
    deleteDoc(doc(getFirestore(), `user/${userDoc}`))
  }

  function Authentication() {
    return {
      signIn: async function() {
        let provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider)
      },
      authState: async function() {
        onAuthStateChanged(getAuth(), () => {
          if (getAuth().currentUser != null) {
                setUsername(getAuth().currentUser.displayName)
                setProfilePic(getAuth().currentUser.photoURL)
                setEmail(getAuth().currentUser.email);
                setUuid(getAuth().currentUser.uid);
                isSignedIn(true);
          } else {
            setUsername("")
            setProfilePic("https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg");
            setEmail("");
            setUuid("")
            isSignedIn(false);
          }
        })
      },
      signUserOut: async function() {
        signOut(getAuth());
        
      }
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      Authentication().authState()
    }

    return () => {
      ignore = true;
    }
  })


  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      onSnapshot(
        query(collection(firestore, 'user'), orderBy('time'), limit(1000)),
        snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
            arr.current = arr.current.filter((item) => item.id !== change.doc.id)
            setInfo([...arr.current])
            } else if (change.type == "added") {
              arr.current.push({
                user: change.doc.data().user,
                photo: change.doc.data().pfp,
                text: change.doc.data().name,
                id: change.doc.id,
                date: change.doc.data().time,
                useremail: change.doc.data().usermail, 
                userId: change.doc.data().uniqueId
              })
              setInfo([...arr.current])
              //https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png
             
            }
          });
        }
      );
    }
    
    return () => {
      ignore = true;
    };
  }, [firestore]);
  
  useEffect(() => {
    let ignore = false;
    if (typeof window !== "undefined" && !ignore) {
      window.addEventListener("offline", () => {
        isOffline(true);
      })
      window.addEventListener("online", () => {
        isOffline(false);
      })
    }
    return () => {
      ignore = true;
    }
  })

  /*if (offline) {
    timer.current = setTimeout(() => {
      isOffline()
    }, 5000)
  } else {
    clearTimeout(timer.current)
  }*/

  return (
    <>
    <script src="/node_modules/material-design-lite/material.min.js" defer></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css" />
<script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
    <main>
      <nav>
        <ul>
          <li className='title'>ChatUp</li>
          <li className='version'>version 1.0.0</li>
        </ul>
        <div className='account-flex'>
        <img title={`${username}`} className='pfp' src={profilePic}></img>
        {
          email == "" ?
        <button className='sign-in-btn' onClick={() => Authentication().signIn()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "rgba(72, 133, 237, 1)"}}>
        <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z">
          </path></svg><span className='one'>S<span className='two'>i</span><span className='three'>g</span><span className='one'>n</span> <span className='five'>i</span><span className='two'>n</span></span></button>
          : <button className='sign-in-btn' onClick={() => Authentication().signUserOut()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{fill: "rgba(72, 133, 237, 1)"}}>
          <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z">
            </path></svg><span className='one'>S<span className='two'>i</span><span className='three'>g</span><span className='one'>n</span> <span className='five'>o</span><span className='two'>ut</span></span></button>
}
          </div>
      </nav>
      <div className='flex'>
    <div id='text-messages'>
      {
        arr.current.map((item, index) => (
          <>
          <div key={item.id} className='message animate'>
            <img key={item.id} src={item.photo}></img>
            <div className='message-info'>
          <h3 className='message-text' key={item.id}>{item.text}</h3>
          <p className='message-sender' key={item.id}>{item.user}</p>
          </div>
          {
            uuid == item.userId ?
            <>
            <div className='delete-flex'>
            <i title='Delete' onClick={() => {
            deleteUser(item.id)
          }} className='material-icons delete-btn'>delete</i>
          </div>
            </>
            : <></>
          }
          </div>
          </>
        ))
      }
    </div>
    </div>
    <div className='send-input-field-flex'>
      <div className='send-input-field'>
      <TextField onChange={e => setText(e.target.value)} style={{width: 200}} id="standard-basic" label="Message" placeholder='Enter Message' variant="standard" />
    <button title='Send' disabled={!signedIn} style={{backgroundColor: "rgba(7, 110, 236, 0.927)", marginTop: 10}} onClick={() => createUser()} className="send-btn mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
  Send
</button>
    </div>
    </div>
    <div class="footer">
    Created by <Link className='link-git' href="https://github.com/dokugo90/chatUp-v1.git">dokugo90</Link> &copy; {new Date().getFullYear()}
  </div>
    </main>
    {
      offline ?
      <></>
      : <></>
    }
    </>
  )
}

const app = initializeApp(firebaseConfig);

