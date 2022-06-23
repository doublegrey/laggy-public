import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  useBreakpointValue,
  Center,
  AvatarBadge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SettingsIcon } from "@chakra-ui/icons";
import { useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import { RestAPI } from "../api/rest";

import { AiOutlineUser } from "react-icons/ai";

const Links = [
  { link: "/dashboard", title: "Dashboard", disabled: false },
  { link: "/workers", title: "Workers", disabled: false },
  { link: "/profiles", title: "Profiles", disabled: false },
  { link: "/wallets", title: "Wallets", disabled: false },
  { link: "/payouts", title: "Payouts", disabled: true },
];

const NavLink = (props: any) => {
  let resolved = useResolvedPath(props.link);
  let match = useMatch({ path: resolved.pathname, end: false });

  return (
    <Text
      display={props.display}
      className={`header-link ${match && "selected"} ${
        props.disabled && "disabled"
      } ${props.mobile ? "mobile" : ""}`}
      textAlign={useBreakpointValue({ base: "center", md: "left" })}
      color={useColorModeValue("gray.600", "#ABB2BF")}
      cursor="pointer"
      onClick={() => {
        !props.disabled && props.onClick();
      }}
      onMouseEnter={props.onMouseEnter}
    >
      {props.title}
    </Text>
  );
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  var navigate = useNavigate();
  const [tabsHighlight, setTabsHighlight] = useState({
    width: 0,
    offset: 0,
    visible: false,
  });

  useEffect(() => {
    // TODO: set currentLink
  }, []);

  return (
    <>
      <Box
        fontSize="14"
        bg={useColorModeValue("white", "gray.900")}
        boxShadow="sm"
        px={4}
        w="100%"
      >
        <Center>
          <Flex
            w={{ base: "100%", lg: "1500px" }}
            h={16}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <IconButton
              _hover={{ backgroundColor: "white" }}
              _active={{ backgroundColor: "white" }}
              variant="outline"
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Menu"}
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={"center"}>
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontWeight="700"
                color={useColorModeValue("gray.800", "#ABB2BF")}
                cursor="pointer"
                onClick={() => navigate("/dashboard")}
                fontSize="lg"
              >
                Laggy
              </Text>

              <div
                className="tab-highlight"
                style={{
                  pointerEvents: "none",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  margin: "0 0",
                  width: tabsHighlight.width,
                  height: "33px",
                  transform: `translateX(${tabsHighlight.offset}px)`,
                  background: tabsHighlight.visible
                    ? "rgba(32, 151, 253, 0.1)"
                    : "transparent",
                  borderRadius: "4px",
                  transitionDuration: "150ms",
                }}
              ></div>

              <HStack
                as={"nav"}
                spacing={{ base: 4, md: "4px" }}
                display={{ base: "none", md: "flex" }}
                onMouseLeave={() => {
                  setTabsHighlight((prev) => ({ ...prev, visible: false }));
                }}
              >
                {Links.map((link, index) => (
                  <NavLink
                    key={link.title}
                    link={link.link}
                    title={link.title}
                    disabled={link.disabled}
                    onClick={() => {
                      navigate(link.link);
                    }}
                    onMouseEnter={(e: any) => {
                      if (!link.disabled) {
                        let rect = e.target.getBoundingClientRect();
                        setTabsHighlight({
                          width: rect.width,
                          offset: rect.x,
                          visible: true,
                        });
                      } else {
                        setTabsHighlight((prev) => ({
                          ...prev,
                          visible: false,
                        }));
                      }
                    }}
                  />
                ))}
              </HStack>
            </HStack>
            <Flex alignItems={"center"}>
              <HStack mr="15px" spacing={"4px"}>
                <NavLink
                  disabled
                  key={"changelog"}
                  link={"/changes"}
                  title={"Changelog"}
                  display={{ base: "none", md: "block" }}
                  onClick={() => {
                    navigate("/changes");
                  }}
                />
                <NavLink
                  disabled
                  key={"support"}
                  link={"/support"}
                  title={"Support"}
                  display={{ base: "none", md: "block" }}
                  onClick={() => {
                    navigate("/support");
                  }}
                />
                <NavLink
                  disabled
                  key={"documentation"}
                  link={"/documentation"}
                  title={"Docs"}
                  display={{ base: "none", md: "block" }}
                  onClick={() => {
                    navigate("/documentation");
                  }}
                />
              </HStack>
              <SettingsIcon
                display={{ base: "block", md: "none" }}
                color="gray.600"
                placement="bottom-end"
                onClick={() => navigate("/settings")}
                w={5}
                h={5}
              />
              <Menu placement="bottom-end" gutter={20}>
                <MenuButton
                  display={{ base: "none", md: "block" }}
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar
                    size={"sm"}
                    bg="white"
                    borderColor="gray.100"
                    showBorder={true}
                    borderWidth={"1px"}
                    icon={
                      <AiOutlineUser
                        style={{ marginRight: "1px" }}
                        fontSize="1.2rem"
                      />
                    }
                  >
                    <AvatarBadge
                      boxSize="2em"
                      borderColor="transparent"
                    ></AvatarBadge>
                  </Avatar>
                </MenuButton>
                <MenuList zIndex={10000} minW="0" w={"200px"} color="gray.600">
                  <MenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </MenuItem>
                  <MenuItem>Feedback</MenuItem>
                  <MenuItem>Notifications</MenuItem>
                  <MenuDivider m="1" />
                  <MenuItem>Feature Preview</MenuItem>
                  <MenuItem>Help</MenuItem>
                  <MenuDivider m="1" />
                  <MenuItem
                    onClick={() => {
                      RestAPI.logout().then(() => {
                        navigate("/login");
                      });
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Center>
        {isOpen ? (
          <Box className="mobile-menu" pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={1}>
              <NavLink
                mobile={true}
                key={"mobile-dashboard"}
                link={"/dashboard"}
                title={"Dashboard"}
                onClick={() => {
                  navigate("/dashboard");
                  onClose();
                }}
              />
              <NavLink
                mobile={true}
                key={"mobile-workers"}
                link={"/workers"}
                title={"Workers"}
                onClick={() => {
                  navigate("/workers");
                  onClose();
                }}
              />
              <NavLink
                mobile={true}
                disabled={true}
                key={"mobile-events"}
                link={"/events"}
                title={"Events"}
                onClick={() => {
                  navigate("/events");
                  onClose();
                }}
              />
              <NavLink
                mobile={true}
                key={"mobile-settings"}
                link={"/settings"}
                title={"Settings"}
                onClick={() => {
                  onClose();
                  navigate("/settings");
                }}
              />
              <NavLink
                mobile={true}
                key={"mobile-logout"}
                link={"/logout"}
                title={"Logout"}
                onClick={() => {
                  RestAPI.logout().then(() => {
                    onClose();
                    navigate("/login");
                  });
                }}
              />
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
