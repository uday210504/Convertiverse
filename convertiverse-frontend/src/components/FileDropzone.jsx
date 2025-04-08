import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Center,
  Text,
  Icon,
  VStack,
  Image
} from '@chakra-ui/react';
import { FiUploadCloud, FiFile } from 'react-icons/fi';

const FileDropzone = ({ onDrop, preview, accept = { 'image/jpeg': ['.jpg', '.jpeg'] } }) => {
  const onDropAccepted = useCallback((acceptedFiles) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop: onDropAccepted,
    accept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  // Determine border color based on drag state
  let borderColor = 'gray.300';
  if (isDragAccept) borderColor = 'green.300';
  if (isDragReject) borderColor = 'red.300';
  if (isDragActive && !isDragAccept && !isDragReject) borderColor = 'blue.300';

  // Determine background color
  const bgColor = isDragActive ? 'gray.100' : 'white';

  return (
    <Box className="dropzone-container">
      <Box
        {...getRootProps()}
        p={6}
        borderWidth={2}
        borderRadius="xl"
        borderStyle="dashed"
        borderColor={borderColor}
        bg={bgColor}
        transition="all 0.2s"
        _hover={{ borderColor: '#0080ff' }}
        cursor="pointer"
        position="relative"
        height="200px"
        className="dropzone"
      >
        <input {...getInputProps()} />

        {preview ? (
          <Center h="100%" position="relative">
            <Image
              src={preview}
              alt="Preview"
              maxH="100%"
              maxW="100%"
              objectFit="contain"
              borderRadius="md"
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.300"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s"
              className="preview-overlay"
            >
              <Text color="white" fontWeight="bold">Click or drag to replace</Text>
            </Box>
          </Center>
        ) : (
          <Center h="100%">
            <VStack spacing={2}>
              <Icon
                as={isDragActive ? FiFile : FiUploadCloud}
                w={12}
                h={12}
                color={isDragActive ? '#0080ff' : 'gray.400'}
                mb={2}
              />
              <Text fontWeight="medium" textAlign="center">
                {isDragActive
                  ? 'Drop the file here...'
                  : 'Drag & drop a JPEG file here, or click to select'}
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                (Only JPEG files up to 10MB are accepted)
              </Text>
            </VStack>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default FileDropzone;
