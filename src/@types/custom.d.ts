declare namespace Express {
  export interface Request {
    user: {
      _id: string,
    },
    admin: {
      _id: string,
    },
    sessionId: string,
    access_token: string | null,
  }
}
