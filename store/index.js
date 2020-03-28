import firebase from '~/plugins/firebase'
const usersRef = firebase.firestore().collection('users')
import Cookies from 'universal-cookie'
import moment from 'moment'
const cookies = new Cookies()

export const state = () => ({
  isLoggedIn: false,
  user: {},
  uid: null,
  month: moment().format('YYYYMM'),
  monthData: {},
  boughtBooks: []
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
  },
  setMonthData: (state, payload) => {
    state.monthData = payload
  },
  pushBoughtBooks: (state, payload) => {
    state.boughtBooks.push(payload)
  },
  resetBoughtBooks: (state) => {
    state.boughtBooks = []
  },
  resetUser: (state) => {
    state.uid = null
    state.user = {}
    state.monthData = {}
    boughtBooks = []
  }
}

export const actions = {
  async setBudget({ state, commit }, payload) {
    await usersRef
      .doc(state.uid)
      .collection('month')
      .doc(state.month)
      .set({
        budget: Number(payload),
        created_at: firebase.firestore.Timestamp.fromDate(new Date())
      })
  },
  async setBoughtBook({ state, commit }, payload) {
    await usersRef
      .doc(state.uid)
      .collection('month')
      .doc(state.month)
      .collection('bought_books')
      .doc(payload.isbn)
      .set({
        ...payload.book,
        price: Number(payload.price),
        created_at: firebase.firestore.Timestamp.fromDate(new Date())
      })
  },
  async setWantBook({ state, commit }, payload) {
    await usersRef
      .doc(state.uid)
      .collection('want_books')
      .doc(payload.isbn)
      .set({
        ...payload.book,
        price: Number(payload.price),
        created_at: firebase.firestore.Timestamp.fromDate(new Date())
      })
  },
  async logout({ commit }) {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('ログアウトしました')
        cookies.remove('user')
        cookies.remove('uid')
        commit('resetUser')
      })
      .catch((error) => {
        console.log(`ログアウト時にエラーが発生しました (${error})`)
      })
  },
  async login({ commit, dispatch }, payload) {
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
    console.log(user)
    cookies.set('user', JSON.stringify(user))
    cookies.set('uid', JSON.stringify(uid))
  },
  async getUserMonthData({ commit }, payload) {
    console.log(payload.uid)
    console.log(payload.month)
    await usersRef
      .doc(payload.uid)
      .collection('month')
      .doc(payload.month)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error('getUserMonthData: No such document')
          console.log('no')
        } else {
          let data = doc.data()
          commit('setMonthData', data)
          console.log(doc.data())
        }
      })
      .catch((error) => {
        throw new Error('getUserMonthData: Error getting document', error)
        console.log(error)
      })
    await usersRef
      .doc(payload.uid)
      .collection('month')
      .doc(payload.month)
      .collection('bought_books')
      .get()
      .then((querySnapshot) => {
        commit('resetBoughtBooks')
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data())
          commit('pushBoughtBooks', { ...doc.data(), isbn: doc.id })
        })
      })
      .catch((error) => {
        throw new Error('getUserMonthData: Error getting document', error)
        console.log(error)
      })
  }
}
