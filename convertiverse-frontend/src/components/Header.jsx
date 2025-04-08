import React from 'react';
import { Box, Flex, Heading, Text, Icon } from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';

const Header = () => {
  return (
    <Box as="header" py={8} mb={8}>
      <Flex direction="column" align="center" textAlign="center">
        <Box
          display="inline-block"
          mb={3}
          className="rotating-icon"
        >
          <Icon as={FiRefreshCw} w={10} h={10} color="#0080ff" />
        </Box>

        <Heading
          as="h1"
          size="2xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, #0080ff, #ff7000)"
          bgClip="text"
          letterSpacing="tight"
          className="fade-in-down"
        >
          Convertiverse
        </Heading>

        <Text
          fontSize="lg"
          color="gray.600"
          maxW="container.md"
          mt={2}
          className="fade-in-up"
        >
          Transform your files with ease. Start with JPEG to PNG conversion.
        </Text>
      </Flex>
    </Box>
  );
};

export default Header;
