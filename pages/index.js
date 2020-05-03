import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Velocity from '../components/Velocity/components/Velocity'
import DATA from '../data-mock'
import utilStyles from '../styles/utils.module.css'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Velocity data={DATA} />
    </Layout>
  )
}
