import { Text } from "@chakra-ui/react";

export default function SimpleWorkersTable() {
  return (
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
        <tr>
          <td>
            <span className="floating-dot success"></span> running
          </td>
          <td>office</td>
          <td>ETH</td>
          <td>60 °C</td>
          <td>2.16 kW</td>
          <td>$ 12.61/day</td>
          <td>3671.15 MH/s</td>
        </tr>
        <tr>
          <td>
            <span className="floating-dot warning"></span> stopped
          </td>
          <td>home</td>
          <td>RVN</td>
          <td>60 °C</td>
          <td>2.16 kW</td>
          <td>$ 0.00/day</td>
          <td>3671.15 MH/s</td>
        </tr>
        <tr>
          <td>
            <span className="floating-dot error"></span> unknown
          </td>
          <td>old</td>
          <td>ZEC</td>
          <td>00 °C</td>
          <td>0 W</td>
          <td>$ 0.00/day</td>
          <td>0 H/s</td>
        </tr>
      </tbody>
    </table>
  );
}
