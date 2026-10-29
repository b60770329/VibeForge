export interface CurriculumModule {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  durationLabel: string;
  keyDeliverable: string;
  topics: string[];
  toolsAndTech: string[];
  iconName: 'Lightbulb' | 'Terminal' | 'Layout' | 'Database' | 'Network' | 'Rocket';
}

export interface FeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  metrics: string;
  tag: string;
  color: 'cyan' | 'purple' | 'blue';
  bullets: string[];
}

export interface OutcomeItem {
  id: string;
  title: string;
  description: string;
  check: string;
  badge: string;
}

export interface MvpGeneratedProject {
  id?: string;
  userId?: string;
  title: string;
  tagline: string;
  problemStatement?: string;
  targetAudience?: string;
  techStack: {
    frontend: string;
    backend: string;
    aiEngine: string;
    hosting: string;
  };
  databaseSchema: Array<{
    collection: string;
    description: string;
  }>;
  starterPrompt: string;
  curriculumSteps: Array<{
    step: number;
    moduleTitle: string;
    action: string;
  }>;
  createdAt?: string;
}

export interface CourseApplication {
  id: string;
  userId: string;
  email: string;
  name: string;
  track: string;
  comment?: string;
  status: 'new' | 'reviewed' | 'enrolled';
  createdAt: string;
}

export interface SavedModuleItem {
  id: string;
  userId: string;
  moduleId: number;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
}
