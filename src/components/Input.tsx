import React, { ForwardRefRenderFunction, forwardRef } from "react";

import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Icon,
  Image,
} from "@chakra-ui/react";

import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  placeholder: string;
  leftIconSrc: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, placeholder, leftIconSrc, error, ...rest }: InputProps,
  ref
) => {
  const IconSvg = () => <Image src={leftIconSrc} />;

  return (
    <FormControl isInvalid={!!error}>
      <InputGroup>
        <InputLeftElement mt={1}>
          <Icon as={IconSvg} />
        </InputLeftElement>

        <ChakraInput
          name={name}
          id={name}
          placeholder={placeholder}
          _placeholder={{ color: "#5A5B80", fontSize: "md", fontWeight: "400" }}
          errorBorderColor="none"
          bgColor="#EBF1FF"
          border="none"
          py={6}
          ref={ref}
          {...rest}
        />
      </InputGroup>

      {!!error && (
        <FormErrorMessage color="#CB1F1F" fontSize="xs" mt="0.2rem">
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
