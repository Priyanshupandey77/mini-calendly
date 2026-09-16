import type {
  CreateAvailabilityData,
  CreateAvailabilityResponse,
  DeleteAvailabilityResponse,
  GetAvailabilityResponse,
} from "../types/api.types";
import api from "./api";

export async function createAvailability(data: CreateAvailabilityData) {
  const response = await api.post<CreateAvailabilityResponse>(
    "/availability",
    data,
  );
  return response.data;
}

export async function getAvailability() {
  const response = await api.get<GetAvailabilityResponse>("/availability");
  return response.data.availability;
}
export async function updateAvailability(
  availabilityId: number,
  data: CreateAvailabilityData,
) {
  const response = await api.put(`/availability/${availabilityId}`, data);
  return response.data;
}
export async function deleteAvailability(availabilityId: number) {
  const response = await api.delete<DeleteAvailabilityResponse>(
    `/availability/${availabilityId}`,
  );
  return response.data;
}
