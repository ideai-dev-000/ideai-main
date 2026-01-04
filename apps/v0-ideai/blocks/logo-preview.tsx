"use client"
import { Card } from "@/components/ui/card"
import { FramerMotionLogo } from "../components/logos/framer-motion-logo"
import { ReactSpringLogo } from "../components/logos/react-spring-logo"
import { KuteLogo } from "../components/logos/kute-logo"
import { MotionOneLogo } from "../components/logos/motion-one-logo"
import { VivusLogo } from "../components/logos/vivus-logo"
import { ParticlesLogo } from "../components/logos/particles-logo"

interface LogoPreviewProps {
  library: string
  selectedSvg: string
  config: {
    duration: number
    delay: number
    loop: boolean
    animationType: string
  }
}

export function LogoPreview({ library, config, selectedSvg }: LogoPreviewProps) {
  const renderLogo = () => {
    switch (library) {
      case "framer-motion":
        return <FramerMotionLogo config={config} selectedSvg={selectedSvg} />
      case "react-spring":
        return <ReactSpringLogo config={config} selectedSvg={selectedSvg} />
      case "kute":
        return <KuteLogo config={config} selectedSvg={selectedSvg} />
      case "motion-one":
        return <MotionOneLogo config={config} selectedSvg={selectedSvg} />
      case "vivus":
        return <VivusLogo config={config} selectedSvg={selectedSvg} />
      case "tsparticles":
        return <ParticlesLogo config={config} selectedSvg={selectedSvg} />
      default:
        return <FramerMotionLogo config={config} selectedSvg={selectedSvg} />
    }
  }

  return (
    <Card className="p-8 bg-card">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Live Preview</h2>
          <p className="text-sm text-muted-foreground">Your animated logo in real-time</p>
        </div>

        <div className="relative bg-muted/30 rounded-lg border border-border min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="relative z-10">{renderLogo()}</div>
        </div>

        {/* Logo Info */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Animation Library: <span className="text-foreground font-medium">{library}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: <span className="text-foreground font-medium">{config.duration}s</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
