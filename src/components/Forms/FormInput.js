// Chakra imports
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

const FormInput = ({ name, label, placeholder, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue=""
      name={name}
      render={({ field }) => (
        <FormControl fullWidth sx={{ mb: 2 }} isInvalid={!!errors[name]}>
          <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
            {label}
          </FormLabel>
          <Input
            {...field}
            fontSize="sm"
            ms="4px"
            borderRadius="15px"
            type="text"
            placeholder={placeholder}
            size="lg"
            disableUnderline
            error={!!errors[name]}
            {...otherProps}
          />
          <FormErrorMessage error={!!errors[name]}>
            {errors[name] ? errors[name].message : ""}
          </FormErrorMessage>
        </FormControl>
      )}
    />
  );
};

export default FormInput;
