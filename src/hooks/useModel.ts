import { useState } from "react";
import { useAtom } from "jotai";
import { modelAtom, pixiAppAtom } from "@/states/atoms";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";

enum MotionPriority {
  NONE,
  IDLE,
  NORMAL,
  FORCE,
}

export const useModel = () => {
  const [model, setModel] = useAtom(modelAtom);
  const [app, setApp] = useAtom(pixiAppAtom);
  const [originalModelHeight, setOriginalModelHeight] = useState(0);
  const [originalModelWidth, setOriginalModelWidth] = useState(0);

  const init = () => {
    if (!window) {
      return;
    }
    (window as any).PIXI = PIXI;
    const canvas = document.getElementById("canvas");
    if (!canvas) {
      return;
    }
    const pixiApp = new PIXI.Application({
      view: canvas as HTMLCanvasElement,
      transparent: true,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setApp(pixiApp);
    initLive2D(pixiApp);
  };

  const initLive2D = async (t?: PIXI.Application) => {
    const current = t ?? app;
    if (!current) {
      return;
    }

    const model = await Live2DModel.from(
      "/Resources/Hiyori/Hiyori.model3.json"
    );

    current.stage.addChild(model);

    setOriginalModelHeight(model.height);
    setOriginalModelWidth(model.width);

    // transforms
    model.anchor.set(0.5, 0.5);

    const modelAspectRatio = model.width / model.height;
    const screenAspectRatio = current.view.width / current.view.height;
    let scale = 1;
    if (screenAspectRatio > modelAspectRatio) {
      scale = current.view.height / model.height;
    } else {
      scale = current.view.width / model.width;
    }
    // model.scale.set(scale);
    model.scale.set(scale * 2);
    // model.position.set(current.view.width / 2, current.view.height/2);
    model.position.set(current.view.width / 2, current.view.height);

    setModel(model);
  };

  const handleResize = () => {
    if (!app || !model) {
      return;
    }
    const innerWidth = window.visualViewport
      ? window.visualViewport.width
      : window.innerWidth;
    const innerHeight = window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

    app.view.style.width = `${innerWidth}px`;
    app.view.style.height = `${innerHeight}px`;

    app.renderer.resize(innerWidth, innerHeight);

    const modelAspectRatio = originalModelWidth / originalModelHeight;
    const screenAspectRatio = innerWidth / innerHeight;
    let scale = 1;
    if (screenAspectRatio > modelAspectRatio) {
      scale = innerHeight / originalModelHeight;
    } else {
      scale = innerWidth / originalModelWidth;
    }
    // model.scale.set(scale);
    model.scale.set(scale * 2);
    // model.position.set(innerWidth / 2, innerHeight / 2);
    model.position.set(innerWidth / 2, innerHeight);
  };

  const transforms = () => {
    if (!model) {
      return;
    }
  };

  const lipSync = async (src: string) => {
    if (!model || !app) {
      return;
    }
    const audio = new Audio();
    audio.addEventListener("canplaythrough", async function (e) {
      const category_name = "Idle";
      const animation_index = 0;
      const priority = MotionPriority.FORCE;

      const result = await model.motion(
        category_name,
        animation_index,
        priority,
        src
      );

      if (result) {
        console.log("リップシンクが正常に開始されました");
      } else {
        console.log("リップシンクの開始に失敗しました");
      }
    });
    audio.src = src;
    audio.load();
  };

  return {
    init,
    initLive2D,
    app,
    model,
    transforms,
    lipSync,
    handleResize,
  };
};
