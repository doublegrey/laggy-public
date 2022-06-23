import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import { Box } from "@chakra-ui/react";

type Props = {
  data?: number[];
  color: string;
  loading: boolean;
};

export default function MiniSymbolPriceChart(props: Props) {
  return props.loading ? (
    <div style={{ height: "100%", width: "100%", textAlign: "center" }}>
      <SyncLoader color={props.color} loading={true} />
    </div>
  ) : (
    <Sparklines style={{ marginLeft: "50px" }} data={props.data}>
      <SparklinesLine
        style={{
          strokeWidth: 2,
          stroke: props.color,
          fill: "none",
        }}
      />
    </Sparklines>
  );
}
