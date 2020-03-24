import Cookies from 'universal-cookie'

export default ({ req, store }) => {
  console.log('cook')
  if (process.browser) {
    return
  }
  const cookies = new Cookies(req.headers.cookie)
  const uid = cookies.get('uid')
  const user = cookies.get('user')
  console.log(uid)
  if (uid && user) {
    store.commit('setUser', { user, uid })
  }
}
