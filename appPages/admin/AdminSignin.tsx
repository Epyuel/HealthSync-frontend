"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { useLoginAdminMutation } from "@/redux/api/adminApi"

export default function AdminSignin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loginAdmin, { isLoading }] = useLoginAdminMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    if (!email || !password) {
      setStatus("error")
      setMessage("Email and password are required.")
      return
    }

    try {
      const result = await loginAdmin({ email, password }).unwrap()
      console.log("Signed in successfully", result)
      setStatus("success")
      setMessage("Signed in successfully! Redirecting to dashboard...")

      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Failed to sign in", err)
      setStatus("error")
      setMessage("Failed to sign in. Please check your credentials and try again.")
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(/images/landing-bg.png)` }}
    >
      <Card className="w-full max-w-md border-0 shadow-2xl bg-black/70 backdrop-blur-sm">
        <div className="px-6 pt-8">
          <h1 className="text-center text-4xl font-bold mb-2">
            <span className="text-primaryColor">Health</span>
            <span className="text-secondaryColor">Sync</span>
          </h1>
          <CardHeader className="px-0 pt-4 pb-0">
            <CardTitle className="text-center text-xl font-semibold text-white">Admin Portal</CardTitle>
          </CardHeader>
        </div>
        <CardContent className="px-6 pb-8 pt-4">
          {status === "success" && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg flex items-center gap-2 text-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2 text-red-100">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primaryColor"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primaryColor"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-6 bg-gradient-to-r from-primaryColor to-secondaryColor hover:opacity-90 transition-opacity text-white font-medium"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" && (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              )}
              {status === "success" && (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Signed In
                </>
              )}
              {(status === "idle" || status === "error") && "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

