import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,

  plugins: [
    inferAdditionalFields({
      user: {
        avatarUrl: { type: "string" },
        phone: { type: "string" },
      },
    }),
  ],
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  getSession,
} = authClient;