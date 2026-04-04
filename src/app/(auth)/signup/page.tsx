"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-surface p-8 shadow-xl border border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Join Mont Water Stock Manager
          </p>
        </div>
        
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m.manager@montwater.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position / Role</Label>
              <Input
                id="position"
                name="position"
                type="text"
                placeholder="e.g. Production Manager, Inventory Clerk"
                required
              />
            </div>
          </div>
          
          {state?.error && (
            <p className="text-sm font-medium text-danger text-center">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
