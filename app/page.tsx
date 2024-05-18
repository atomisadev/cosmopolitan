"use client";

import { SignInButton, useUser, SignIn, useAuth } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Rowdies } from "next/font/google";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./globals.css";

const font = Rowdies({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) router.push("/dashboard");
  }, [isLoaded, userId, router]);

  return (
    <motion.main
      initial={{ y: -1600 }}
      animate={{ y: 0 }}
      transition={{ duration: 1 }}
      className={`flex min-h-screen flex-col items-center justify-between bg-[#DAF5FF]`}
    >
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, deplay: 1 }}
      >
        <h1
          className={`text-6xl tracking-wider ${font.className} text-[#2E4C48] mt-28 p-12`}
        >
          Cosmopolitan
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, deplay: 1 }}
      >
        <SignInButton>
          <button className="bg-[#2E4C48] text-[#DAF5FF] font-medium py-2 px-4 rounded-lg hover:bg-[#63A4C1]/80 transition ease-in-out duration-100">
            Generate
          </button>
        </SignInButton>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
      >
        <Image
          src="carbon.svg"
          alt="image"
          className="w-full"
          width={100}
          height={5}
        />
      </motion.div>
      <div className="flex flex-col items-center text-center">
        <h1 className={`text-3xl ${font.className} p-6`}>Abstract</h1>
        <p className="w-4/5">
          Cosmopolitan informs user about where thier trash goes as people don't
          realize what happens to thier trash. It does so by analyzing everyday
          items, it identifies their materials and assesses recyclability. If an
          item is recyclable, our app provides nearby recycling centers and
          showcases five other products that can be made from the recycled
          materials to show how recycling remains in circulation. For
          non-recyclable items, it educates users on proper disposal by
          visualizing the path from landfills to oceans and its negative
          impacts.
        </p>
      </div>
      <div className="flex flex-row justify-center mt-48 mb-20">
        <div className="w-1/2 m-6 p-12">
          <h1 className={`text-3xl ${font.className} pb-12`}>Why?</h1>
          <p className="w-3/5 text-sm">
            Over 8 million metric tonnes of trash ends up in the oceans each
            year. However, about a fifth of Americans report that most people in
            their communities don’t really part take in recycling. Additionally
            nearly half of Americans don’t know where to drop off recycling.
            Over app Cosmopolitan aims to change that by informing and
            demonstrating the effects of recyling and not recycling.
          </p>
        </div>

        <Image
          src="tides.svg"
          alt="image"
          className="w-1/4"
          width={100}
          height={5}
        />
      </div>
      <footer className="text-xs text-center mb-12 tracking-widest">
        <p>Note: All code, and art is orginal</p>
        <p>@hackmhs IX 2024</p>
      </footer>
    </motion.main>
  );
}
