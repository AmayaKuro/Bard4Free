"use client";
import * as React from 'react';

import type { Session } from "next-auth/core/types";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AnimatePresence } from 'framer-motion';

type Props = {
  children?: React.ReactNode;
};


export const NextAuthProvider = ({ children, session }: { children: React.ReactNode, session?: Session }) => {
  // refetchInterval can't not be set by a variable or by return of a function
  return <SessionProvider
    session={session}
    refetchInterval={1740}
  >
  { children }
  </SessionProvider >;
};


export const Theme = ({ children }: Props) => {
  const theme = React.useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#f7f8f9',
      },
      secondary: {
        main: '#d0d0d5',
      },
      error: {
        main: '#f05858',
      },
    },
  }), [])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};


export const AnimateProvider = ({ children }: Props) => {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
