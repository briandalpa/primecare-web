import { useState } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { registerUser } from '@/services/auth';
import {
  registerSchema,
  type RegisterFormValues,
  type RegisterFormErrors,
} from '@/features/auth/registerSchema';

export function useRegister() {
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterFormValues>({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof RegisterFormValues, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: RegisterFormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegisterFormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await registerUser(result.data);

      toast.success('Account created!', {
        description: 'Check your email to set your password.',
      });

      navigate('/auth/verify-email', {
        state: { email: result.data.email },
        replace: true,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 409) {
          setErrors({ email: 'Email already registered' });
          toast.error('Email already in use', {
            description: 'Try logging in instead or use a different email.',
          });
        } else if (status === 400) {
          toast.error('Invalid input', {
            description: message || 'Please check your information.',
          });
        } else {
          toast.error('Registration failed', {
            description: message || 'Please try again later.',
          });
        }
      } else {
        toast.error('Something went wrong', {
          description: 'Please check your connection and try again.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return { values, errors, isSubmitting, handleChange, handleSubmit };
}
