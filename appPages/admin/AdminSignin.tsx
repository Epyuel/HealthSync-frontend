'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import backimg from "@/public/images/landing-bg.png";
import { useLoginAdminMutation } from "@/redux/api/adminApi";
import { useRouter } from "next/navigation";

export default function AdminSignin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const result = await loginAdmin({ email, password }).unwrap();
      console.log("Signed in successfully", result);
      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Failed to sign in", err);
      setError("Failed to sign in. Please check your credentials and try again.");
    }
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gray-100 p-4"
      style={{ backgroundImage: `url(${backimg.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Card className="w-full max-w-2xl bg-gray-800 bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-center text-5xl font-bold"><span className="text-primaryColor">Health</span><span className="text-secondaryColor">Sync</span></h1>
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold text-white">
            Sign In as an Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-700 text-lg bg-red-100 rounded-lg py-4 text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading} isLoading={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
