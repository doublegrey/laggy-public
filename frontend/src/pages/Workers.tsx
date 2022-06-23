import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  VStack,
  useDisclosure,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { RestAPI } from "../api/rest";
import { Worker } from "../types/worker";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Profile } from "../types/profile";
import { GlobalStateContext } from "..";
import { Wallet } from "../types/wallet";

export default function Workers() {
  var navigate = useNavigate();
  const { mining, prices, displayCurrency } = useContext(GlobalStateContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profilesLabels, setProfilesLabels] = useState(
    new Map<string, { name: string; wallet: string }>()
  );
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletsAssets, setWalletsAssets] = useState(new Map<string, string>());
  const [newWorker, setNewWorker] = useState<Worker>({
    id: "",
    name: "",
    created: new Date(),
    profile: "",
    status: "",
    hashrate: 0,
    targetHashrate: 0,
    additionalPower: 0,
    runningSince: new Date(),
    cpu: 0,
    ram: 0,
    storage: 0,
    power: 0,
    gpus: [],
  });

  useEffect(() => {
    fetchWallets();
    fetchProfiles();
    fetchWorkers();
  }, [isOpen]);

  useEffect(() => {
    var temp = new Map<string, any>();
    profiles.forEach((profile) => {
      temp.set(profile.id, { name: profile.name, wallet: profile.wallet });
    });
    setProfilesLabels(temp);
  }, [profiles]);

  useEffect(() => {
    var temp = new Map<string, string>();
    wallets.forEach((wallet) => {
      temp.set(wallet.id, wallet.asset);
    });
    setWalletsAssets(temp);
  }, [wallets]);

  async function fetchWorkers() {
    RestAPI.getWorkers().then((response) => {
      setWorkers(response.data);
    });
  }
  async function fetchProfiles() {
    RestAPI.getProfiles().then((response) => {
      setProfiles(response.data);
    });
  }
  async function fetchWallets() {
    RestAPI.getWallets().then((response) => {
      setWallets(response.data);
    });
  }

  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent mx={{ base: "20px", md: "" }}>
          <ModalBody color={"gray.500"} my={"20px"}>
            <VStack spacing={"15px"}>
              <Box w="100%">
                <Text mb="8px">Name</Text>
                <Input
                  onChange={(event) => {
                    setNewWorker((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));
                  }}
                  value={newWorker.name}
                  size="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Profile</Text>
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
                    value: newWorker.profile,
                    label: profilesLabels.get(newWorker.profile)?.name || "",
                  }}
                  onChange={(option) => {
                    setNewWorker((prev) => ({
                      ...prev,
                      profile: option!.value,
                    }));
                  }}
                  classNamePrefix="select"
                  isClearable={false}
                  name="profile"
                  options={profiles.map((profile) => {
                    return { label: profile.name, value: profile.id };
                  })}
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button
                variant="solid"
                color="white"
                bg="#353d49"
                _hover={{ bg: "#404958" }}
                _active={{ bg: "#404958" }}
                onClick={() => {
                  RestAPI.createWorker(newWorker).then(() => {
                    onClose();
                  });
                }}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        w="100%"
        minH="110px"
        bgColor="white"
        borderRadius="5"
        overflow="scroll"
        boxShadow="sm"
        px="20px"
        py="10px"
        mb="20px"
        display={{ base: "none", md: "block" }}
      >
        <table className="simple-table">
          <thead style={{ color: "#bdbdbd" }}>
            <tr>
              <th>STATUS</th>
              <th>NAME</th>
              <th>ASSET</th>
              <th>CPU</th>
              <th>RAM</th>
              <th>TEMP</th>
              <th>POWER</th>
              <th>PROFIT</th>
              <th>HASHRATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => {
              var asset =
                walletsAssets.get(
                  profilesLabels.get(worker.profile)?.wallet || ""
                ) || "ETH";
              return (
                <tr key={worker.id}>
                  <td>
                    <span
                      className={`floating-dot ${
                        worker.status === "running" ? "success" : "error"
                      }`}
                    ></span>{" "}
                    {worker.status}
                  </td>
                  <td>{worker.name}</td>
                  <td>{asset}</td>
                  <td>{worker.cpu.toFixed(0)}%</td>
                  <td>{worker.ram.toFixed(0)}%</td>
                  <td>
                    {worker.gpus.length > 0
                      ? worker.gpus.reduce(
                          (total, next) => total + next.chip,
                          0
                        ) / worker.gpus.length
                      : 0}{" "}
                    °C
                  </td>
                  <td>
                    {((worker.power + worker.additionalPower) / 1000).toFixed(
                      2
                    )}{" "}
                    kW
                  </td>
                  <td>
                    <span>
                      {/* Ξ ₿ $ € ₽ ¥  */}
                      {displayCurrency.sign}{" "}
                      {prices[asset] !== undefined
                        ? (
                            (worker.hashrate / mining[asset]?.hashrate) *
                            mining[asset]?.blockReward *
                            (86400.0 / mining[asset]?.blockTime) *
                            30 *
                            prices[asset]?.[displayCurrency.currency]
                          ).toFixed(2)
                        : "0.00000"}
                    </span>{" "}
                    / month
                  </td>
                  <td>{(worker.hashrate / 1000000).toFixed(2)} MH/s</td>
                  <td>
                    <span>
                      <HStack w="50px">
                        <Text
                          cursor="pointer"
                          onClick={() => {
                            navigate(`/workers/${worker.id}`);
                          }}
                          color="#2097FD"
                        >
                          view
                        </Text>
                        <Center height="15px">
                          <Divider orientation="vertical" />
                        </Center>
                        <Text
                          onClick={() => {
                            RestAPI.deleteWorker(worker.id).then(() => {
                              fetchWorkers();
                            });
                          }}
                          cursor="pointer"
                          color="#F74D60"
                        >
                          delete
                        </Text>
                      </HStack>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
      <Box display={{ md: "none" }}>
        {workers.map((worker) => {
          var asset =
            walletsAssets.get(
              profilesLabels.get(worker.profile)?.wallet || ""
            ) || "ETH";
          return (
            <Box
              key={worker.id}
              cursor="pointer"
              onClick={() => {
                navigate(`/workers/${worker.id}`);
              }}
              mb={"20px"}
              w="100%"
              textAlign="center"
              bgColor="white"
              p={"5"}
              borderRadius="5"
              color="#05CE24"
              boxShadow="sm"
            >
              <Grid
                color="black"
                h="100px"
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(5, 1fr)"
                gap={4}
              >
                <GridItem
                  fontWeight="500"
                  fontSize="16px"
                  textAlign="start"
                  rowSpan={1}
                  colSpan={{ base: 5, md: 4 }}
                >
                  <HStack spacing="10px">
                    <VStack alignItems="start" spacing="15px" minWidth="80px">
                      <Text fontWeight="600" fontSize="18px" mb="5px">
                        {worker.name}
                      </Text>
                      <VStack alignItems="start" spacing="0">
                        <HStack spacing="5px">
                          <Text fontWeight="700" fontSize="20px">
                            {displayCurrency.sign}
                          </Text>
                          <Text fontWeight="700" fontSize="20px">
                            {prices[asset] !== undefined
                              ? (
                                  (worker.hashrate / mining[asset]?.hashrate) *
                                  mining[asset]?.blockReward *
                                  (86400.0 / mining[asset]?.blockTime) *
                                  30 *
                                  prices[asset]?.[displayCurrency.currency]
                                ).toFixed(2)
                              : "0.00000"}
                          </Text>
                          <Text fontWeight="700" fontSize="20px">
                            /
                          </Text>
                          <Text fontWeight="700" fontSize="20px">
                            month
                          </Text>
                        </HStack>

                        <HStack color="#B1B6BE" mb="15px" spacing="5px">
                          <Text>{(worker.hashrate / 1000000).toFixed(2)}</Text>
                          <Text>MH/s</Text>
                        </HStack>
                      </VStack>
                    </VStack>
                    <Box w="100%" display={{ base: "none", md: "block" }}></Box>

                    <VStack
                      w={{ base: "100%", md: "inherit" }}
                      alignItems="flex-end"
                    >
                      <Text
                        fontWeight="500"
                        color="#CDCDCD"
                        fontSize="16px"
                        mb="40px"
                      >
                        <span
                          className={`floating-dot ${
                            worker.status === "running" ? "success" : "error"
                          }`}
                        ></span>
                      </Text>
                      <Text fontWeight="600" fontSize="16px">
                        {asset}
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>
              </Grid>
            </Box>
          );
        })}
      </Box>
      <Button
        float="right"
        color="white"
        bg="#353d49"
        _hover={{ bg: "#404958" }}
        _active={{ bg: "#404958" }}
        mt="5px"
        w="90px"
        variant={"solid"}
        onClick={() => {
          onOpen();
        }}
      >
        Create
      </Button>
    </Box>
  );
}
