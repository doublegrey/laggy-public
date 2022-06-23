import { Center, Divider, HStack, Text } from "@chakra-ui/react";
import { GPU } from "../types/worker";

type Props = {
  gpus: GPU[];
  editGpu: any;
};

export default function CardsTable(props: Props) {
  return (
    <table className="simple-table">
      <thead style={{ color: "#bdbdbd" }}>
        <tr>
          <th>NAME</th>
          <th>VALID</th>
          <th>LOAD</th>
          <th>CHIP</th>
          <th>MEM</th>
          <th>POWER</th>
          <th>FAN</th>
          <th>HASHRATE</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {props.gpus !== null
          ? props.gpus
              .sort((first, second) => first.pci - second.pci)
              .map((gpu, index) => {
                return (
                  <tr key={`worker-gpu-${index}`}>
                    <td>
                      <span className="floating-dot success"></span>[{gpu.pci}]{" "}
                      {gpu.name}
                    </td>
                    <td>
                      {(
                        (gpu.acceptedShares /
                          (gpu.acceptedShares + gpu.rejectedShares)) *
                        100
                      ).toFixed(0)}
                      %
                    </td>
                    <td>{gpu.load.toFixed(0)}%</td>
                    <td>{gpu.chip} °C</td>
                    <td>{gpu.mem} °C</td>
                    <td>{gpu.power.toFixed(0)} W</td>
                    <td>{gpu.fan.toFixed(0)}%</td>
                    <td>{(gpu.hashrate / 1000000).toFixed(2)} MH/s</td>
                    <td>
                      <span>
                        <HStack w="30px">
                          <Text
                            onClick={() => {
                              props.editGpu(gpu);
                            }}
                            cursor="pointer"
                            color="#2097FD"
                          >
                            edit
                          </Text>
                          <Center height="15px">
                            <Divider orientation="vertical" />
                          </Center>
                          <Text cursor="pointer" color="#F74D60">
                            stop
                          </Text>
                        </HStack>
                      </span>
                    </td>
                  </tr>
                );
              })
          : null}
      </tbody>
    </table>
  );
}
