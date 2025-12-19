 
import { Brain, Target, TrendingUp, Users, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning algorithms analyze learner behavior to predict course completion and identify at-risk students.",
    },
    {
      icon: Target,
      title: "Dropout Risk Analysis",
      description:
        "Get real-time insights on dropout probability with low, medium, and high-risk classifications for proactive intervention.",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description:
        "Monitor quiz scores, video engagement, and completion rates to understand learner progress at a glance.",
    },
    {
      icon: Users,
      title: "Mentor Dashboard",
      description:
        "Comprehensive dashboards for mentors and admins to track multiple learners and make data-driven decisions.",
    },
    {
      icon: Shield,
      title: "Data-Driven Insights",
      description:
        "Transform raw learning data into actionable insights with confidence scores and probability metrics.",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get immediate predictions and recommendations as soon as learner data is submitted to the system.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Powerful Features for Smart Learning</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need to understand, predict, and improve learner outcomes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
