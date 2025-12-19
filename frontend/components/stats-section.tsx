 
import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    {
      value: "95%",
      label: "Prediction Accuracy",
      description: "Industry-leading ML models",
    },
    {
      value: "10K+",
      label: "Learners Analyzed",
      description: "Across multiple platforms",
    },
    {
      value: "40%",
      label: "Dropout Reduction",
      description: "With early intervention",
    },
    {
      value: "24/7",
      label: "Real-time Monitoring",
      description: "Continuous insights",
    },
  ]

  return (
    <section className="py-24 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-border/50">
              <CardContent className="pt-8 pb-8">
                <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
