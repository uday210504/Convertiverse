import React from 'react';
import { Box, Flex, Heading, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

const Header = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, accent.500)',
    'linear(to-r, brand.400, accent.400)'
  );

  return (
    <Box as="header" py={8} mb={8}>
      <Flex direction="column" align="center" textAlign="center">
        <MotionBox
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatType: "loop" }}
          display="inline-block"
          mb={3}
        >
          <Icon as={FiRefreshCw} w={10} h={10} bgGradient={bgGradient} bgClip="text" />
        </MotionBox>
        
        <MotionHeading
          as="h1"
          size="2xl"
          fontWeight="extrabold"
          bgGradient={bgGradient}
          bgClip="text"
          letterSpacing="tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Convertiverse
        </MotionHeading>
        
        <MotionText
          fontSize="lg"
          color="gray.600"
          maxW="container.md"
          mt={2}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transform your files with ease. Start with JPEG to PNG conversion.
        </MotionText>
      </Flex>
    </Box>
  );
};

export default Header;
