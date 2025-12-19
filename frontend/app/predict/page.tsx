"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ChatBot } from "@/components/chatbot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface PredictionInput {
  TimeSpentOnCourse: number;
  NumberOfVideosWatched: number;
  NumberOfQuizzesTaken: number;
  QuizScores: number;
  CompletionRate: number;
  CourseCategory: string;
  DeviceType: string;
}

interface PredictionOutput {
  will_complete: boolean;
  completion_probability: number;
  dropout_risk: "Low" | "Medium" | "High";
  confidence: number;
  input_data: PredictionInput;
}

export default function PredictPage() {
  const [formData, setFormData] = useState<PredictionInput>({
    TimeSpentOnCourse: 0,
    NumberOfVideosWatched: 0,
    NumberOfQuizzesTaken: 0,
    QuizScores: 0,
    CompletionRate: 0,
    CourseCategory: "",
    DeviceType: "",
  });
  const [prediction, setPrediction] = useState<PredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    field: keyof PredictionInput,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI prediction with realistic logic
    setTimeout(() => {
      // Calculate completion probability based on multiple factors
      const timeWeight = Math.min(formData.TimeSpentOnCourse / 100, 1) * 0.2;
      const videoWeight =
        Math.min(formData.NumberOfVideosWatched / 50, 1) * 0.15;
      const quizWeight = Math.min(formData.NumberOfQuizzesTaken / 20, 1) * 0.15;
      const scoreWeight = (formData.QuizScores / 100) * 0.3;
      const completionWeight = (formData.CompletionRate / 100) * 0.2;

      const baseProbability =
        timeWeight + videoWeight + quizWeight + scoreWeight + completionWeight;
      const probability = Math.min(
        Math.max(baseProbability + (Math.random() * 0.1 - 0.05), 0),
        1
      );

      const willComplete = probability > 0.5;
      let dropoutRisk: "Low" | "Medium" | "High";

      if (probability > 0.7) dropoutRisk = "Low";
      else if (probability > 0.4) dropoutRisk = "Medium";
      else dropoutRisk = "High";

      const result: PredictionOutput = {
        will_complete: willComplete,
        completion_probability: Number.parseFloat(probability.toFixed(4)),
        dropout_risk: dropoutRisk,
        confidence: Number.parseFloat((0.85 + Math.random() * 0.1).toFixed(4)),
        input_data: formData,
      };

      setPrediction(result);
      setIsLoading(false);
    }, 1500);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Learner Completion Predictor
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Input learner data to get AI-powered predictions on course
                completion
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Learner Data Input</CardTitle>
                  <CardDescription>
                    Fill in all fields for accurate predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="timeSpent">
                        Time Spent on Course (minutes)
                      </Label>
                      <Input
                        id="timeSpent"
                        type="number"
                        min="0"
                        step="0.1"
                        required
                        value={formData.TimeSpentOnCourse || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "TimeSpentOnCourse",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videos">Number of Videos Watched</Label>
                      <Input
                        id="videos"
                        type="number"
                        min="0"
                        required
                        value={formData.NumberOfVideosWatched || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "NumberOfVideosWatched",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quizzes">Number of Quizzes Taken</Label>
                      <Input
                        id="quizzes"
                        type="number"
                        min="0"
                        required
                        value={formData.NumberOfQuizzesTaken || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "NumberOfQuizzesTaken",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quizScore">
                        Average Quiz Score (0-100)
                      </Label>
                      <Input
                        id="quizScore"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        required
                        value={formData.QuizScores || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "QuizScores",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="completion">
                        Current Completion Rate (%)
                      </Label>
                      <Input
                        id="completion"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        required
                        value={formData.CompletionRate || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "CompletionRate",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Course Category</Label>
                      <Select
                        required
                        value={formData.CourseCategory}
                        onValueChange={(value) =>
                          handleInputChange("CourseCategory", value)
                        }
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Programming">
                            Programming
                          </SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Data Science">
                            Data Science
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="device">Device Type</Label>
                      <Select
                        required
                        value={formData.DeviceType}
                        onValueChange={(value) =>
                          handleInputChange("DeviceType", value)
                        }
                      >
                        <SelectTrigger id="device">
                          <SelectValue placeholder="Select device" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Desktop">Desktop</SelectItem>
                          <SelectItem value="Mobile">Mobile</SelectItem>
                          <SelectItem value="Tablet">Tablet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Analyzing..." : "Generate Prediction"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Prediction Results */}
              <div className="space-y-6">
                {prediction ? (
                  <>
                    <Card
                      className={
                        prediction.will_complete
                          ? "border-green-500/50"
                          : "border-red-500/50"
                      }
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {prediction.will_complete ? (
                            <>
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                              Likely to Complete
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-6 h-6 text-red-500" />
                              At Risk of Dropping Out
                            </>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">
                              Completion Probability
                            </span>
                            <span className="text-sm font-bold">
                              {(
                                prediction.completion_probability * 100
                              ).toFixed(2)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                prediction.completion_probability > 0.7
                                  ? "bg-green-500"
                                  : prediction.completion_probability > 0.4
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{
                                width: `${
                                  prediction.completion_probability * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Dropout Risk
                          </span>
                          <Badge
                            className={getRiskColor(prediction.dropout_risk)}
                          >
                            {prediction.dropout_risk === "High" && (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {prediction.dropout_risk === "Low" && (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            )}
                            {prediction.dropout_risk}
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Model Confidence
                          </span>
                          <span className="text-sm font-bold">
                            {(prediction.confidence * 100).toFixed(2)}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Input Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Time Spent:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.TimeSpentOnCourse} min
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Videos Watched:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.NumberOfVideosWatched}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Quizzes Taken:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.NumberOfQuizzesTaken}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Avg Quiz Score:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.QuizScores}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Completion Rate:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.CompletionRate}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Category:
                          </span>
                          <span className="font-medium">
                            {prediction.input_data.CourseCategory}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Device:</span>
                          <span className="font-medium">
                            {prediction.input_data.DeviceType}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center border-dashed">
                    <CardContent className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill in the form and click Generate Prediction to see
                        results
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </main>
  );
}
