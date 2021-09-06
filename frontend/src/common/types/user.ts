export interface User {
  id: number;
  email: string;
  username: string;
  isRegisteredWithGoogle: boolean;
  avatar: string | null;
  googleAvatar: string;
}