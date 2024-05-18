"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Rowdies } from "next/font/google";
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import "./globals.css";

const font = Rowdies({ subsets: ["latin"], weight:'400' });


export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  return (

      <main className={`flex min-h-screen flex-col items-center justify-between bg-[#EEDBB6]`}>
        <motion.div 
          initial={{ opacity: 0, y:-100 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5 }} 
        >
      <h1 className={`text-6xl tracking-wider ${font.className} text-[#2E4C48] mt-28 p-12`}>Cosmopolitan</h1>
      </motion.div>
      <SignInButton>
        <button className="bg-white text-black font-medium py-2 px-4 rounded-lg hover:bg-white/80 transition ease-in-out duration-100">
          Generate
        </button>
      </SignInButton>      
      <motion.div 
      initial={{ opacity: 0, y:50 }}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 0.5 }} 
    >
      <Image src="carbon.svg" alt="image" className="w-full" width={100} height={5}/>
    </motion.div>
    </main>

  );
}
