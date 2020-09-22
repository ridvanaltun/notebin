// Utils
import { useRouter } from 'next/router'

const Raw = ({ path }) => {
  if (path) {
    const router = useRouter()
    router.push(path)
  }

  return null
}

Raw.getInitialProps = async (ctx) => {
  const isServer = !!ctx.req
  const { path } = ctx.query

  if (isServer) {
    ctx.res.writeHead(302, { Location: `/${path}` }).end()
  } else {
    // in client
    return { path: `/${path}` }
  }
}

export default Raw
