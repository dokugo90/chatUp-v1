"use client";

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css';
import "./globals.css"
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
      router.push('/chat')
    }
    return () => {
      ignore = true;
    }
  }, [router])

  return (
    <main className='redirect-main'>
      <h1 className='redirect'>Redirecting to chatUp...</h1>
    </main>
  )
}
