import {
  Box,
  Button,
  HStack,
  Text,
  Center,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RestAPI } from "../api/rest";
import { Profile } from "../types/profile";
import { Wallet } from "../types/wallet";
import Select from "react-select";

export default function Profiles() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [create, setCreate] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile>({
    id: "",
    wallet: "",
    name: "",
    pool: "ethermine",
    miner: "nbminer",
    created: new Date(),
  });
  const [walletsLabels, setWalletsLabels] = useState(
    new Map<string, { name: string; asset: string }>()
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    fetchWallets();
    fetchProfiles();
  }, [isOpen]);

  useEffect(() => {
    var temp = new Map<string, any>();
    wallets.forEach((wallet) => {
      temp.set(wallet.id, { name: wallet.name, asset: wallet.asset });
    });
    setWalletsLabels(temp);
  }, [wallets]);

  function fetchWallets() {
    RestAPI.getWallets().then((response) => {
      setWallets(response.data);
    });
  }

  function fetchProfiles() {
    RestAPI.getProfiles().then((response) => {
      setProfiles(response.data);
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
                    setEditingProfile((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }));
                  }}
                  value={editingProfile.name}
                  size="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Wallet</Text>
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
                    value: editingProfile.wallet,
                    label:
                      walletsLabels.get(editingProfile.wallet)?.name ||
                      "unknown",
                  }}
                  onChange={(option) => {
                    setEditingProfile((prev) => ({
                      ...prev,
                      wallet: option!.value,
                    }));
                  }}
                  classNamePrefix="select"
                  isClearable={false}
                  name="wallet"
                  options={wallets.map((wallet) => {
                    return { label: wallet.name, value: wallet.id };
                  })}
                />
              </Box>
              <Box w="100%">
                <Text mb="8px">Pool</Text>
                <Input disabled defaultValue={editingProfile.pool} size="md" />
              </Box>
              <Box w="100%">
                <Text mb="8px">Miner</Text>
                <Input
                  disabled
                  onChange={(event) => {}}
                  defaultValue={editingProfile.miner}
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
                    RestAPI.createProfile(editingProfile).then(() => {
                      onClose();
                    });
                  } else {
                    RestAPI.updateProfile(editingProfile).then(() => {
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
              <th>WALLET</th>
              <th>ASSET</th>
              <th>POOL</th>
              <th>MINER</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              return (
                <tr>
                  <td>
                    <span className="floating-dot success"></span> active
                  </td>
                  <td>{profile.name}</td>
                  <td>
                    {walletsLabels.get(profile.wallet)?.name || "unknown"}
                  </td>
                  <td>
                    {walletsLabels.get(profile.wallet)?.asset || "unknown"}
                  </td>
                  <td>{profile.pool}</td>
                  <td>{profile.miner}</td>
                  <td>
                    <span>
                      <HStack>
                        <Text
                          cursor="pointer"
                          color="#2097FD"
                          onClick={() => {
                            setCreate(false);
                            setEditingProfile(profile);
                            onOpen();
                          }}
                        >
                          edit
                        </Text>
                        <Center height="15px">
                          <Divider orientation="vertical" />
                        </Center>
                        <Text
                          cursor="pointer"
                          color="#F74D60"
                          onClick={() => {
                            RestAPI.deleteProfile(profile.id).then(() => {
                              fetchProfiles();
                            });
                          }}
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
          setEditingProfile({
            id: "",
            wallet: "",
            name: "",
            pool: "ethermine",
            miner: "nbminer",
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
