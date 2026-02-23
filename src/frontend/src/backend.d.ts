import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface LeaderboardEntry {
    userId: Principal;
    points: bigint;
}
export interface Doubt {
    description: string;
    author: Principal;
    timestamp: bigint;
    attachment?: ExternalBlob;
}
export interface Answer {
    responder: Principal;
    video?: ExternalBlob;
    doubtId: Principal;
    text: string;
    numRatings: bigint;
    notes?: ExternalBlob;
    rating: number;
}
export interface UserProfile {
    name: string;
    role: UserRole;
}
export enum UserRole {
    Junior = "Junior",
    Senior = "Senior"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    getAllDoubts(): Promise<Array<[Principal, Doubt]>>;
    getAnswersForDoubt(doubtId: Principal): Promise<Array<[Principal, Answer]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    postAnswer(doubtId: Principal, text: string, notes: ExternalBlob | null, video: ExternalBlob | null): Promise<void>;
    postDoubt(description: string, attachment: ExternalBlob | null): Promise<void>;
    rateAnswer(answerer: Principal, doubtId: Principal, rating: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
