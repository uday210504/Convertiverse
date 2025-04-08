import React from 'react';
import { Box, Text, Link, Flex, Icon } from '@chakra-ui/react';
import { FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <Box as="footer" py={8} mt="auto">
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="center" 
        align="center" 
        textAlign="center"
        fontSize="sm"
        color="gray.500"
      >
        <Text>
          © {new Date().getFullYear()} Convertiverse. All rights reserved.
        </Text>
        <Text mx={2} display={{ base: 'none', md: 'block' }}>•</Text>
        <Text>
          Made with <Icon as={FiHeart} color="red.500" mx={1} /> for seamless file conversions
        </Text>
        <Text mx={2} display={{ base: 'none', md: 'block' }}>•</Text>
        <Text>
          <Link 
            href="#" 
            color="brand.500" 
            _hover={{ textDecoration: 'underline' }}
          >
            Privacy Policy
          </Link>
          {' | '}
          <Link 
            href="#" 
            color="brand.500" 
            _hover={{ textDecoration: 'underline' }}
          >
            Terms of Service
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
