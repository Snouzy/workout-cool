export type RewardedAdGateStatus = "idle" | "loading" | "success" | "error";

export type RewardedAdFailureReason = "blocked" | "failed" | "timeout";

export interface RewardedAdGateState {
  status: RewardedAdGateStatus;
  failureReason?: RewardedAdFailureReason;
}

export type RewardedAdGateEvent =
  | { type: "start" }
  | { type: "success" }
  | { type: "failure"; reason: Exclude<RewardedAdFailureReason, "timeout"> }
  | { type: "timeout" }
  | { type: "retry" };

export const REWARDED_AD_TIMEOUT_MS = 30_000;

export function rewardedAdGateReducer(
  state: RewardedAdGateState,
  event: RewardedAdGateEvent,
): RewardedAdGateState {
  switch (event.type) {
    case "start":
      return state.status === "idle" ? { status: "loading" } : state;
    case "success":
      return state.status === "loading" ? { status: "success" } : state;
    case "failure":
      if (state.status === "loading") return { status: "error", failureReason: event.reason };
      if (state.status === "idle" && event.reason === "blocked") {
        return { status: "error", failureReason: "blocked" };
      }
      return state;
    case "timeout":
      return state.status === "loading" ? { status: "error", failureReason: "timeout" } : state;
    case "retry":
      return state.status === "error" ? { status: "idle" } : state;
  }
}
