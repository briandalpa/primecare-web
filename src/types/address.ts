export type Address = {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
  phone: string | null;
  createdAt: string;
};

export type AddressPayload = {
  label: string;
  street: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  phone: string;
};

export type Province = {
  id: number;
  name: string;
};

export type City = {
  id: number;
  name: string;
  zipCode: string;
};
