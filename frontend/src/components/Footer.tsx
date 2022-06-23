import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaDiscord, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { ReactNode } from "react";

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("#FAFAFA", "whiteAlpha.100")}
      color="#4A5667"
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("#edf1fb", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      className="footer"
      fontSize="14"
      bg={useColorModeValue("#FAFAFA", "gray.900")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          Made with <span style={{ color: "#ff5476" }}>❤️</span> by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            // href="https://t.me/doublegrey"
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#2196fe",
              fontWeight: "600",
            }}
          >
            Innovatio
          </a>
        </Text>
        <Stack direction={"row"} spacing={2}>
          <SocialButton label={"Telegram"} href={""}>
            <FaTelegramPlane
              onClick={() => {
                window.open("https://t.me/laggy_mining", "_blank");
              }}
            />
          </SocialButton>
          <SocialButton label={"Discord"} href={""}>
            <FaDiscord />
          </SocialButton>
          <SocialButton label={"YouTube"} href={""}>
            <FaYoutube />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}
