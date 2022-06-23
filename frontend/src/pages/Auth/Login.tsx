import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  Box,
  VStack,
  HStack,
  Image,
  Alert,
  AlertDescription,
} from "@chakra-ui/react";
import { useState } from "react";
import { RestAPI } from "../../api/rest";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { updateDisplayCurrency } from "../..";

export default function Login() {
  var logo = require("../../preview.png");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [trusted, setTrusted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  var navigate = useNavigate();
  return (
    <Box>
      <Stack
        color="#4A5667"
        minH={"100vh"}
        direction={{ base: "column", xl: "row" }}
      >
        <Flex flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"} mx="50px">
            <Heading
              mb="15px"
              textAlign="center"
              fontSize={"3xl"}
              fontWeight="800"
            >
              Welcome back!
            </Heading>
            <Alert hidden={!failed} status="error">
              <AlertDescription>
                Failed to create session. Please check your credentials.
              </AlertDescription>
            </Alert>
            <FormControl id="username">
              <FormLabel>Username</FormLabel>
              <Input
                onChange={(event) => setUsername(event.target.value)}
                value={username}
                bg="#F5F8FB"
                type="username"
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <PasswordInput
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                style={{ backgroundColor: "#F5F8FB" }}
              />
            </FormControl>
            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox
                  onChange={(event) => setTrusted(event.target.checked)}
                  isChecked={trusted}
                  colorScheme="gray"
                >
                  Trusted device
                </Checkbox>
                <Link color={"blue.500"}>Forgot password?</Link>
              </Stack>
              <Box w="100%" align="end">
                <Button
                  color="white"
                  bg="#353d49"
                  _hover={{ bg: "#404958" }}
                  _active={{ bg: "#404958" }}
                  isLoading={loading}
                  mt="5px"
                  w="90px"
                  variant={"solid"}
                  onClick={() => {
                    setLoading(true);
                    RestAPI.login(username, password, trusted)
                      .then((response) => {
                        setLoading(false);
                        if (response.status === 200) {
                          updateDisplayCurrency();
                          navigate("/");
                        } else {
                          setFailed(true);
                        }
                      })
                      .catch(() => {
                        setFailed(true);
                        setLoading(false);
                      });
                  }}
                >
                  Connect
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Flex>
        <Flex
          display={{ base: "none", xl: "flex" }}
          flex={1}
          bg="#e0f2ff"
          borderLeft="2px solid #c9e7ff"
          align={"center"}
          justify={"start"}
          pl={{ base: "20px", xl: "5em" }}
        >
          <Stack spacing="5vh" w={"full"}>
            <VStack align="start" spacing={4}>
              <Heading fontSize={"4xl"} fontWeight="600">
                Laggy Mining
              </Heading>
              <Text fontSize={"xl"} w="750px" color={"gray.600"}>
                The ultimate mining platform which allows users to setup, mine
                and control processes more effectively and hassle-free across
                thousands of rigs all from a single place.
              </Text>
            </VStack>
            <Box
              className="banner-box"
              w={{ base: "full" }}
              mx="auto"
              textAlign="center"
            >
              <div className="ribbon ribbon-top-right">
                <span></span>
              </div>

              <Image
                className="banner-image"
                w="600px"
                rounded="lg"
                shadow="xl"
                src={logo}
                alt="dashboard"
                mb={"20px"}
              />
            </Box>
            <VStack align="start" spacing={4}>
              <Heading fontSize={"3xl"} fontWeight="550">
                Want to join Beta?
              </Heading>
              <HStack spacing="10px">
                <Button
                  onClick={() => {
                    window.open("https://t.me/doublegrey", "_blank");
                  }}
                  _hover={{ backgroundColor: "#d4e8fa" }}
                  _active={{ backgroundColor: "#d4e8fa" }}
                  color="#2196fe"
                  bg="#c7e5ff"
                  w="90px"
                  variant={"solid"}
                >
                  Apply
                </Button>
                <ArrowForwardIcon />
                <Button
                  disabled={true}
                  _hover={{ backgroundColor: "#d4e8fa" }}
                  _active={{ backgroundColor: "#d4e8fa" }}
                  color="#2196fe"
                  bg="#c7e5ff"
                  w="180px"
                  variant={"solid"}
                >
                  Receive Invitation
                </Button>
                <ArrowForwardIcon />
                <Button
                  disabled={true}
                  _hover={{ backgroundColor: "#d4e8fa" }}
                  _active={{ backgroundColor: "#d4e8fa" }}
                  color="#2196fe"
                  bg="#c7e5ff"
                  w="100px"
                  variant={"solid"}
                >
                  Register
                </Button>
              </HStack>
            </VStack>
          </Stack>
        </Flex>
      </Stack>
    </Box>
  );
}
