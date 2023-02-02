export interface CustomApiResponse<T> {
  result: T;
  errorCode: string;
  message: object;
  responseCode: number;
}

export interface PdQuestion {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  code: string;
  content: string;
  description?: string;
  answerType: string;
  placeHolder?: string;
  answers?: Array<string>;
}

export interface PdGroupQuestions {
  id: string;
  order: number;
  pdGroupId: number;
  pdQuestion: PdQuestion;
  pdQuestionId: number;
}

export interface PDGroup {
  content: string;
  createdAt: string;
  createdBy: string;
  description: string;
  id: string;
  objectId: number;
  pdGroupQuestions: Array<PdGroupQuestions>;
  status: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PdModelGroups {
  id: string;
  order: number;
  pdModelId: number;
  pdGroup: PDGroup;
  pdGroupId: number;
}

export interface PDModel {
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  id: string;
  objectId: number;
  code: string;
  content: string;
  pdModelGroups: Array<PdModelGroups>;
  description?: string;
  status: string;
}
