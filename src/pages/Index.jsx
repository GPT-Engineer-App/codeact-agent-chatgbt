import { Container, Text, VStack, Button, Input, Box, useToast, Textarea } from "@chakra-ui/react";
import { useState } from "react";

const Index = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const toast = useToast();

  const handleExecute = async () => {
    try {
      const res = await fetch("https://api.e2b.dev/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to execute code");
      }

      const data = await res.json();
      setResponse(data.result);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChatGPT = async () => {
    try {
      const res = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          prompt: input,
          max_tokens: 150,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from ChatGPT");
      }

      const data = await res.json();
      setResponse(data.choices[0].text);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Code Execution Tool</Text>
        <Textarea
          placeholder="Enter your code or question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          size="lg"
        />
        <Button colorScheme="teal" size="lg" onClick={handleExecute}>
          Execute Code
        </Button>
        <Button colorScheme="blue" size="lg" onClick={handleChatGPT}>
          Ask ChatGPT
        </Button>
        {response && (
          <Box p={4} bg="gray.100" width="100%" borderRadius="md">
            <Text>Response:</Text>
            <Text whiteSpace="pre-wrap">{response}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;