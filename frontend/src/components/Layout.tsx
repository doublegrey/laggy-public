import { Box } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout(props: any) {
  return (
    <>
      <Header />

      <Box
        minH="100vh"
        bgColor="#f7fafc"
        p={{ base: "2em", md: "6em" }}
        py={{ base: "2em", md: "4em" }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
