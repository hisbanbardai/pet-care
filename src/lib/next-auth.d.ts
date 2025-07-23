import {} from "next-auth";

declare module "next-auth" {
  interface User {
    hasPaid: boolean;
    id: string;
  }

  interface Session {
    user: User & {
      id: string;
      hasPaid: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    hasPaid: boolean;
  }
}
