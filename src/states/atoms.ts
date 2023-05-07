import { atom } from "jotai";
import type { Application } from "pixi.js";
import type { Live2DModel, InternalModel } from "pixi-live2d-display";

export const modelAtom = atom<Live2DModel<InternalModel> | null>(null);

export const pixiAppAtom = atom<Application | null>(null);

export const chatsAtom = atom<Message[]>([]);

export const replyCompletedAtom = atom<boolean>(true);
