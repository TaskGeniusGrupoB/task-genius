import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/router";

import { auth } from "./firebase";
import {
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as FirebaseSignOut,
  sendPasswordResetEmail as FirebaseSendPasswordResetEmail,
} from "firebase/auth";

import axios from "axios";

import { recover } from "./recover";

import { useCookies } from "@/hooks/useCookies";

import type { User } from "@/database/functions";

interface AuthProviderProps {
  children?: React.ReactNode;
}

type signInProps = Pick<User, "email"> & {
  password: string;
};

type signUpProps = Pick<User, "email" | "name"> & { password: string };

type sendPasswordResetEmailProps = Pick<User, "email">;

export interface AuthContextModel {
  auth: Auth;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;

  signUp: ({ email, name, password }: signUpProps) => Promise<UserCredential>;
  signIn: ({ email, password }: signInProps) => Promise<UserCredential>;
  signOut: () => Promise<void>;

  sendPasswordResetEmail: ({
    email,
  }: sendPasswordResetEmailProps) => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const { readCookie, createCookie, deleteCookie } = useCookies();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userCookie = readCookie("user.token");

    if (!!userCookie) {
      recover({ email: userCookie }).then((response) => {
        if (!response) return;

        const { id, email, name, tasks, member } = response;
        setUser({ id, email, name, tasks, member });
      });
    }
  }, []);

  async function signUp({ email, name, password }: signUpProps) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const {
      data: { user },
    }: {
      data: { user: User };
    } = await axios.post("/api/auth/createUser", { email, name });

    createCookie("user.token", user.email, {
      maxAge: 60 * 60 * 24 * 7, // one week
    });

    setUser(user);

    router.push("/home");

    return userCredential;
  }

  async function signIn({ email, password }: signInProps) {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = await recover({ email });

    createCookie("user.token", user!.email, {
      maxAge: 60 * 60 * 24 * 7, // one week
    });

    setUser(user!);

    router.push("/home");

    return userCredential;
  }

  async function signOut() {
    await FirebaseSignOut(auth);

    deleteCookie("user.token");

    setUser(null);

    router.push("/auth/login");
  }

  async function sendPasswordResetEmail({
    email,
  }: sendPasswordResetEmailProps) {
    await FirebaseSendPasswordResetEmail(auth, email);
  }

  const values: AuthContextModel = {
    user,
    setUser,
    signIn,
    signUp,
    signOut,
    sendPasswordResetEmail,
    auth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
