import { seedSignals } from "./demo-data";
import { buildProblemObjects } from "./clustering";
import type { ProblemObject, RawSignal } from "./types";

interface StoreState {
  signals: RawSignal[];
  problems: ProblemObject[];
  initialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var reverseDemocracyStore: StoreState | undefined;
}

const state: StoreState =
  globalThis.reverseDemocracyStore ??
  (globalThis.reverseDemocracyStore = {
    signals: [...seedSignals],
    problems: [],
    initialized: false
  });

export async function ensureInitialized(): Promise<void> {
  if (!state.initialized) {
    state.problems = await buildProblemObjects(state.signals);
    state.initialized = true;
  }
}

export async function getProblems(): Promise<ProblemObject[]> {
  await ensureInitialized();
  return state.problems;
}

export async function getSignals(): Promise<RawSignal[]> {
  await ensureInitialized();
  return state.signals;
}

export async function addSignal(signal: RawSignal): Promise<ProblemObject[]> {
  state.signals = [signal, ...state.signals];
  state.problems = await buildProblemObjects(state.signals);
  state.initialized = true;
  return state.problems;
}

export async function resetDemoData(): Promise<ProblemObject[]> {
  state.signals = [...seedSignals];
  state.problems = await buildProblemObjects(state.signals);
  state.initialized = true;
  return state.problems;
}

export async function findProblem(id: string): Promise<ProblemObject | undefined> {
  const problems = await getProblems();
  return problems.find((problem) => problem.id === id);
}
