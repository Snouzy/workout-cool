import { describe, expect, it } from "vitest";

import {
  REWARDED_AD_TIMEOUT_MS,
  rewardedAdGateReducer,
  type RewardedAdGateState,
} from "./rewarded-ad-state";

const idle: RewardedAdGateState = { status: "idle" };
const loading: RewardedAdGateState = { status: "loading" };

describe("rewardedAdGateReducer", () => {
  it("moves from idle to loading", () => {
    expect(rewardedAdGateReducer(idle, { type: "start" })).toEqual({ status: "loading" });
  });

  it("only grants from loading on an explicit success event", () => {
    expect(rewardedAdGateReducer(loading, { type: "success" })).toEqual({ status: "success" });
  });

  it("does not grant when the ad request fails", () => {
    expect(rewardedAdGateReducer(loading, { type: "failure", reason: "failed" })).toEqual({
      status: "error",
      failureReason: "failed",
    });
  });

  it("does not grant when the ad SDK is blocked or unavailable", () => {
    expect(rewardedAdGateReducer(idle, { type: "failure", reason: "blocked" })).toEqual({
      status: "error",
      failureReason: "blocked",
    });
    expect(rewardedAdGateReducer(loading, { type: "failure", reason: "blocked" })).toEqual({
      status: "error",
      failureReason: "blocked",
    });
  });

  it("does not grant when the request times out", () => {
    expect(rewardedAdGateReducer(loading, { type: "timeout" })).toEqual({
      status: "error",
      failureReason: "timeout",
    });
    expect(REWARDED_AD_TIMEOUT_MS).toBe(30_000);
  });

  it("ignores late callbacks after a timeout and supports retrying", () => {
    const timedOut = rewardedAdGateReducer(loading, { type: "timeout" });

    expect(rewardedAdGateReducer(timedOut, { type: "success" })).toEqual(timedOut);
    expect(rewardedAdGateReducer(timedOut, { type: "retry" })).toEqual({ status: "idle" });
    expect(rewardedAdGateReducer({ status: "idle" }, { type: "start" })).toEqual(loading);
  });
});
