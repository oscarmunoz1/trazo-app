import React from 'react';
import { Box, VStack, Text, Icon, Grid, useColorModeValue, Input } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FaCamera, FaCheckCircle, FaFile } from 'react-icons/fa';

const MediaUpload = ({
  onFilesChange,
  acceptedFiles = [],
  maxFiles = 5,
  maxSize = 10485760, // 10MB
  accept = { 'image/*': [] },
  multiple = true,
  disabled = false,
  showPreviews = true,
  previewType = 'grid', // 'grid' | 'list'
  placeholder,
  description,
  height = '280px'
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('green.50', 'green.900');
  const textColor = useColorModeValue('gray.700', 'white');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesChange,
    accept,
    multiple,
    maxFiles,
    maxSize,
    disabled
  });

  const isImage = (file) => {
    return file.type && file.type.startsWith('image/');
  };

  const renderFilePreview = (file, index) => {
    if (isImage(file) && showPreviews) {
      return (
        <Box key={index} textAlign="center">
          <Box borderRadius="xl" overflow="hidden" mb={3} boxShadow="lg">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{
                width: '100%',
                height: '100px',
                objectFit: 'cover'
              }}
            />
          </Box>
          <Text fontSize="sm" color="gray.600" noOfLines={1} fontWeight="500">
            {file.name}
          </Text>
        </Box>
      );
    }

    return (
      <Box
        key={index}
        textAlign="center"
        p={4}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg">
        <Icon as={FaFile} boxSize={8} color="gray.500" mb={2} />
        <Text fontSize="sm" color={textColor} noOfLines={1} fontWeight="500">
          {file.name}
        </Text>
      </Box>
    );
  };

  return (
    <VStack spacing={4} align="stretch" w="100%">
      <Box
        border="2px dashed"
        borderColor={isDragActive ? 'green.400' : borderColor}
        borderRadius="lg"
        p={8}
        minH={height}
        textAlign="center"
        cursor={disabled ? 'not-allowed' : 'pointer'}
        transition="all 0.3s ease"
        bg={isDragActive ? bgColor : 'transparent'}
        _hover={{
          borderColor: disabled ? borderColor : 'green.400',
          bg: disabled ? 'transparent' : bgColor,
          transform: disabled ? 'none' : 'translateY(-2px)',
          boxShadow: disabled ? 'none' : 'lg'
        }}
        opacity={disabled ? 0.6 : 1}
        {...getRootProps()}>
        <Input {...getInputProps()} />

        {acceptedFiles.length > 0 ? (
          <VStack spacing={6} justify="center" h="full">
            <Icon as={FaCheckCircle} color="green.500" boxSize={12} />
            <Text fontWeight="bold" fontSize="lg" color={textColor}>
              {acceptedFiles.length} file{acceptedFiles.length !== 1 ? 's' : ''} selected
            </Text>

            {showPreviews && (
              <Grid
                templateColumns={
                  previewType === 'grid' ? 'repeat(auto-fill, minmax(140px, 1fr))' : '1fr'
                }
                gap={6}
                w="100%"
                maxW="600px"
                mx="auto">
                {acceptedFiles.map((file, index) => renderFilePreview(file, index))}
              </Grid>
            )}
          </VStack>
        ) : (
          <VStack spacing={6} justify="center" h="full">
            <Box p={4} bg="gray.100" borderRadius="full">
              <Icon as={FaCamera} color="gray.500" boxSize={12} />
            </Box>
            <VStack spacing={2}>
              <Text fontSize="lg" color="gray.600" fontWeight="600" textAlign="center">
                {placeholder || 'Drag & drop files here, or click to select'}
              </Text>
              <Text fontSize="md" color="gray.500" textAlign="center">
                {description ||
                  `Maximum ${maxFiles} files, up to ${Math.round(maxSize / 1048576)}MB each`}
              </Text>
            </VStack>
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default MediaUpload;
