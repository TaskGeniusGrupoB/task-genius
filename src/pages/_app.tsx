import type { AppProps } from "next/app";

import { AuthProvider } from "@/auth/AuthProvider";

import { ChakraBaseProvider } from "@chakra-ui/react";
import { theme } from "@/styles/theme";

/*
// Senhas de conexão
//
// Antiga
// mysql://5jpvqvvv4o1aiwudh1sp:pscale_pw_oRgfOt8uSG25Zo9EkRNVFRIonuWDdnzOuT17ztkeNgZ@aws.connect.psdb.cloud/task-genius?ssl={"rejectUnauthorized":true}'&sslcert=/etc/pki/tls/certs/ca-bundle.crt
// 
// Nova
// mysql://s9xzos308mrc9vxi7amt:pscale_pw_8QFPzbGpA69PXBmW808VrDRYHVFQ7yJjYldfTXMyQSn@aws.connect.psdb.cloud/task-genius?ssl={"rejectUnauthorized":true}
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
