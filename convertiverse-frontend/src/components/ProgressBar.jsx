import React from 'react';
import { Box, Progress, Text } from '@chakra-ui/react';

const ProgressBar = ({ value = 0, isVisible = false, label = 'Processing...' }) => {
  return (
    <Box
      className={`progress-container ${isVisible ? 'visible' : 'hidden'}`}
      overflow="hidden"
      mb={isVisible ? 4 : 0}
      opacity={isVisible ? 1 : 0}
      height={isVisible ? 'auto' : '0'}
      transition="all 0.3s ease"
    >
      <Text mb={1} fontSize="sm" fontWeight="medium">
        {label} {value > 0 ? `(${Math.round(value)}%)` : ''}
      </Text>
      <Progress
        value={value}
        size="sm"
        colorScheme="blue"
        borderRadius="full"
        hasStripe={value < 100}
        isAnimated={value < 100}
      />
    </Box>
  );
};

export default ProgressBar;
