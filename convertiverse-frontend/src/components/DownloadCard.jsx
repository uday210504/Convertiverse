import React from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  Link
} from '@chakra-ui/react';
import { FiDownload, FiCheck } from 'react-icons/fi';

const DownloadCard = ({ downloadUrl, fileName = 'converted-image.png', onReset }) => {
  // Use the production URL if in production, otherwise use the environment variable or localhost
  const API_URL = import.meta.env.PROD
    ? 'https://convertiverse-production.up.railway.app'
    : (import.meta.env.VITE_API_URL || 'http://localhost:5000');
  const fullDownloadUrl = `${API_URL}${downloadUrl}`;

  return (
    <Box
      className="download-card fade-in"
      bg="white"
      borderRadius="xl"
      boxShadow="xl"
      p={6}
      mb={6}
    >
      <Flex
        direction="column"
        align="center"
        textAlign="center"
      >
        <Box
          bg="green.100"
          color="green.500"
          borderRadius="full"
          p={3}
          mb={4}
        >
          <Icon as={FiCheck} w={6} h={6} />
        </Box>

        <Text fontWeight="bold" fontSize="xl" mb={2}>
          Conversion Complete!
        </Text>

        <Text color="gray.500" mb={4}>
          Your PNG file is ready for download
        </Text>

        <Button
          as={Link}
          href={fullDownloadUrl}
          download={fileName}
          colorScheme="blue"
          size="lg"
          leftIcon={<FiDownload />}
          mb={3}
          w="full"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
            textDecoration: 'none'
          }}
        >
          Download PNG
        </Button>

        <Button
          variant="ghost"
          onClick={onReset}
          size="sm"
        >
          Convert another file
        </Button>
      </Flex>
    </Box>
  );
};

export default DownloadCard;
