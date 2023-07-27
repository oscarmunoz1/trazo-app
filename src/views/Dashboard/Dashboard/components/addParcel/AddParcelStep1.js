// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
// Custom components
import React, { useEffect, useRef, useState } from "react";
import { object, string } from "zod";
import { useDispatch, useSelector } from "react-redux";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CreatableSelect from "react-select/creatable";
import Editor from "components/Editor/Editor";
import { FaPlus } from "react-icons/fa";
import FormInput from "components/Forms/FormInput";
import IconBox from "components/Icons/IconBox";
import { MdModeEdit } from "react-icons/md";
import parcel1 from "assets/img/ImageParcel1.png";
import { setForm } from "store/features/formSlice";
import { useGetProductsQuery } from "store/features/productApi";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

const styles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #E2E8F0",
    borderRadius: "15px",
    boxShadow: "none",
    outline: "2px solid transparent",
    minHeight: "35px",
    fontSize: "0.75rem;",
    paddingLeft: "6px",
    placeholderColor: "red",
    marginLeft: "4px",
    "&:hover": {
      borderColor: "gray.300",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#A0AEC0",
  }),
  option: (provided) => ({
    ...provided,
    fontSize: "0.75rem",
  }),
};

const formSchema = object({
  name: string().min(1, "Name is required"),
  area: string().min(1, "Area is required"),
  description: string().optional(),
});

const AddParcelStep1 = ({ onClose, isOpen, nextTab, onSubmit }) => {
  const textColor = useColorModeValue("gray.700", "white");
  const dispatch = useDispatch();
  const [productOptions, setProductOptions] = useState([]);

  const { data } = useGetProductsQuery();

  useEffect(() => {
    if (data) {
      const products = data.map((product) => ({
        value: product.id,
        label: product.name,
      }));
      setProductOptions(products);
    }
  }, [data]);

  const methods = useForm({
    resolver: zodResolver(formSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const product = watch("product");

  const onSubmitStep1 = (data) => {
    dispatch(setForm({ parcel: data }));
    onSubmit();
  };

  return (
    <Card>
      <CardHeader mb="22px">
        <Text color={textColor} fontSize="lg" fontWeight="bold">
          Parcel Info
        </Text>
      </CardHeader>
      <CardBody justifyContent="center">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmitStep1)}
            style={{ width: "100%" }}
          >
            <Flex direction="column" w="100%">
              <Flex direction={{ sm: "column", md: "row" }} w="100%">
                <Box
                  position="relative"
                  minW={{ sm: "200px", xl: "240px" }}
                  h={{ sm: "110px", xl: "150px" }}
                  mx={{ sm: "5px", md: "10px", xl: "20px" }}
                  mb={{ sm: "25px" }}
                >
                  <Avatar src={parcel1} w="100%" h="100%" borderRadius="12px" />
                  <IconBox
                    bg="#fff"
                    h="35px"
                    w="35px"
                    boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.06)"
                    position="absolute"
                    right="-10px"
                    bottom="-10px"
                    cursor="pointer"
                  >
                    <Icon as={MdModeEdit} w="15px" h="15px" color="#333" />
                  </IconBox>
                </Box>
                <Stack direction="column" spacing="20px" w="100%">
                  <FormControl>
                    <Flex direction={"column"} grow={"1"} pr={"32px"}>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder="Name of the parcel"
                        name="name"
                        label="Name"
                      />
                      <FormControl>
                        <FormInput
                          fontSize="xs"
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          name="area"
                          placeholder="Area of the parcel"
                          label="Area"
                        />
                      </FormControl>
                      {/* <FormLabel
                        mb="4px"
                        fontSize="xs"
                        fontWeight="bold"
                        pl="12px"
                      >
                        Product
                      </FormLabel>
                      <Controller
                        name="product"
                        control={control}
                        mb="100px"
                        render={({ field }) => (
                          <CreatableSelect
                            options={productOptions}
                            styles={styles}
                            isClearable
                            name="colors"
                            className="basic-select"
                            classNamePrefix="select"
                            onChange={field.onChange}
                            // {...register("product")}
                          />
                        )}
                      /> */}
                      {/* <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        name="product"
                        placeholder="Product of the parcel"
                        label="Product"
                      /> */}
                    </Flex>
                  </FormControl>
                </Stack>
              </Flex>
              <FormControl mb="12px">
                <FormLabel
                  mb="4px"
                  fontSize="xs"
                  fontWeight="bold"
                  color={textColor}
                  pl="12px"
                >
                  Description
                </FormLabel>
                <Editor />
              </FormControl>

              <Button
                variant="no-hover"
                bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                alignSelf="flex-end"
                mt="24px"
                w={{ sm: "75px", lg: "100px" }}
                h="35px"
                type="submit"
              >
                <Text fontSize="xs" color="#fff" fontWeight="bold">
                  NEXT
                </Text>
              </Button>
            </Flex>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default AddParcelStep1;
