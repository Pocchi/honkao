import Cookies from 'universal-cookie'

export default ({ req, store }) => {
  if (process.browser) {
    return
  }
  const cookies = new Cookies(req.headers.cookie)
  const uid = cookies.get('uid')
  const user = cookies.get('user')
  if (uid && user) {
    store.commit('setUser', { user, uid })
  }
}
