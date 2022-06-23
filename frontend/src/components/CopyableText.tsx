import * as React from "react";
import { HStack, Text } from "@chakra-ui/react";

import { CheckIcon, CopyIcon } from "@chakra-ui/icons";

type LinkProps = {
  text: string;
  className?: string;
  style?: any;
};

type LinkState = {
  pendingCopy: boolean;
};

export class CopyableText extends React.Component<LinkProps, LinkState> {
  constructor(props: LinkProps) {
    super(props);
    this.state = {
      pendingCopy: false,
    };
  }

  copy = () => {
    navigator.clipboard.writeText(this.props.text);
    this.setState({ pendingCopy: true });
    setTimeout(() => {
      this.setState({ pendingCopy: false });
    }, 2000);
  };
  render() {
    return (
      <HStack>
        <Text style={{ ...this.props.style }}>{this.props.text}</Text>
        {this.state.pendingCopy ? (
          <CheckIcon color="gray.400" mb={"4px"} ml={"7px"} />
        ) : (
          <CopyIcon
            color="gray.400"
            cursor="pointer"
            onClick={async () => {
              this.copy();
            }}
            mb={"2px"}
            ml={"7px"}
          />
        )}
      </HStack>
    );
  }
}

export default CopyableText;
