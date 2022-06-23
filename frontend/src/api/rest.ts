import axios, { AxiosResponse } from "axios";
import Cookies from "universal-cookie";
import { Profile } from "../types/profile";
import { User } from "../types/user";
import { Wallet } from "../types/wallet";
import { Worker } from "../types/worker";

const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:9000/api";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 &&
      error.response.config.url !== "/users/me" &&
      error.response.config.url !== "/notifications/subscribe"
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export class API {
  public statsUrl = `/stats/`;
  public walletsUrl = `/wallets/`;
  public profilesUrl = `/profiles/`;
  public workersUrl = `/workers/`;
  public usersUrl = `/users/`;

  login(
    username: string,
    password: string,
    trusted: boolean
  ): Promise<AxiosResponse> {
    return axiosInstance.post(
      `/login`,
      JSON.stringify({
        username,
        password,
        trusted,
      }),
      { withCredentials: true }
    );
  }
  logout(): Promise<AxiosResponse> {
    const cookies = new Cookies();
    cookies.remove("session");
    return axiosInstance.get(`/logout`);
  }

  initGlobalState(): Promise<AxiosResponse> {
    return axiosInstance.get(this.statsUrl);
  }
  // do not use axiosInstance to avoid interceptor redirect loop
  me(): Promise<AxiosResponse<User>> {
    return axios.get<User>(`${baseURL}${this.usersUrl}me`, {
      withCredentials: true,
    });
  }

  subscribeToNotifications(
    token: string,
    device: string
  ): Promise<AxiosResponse> {
    return axiosInstance.get("/notifications/subscribe", {
      params: { token, device },
    });
  }

  updateUser(user: User): Promise<AxiosResponse> {
    return axiosInstance.put<User>(
      `${this.usersUrl}${user.id}`,
      JSON.stringify(user)
    );
  }

  getWallets(): Promise<AxiosResponse<Wallet[]>> {
    return axiosInstance.get<Wallet[]>(this.walletsUrl);
  }
  getWallet(id: string): Promise<AxiosResponse<Wallet>> {
    return axiosInstance.get<Wallet>(`${this.walletsUrl}${id}`);
  }
  createWallet(wallet: Wallet): Promise<AxiosResponse<Wallet>> {
    return axiosInstance.post<Wallet>(
      `${this.walletsUrl}`,
      JSON.stringify(wallet)
    );
  }
  updateWallet(wallet: Wallet): Promise<AxiosResponse> {
    return axiosInstance.put<Wallet>(
      `${this.walletsUrl}${wallet.id}`,
      JSON.stringify(wallet)
    );
  }
  deleteWallet(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`${this.walletsUrl}${id}`);
  }

  getProfiles(): Promise<AxiosResponse<Profile[]>> {
    return axiosInstance.get<Profile[]>(this.profilesUrl);
  }
  getProfile(id: string): Promise<AxiosResponse<Profile>> {
    return axiosInstance.get<Profile>(`${this.profilesUrl}${id}`);
  }
  createProfile(profile: Profile): Promise<AxiosResponse<Profile>> {
    return axiosInstance.post<Profile>(
      `${this.profilesUrl}`,
      JSON.stringify(profile)
    );
  }
  updateProfile(profile: Profile): Promise<AxiosResponse> {
    return axiosInstance.put<Profile>(
      `${this.profilesUrl}${profile.id}`,
      JSON.stringify(profile)
    );
  }
  deleteProfile(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`${this.profilesUrl}${id}`);
  }

  getWorkers(): Promise<AxiosResponse<Worker[]>> {
    return axiosInstance.get<Worker[]>(this.workersUrl);
  }
  getWorker(id: string): Promise<AxiosResponse<Worker>> {
    return axiosInstance.get<Worker>(`${this.workersUrl}${id}`);
  }
  createWorker(worker: Worker): Promise<AxiosResponse<Worker>> {
    return axiosInstance.post<Worker>(
      `${this.workersUrl}`,
      JSON.stringify(worker)
    );
  }
  updateWorker(worker: Worker): Promise<AxiosResponse> {
    return axiosInstance.put<Worker>(
      `${this.workersUrl}${worker.id}`,
      JSON.stringify(worker)
    );
  }
  deleteWorker(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`${this.workersUrl}${id}`);
  }
}

export const RestAPI = new API();
