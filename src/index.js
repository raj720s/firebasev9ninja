import { initializeApp } from "firebase/app";
import {
  getFirestore,
  serverTimestamp,
  collection,
  getDoc,
  getDocs,
  getDocsFromCache,
  getDocFromServer,
  getDocsFromServer,
  query,
  where,
  doc,
  deleteDoc,
  addDoc,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCN9WbKP1srMw1NTULgBj_wrrqj9-dIbxQ",
  authDomain: "bas ics-ddd14.firebaseapp.com",
  databaseURL: "https://basics-ddd14.firebaseio.com",
  projectId: "basics-ddd14",
  storageBucket: "basics-ddd14.appspot.com",
  messagingSenderId: "353718454377",
  appId: "1:353718454377:web:6fbf47bdec0d1f72b47af8",
  measurementId: "G-LLZM2WK2EX",
};

initializeApp(firebaseConfig);

// initialize services

const DB = getFirestore(); // general initialize

// collection ref

const books_collection = collection(DB, "books");

// getting or reading docs
/* 
*
getDocs(books_collection)
  .then((snap) => {
    const books = []
    snap.docs.forEach((doc) => {
      books.push({...doc.data(), id: doc.id})
    })
    console.log(books)
  })
  .catch((e) => {
    console.log(e)
  })
*  
*/

//  -------------Realtime Listener // subscription above
onSnapshot(books_collection, (snap) => {
  // no .then() coz its asynnc
  const books = [];
  snap.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

//-------- Adding Documents from form

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(books_collection, {
    title: addForm.title.value,
    author: addForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addForm.reset();
  });
});

// --------- Delete doc from its ID
const delForm = document.querySelector(".del");
delForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(DB, "books", delForm.id.value);
  deleteDoc(docRef).then(() => {
    delForm.reset();
  });
});

// Firestore Query
// const qry = query(books_collection, where('author', '==', 'kd'), orderBy('title', 'desc'))
// ordering data from query:: orderBy
const qry = query(
  books_collection,
  where("author", "==", "kd"),
  orderBy("createdAt", "desc")
);

onSnapshot(qry, (snap) => {
  // no .then() coz its asynnc
  const kdbooks = [];
  snap.docs.forEach((doc) => {
    kdbooks.push({ ...doc.data(), id: doc.id });
  });
  console.log(kdbooks);
});

// getting a single doc : get-doc

const docRef = doc(DB, "books", "KNRu0es8lOC4vuDqieWg");
getDoc(docRef).then((doc) => {
  console.log(doc.data());
});
onSnapshot(docRef, (doc) => {
  console.log(doc.data());
});

// updating a doc

const updForm = document.querySelector(".upd");

updForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = updForm.id.value;
  const docRef = doc(DB, "books", id);
  updateDoc(docRef, {
    title: "new title",
  })
    .then(() => {
      updForm.reset();
    })
    .catch((e) => {
      console.log(e);
    });
});

// authentication

const auth = getAuth();

const signupFrm = document.querySelector(".signupForm");
signupFrm.addEventListener("submit", (e) => {
  e.preventDefault();
  createUserWithEmailAndPassword(
    auth,
    signupFrm.email.value,
    signupFrm.password.value
  )
    .then((cred) => {
      console.log(cred.user);
      signupFrm.reset();
    })
    .catch((e) => {
      console.log(e);
    });
});

// on Auth state
const authState = onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.uid);
  } else {
    console.log("user has signOut");
  }
});

// logout

const lgout_btn = document.querySelector("#logout");
lgout_btn.addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      console.log("user gone");
      // unsubscribe to all Listener
      /*
      1. store all listeners in  a variable like const 
      2. just invoke them here 
      3. ex ampple of unsubsribing from the auth state change is defined below
      */
      authState();
    })
    .catch((e) => {
      console.log(e);
    });
});

// login the user

const signinFrm = document.querySelector(".signinForm");
signinFrm.addEventListener("submit", (e) => {
  e.preventDefault();
  signInWithEmailAndPassword(
    auth,
    signinFrm.email.value,
    signinFrm.password.value
  )
    .then((cred) => {
      console.log(cred.user, "user logged in");
      signinFrm.reset();
    })
    .catch((e) => {
      console.log(e);
    });
});

///--------- check docs for learnmore //
