import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../../lib/mongodb";
import User, { UserRole } from "../../../../models/User";
import bcrypt from "bcryptjs";

interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        try {
          await connectDB();
        } catch (error) {
          console.error("Database connection error:", error);
          throw new Error("Unable to connect to the database");
        }

        try {
          // Try to find user by personal_information.email first, then fallback to legacy email field
          const user = await User.findOne({
            $and: [{ "personal_information.email": credentials.email }],
          }).select("+password");

          if (!user) {
            throw new Error("INVALID_CREDENTIALS");
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isMatch) {
            throw new Error("INVALID_CREDENTIALS");
          }

          if (!user.general_information?.roles?.includes(UserRole.ADMIN)) {
            throw new Error("ADMIN_REQUIRED");
          }

          // Get user details from the new schema structure
          const displayName = user.personal_information?.first_name;
          const primaryEmail = user.personal_information?.email;
          const userRoles = user.general_information?.roles || [UserRole.USER];

          return {
            id: user._id.toString(),
            email: primaryEmail ?? "",
            name: displayName ?? "",
            roles: userRoles,
          };
        } catch (error) {
          console.error("Auth error:", error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("An unexpected error occurred");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser.id;
        token.roles = extendedUser.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as ExtendedUser).id = token.id as string;
        (session.user as ExtendedUser).roles = token.roles as string[];
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
