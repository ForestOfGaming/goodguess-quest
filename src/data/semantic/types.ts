
// Common types for semantic databases
export interface SemanticData {
  name: string;
  related: string[];
  properties: Record<string, string[]>;
}
