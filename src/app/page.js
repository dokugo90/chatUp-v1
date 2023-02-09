"use client";

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



// Your web app's Firebase configuration


const inter = Inter({ subsets: ['latin'] })
export default function Home() {

  const router = useRouter();

  router.push("/data/base")

  return (
    <main>
      <h1>Redirecting to chatUp...</h1>
    </main>
  )
}
