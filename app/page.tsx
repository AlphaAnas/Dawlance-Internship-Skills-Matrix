"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import SplashScreen from "./components/SplashScreen"
import Component from "./components/Pre_loader"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
      setTimeout(() => {
        router.push("/login")
      }, 500) // Small delay for smooth transition
    }, 4000)

    return () => clearTimeout(timer)
  }, [router])

  // return <SplashScreen show={showSplash} />
    return <Component />
}
