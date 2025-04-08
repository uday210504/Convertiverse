import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Center, 
  Text, 
  Icon, 
  VStack,
  useColorModeValue,
  Image
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiFile } from 'react-icons/fi';

const MotionBox = motion(Box);

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

  const borderColor = useColorModeValue(
    isDragAccept 
      ? 'green.300' 
      : isDragReject 
        ? 'red.300' 
        : isDragActive 
          ? 'blue.300' 
          : 'gray.300',
    isDragAccept 
      ? 'green.500' 
      : isDragReject 
        ? 'red.500' 
        : isDragActive 
          ? 'blue.500' 
          : 'gray.500'
  );

  const bgColor = useColorModeValue(
    isDragActive ? 'gray.100' : 'white',
    isDragActive ? 'gray.700' : 'gray.800'
  );

  return (
    <MotionBox
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        {...getRootProps()}
        p={6}
        borderWidth={2}
        borderRadius="xl"
        borderStyle="dashed"
        borderColor={borderColor}
        bg={bgColor}
        transition="all 0.2s"
        _hover={{ borderColor: 'brand.500' }}
        cursor="pointer"
        position="relative"
        height="200px"
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
                color={isDragActive ? 'brand.500' : 'gray.400'} 
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
    </MotionBox>
  );
};

export default FileDropzone;
