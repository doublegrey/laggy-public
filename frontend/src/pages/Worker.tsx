import {
  Box,
  Stack,
  HStack,
  VStack,
  Icon,
  IconButton,
  StackDivider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Input,
  ModalFooter,
  InputGroup,
  InputRightAddon,
  Grid,
  GridItem,
  Divider,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CardsTable from "../components/CardsTable";
import { FiActivity, FiCpu, FiRefreshCw, FiSettings } from "react-icons/fi";
import { MdOutlineArrowBackIosNew, MdSdStorage } from "react-icons/md";
import { FaMicrochip, FaWifi } from "react-icons/fa";
import { ImPowerCord } from "react-icons/im";
import { SiArtixlinux } from "react-icons/si";
import { BiTimeFive } from "react-icons/bi";
import { Worker } from "../types/worker";
import { Wallet } from "../types/wallet";
import { RestAPI } from "../api/rest";
import { Profile } from "../types/profile";
import moment from "moment";
import { bytesToSize } from "../utils";
import { GlobalStateContext } from "..";

export default function WorkerPage() {
  const { mining, prices, displayCurrency } = useContext(GlobalStateContext);
  const { workerId } = useParams();
  const [gpuModalOpened, setGpuModalOpened] = useState(false);
  const [settingsModalOpened, setSettingsModalOpened] = useState(false);
  const [worker, setWorker] = useState<Worker>({
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
  const [updatedWorker, setUpdatedWorker] = useState<Worker>({
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
  const [profile, setProfile] = useState<Profile>({
    id: "",
    wallet: "",
    name: "",
    pool: "",
    miner: "",
    created: new Date(),
  });
  const [wallet, setWallet] = useState<Wallet>({
    id: "",
    name: "",
    asset: "",
    address: "",
    source: "",
    created: new Date(),
    balance: 0,
    unpaidBalance: 0,
  });
  var navigate = useNavigate();
  useEffect(() => {
    if (workerId!.length !== 24) {
      navigate("/workers");
    }
    // display uptime in hours for first 2 days
    moment.relativeTimeThreshold("m", 60);
    moment.relativeTimeThreshold("h", 24 * 2);

    fetchWorker(workerId!);
  }, [workerId]);

  function fetchWorker(id: string) {
    RestAPI.getWorker(id).then((response) => {
      setWorker(response.data);
      setUpdatedWorker(response.data);
      fetchProfile(response.data.profile);
    });
  }

  function fetchProfile(id: string) {
    RestAPI.getProfile(id).then((response) => {
      setProfile(response.data);
      fetchWallet(response.data.wallet);
    });
  }

  function fetchWallet(id: string) {
    RestAPI.getWallet(id).then((response) => {
      setWallet(response.data);
    });
  }

  return (
    <Box>
      <Modal
        onClose={() => setSettingsModalOpened(false)}
        isOpen={settingsModalOpened}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody color={"gray.500"} my={"20px"}>
            <VStack spacing={"15px"}>
              <Box w="100%">
                <Text mb="8px">Token</Text>
                <Input readOnly defaultValue={updatedWorker.id} size="md" />
              </Box>
              <Box w="100%">
                <Text mb="8px">Name</Text>
                <Input
                  onChange={(event) => {
                    setUpdatedWorker((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));
                  }}
                  value={updatedWorker.name}
                  size="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Profile</Text>
                <Input onChange={(event) => {}} disabled size="md" />
              </Box>
              <Box w="100%">
                <Text mb="8px">Target Hashrate</Text>
                <InputGroup size="md">
                  <Input
                    onChange={(event) => {
                      setUpdatedWorker((prev) => ({
                        ...prev,
                        targetHashrate:
                          parseInt(
                            event.target.value.length > 0
                              ? event.target.value
                              : "0"
                          ) * 1000000,
                      }));
                    }}
                    value={updatedWorker.targetHashrate / 1000000}
                    size="md"
                  />
                  <InputRightAddon children="MH/s" />
                </InputGroup>
              </Box>
              <Box w="100%">
                <Text mb="8px">Additional Power Consumption</Text>
                <InputGroup size="md">
                  <Input
                    onChange={(event) => {
                      setUpdatedWorker((prev) => ({
                        ...prev,
                        additionalPower: parseInt(
                          event.target.value.length > 0
                            ? event.target.value
                            : "0"
                        ),
                      }));
                    }}
                    value={updatedWorker.additionalPower}
                    size="md"
                  />
                  <InputRightAddon children="W" />
                </InputGroup>
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
                  RestAPI.updateWorker(updatedWorker).then(() => {
                    fetchWorker(workerId!);
                    setSettingsModalOpened(false);
                  });
                }}
              >
                Save
              </Button>
              <Button onClick={() => setSettingsModalOpened(false)}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        onClose={() => setGpuModalOpened(false)}
        isOpen={gpuModalOpened}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody color={"gray.500"} my={"20px"}>
            <VStack spacing={"15px"}>
              <Box w="100%">
                <Text mb="8px">PCI Lookup</Text>
                <Input disabled defaultValue={""} size="md" />
              </Box>
              <Box w="100%">
                <Text mb="8px">Core Clock</Text>
                <InputGroup size="md">
                  <Input onChange={(event) => {}} size="md" />
                  <InputRightAddon children="MHz" />
                </InputGroup>
              </Box>
              <Box w="100%">
                <Text mb="8px">Memory Clock</Text>
                <InputGroup size="md">
                  <Input onChange={(event) => {}} size="md" />
                  <InputRightAddon children="MHz" />
                </InputGroup>
              </Box>
              <Box w="100%">
                <Text mb="8px">Fan Speed</Text>
                <InputGroup size="md">
                  <Input onChange={(event) => {}} size="md" />
                  <InputRightAddon children="%" />
                </InputGroup>
              </Box>
              <Box w="100%">
                <Text mb="8px">Power Limit</Text>
                <InputGroup size="md">
                  <Input onChange={(event) => {}} size="md" />
                  <InputRightAddon children="W" />
                </InputGroup>
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
                onClick={() => {}}
              >
                Save
              </Button>
              <Button onClick={() => setGpuModalOpened(false)}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <HStack
        mb={10}
        w="100%"
        spacing="1px"
        display={{ base: "none", md: "flex" }}
      >
        <HStack w="70%">
          <IconButton
            mt="2px"
            onClick={() => {
              navigate("/workers");
            }}
            border="none"
            variant="outline"
            size="sm"
            aria-label="back"
            icon={<MdOutlineArrowBackIosNew />}
          />
        </HStack>

        <Box w="30%">
          <IconButton
            onClick={() => {
              setSettingsModalOpened(true);
            }}
            border="none"
            variant="outline"
            size="sm"
            aria-label="settings"
            float="right"
            icon={<FiSettings />}
          />
          <IconButton
            onClick={() => {
              if (workerId) {
                fetchWorker(workerId);
              }
            }}
            mr={2}
            border="none"
            variant="outline"
            size="sm"
            aria-label="settings"
            float="right"
            icon={<FiRefreshCw />}
          />
        </Box>
      </HStack>
      <VStack
        mb={"40px"}
        divider={<StackDivider borderColor="gray.100" />}
        spacing={4}
        fontSize="md"
        align="stretch"
        display={{ base: "none", lg: "inherit" }}
      >
        <Box>
          <Stack
            direction={{ base: "column", md: "row" }}
            w="100%"
            spacing={{ base: "20px", md: "50px" }}
          >
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Name
              </Text>
              <Text float="right">{worker.name}</Text>
            </Box>
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Status
              </Text>
              <Text float="right">
                <span
                  className={`floating-dot ${
                    worker.status === "running" ? "success" : "error"
                  }`}
                ></span>{" "}
                {worker.status}
              </Text>
            </Box>
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Asset
              </Text>
              <Text float="right">{wallet.asset}</Text>
            </Box>
          </Stack>
        </Box>
        <Box>
          <Stack
            direction={{ base: "column", md: "row" }}
            w="100%"
            spacing={{ base: "20px", md: "50px" }}
          >
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Wallet
              </Text>
              <Text float="right">{wallet.name}</Text>
            </Box>
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Pool
              </Text>
              <Text float="right">{profile.pool}</Text>
            </Box>
            <Box w={{ base: "100%", md: "33%" }}>
              <Text float="left" as="b">
                Miner
              </Text>
              <Text float="right">{profile.miner}</Text>
            </Box>
          </Stack>
        </Box>
      </VStack>
      <Box mb={{ base: "30px", md: "50px" }}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          w="100%"
          align="end"
          spacing="20px"
          mb="20px"
        >
          <HStack
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={SiArtixlinux}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Profit</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {displayCurrency.sign}{" "}
                  {prices[wallet.asset] !== undefined
                    ? (
                        (worker.hashrate / mining[wallet.asset]?.hashrate) *
                        mining[wallet.asset]?.blockReward *
                        (86400.0 / mining[wallet.asset]?.blockTime) *
                        30 *
                        prices[wallet.asset]?.[displayCurrency.currency]
                      ).toFixed(2)
                    : "0.00"}
                </span>{" "}
                / month
              </Text>
            </VStack>
          </HStack>
          <HStack
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={FiActivity}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Hashrate</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {(worker.hashrate / 1000000).toFixed(2)} MH/s
                </span>
              </Text>
            </VStack>
          </HStack>

          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={BiTimeFive}
            />

            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Uptime</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {new Date(worker.runningSince).getFullYear() > 2
                    ? moment(worker.runningSince).fromNow(true)
                    : "offline"}
                </span>
              </Text>
            </VStack>
          </HStack>
          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={FaWifi}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Network</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>100%</span>
              </Text>
            </VStack>
          </HStack>
        </Stack>
        <Stack
          direction={{ base: "column", lg: "row" }}
          w="100%"
          align="end"
          spacing="20px"
        >
          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={FiCpu}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>CPU</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {worker.cpu.toFixed(0)}%
                </span>
              </Text>
            </VStack>
          </HStack>

          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="40px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={FaMicrochip}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>RAM</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {worker.ram.toFixed(0)}%
                </span>
              </Text>
            </VStack>
          </HStack>
          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={MdSdStorage}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Storage</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {bytesToSize(worker.storage)}
                </span>
              </Text>
            </VStack>
          </HStack>
          <HStack
            display={{ base: "none", lg: "inherit" }}
            bgColor="white"
            p={"5"}
            borderRadius="5"
            color="#05CE24"
            boxShadow="sm"
            w="100%"
            spacing="30px"
          >
            <Icon
              borderRadius="15px"
              fontSize="45px"
              aria-label="crypto-icon"
              color="#2097FD"
              as={ImPowerCord}
            />
            <VStack align="left" color="gray.600" spacing="0px">
              <Text>Power</Text>
              <Text fontSize="md" as="b">
                <span style={{ fontSize: "25px" }}>
                  {((worker.power + worker.additionalPower) / 1000).toFixed(2)}{" "}
                  kW
                </span>
              </Text>
            </VStack>
          </HStack>
        </Stack>
      </Box>
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
        <CardsTable
          editGpu={(gpu: any) => {
            setGpuModalOpened(true);
          }}
          gpus={worker.gpus}
        />
      </Box>
      <Box display={{ base: "block", md: "none" }}>
        <Divider mb="30px" />
        {(worker.gpus !== null ? worker.gpus : []).map((gpu) => {
          return (
            <Box
              cursor="pointer"
              mb={"20px"}
              w="100%"
              textAlign="center"
              bgColor="white"
              p={"5"}
              borderRadius="5"
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
                    <VStack alignItems="start" spacing="15px" minWidth="200px">
                      <Text
                        fontWeight="600"
                        color={"gray.800"}
                        fontSize="18px"
                        mb="5px"
                      >
                        {gpu.name}
                      </Text>
                      <VStack alignItems="start" spacing="0">
                        <HStack color="gray.600" spacing="5px">
                          <Text fontWeight="700" fontSize="20px">
                            {(gpu.hashrate / 1000000).toFixed(2)}
                          </Text>
                          <Text fontWeight="700" fontSize="20px">
                            MH/s
                          </Text>
                        </HStack>

                        <HStack color="#B1B6BE" mb="15px" spacing="5px">
                          <Text>{gpu.load.toFixed(0)}%</Text>
                          <Center height="10px">
                            <Divider orientation="vertical" />
                          </Center>

                          <Text>{gpu.fan.toFixed(0)}%</Text>
                          <Center height="10px">
                            <Divider orientation="vertical" />
                          </Center>
                          <Text>{gpu.power.toFixed(0)} W</Text>
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
                        {gpu.chip} °C
                      </Text>
                      <Text fontWeight="500" color="#CDCDCD" fontSize="16px">
                        {gpu.mem} °C
                      </Text>
                    </VStack>
                  </HStack>
                </GridItem>
              </Grid>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
