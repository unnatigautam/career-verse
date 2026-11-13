
import api from "./api";

export interface AssessmentData {
  education: string;
  field: string;
  interests: string[];
  skills: string[];
  experience: string;
  workPreference: string;
  careerGoal: string;
}

export interface CareerSnapshot {
  title: string;
  score: number;
}

export interface AssessmentResult {
  assessment: AssessmentData;
  careerMatches: CareerSnapshot[];
}

export interface AssessmentRecord {
  _id: string;
  userId: string;
  answers: AssessmentData;
  result: AssessmentResult;
  createdAt: string;
  updatedAt: string;
}

export const saveAssessment = async (
  answers: AssessmentData,
  result: AssessmentResult
) => {
  const response = await api.post("/assessment", {
    answers,
    result,
  });
  return response.data;
};

export const getLatestAssessment = async () => {
  const response = await api.get("/assessment");
  return response.data;
};

export const getAssessmentHistory = async () => {
  const response = await api.get("/assessment/history");
  return response.data;
};

export const deleteAssessment = async (id: string) => {
  const response = await api.delete(`/assessment/${id}`);
  return response.data;
};

export const clearAssessmentHistory = async () => {
  const response = await api.delete("/assessment/history");
  return response.data;
};
