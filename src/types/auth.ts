export interface RegisterRequest {
  name: string;
  email: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
}
