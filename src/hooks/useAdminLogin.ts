import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authClient, signOut } from "@/lib/auth-client";
import { getMyProfile } from "@/services/user";
import { getDashboardRoute } from "@/utils/auth";

import {
  adminLoginSchema,
  type AdminLoginFormValues,
  type AdminLoginFormErrors,
} from "@/features/auth/adminLoginSchema";

const ADMIN_ROLES = ["SUPER_ADMIN", "OUTLET_ADMIN"] as const;

export function useAdminLogin() {
  const navigate = useNavigate();

  const [values, setValues] = useState<AdminLoginFormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<AdminLoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof AdminLoginFormValues, value: string) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = adminLoginSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: AdminLoginFormErrors = {};

      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof AdminLoginFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const signInResult = await authClient.signIn.email({
        email: result.data.email,
        password: result.data.password,
      });

      if (signInResult.error) {
        toast.error("Login failed", {
          description: signInResult.error.message,
        });
        return;
      }

      /**
       * Fetch profile to get role
       */
      const profile = await getMyProfile();
      const role = profile?.staff?.role;

      if (role && (ADMIN_ROLES as readonly string[]).includes(role)) {
        toast.success("Login success!", {
          description:
            `Welcome, ${profile?.name ?? ""}!`.trim() || "Welcome back!",
        });

        navigate(getDashboardRoute(role), { replace: true });
      } else {
        await signOut();

        toast.error("Unauthorized", {
          description: "Admin access only. Use the customer login instead.",
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
}