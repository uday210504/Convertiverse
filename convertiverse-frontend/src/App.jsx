import React from 'react';
import {
  ChakraProvider,
  Container,
  Box,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  useToast
} from '@chakra-ui/react';
import { FiUpload } from 'react-icons/fi';

// Custom theme
import theme from './theme';

// Custom components
import Header from './components/Header';
import Footer from './components/Footer';
import FileDropzone from './components/FileDropzone';
import ProgressBar from './components/ProgressBar';
import DownloadCard from './components/DownloadCard';

// Custom hooks
import useFileUpload from './hooks/useFileUpload';

function App() {
  const toast = useToast();

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
      toast({
        title: 'No file selected',
        description: 'Please select a JPEG file first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    handleConvert();
  };

  return (
    <ChakraProvider theme={theme}>
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

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
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
    </ChakraProvider>
  );
}

export default App
