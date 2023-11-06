export type BearerToken = `Bearer ${string}`;
export interface AuthMessage {
  headers: {
    Authorization: BearerToken;
  };
}
