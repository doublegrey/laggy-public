import * as React from "react";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/react";

import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

type PasswordInputProps = {
  disabled?: boolean;
  readOnly?: boolean;
  id?: string;
  placeholder?: string;
  value?: number | string;
  className?: string;
  isInvalid?: boolean;
  style?: any;

  onChange: (event: any) => void;
  onToggle?: (isPlain: boolean) => void;
};

type PasswordInputState = {
  currentValue?: number | string;
  currentName?: string;
  isPlain: boolean;
};

export class PasswordInput extends React.Component<
  PasswordInputProps,
  PasswordInputState
> {
  constructor(props: PasswordInputProps) {
    super(props);
    this.state = {
      currentValue: props.value,
      isPlain: false,
    };
  }
  onChange = (event: any) => {
    this.setState({ currentValue: event.target.value });
    this.props.onChange(event);
  };
  onToggle = (isPlain: boolean) => {
    this.setState({ isPlain });
    this.props.onToggle && this.props.onToggle(isPlain);
  };
  render() {
    const { isPlain, currentValue } = this.state;
    return (
      <InputGroup
        style={{
          ...this.props.style,
        }}
        size="md"
      >
        <Input
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
          errorBorderColor="red.300"
          isInvalid={this.props.isInvalid}
          onChange={this.onChange}
          value={currentValue}
          pr="4.5rem"
          type={isPlain ? "text" : "password"}
          placeholder={this.props.placeholder}
        />
        <InputRightElement>
          {isPlain ? (
            <AiOutlineEyeInvisible
              style={{ color: "grey" }}
              aria-label="Show"
              onClick={() => this.onToggle(!isPlain)}
            ></AiOutlineEyeInvisible>
          ) : (
            <AiOutlineEye
              style={{ color: "grey" }}
              aria-label="Hide"
              onClick={() => this.onToggle(!isPlain)}
            ></AiOutlineEye>
          )}
        </InputRightElement>
      </InputGroup>
    );
  }
}

export default PasswordInput;
