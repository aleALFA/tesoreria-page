
export default interface DashboardRepo {
  index(signal?: AbortSignal): Promise<any>;
}