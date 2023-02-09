"use client";

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect} from 'react';



// Your web app's Firebase configuration


const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  /*const router = useRouter();

  router.push("/data/base")*/

  const router = useRouter()

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      router.push('/data/base')
    }
    return () => {
      ignore = true;
    }
  }, [router])

  return (
    <main>
      <h1>Redirecting to chatUp...</h1>
      <Link href="/data/base" as={`/data/base`}><button>Go to chatUp</button></Link>
    </main>
  )
}
