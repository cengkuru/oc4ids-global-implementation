// src/app/models/story.model.ts

export interface Story {
  type: string;
  properties: {
    country: string;
    projectsDisclosed: number;
    region: string;
    status: string;
    disclosureMandate: string;
    achievements: string[];
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export interface EnhancedStory extends Story {
  properties: Story['properties'] & {
    joinDate?: string;
    impactMetrics?: {
      costSavings?: number;
      improvedDeliveryTime?: number;
    };
    beforeAfterImages?: Array<{
      before: string;
      after: string;
      description: string;
    }>;
    testimonial?: {
      videoUrl: string;
      transcript: string;
    };
    keyMilestones?: Array<{
      date: string;
      description: string;
    }>;
  };
}

export interface CoSTDataset {
  type: string;
  features: Story[];
  metadata?: {
    lastUpdated?: string;
    totalCountries?: number;
    activeCountries?: number;
    totalProjectsDisclosed?: number;
  };
}
