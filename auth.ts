import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { NextResponse } from "next/server"

import { prisma } from "@/app/lib/prisma"
import { verifyPassword } from "@/app/lib/password"
import type { AppRole } from "@/app/lib/authz"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      phone?: string | null
      role: AppRole
      farmId?: string | null
      farmName?: string | null
      isActive: boolean
    } & DefaultSession["user"]
  }

  interface User {
    phone?: string | null
    role: AppRole
    farmId?: string | null
    farmName?: string | null
    isActive: boolean
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    phone?: string | null
    role?: AppRole
    farmId?: string | null
    farmName?: string | null
    isActive?: boolean
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
          include: {
            farm: true,
          },
        })

        if (
          !user ||
          !user.isActive ||
          !verifyPassword(password, user.passwordHash)
        ) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          farmId: user.farmId,
          farmName: user.farm?.name ?? null,
          isActive: user.isActive,
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
        token.farmId = user.farmId
        token.farmName = user.farmName
        token.isActive = user.isActive
      }

      return token
    },
    session({ session, token }) {
      session.user.id = token.sub ?? ""
      session.user.phone =
        typeof token.phone === "string" ? token.phone : null
      session.user.role =
        typeof token.role === "string" ? (token.role as AppRole) : "WORKER"
      session.user.farmId =
        typeof token.farmId === "string" ? token.farmId : null
      session.user.farmName =
        typeof token.farmName === "string" ? token.farmName : null
      session.user.isActive = token.isActive !== false

      return session
    },
  },
})
