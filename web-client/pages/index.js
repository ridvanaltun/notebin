import { useRouter } from 'next/router'

const Home = ({ path }) => {
  if (path) {
    // in client
    const router = useRouter()
    router.push(path)
    // router.push('/[path]', '/deneme123')
  }

  return null
}

Home.getInitialProps = async (ctx) => {
  if (ctx.req) {
    // in server
    ctx.res.writeHead(302, { Location: '/login' }).end()
  } else {
    // const { path } = ctx.query
    return { path: '/login' }
  }
}

export default Home
