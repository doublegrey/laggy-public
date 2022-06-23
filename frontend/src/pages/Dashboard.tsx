import {
  Box,
  VStack,
  Stack,
  Text,
  HStack,
  useColorModeValue,
  IconButton,
  Grid,
  GridItem,
  CircularProgress,
  Divider,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";

import { FaWallet } from "react-icons/fa";
import { BsReception4 } from "react-icons/bs";

import { numberWithCommas, percentage } from "../utils";
import MiniSymbolPriceChart from "../components/MiniSymbolPriceChart";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalStateContext } from "..";
import { Profile } from "../types/profile";
import { Wallet } from "../types/wallet";
import { Worker } from "../types/worker";
import { RestAPI } from "../api/rest";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  var navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [totalProfit, setTotalProfit] = useState("$ 0.00");
  const [assetsProfit, setAssetsProfit] = useState(new Map<string, number>());
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const { mining, prices, displayCurrency } = useContext(GlobalStateContext);
  const [profilesLabels, setProfilesLabels] = useState(
    new Map<string, { name: string; wallet: string }>()
  );
  const [walletsAssets, setWalletsAssets] = useState(new Map<string, string>());

  const [balanceRange, setBalanceRange] = useState("month");
  const [activePanel, setActivePanel] = useState("workers");
  const [chartsLoading, setChartsLoading] = useState(false);
  const [charts, setCharts] = useState<any[]>([
    { symbol: "ETH", color: "#637EEA", background: "#dce2fa" },
    { symbol: "ETC", color: "#4296a1", background: "#e5f5e5" },
    { symbol: "RVN", color: "#8c63ea", background: "#eaecf6" },
    { symbol: "ZEC", color: "#eacf63", background: "#fcf4e4" },
  ]);

  useEffect(() => {
    fetchWallets();
    fetchProfiles();
    fetchWorkers();
  }, []);

  useEffect(() => {
    var temp = new Map<string, string>();
    wallets.forEach((wallet) => {
      temp.set(wallet.id, wallet.asset);
    });
    setWalletsAssets(temp);
  }, [wallets]);

  useEffect(() => {
    var totalProfit = 0.0;
    var assets = new Map<string, number>();
    workers.forEach((worker) => {
      var asset =
        walletsAssets.get(profilesLabels.get(worker.profile)?.wallet || "") ||
        "ETH";
      var assetValue =
        (worker.hashrate / mining[asset]?.hashrate) *
        mining[asset]?.blockReward *
        (86400.0 / mining[asset]?.blockTime) *
        30;
      assets.set(asset, (assets.get(asset) || 0) + assetValue);
      totalProfit += assetValue * prices[asset]?.[displayCurrency.currency];
    });
    setTotalProfit(`${displayCurrency.sign} ${totalProfit.toFixed(2)}`);
    setAssetsProfit(assets);
  }, [workers, profiles, mining, prices, walletsAssets]);

  useEffect(() => {
    var temp = new Map<string, any>();
    profiles.forEach((profile) => {
      temp.set(profile.id, { name: profile.name, wallet: profile.wallet });
    });
    setProfilesLabels(temp);
  }, [profiles]);

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

  useEffect(() => {
    setChartsLoading(true);
    var klines: any[] = new Array(charts.length);
    var limit = 0;
    var interval = "";
    switch (balanceRange) {
      case "hour":
        interval = "1m";
        limit = 60;
        break;
      case "day":
        interval = "30m";
        limit = 48;
        break;
      case "week":
        interval = "2h";
        limit = 84;
        break;
      case "month":
        interval = "12h";
        limit = 60;
        break;
      default:
        break;
    }

    var promises: any[] = [];
    charts.forEach((chart, index) => {
      promises.push(
        axios
          .get(
            `https://api.binance.com/api/v3/klines?symbol=${
              chart.symbol + "USDT"
            }&interval=${interval}&limit=${limit.toFixed()}`
          )
          .then((response) => {
            var data: number[] = [];
            response.data.forEach((record: any[]) => {
              data.push(parseFloat(record[4]));
            });
            klines[index] = {
              symbol: chart.symbol,
              background: chart.background,
              color: chart.color,
              data,
            };
          })
          .catch(() => {
            klines[index] = {
              symbol: chart.symbol,
              background: chart.background,
              color: chart.color,
              data: [0, 0, 0, 0, 0],
            };
          })
      );
    });
    Promise.all(promises).then(function () {
      setCharts(klines);
      setChartsLoading(false);
    });
  }, [balanceRange]);
  var runningWorkers = workers.filter((worker) => worker.status === "running");
  var currentHashrate = runningWorkers.reduce(
    (reducer, worker) => (reducer += worker.hashrate / 1000000),
    0
  );
  var targetHashrate = runningWorkers.reduce(
    (reducer, worker) =>
      (reducer +=
        (worker.targetHashrate === 0
          ? worker.hashrate
          : worker.targetHashrate) / 1000000),
    0
  );
  var powerConsumption =
    runningWorkers.reduce(
      (total, worker) => (total += worker.power + worker.additionalPower),
      0
    ) / 1000;

  var totalBalanceEth = wallets.reduce(
    (total, wallet) => (total += wallet.balance * prices[wallet.asset]?.ETH),
    0
  );
  var totalUnpaidBalanceEth = wallets.reduce(
    (total, wallet) =>
      (total += wallet.unpaidBalance * prices[wallet.asset]?.ETH),
    0
  );
  return (
    <Box>
      <Stack spacing={"50px"} direction={{ base: "column", xl: "row" }}>
        <Box fontWeight="550" w="100%">
          <VStack spacing="50px" align="start">
            <VStack h={"150px"} spacing="10px" align="start">
              <Text fontSize="22px" fontWeight="500">
                My Balance
              </Text>
              <Popover placement="right-end" trigger="hover">
                <PopoverTrigger>
                  <Text fontSize="35px" fontWeight="700">
                    {displayCurrency.sign}{" "}
                    {numberWithCommas(
                      prices["ETH"]?.[displayCurrency.currency] *
                        (totalBalanceEth + totalUnpaidBalanceEth),
                      2
                    )}
                  </Text>
                </PopoverTrigger>
                <PopoverContent
                  display={{ base: "none", md: "inherit" }}
                  ml="10px"
                >
                  <PopoverArrow />
                  <PopoverBody>
                    <VStack align={"start"}>
                      <HStack w="100%">
                        <Text w="100%">Confirmed Balance:</Text>
                        <Text w="250px" textAlign={"end"}>
                          {totalBalanceEth.toFixed(5)} ETH
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack w="100%">
                        <Text w="100%">Unpaid Balance:</Text>
                        <Text w="250px" textAlign={"end"}>
                          {totalUnpaidBalanceEth.toFixed(5)} ETH
                        </Text>
                      </HStack>
                    </VStack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>

              <HStack spacing="20px">
                <Box
                  textAlign="center"
                  bgColor="white"
                  px="5"
                  py="2"
                  borderRadius="5"
                  color="#2196FE"
                  boxShadow="sm"
                >
                  <HStack>
                    <FaWallet />
                    <Text>{totalProfit} / month</Text>
                  </HStack>
                </Box>
                <Box
                  textAlign="center"
                  bgColor="white"
                  px="5"
                  py="2"
                  borderRadius="5"
                  color="#05CE24"
                  boxShadow="sm"
                  display={{ base: "none", md: "block" }}
                >
                  <HStack>
                    <BsReception4 />
                    <Text>Healthy</Text>
                  </HStack>
                </Box>
              </HStack>
            </VStack>

            <VStack w="100%" spacing="20px" align="start">
              <HStack>
                <Text
                  fontWeight="400"
                  className={`dashboard-link ${
                    balanceRange === "hour" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    setBalanceRange("hour");
                  }}
                >
                  Hour
                </Text>
                <Text
                  fontWeight="400"
                  className={`dashboard-link ${
                    balanceRange === "day" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    setBalanceRange("day");
                  }}
                >
                  Day
                </Text>
                <Text
                  fontWeight="400"
                  className={`dashboard-link ${
                    balanceRange === "week" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    setBalanceRange("week");
                  }}
                >
                  Week
                </Text>
                <Text
                  fontWeight="400"
                  className={`dashboard-link ${
                    balanceRange === "month" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    setBalanceRange("month");
                  }}
                >
                  Month
                </Text>
              </HStack>
              <Box w="100%" h="620px" overflowY="scroll">
                <VStack w="100%" spacing="20px" align="start">
                  {charts.map((chart) => {
                    var balance: any = assetsProfit.get(chart.symbol);
                    if (balance) {
                      switch (balanceRange) {
                        case "week":
                          balance = balance / 4;
                          break;
                        case "day":
                          balance = balance / 30;
                          break;
                        case "hour":
                          balance = balance / 30 / 24;
                          break;
                      }
                    } else {
                      balance = 0.0;
                    }
                    balance = balance.toFixed(balance > 0 ? 5 : 2);
                    return (
                      <Box
                        key={chart.symbol}
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
                            textAlign="start"
                            colSpan={1}
                            display={{ base: "none", md: "block" }}
                          >
                            <HStack spacing="30px">
                              <IconButton
                                borderRadius="15px"
                                fontSize="45px"
                                h="80px"
                                w="80px"
                                backgroundColor={chart.background}
                                aria-label="crypto-icon"
                                icon={
                                  <Image
                                    src={`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons/128/color/${chart.symbol.toLowerCase()}.png`}
                                    w="45"
                                    h="45"
                                  />
                                }
                              />
                              <Divider height="100px" orientation="vertical" />
                            </HStack>
                          </GridItem>
                          <GridItem
                            fontWeight="500"
                            fontSize="16px"
                            textAlign="start"
                            rowSpan={1}
                            colSpan={{ base: 5, md: 4 }}
                          >
                            <HStack spacing="10px">
                              <VStack
                                alignItems="start"
                                spacing="15px"
                                minWidth="80px"
                              >
                                <Text fontWeight="600" fontSize="18px" mb="5px">
                                  {chart.symbol}
                                </Text>
                                <VStack alignItems="start" spacing="0">
                                  <Text fontWeight="700" fontSize="20px">
                                    {wallets
                                      .reduce(
                                        (reducer, wallet) =>
                                          wallet.asset === chart.symbol
                                            ? (reducer +=
                                                wallet.balance +
                                                wallet.unpaidBalance)
                                            : reducer,
                                        0
                                      )
                                      .toFixed(5)}
                                  </Text>

                                  <HStack
                                    color="#B1B6BE"
                                    mb="15px"
                                    spacing="5px"
                                  >
                                    <Text>{balance}</Text>
                                    <Text>/</Text>
                                    <Text>{balanceRange}</Text>
                                  </HStack>
                                </VStack>
                              </VStack>
                              <Box
                                w="100%"
                                display={{ base: "none", md: "block" }}
                              >
                                <MiniSymbolPriceChart
                                  loading={chartsLoading}
                                  data={chart.data}
                                  color={chart.color}
                                />
                              </Box>

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
                                  Binance
                                </Text>
                                <Text fontWeight="600" fontSize="16px">
                                  $
                                  {numberWithCommas(
                                    chart.data
                                      ? chart.data[chart.data.length - 1]
                                      : 0,
                                    2
                                  )}
                                </Text>
                              </VStack>
                            </HStack>
                          </GridItem>
                        </Grid>
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Box>
        <Box w={{ base: "100%", lg: "150%" }}>
          <VStack spacing="50px" align="start">
            <HStack
              w="100%"
              align="end"
              h={"150px"}
              spacing="20px"
              display={{ base: "none", xl: "inherit" }}
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
                <CircularProgress
                  trackColor="gray.100"
                  color="#2196FE"
                  thickness="16px"
                  value={percentage(runningWorkers.length, workers.length)}
                  size="10"
                />
                <VStack align="left" color="gray.600" spacing="0px">
                  <Text>Workers</Text>
                  <Text fontSize="md" as="b">
                    <span style={{ fontSize: "25px" }}>
                      {runningWorkers.length}
                    </span>
                    /{workers.length}
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
                <CircularProgress
                  trackColor="gray.100"
                  color="#2196FE"
                  thickness="16px"
                  value={percentage(currentHashrate, targetHashrate)}
                  size="10"
                />
                <VStack align="left" color="gray.600" spacing="0px">
                  <Text>Hashrate</Text>
                  <Text fontSize="md" as="b">
                    <span style={{ fontSize: "25px" }}>
                      {currentHashrate.toFixed(2)}
                    </span>
                    /{targetHashrate.toFixed(2)} MH/s
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
                <CircularProgress
                  trackColor="gray.100"
                  color="#2196FE"
                  thickness="16px"
                  value={percentage(powerConsumption, powerConsumption)}
                  size="10"
                />
                <VStack align="left" color="gray.600" spacing="0px">
                  <Text>Power</Text>
                  <Text fontSize="md" as="b">
                    <span style={{ fontSize: "25px" }}>
                      {powerConsumption.toFixed(2)} kW
                    </span>
                  </Text>
                </VStack>
              </HStack>
            </HStack>
            <VStack
              display={{ base: "none", xl: "block" }}
              w="100%"
              spacing="20px"
              align="start"
            >
              <HStack>
                <Text
                  fontWeight="400"
                  className={`dashboard-link ${
                    activePanel === "workers" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    setActivePanel("workers");
                  }}
                >
                  Workers
                </Text>
                <Text
                  fontWeight="400"
                  className={`dashboard-link disabled ${
                    activePanel === "payouts" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    // setActivePanel("payouts");
                  }}
                >
                  Payouts
                </Text>

                <Text
                  fontWeight="400"
                  className={`dashboard-link disabled ${
                    activePanel === "tasks" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    // setActivePanel("tasks");
                  }}
                >
                  Tasks
                </Text>
                <Text
                  fontWeight="400"
                  className={`dashboard-link disabled ${
                    activePanel === "events" ? "selected" : ""
                  }`}
                  color={useColorModeValue("gray.600", "#ABB2BF")}
                  cursor="pointer"
                  onClick={() => {
                    // setActivePanel("events");
                  }}
                >
                  Events
                </Text>
              </HStack>
              <Box
                w="100%"
                h="620px"
                bgColor="white"
                borderRadius="5"
                overflow="scroll"
                boxShadow="sm"
                px="20px"
                py="10px"
              >
                <table className="simple-table">
                  <thead style={{ color: "#bdbdbd" }}>
                    <tr>
                      <th>STATUS</th>
                      <th>NAME</th>
                      <th>ASSET</th>
                      <th>TEMP</th>
                      <th>POWER</th>
                      <th>PROFIT</th>
                      <th>HASHRATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => {
                      var asset =
                        walletsAssets.get(
                          profilesLabels.get(worker.profile)?.wallet || ""
                        ) || "ETH";
                      return (
                        <tr
                          style={{ cursor: "pointer" }}
                          onClick={() => navigate("/workers/" + worker.id)}
                          key={worker.id}
                        >
                          <td>
                            <span
                              className={`floating-dot ${
                                worker.status === "running"
                                  ? "success"
                                  : "error"
                              }`}
                            ></span>{" "}
                            {worker.status}
                          </td>
                          <td>{worker.name}</td>
                          <td>{asset}</td>
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
                            {(
                              (worker.power + worker.additionalPower) /
                              1000
                            ).toFixed(2)}{" "}
                            kW
                          </td>
                          <td>
                            <span>
                              {/* Ξ ₿ $ € ₽ ¥  */}
                              {displayCurrency.sign}{" "}
                              {prices[asset] !== undefined
                                ? (
                                    (worker.hashrate /
                                      mining[asset]?.hashrate) *
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Stack>
    </Box>
  );
}
