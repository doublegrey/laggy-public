import {
  Box,
  Button,
  HStack,
  useDisclosure,
  Text,
  Center,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { GlobalStateContext } from "..";
import { RestAPI } from "../api/rest";
import CopyableText from "../components/CopyableText";
import { Wallet } from "../types/wallet";

export default function Wallets() {
  const { mining, prices, displayCurrency } = useContext(GlobalStateContext);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [create, setCreate] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet>({
    id: "",
    name: "",
    asset: "ETH",
    address: "",
    source: "Laggy",
    balance: 0,
    unpaidBalance: 0,
    created: new Date(),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchWallets();
  }, [isOpen]);

  function fetchWallets() {
    RestAPI.getWallets().then((response) => {
      setWallets(response.data);
    });
  }

  return (
    <Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody color={"gray.500"} my={"20px"}>
            <VStack spacing={"15px"}>
              <Box w="100%">
                <Text mb="8px">Name</Text>
                <Input
                  onChange={(event) => {
                    setEditingWallet((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));
                  }}
                  value={editingWallet.name}
                  size="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Asset</Text>
                <Input disabled defaultValue={editingWallet.asset} size="md" />
              </Box>
              <Box w="100%">
                <Text mb="8px">Address</Text>
                <Input
                  onChange={(event) => {
                    setEditingWallet((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }));
                  }}
                  value={editingWallet.address}
                  size="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Source</Text>
                <Input
                  disabled
                  onChange={(event) => {}}
                  defaultValue={editingWallet.source}
                  size="md"
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
                  if (create) {
                    RestAPI.createWallet(editingWallet).then(() => {
                      onClose();
                    });
                  } else {
                    RestAPI.updateWallet(editingWallet).then(() => {
                      onClose();
                    });
                  }
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
      >
        <table className="simple-table">
          <thead style={{ color: "#bdbdbd" }}>
            <tr>
              <th>STATUS</th>
              <th>NAME</th>
              <th>ASSET</th>
              <th>ADDRESS</th>
              <th>SOURCE</th>
              <th>BALANCE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => {
              return (
                <tr key={wallet.id}>
                  <td>
                    <span className="floating-dot success"></span> connected
                  </td>
                  <td>{wallet.name}</td>
                  <td>{wallet.asset}</td>
                  <td style={{ width: "520px" }}>
                    <CopyableText
                      text={wallet.address}
                      style={{ fontFamily: "monospace" }}
                    />
                  </td>
                  <td>{wallet.source}</td>
                  <td>
                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <div>
                          {displayCurrency.sign}{" "}
                          {(
                            prices[wallet.asset]?.[displayCurrency.currency] *
                            (wallet.balance + wallet.unpaidBalance)
                          ).toFixed(2)}{" "}
                          ({(wallet.balance + wallet.unpaidBalance).toFixed(5)}{" "}
                          {wallet.asset})
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <VStack align={"start"}>
                            <HStack w="100%">
                              <Text w="100%">Confirmed Balance:</Text>
                              <Text w="250px" textAlign={"end"}>
                                {wallet.balance.toFixed(5)} {wallet.asset}
                              </Text>
                            </HStack>
                            <Divider />
                            <HStack w="100%">
                              <Text w="100%">Unpaid Balance:</Text>
                              <Text w="250px" textAlign={"end"}>
                                {wallet.unpaidBalance.toFixed(5)} {wallet.asset}
                              </Text>
                            </HStack>
                          </VStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </td>
                  <td>
                    <span>
                      <HStack>
                        <Text
                          cursor="pointer"
                          onClick={() => {
                            setCreate(false);
                            setEditingWallet(wallet);
                            onOpen();
                          }}
                          color="#2097FD"
                        >
                          edit
                        </Text>
                        <Center height="15px">
                          <Divider orientation="vertical" />
                        </Center>
                        <Text
                          cursor="pointer"
                          onClick={() => {
                            RestAPI.deleteWallet(wallet.id).then(() => {
                              fetchWallets();
                            });
                          }}
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
          setCreate(true);
          setEditingWallet({
            id: "",
            name: "",
            asset: "ETH",
            address: "",
            source: "Laggy",
            balance: 0,
            unpaidBalance: 0,
            created: new Date(),
          });
          onOpen();
        }}
      >
        Create
      </Button>
    </Box>
  );
}
