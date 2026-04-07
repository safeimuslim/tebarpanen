import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { verifyPassword } from "@/app/lib/password"

type AppRole = "SUPER_ADMIN" | "OWNER" | "ADMIN" | "WORKER"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      phone?: string | null
      role: AppRole
    } & DefaultSession["user"]
  }

  interface User {
    phone?: string | null
    role: AppRole
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    phone?: string | null
    role?: AppRole
  }
}

function readCredential(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email / HP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = readCredential(credentials.identifier)
        const password = readCredential(credentials.password)

        if (!identifier || !password) {
          return null
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier.toLowerCase() }, { phone: identifier }],
          },
        })

        if (!user || !verifyPassword(password, user.passwordHash)) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      if (auth?.user) {
        return true
      }

      const loginUrl = new URL("/login", request.nextUrl)
      loginUrl.searchParams.set(
        "callbackUrl",
        `${request.nextUrl.pathname}${request.nextUrl.search}`
      )

      return NextResponse.redirect(loginUrl)
    },
    jwt({ token, user }) {
      if (user) {
        token.phone = user.phone
        token.role = user.role
      }

      return token
    },
    session({ session, token }) {
      session.user.id = token.sub ?? ""
      session.user.phone =
        typeof token.phone === "string" ? token.phone : null
      session.user.role =
        typeof token.role === "string" ? (token.role as AppRole) : "WORKER"

      return session
    },
  },
})
