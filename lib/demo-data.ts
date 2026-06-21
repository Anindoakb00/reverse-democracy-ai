import type { DimensionWeights, RawSignal } from "./types";

export const dimensionWeights: DimensionWeights = {
  urgency: 0.22,
  impactRadius: 0.18,
  costOfIgnoring: 0.2,
  timeSensitivity: 0.18,
  recoveryDifficulty: 0.12,
  signalConfidence: 0.1
};

export const seedSignals: RawSignal[] = [
  {
    id: "sig-001",
    source: "survey",
    channel: "student-wellness-form",
    text: "Students report severe burnout, skipped classes, panic episodes, and no available counseling appointments.",
    location: { district: "Central Campus", lat: 23.7807, lng: 90.4072 },
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
    confidence: 0.94,
    metadata: { sampleSize: 418, institution: "North District University" }
  },
  {
    id: "sig-002",
    source: "complaint",
    channel: "parent-hotline",
    text: "Parents say students are exhausted, missing exams, and asking for emergency mental health support.",
    location: { district: "Central Campus", lat: 23.7821, lng: 90.4055 },
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    confidence: 0.88,
    metadata: { calls: 62 }
  },
  {
    id: "sig-003",
    source: "sensor",
    channel: "water-board-iot",
    text: "Reservoir levels in District 7 dropped below the emergency threshold for the third consecutive day.",
    location: { district: "District 7", lat: 23.7351, lng: 90.3922 },
    createdAt: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    confidence: 0.96,
    metadata: { reservoirPercent: 18 }
  },
  {
    id: "sig-004",
    source: "report",
    channel: "public-health-office",
    text: "Clinics near District 7 report dehydration visits and supply stress related to water scarcity.",
    location: { district: "District 7", lat: 23.7322, lng: 90.3962 },
    createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    confidence: 0.91,
    metadata: { clinics: 5 }
  },
  {
    id: "sig-005",
    source: "direct",
    channel: "scholarship-portal",
    text: "Students from low-income families cannot access scholarship forms before deadline due to portal errors.",
    location: { district: "West Zone", lat: 23.7903, lng: 90.3625 },
    createdAt: new Date(Date.now() - 1000 * 60 * 49).toISOString(),
    confidence: 0.83,
    metadata: { affectedApplicants: 1200 }
  },
  {
    id: "sig-006",
    source: "social",
    channel: "community-social-listening",
    text: "Multiple posts mention rural schools cancelling classes because teacher vacancies remain unfilled.",
    location: { district: "Rural North", lat: 24.0102, lng: 90.4011 },
    createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
    confidence: 0.74,
    metadata: { posts: 144 }
  },
  {
    id: "sig-007",
    source: "report",
    channel: "infrastructure-audit",
    text: "Digital infrastructure gap blocks remote learning access for several low-connectivity schools.",
    location: { district: "East Belt", lat: 23.8102, lng: 90.4501 },
    createdAt: new Date(Date.now() - 1000 * 60 * 66).toISOString(),
    confidence: 0.78,
    metadata: { schools: 18 }
  },
  {
    id: "sig-008",
    source: "news",
    channel: "local-news-monitor",
    text: "Editorial warns that scholarship access problems are growing but not yet visible in official meetings.",
    location: { district: "West Zone", lat: 23.7929, lng: 90.3659 },
    createdAt: new Date(Date.now() - 1000 * 60 * 72).toISOString(),
    confidence: 0.69,
    metadata: { articleReach: 18000 }
  }
];

export const slideLeaderboardTargets = [
  { title: "Student Burnout & Mental Health Crisis", score: 91, trend: "rising", window: 14 },
  { title: "Water Scarcity - District 7", score: 87, trend: "rising", window: 21 },
  { title: "Scholarship Access Gap", score: 79, trend: "stable", window: 45 },
  { title: "Teacher Shortage - Rural Zones", score: 74, trend: "easing", window: 60 },
  { title: "Digital Infrastructure Gap", score: 68, trend: "stable", window: 90 }
] as const;
