import Cookies from 'universal-cookie'
import moment from 'moment'

export default ({ req, store, redirect }) => {
  console.log(req.originalUrl)
  if (process.browser) {
    return
  }
  const cookies = new Cookies(req.headers.cookie)
  const uid = cookies.get('uid')
  const user = cookies.get('user')
  if (uid && user) {
    store.commit('setUser', { user, uid })
    if (req && req.originalUrl === '/user/login') {
      redirect(`/user/${uid}/${moment().format('YYYYMM')}/list`)
    }
  }
}
