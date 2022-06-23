import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  var navigate = useNavigate();
  return (
    <Box textAlign="center" py={10} px={6} mt="18vh">
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgColor="#2196fe"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        color="white"
        bg="#353d49"
        _hover={{ bg: "#404958" }}
        _active={{ bg: "#404958" }}
        mt="5px"
        variant={"solid"}
        onClick={() => {
          navigate("/dashboard");
        }}
      >
        Back To Home
      </Button>
    </Box>
  );
}
