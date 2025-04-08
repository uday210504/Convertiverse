import React, { useState } from 'react';
import {
  Container,
  Box,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

// Custom theme provider
import ThemeProvider from './theme/ThemeProvider';

// Custom components
import Header from './components/Header';
import Footer from './components/Footer';
import FileDropzone from './components/FileDropzone';
import ProgressBar from './components/ProgressBar';
import DownloadCard from './components/DownloadCard';

// Custom hooks
import useFileUpload from './hooks/useFileUpload';

function App() {
  // State for showing error message
  const [validationError, setValidationError] = useState(null);

  const {
    file,
    preview,
    isLoading,
    downloadUrl,
    error,
    progress,
    handleDrop,
    handleConvert,
    resetState
  } = useFileUpload();

  const handleConvertClick = () => {
    if (!file) {
      setValidationError('Please select a JPEG file first');
      // Auto-hide the error after 3 seconds
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    // Clear any previous error
    setValidationError(null);
    handleConvert();
  };

  return (
    <ThemeProvider>
      <Flex direction="column" minH="100vh">
        <Container maxW="container.md" py={8}>
          <Header />

          <Box
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            p={6}
            mb={6}
          >
            <VStack spacing={6} align="stretch">
              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                JPEG to PNG Converter
              </Text>

              <FileDropzone
                onDrop={handleDrop}
                preview={preview}
              />

              {file && (
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Selected file: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Text>
              )}

              <ProgressBar
                value={progress}
                isVisible={progress > 0 || isLoading}
                label={isLoading ? 'Converting...' : 'Processing...'}
              />

              {(error || validationError) && (
                <Alert status={validationError ? "warning" : "error"} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{validationError || error}</AlertDescription>
                </Alert>
              )}

              {!downloadUrl && (
                <Button
                  colorScheme="brand"
                  size="lg"
                  leftIcon={<FiUpload />}
                  onClick={handleConvertClick}
                  isLoading={isLoading}
                  loadingText="Converting..."
                  isDisabled={!file || isLoading}
                  w="full"
                >
                  Convert to PNG
                </Button>
              )}
            </VStack>
          </Box>

          {downloadUrl && (
            <DownloadCard
              downloadUrl={downloadUrl}
              fileName={file ? file.name.replace(/\.[^/.]+$/, "") + '.png' : 'converted-image.png'}
              onReset={resetState}
            />
          )}
        </Container>

        <Footer />
      </Flex>
    </ThemeProvider>
  );
}

export default App
