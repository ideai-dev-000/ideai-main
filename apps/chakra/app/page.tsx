/**
 * @fileoverview Chakra UI page - Simple, modular component showcase
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Heading,
  Text,
  Stack,
  Badge,
  HStack,
  VStack,
} from "@chakra-ui/react";

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "chakra";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <IdeAIPageTemplate
      siteName="IdeaI /chakra"
      subtitle="Chakra UI - Simple, Modular Components"
      vercelProjectName={vercelProjectName}
      vercelOrgId={vercelOrgId}
      headerActions={<IdeaIButton appName="chakra">Open alert</IdeaIButton>}
    >
      <Box maxW="1200px" mx="auto" p={8}>
        <IdeAICSSSummary
          frameworks={["Chakra UI", "Emotion", "Framer Motion"]}
          description="Chakra UI is a simple, modular and accessible component library that gives you the building blocks you need to build your React applications."
        />

        <VStack spacing={8} align="stretch" mt={8}>
          <section>
            <Heading as="h2" size="lg" mb={4}>
              Chakra UI Components
            </Heading>
            <Text color="gray.600" mb={6}>
              All components use Chakra UI's design system and are fully accessible.
            </Text>
          </section>

          {/* Button Component */}
          <section>
            <Heading as="h3" size="md" mb={4}>
              Button
            </Heading>
            <HStack spacing={4} flexWrap="wrap">
              <Button colorScheme="blue">Default</Button>
              <Button colorScheme="purple" variant="outline">
                Outline
              </Button>
              <Button colorScheme="green" variant="ghost">
                Ghost
              </Button>
              <Button colorScheme="red" variant="solid">
                Solid
              </Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button isDisabled>Disabled</Button>
            </HStack>
          </section>

          {/* Badge Component */}
          <section>
            <Heading as="h3" size="md" mb={4}>
              Badge
            </Heading>
            <HStack spacing={4} flexWrap="wrap">
              <Badge>Default</Badge>
              <Badge colorScheme="blue">Blue</Badge>
              <Badge colorScheme="green">Green</Badge>
              <Badge colorScheme="red">Red</Badge>
              <Badge colorScheme="purple" variant="outline">
                Outline
              </Badge>
            </HStack>
          </section>

          {/* Card Component */}
          <section>
            <Heading as="h3" size="md" mb={4}>
              Card
            </Heading>
            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
              <Card>
                <CardHeader>
                  <Heading size="md">Card Title</Heading>
                </CardHeader>
                <CardBody>
                  <Text>Card description text. This demonstrates the Chakra UI card component.</Text>
                </CardBody>
                <CardFooter>
                  <Button size="sm" colorScheme="blue">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Another Card</Heading>
                </CardHeader>
                <CardBody>
                  <Text>With different content showing Chakra UI's design system.</Text>
                </CardBody>
                <CardFooter>
                  <Button size="sm" variant="outline" colorScheme="blue">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <Heading size="md">Card with Badge</Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={2}>
                    <Text>Combining multiple Chakra UI components together.</Text>
                    <HStack>
                      <Badge colorScheme="blue">React</Badge>
                      <Badge colorScheme="purple">Chakra UI</Badge>
                    </HStack>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button size="sm" colorScheme="blue" width="full">
                    Full Width Button
                  </Button>
                </CardFooter>
              </Card>
            </Stack>
          </section>
        </VStack>
      </Box>
    </IdeAIPageTemplate>
  );
}

