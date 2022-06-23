import {
  Box,
  Button,
  Center,
  chakra,
  Checkbox,
  Flex,
  GridItem,
  Heading,
  IconButton,
  Input,
  Link,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { BiPlusMedical } from "react-icons/bi";
import { FaFacebook, FaTelegramPlane } from "react-icons/fa";
import { MdHttps } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { updateDisplayCurrency } from "..";
import { RestAPI } from "../api/rest";

export function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    username: "",
    email: "",
    contactInfo: "",
    currency: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    RestAPI.me().then((response) => setUser(response.data));
  }, []);

  function handleChange(field: string, value: any) {
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }
  return (
    <Center>
      <Box p={{ base: 0, md: 10 }} maxW="1200px">
        <Box mt={[10, 0]}>
          <SimpleGrid
            display={{ base: "initial", md: "grid" }}
            columns={{ md: 3 }}
            spacing={{ md: 6 }}
          >
            <GridItem colSpan={{ md: 1 }}>
              <Box px={[4, 0]}>
                <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                  Personal Information
                </Heading>
                <Text mt={1} fontSize="sm" color={"gray.600"}>
                  Change your account information here. Connect third-party
                  accounts to enable{" "}
                  <Link
                    color="blue.400"
                    onClick={() => {
                      var el = document.getElementsByClassName(
                        "notifications-section"
                      );
                      if (el.length > 0) {
                        el[0].scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    Notifications
                  </Link>
                </Text>
              </Box>
            </GridItem>
            <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
              <Stack
                color={"gray.700"}
                px={4}
                py={5}
                p={[null, 6]}
                bg={"white"}
                spacing={6}
              >
                <Stack
                  spacing={"15px"}
                  w="100%"
                  direction={{ base: "column", lg: "row" }}
                >
                  <Box w="100%">
                    <Text mb="8px">First Name</Text>
                    <Input
                      onChange={(event) => {
                        handleChange("firstName", event.target.value);
                      }}
                      value={user.firstName}
                      size="md"
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb="8px">Username</Text>
                    <Input
                      onChange={(event) => {
                        handleChange("username", event.target.value);
                      }}
                      value={user.username}
                      size="md"
                    />
                  </Box>
                </Stack>
                <Stack
                  spacing={"15px"}
                  w="100%"
                  direction={{ base: "column", lg: "row" }}
                >
                  <Box w="100%">
                    <Text mb="8px">Email Address</Text>
                    <Input
                      onChange={(event) => {
                        handleChange("email", event.target.value);
                      }}
                      value={user.email}
                      size="md"
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb="8px">Contact Information</Text>
                    <Input
                      onChange={(event) => {
                        handleChange("contactInfo", event.target.value);
                      }}
                      value={user.contactInfo}
                      size="md"
                    />
                  </Box>
                </Stack>
                <Stack
                  spacing={"15px"}
                  w="100%"
                  direction={{ base: "column", lg: "row" }}
                >
                  <Box w="100%">
                    <Text mb="8px">Currency</Text>
                    <Select
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 1000000,
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#718196",
                        }),
                        control: (base, state) => ({
                          ...base,
                          minHeight: 40,
                          border: "1px solid #E2E8F0",
                          transition: "0.3s",
                          "&:hover": {
                            border: "1px solid #CBD5E0",
                          },
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                          ...theme.colors,
                          primary: "#3082CE",
                        },
                      })}
                      value={{
                        value: user.currency,
                        label: user.currency,
                      }}
                      onChange={(option) => {
                        handleChange("currency", option!.value);
                      }}
                      classNamePrefix="select"
                      isClearable={false}
                      name="wallet"
                      options={[
                        { label: "USD", value: "USD" },
                        { label: "EUR", value: "EUR" },
                        { label: "ETH", value: "ETH" },
                        { label: "BTC", value: "BTC" },
                        { label: "RUB", value: "RUB" },
                        { label: "CNY", value: "CNY" },
                      ]}
                    />
                  </Box>
                  <Box w="100%">
                    <Text mb="8px">Country</Text>
                    <Input disabled size="md" />
                  </Box>
                  <Box w="100%">
                    <Text mb="8px">Time Zone</Text>
                    <Input disabled size="md" />
                  </Box>
                </Stack>
                <Stack
                  spacing={"15px"}
                  w="100%"
                  direction={{ base: "column", lg: "row" }}
                >
                  <Button
                    disabled
                    w={"full"}
                    colorScheme={"telegram"}
                    leftIcon={<FaTelegramPlane />}
                  >
                    <Center>
                      <Text>Telegram</Text>
                    </Center>
                  </Button>
                  <Button
                    disabled
                    w={"full"}
                    colorScheme={"facebook"}
                    leftIcon={<FaFacebook />}
                  >
                    <Center>
                      <Text>Facebook</Text>
                    </Center>
                  </Button>
                  <Button
                    disabled
                    w={"full"}
                    colorScheme={"gray"}
                    leftIcon={<MdHttps />}
                  >
                    <Center>
                      <Text>Webhook</Text>
                    </Center>
                  </Button>
                </Stack>
              </Stack>
            </GridItem>
          </SimpleGrid>
        </Box>

        <Box visibility={{ base: "hidden", sm: "visible" }} aria-hidden="true">
          <Box py={5}>
            <Box borderTop="solid 1px" borderTopColor={"gray.200"}></Box>
          </Box>
        </Box>

        <Box mt={[10, 0]}>
          <SimpleGrid
            display={{ base: "initial", md: "grid" }}
            columns={{ md: 3 }}
            spacing={{ md: 6 }}
          >
            <GridItem colSpan={{ md: 1 }}>
              <Box px={[4, 0]}>
                <Heading
                  fontSize="lg"
                  fontWeight="medium"
                  lineHeight="6"
                  className="notifications-section"
                >
                  Notifications
                </Heading>
                <Text mt={1} fontSize="sm" color={"gray.600"}>
                  Decide which notifications you'd like to receive and how
                </Text>
              </Box>
            </GridItem>
            <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
              <Stack px={4} py={5} p={[null, 6]} bg={"white"} spacing={6}>
                <chakra.fieldset>
                  <Box as="legend" fontSize="md" color={"gray.900"}>
                    Events
                  </Box>
                  <Stack mt={4} spacing={4}>
                    <Flex alignItems="start">
                      <Flex alignItems="center" h={5}>
                        <Checkbox
                          id="comments"
                          rounded="md"
                          colorScheme="gray"
                        />
                      </Flex>
                      <Box ml={3} fontSize="sm">
                        <chakra.label
                          htmlFor="comments"
                          fontWeight="md"
                          color={"gray.700"}
                        >
                          Workers
                        </chakra.label>
                        <Text color={"gray.500"}>
                          Get notified on workers status change.
                        </Text>
                      </Box>
                    </Flex>
                    <Flex alignItems="start">
                      <Flex alignItems="center" h={5}>
                        <Checkbox
                          id="comments"
                          rounded="md"
                          colorScheme="gray"
                        />
                      </Flex>
                      <Box ml={3} fontSize="sm">
                        <chakra.label
                          htmlFor="comments"
                          fontWeight="md"
                          color={"gray.700"}
                        >
                          Payouts
                        </chakra.label>
                        <Text color={"gray.500"}>
                          Get notified on new payout to linked wallet.
                        </Text>
                      </Box>
                    </Flex>

                    <Flex alignItems="start">
                      <Flex alignItems="center" h={5}>
                        <Checkbox
                          id="comments"
                          rounded="md"
                          colorScheme="gray"
                        />
                      </Flex>
                      <Box ml={3} fontSize="sm">
                        <chakra.label
                          htmlFor="comments"
                          fontWeight="md"
                          color={"gray.700"}
                        >
                          Miners
                        </chakra.label>
                        <Text color={"gray.500"}>
                          Get notified when miner software fires events.
                        </Text>
                      </Box>
                    </Flex>

                    <Flex alignItems="start">
                      <Flex alignItems="center" h={5}>
                        <Checkbox
                          id="comments"
                          rounded="md"
                          colorScheme="gray"
                        />
                      </Flex>
                      <Box ml={3} fontSize="sm">
                        <chakra.label
                          htmlFor="comments"
                          fontWeight="md"
                          color={"gray.700"}
                        >
                          Account
                        </chakra.label>
                        <Text color={"gray.500"}>
                          Get notified on new account activity.
                        </Text>
                      </Box>
                    </Flex>
                  </Stack>
                </chakra.fieldset>
                <chakra.fieldset>
                  <Box as="legend" fontSize="md" color={"gray.900"}>
                    Web Push Notifications
                    <Text fontSize="sm" color={"gray.500"}>
                      Notifications delivered via Web Browser to your device.
                    </Text>
                  </Box>
                  <RadioGroup
                    fontSize="sm"
                    color={"gray.700"}
                    mt={4}
                    defaultValue="1"
                  >
                    <Stack spacing={4}>
                      <Radio colorScheme="gray" spacing={3} value="2">
                        Send notifications
                      </Radio>
                      <Radio colorScheme="gray" spacing={3} value="3">
                        No push notifications
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </chakra.fieldset>
              </Stack>
            </GridItem>
          </SimpleGrid>
        </Box>
        <Box visibility={{ base: "hidden", sm: "visible" }} aria-hidden="true">
          <Box py={5}>
            <Box borderTop="solid 1px" borderTopColor={"gray.200"}></Box>
          </Box>
        </Box>

        <Box mt={[10, 0]}>
          <SimpleGrid
            display={{ base: "initial", md: "grid" }}
            columns={{ md: 3 }}
            spacing={{ md: 6 }}
          >
            <GridItem colSpan={{ md: 1 }}>
              <Box px={[4, 0]}>
                <Heading fontSize="lg" fontWeight="medium" lineHeight="6">
                  API
                </Heading>
                <Text mt={1} fontSize="sm" color={"gray.600"}>
                  With the API token, you can create custom integrations that
                  completely fit your needs. You can find the full list of
                  possibilities in{" "}
                  <Link
                    color="blue.400"
                    onClick={() => navigate("/documentation")}
                  >
                    Docs
                  </Link>{" "}
                  section
                </Text>
              </Box>
            </GridItem>
            <GridItem mt={[5, null, 0]} colSpan={{ md: 2 }}>
              <Stack px={4} py={5} p={[null, 6]} bg={"white"} spacing={6}>
                <chakra.fieldset>
                  <Box mb={"30px"} as="legend" fontSize="md" color={"gray.900"}>
                    API Tokens
                  </Box>

                  <Text fontSize="sm" color={"gray.500"}>
                    No tokens are linked to your account...
                  </Text>
                </chakra.fieldset>
              </Stack>
              <Box
                px={{ base: 4, sm: 6 }}
                pb={{ base: 4 }}
                bg={"white"}
                textAlign="right"
              >
                <IconButton
                  disabled={true}
                  variant="outline"
                  aria-label="add-token"
                  icon={<BiPlusMedical />}
                />
              </Box>
            </GridItem>
          </SimpleGrid>
        </Box>
        <Box mt={10} textAlign="right">
          <Button
            type="submit"
            isLoading={loading}
            color="white"
            bg="#353d49"
            _hover={{ bg: "#404958" }}
            _active={{ bg: "#404958" }}
            w="90px"
            variant={"solid"}
            onClick={() => {
              setLoading(true);
              updateDisplayCurrency(user.currency);
              RestAPI.updateUser(user).then(() => setLoading(false));
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
