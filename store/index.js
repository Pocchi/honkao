import firebase from '~/plugins/firebase'
const usersRef = firebase.firestore().collection('users')
import Cookies from 'universal-cookie'
import moment from 'moment'

export const state = () => ({
  isLoggedIn: false,
  user: {},
  uid: null,
  month: moment().format('YYYYMM')
})

export const getters = {
  isLoggedIn: (state) => state.isLoggedIn,
  user: (state) => state.user
}

export const mutations = {
  setUser: (state, { user, uid }) => {
    state.user = user
    state.uid = uid
    state.isLoggedIn = true
  }
}

export const actions = {
  setBoughtBook({ state, commit }, payload) {
    console.log(state.uid)
    console.log(state.month)
    /*
    usersRef
      .doc(this.uid)
      .collection('month')
      .doc(this.month)
      .collection('bought_book')
      .doc(payload.isbn)
      .set({
        title: payload.book.volumeInfo.title,
        description: payload.book.volumeInfo.description,
        subtitle: payload.book.volumeInfo.subtitle,
        price: payload.price,
        img: payload.book.volumeInfo.imageLinks.smallThumbnail
      })
      */
  },
  async login({ commit }, payload) {
    let uid
    let user
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.mail, payload.password)
      .then((data) => {
        uid = data.user.uid
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        throw new Error(`${errorCode}:${errorMessage}`)
      })
    await usersRef
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error('login: No such document')
        } else {
          user = doc.data()
          commit('setUser', { user: doc.data(), uid: uid })
          console.log(doc.data())
        }
      })
      .catch((error) => {
        throw new Error('login: Error getting document', error)
      })
    const cookies = new Cookies()
    console.log(user)
    cookies.set('user', JSON.stringify(user))
    cookies.set('uid', JSON.stringify(uid))
  }
}
