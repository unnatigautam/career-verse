
import api from "./api";

export interface RoadmapProgressResponse {
  success: boolean;
  completedTasks: string[];
}

export const getRoadmapProgress = async (): Promise<
  RoadmapProgressResponse
> => {
  const response = await api.get<RoadmapProgressResponse>("/roadmap");
  return response.data;
};

export const saveRoadmapProgress = async (
  completedTasks: string[]
): Promise<RoadmapProgressResponse> => {
  const response = await api.put<RoadmapProgressResponse>("/roadmap", {
    completedTasks,
  });

  return response.data;
};
