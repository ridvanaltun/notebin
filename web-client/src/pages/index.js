// Utils
import {useRouter} from 'next/router'
import {apiClient} from '../utils'

const Home = ({path}) => {
  if (path) {
    const router = useRouter()
    router.push(path)
  }

  return null
}

Home.getInitialProps = async ctx => {
  try {
    const res = await apiClient({
      method: 'post',
      url: '/notes'
    })
    const {path} = res.data
    // Route to created note
    if (ctx.req) {
      // in server
      ctx.res.writeHead(302, {Location: `/${path}`}).end()
    } else {
      // in client
      return {path: `/${path}`}
    }
  } catch (error) {
    return {error}
  }
}

export default Home
