import { ForwardRefRenderFunction, forwardRef, useState } from "react";

import {
  FormControl,
  FormErrorMessage,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  Icon,
  Image,
} from "@chakra-ui/react";

import { FieldError } from "react-hook-form";

interface InputProps extends ChakraInputProps {
  name: string;
  placeholder: string;
  iconSrc: string;
  error?: FieldError;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, placeholder, iconSrc, error, ...rest }: InputProps,
  ref
) => {
  const { type } = { ...rest };
  const isPassword = type === "password";

  var [show, setShow] = useState(false);

  const MyIcon = () => <Image src={iconSrc} />;
  const EyeOffIcon = () => <Image src="/icons/Eye-Off.svg" />;

  return (
    <FormControl isInvalid={!!error}>
      <InputGroup>
        <InputLeftElement mt={1} mr={2}>
          <Icon as={MyIcon} />
        </InputLeftElement>

        <ChakraInput
          ref={ref}
          name={name}
          id={name}
          placeholder={placeholder}
          color="black.200"
          fontWeight="400"
          errorBorderColor="none"
          bgColor="primary"
          border="none"
          py={6}
          {...rest}
          type={isPassword ? (show ? "text" : "password") : "text"}
        />

        {isPassword && (
          <InputRightElement mt={1} mr={2}>
            <Button
              size="sm"
              bgColor="transparent"
              onClick={() => setShow(!show)}
              _hover={{ opacity: 0.7 }}
              _active={{ opacity: 0.7 }}
            >
              <Icon as={EyeOffIcon} />
            </Button>
          </InputRightElement>
        )}
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
