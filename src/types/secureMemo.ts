export type SecureMemo = {
  key: string;
  cipherText: string;
  iv: string;
  tag: string;
  salt: string;
  createdAt: number;
  updatedAt: number;
};
