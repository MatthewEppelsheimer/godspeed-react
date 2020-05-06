import Head from 'next/head'
import Link from 'next/link'
import Layout, { siteTitle } from '../components/layout'
import Velocity from '../components/Velocity/components/Velocity'
import DATA from '../data-mock'
import utilStyles from '../styles/utils.module.css'

// Mock interactions w/ external data store
const createCallback = (document) => {
  // console.log('dataStore told to create record:',document);
  // @TODO return a promise to update optimistic UI after completion
};

const dataStoreCrudCallbacks = {
  create: createCallback,
};

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Velocity data={DATA} dataStore={dataStoreCrudCallbacks} />
    </Layout>
  )
}
