export type User = {
  id: number;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  full_name: string;
};
