export interface Example {
  id: number;
  value: string;
}

export interface Definition {
  id: number;
  value: string;
}

export interface Phrase {
  id: number;
  value: string;
  type: string;
  userId: number;
  examples: Example[];
  definition: Definition,
  createdAt: string;
}

export interface Answer {
  id: number;
  definition: string;
}

export interface Test {
  id: number;
  done: boolean;
  phrase: {
    id: number;
    value: string;
    type: string;
    userId: number;
  };
  answers: Answer[];
}