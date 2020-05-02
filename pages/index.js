import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Velocity from '../components/Velocity/Velocity'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      {/* <section className={utilStyles.headingMd}>
        <p>Hello, it's nice to meet you!</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section> */}
      {/* <h2>
        Start <Link href="/posts/first-post"><a>reading my posts</a></Link>
      </h2> */}
      <Velocity />
    </Layout>
  )
}
