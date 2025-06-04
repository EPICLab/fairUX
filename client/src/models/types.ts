// models/types.ts
export interface Image {
  id: string;
  name: string;
  url: string;
  file?: File;
  path?: string | null; // Path where the image is saved
}
  
export interface DescriptionItem {
  title: string;
  highlight: string[];
  details: string;
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  descriptionItems: DescriptionItem[];  // Flexible array of description items
  background: string;
  hasDisability?: boolean;
}

// Bug interface for individual issues found
export interface Bug {
  description: string;
  location: string;
  severity: 'High' | 'Medium' | 'Low';
  categories: string;
  recommendation: string;
}

// Violation interface for rules that were violated
export interface Violation {
  rule_id: string;
  facet?: string;
  bugs: Bug[];
}

// AnalysisResult matches backend response structure
export interface AnalysisResult {
  screenshot: string;
  screenshot_path?: string;
  screenshot_name?: string;      // Original filename
  screenshot_base64?: string;    // Base64 encoded image data
  violations: Violation[];
}

export interface Report {
  id: string;
  filename: string;
  url: string;
  createdAt: Date;
  results: AnalysisResult[];
  // Optional metadata from backend
  total_screenshots?: number;
  total_violations?: number;
  total_issues?: number;
}

// Optional: Rule interface if you need to display rule information
export interface Rule {
  'Rule ID': string;
  'Rule Name': string;
  'Facet': string;
  'Description'?: string;
}