import React, { ForwardRefRenderFunction, forwardRef } from "react";

import {
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import { FieldError } from "react-hook-form";

interface TextareaProps extends ChakraTextareaProps {
  name: string;
  placeholder: string;
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, placeholder, error, ...rest }: TextareaProps, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      <ChakraTextarea
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

      {!!error && (
        <FormErrorMessage color="#CB1F1F" fontSize="xs" mt="0.2rem">
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Textarea = forwardRef(TextareaBase);
