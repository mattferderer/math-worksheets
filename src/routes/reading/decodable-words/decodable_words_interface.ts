export interface decodableWords {
  grade: string;
  categories: {
    category: string;
    focus: string;
    words: string[];
  }[];
}
