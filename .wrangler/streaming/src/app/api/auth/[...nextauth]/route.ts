import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  ...authOptions,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
});

export { handler as GET, handler as POST };