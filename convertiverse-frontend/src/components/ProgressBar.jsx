import React from 'react';
import { Box, Progress, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ProgressBar = ({ value = 0, isVisible = false, label = 'Processing...' }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        height: isVisible ? 'auto' : 0
      }}
      transition={{ duration: 0.3 }}
      overflow="hidden"
      mb={isVisible ? 4 : 0}
    >
      <Text mb={1} fontSize="sm" fontWeight="medium">
        {label} {value > 0 ? `(${Math.round(value)}%)` : ''}
      </Text>
      <Progress 
        value={value} 
        size="sm" 
        colorScheme="brand" 
        borderRadius="full"
        hasStripe={value < 100}
        isAnimated={value < 100}
      />
    </MotionBox>
  );
};

export default ProgressBar;
