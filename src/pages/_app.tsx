import type { AppProps } from "next/app";

import { AuthProvider } from "@/auth/AuthProvider";

import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "@/styles/theme";

/*
// Alterações
//
// [ ] No modal de criação de tarefa, substituir input de descrição por textarea
// [ ] Botão de editar tarefa
// [ ] implementar Notificações
//
*/

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraBaseProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraBaseProvider>
    </AuthProvider>
  );
}
