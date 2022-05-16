import {initializeApp} from 'firebase/app'
import {getFirestore, collection, getDoc, getDocs, getDocsFromCache, getDocFromServer, getDocsFromServer, query, where, doc, deleteDoc, addDoc, onSnapshot, orderBy} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCN9WbKP1srMw1NTULgBj_wrrqj9-dIbxQ',
  authDomain: 'bas ics-ddd14.firebaseapp.com',
  databaseURL: 'https://basics-ddd14.firebaseio.com',
  projectId: 'basics-ddd14',
  storageBucket: 'basics-ddd14.appspot.com',
  messagingSenderId: '353718454377',
  appId: '1:353718454377:web:6fbf47bdec0d1f72b47af8',
  measurementId: 'G-LLZM2WK2EX',
}

initializeApp(firebaseConfig)

// initialize services

const DB = getFirestore() // general initialize

// collection ref

const books_collection = collection(DB, 'books')

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
  const books = []
  snap.docs.forEach((doc) => {
    books.push({...doc.data(), id: doc.id})
  })
  console.log(books)
})

//-------- Adding Documents from form

const addForm = document.querySelector('.add')
addForm.addEventListener('submit', (e) => {
  e.preventDefault()
  addDoc(books_collection, {
    title: addForm.title.value,
    author: addForm.author.value,
  }).then(() => {
    addForm.reset()
  })
})

// --------- Delete doc from its ID
const delForm = document.querySelector('.del')
delForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(DB, 'books', delForm.id.value)
  deleteDoc(docRef).then(() => {
    delForm.reset()
  })
})

// Firestore Query
const qry = query(books_collection, where('author', '==', 'kd'), orderBy('title', 'desc'))

onSnapshot(qry, (snap) => {
  // no .then() coz its asynnc
  const kdbooks = []
  snap.docs.forEach((doc) => {
    kdbooks.push({...doc.data(), id: doc.id})
  })
  console.log(kdbooks)
})

// ordering data from query:: orderBy
