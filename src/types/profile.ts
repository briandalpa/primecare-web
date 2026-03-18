import type React from 'react';

export interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  verified?: boolean;
  memberSince?: string;
}

export interface ProfileField {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  key: string;
  value: string;
  type?: string;
  placeholder?: string;
  validate: (v: string) => {
    success: boolean;
    error?: { errors: { message: string }[] };
  };
}
