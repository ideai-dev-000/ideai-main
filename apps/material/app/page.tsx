/**
 * @fileoverview Material UI page - Material Design component showcase
 */

"use client";

import { IdeAIPageTemplate } from "@repo/ui/components/ideai-page-template";
import { IdeAICSSSummary } from "@repo/ui/components/ideai-css-summary";
import { IdeaIButton } from "@repo/ui/components/ideai-button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Button, Card, CardContent, CardActions, Typography, Box, Stack, Chip } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#8b5cf6",
    },
  },
});

export default function Home() {
  const vercelProjectName = process.env.NEXT_PUBLIC_VERCEL_PROJECT_NAME || "material";
  const vercelOrgId = process.env.NEXT_PUBLIC_VERCEL_ORG_ID || "team_vhjzlMi6CfNow0IfBXnv2Yn2";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IdeAIPageTemplate
        siteName="IdeaI /material"
        subtitle="Material UI - Material Design Components"
        vercelProjectName={vercelProjectName}
        vercelOrgId={vercelOrgId}
        headerActions={<IdeaIButton appName="material">Open alert</IdeaIButton>}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
          <IdeAICSSSummary
            frameworks={["Material UI", "Material Design", "Emotion"]}
            description="Material UI (MUI) component library implementing Google's Material Design principles. Built with React and Emotion for styling."
          />

          <Stack spacing={4} sx={{ mt: 4 }}>
            <section>
              <Typography variant="h4" component="h2" gutterBottom>
                Material UI Components
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                All components use Material Design principles from the Material UI library.
              </Typography>
            </section>

            {/* Button Component */}
            <section>
              <Typography variant="h5" component="h3" gutterBottom>
                Button
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="contained">Contained</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="text">Text</Button>
                <Button color="secondary" variant="contained">Secondary</Button>
                <Button size="small">Small</Button>
                <Button size="large">Large</Button>
                <Button disabled>Disabled</Button>
              </Stack>
            </section>

            {/* Chip Component */}
            <section>
              <Typography variant="h5" component="h3" gutterBottom>
                Chip
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Success" color="success" />
                <Chip label="Error" color="error" />
                <Chip label="Outlined" variant="outlined" />
              </Stack>
            </section>

            {/* Card Component */}
            <section>
              <Typography variant="h5" component="h3" gutterBottom>
                Card
              </Typography>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6" component="h4" gutterBottom>
                      Card Title
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Card description text. This demonstrates the Material UI card component.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Action</Button>
                  </CardActions>
                </Card>

                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6" component="h4" gutterBottom>
                      Another Card
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      With different content showing Material Design principles.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="outlined">
                      Learn More
                    </Button>
                  </CardActions>
                </Card>

                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6" component="h4" gutterBottom>
                      Card with Chip
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Combining multiple Material UI components together.
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label="React" size="small" />
                      <Chip label="Material UI" size="small" color="primary" />
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button size="small" fullWidth>
                      Full Width Button
                    </Button>
                  </CardActions>
                </Card>
              </Stack>
            </section>
          </Stack>
        </Box>
      </IdeAIPageTemplate>
    </ThemeProvider>
  );
}

