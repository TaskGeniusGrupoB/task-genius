import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "black.100",
        bg: "background",
      },
    },
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
  colors: {
    background: "white",
    primary: "#EBF1FF",
    black: {
      0: "#000000",
      100: "#0D062D",
      200: "#5A5B80",
    },
    white: {
      0: "#FFFFFF",
      100: "#F5F5F5",
    },
    gray: {
      0: "#6D6D6D",
      100: "#807C8D",
      200: "#5A5B80",
      300: "#9F9F9F",
      400: "#6D6D6D",
    },
    blue: {
      0: "#0047FF",
      100: "#0D0F43",
    },
  },
});
