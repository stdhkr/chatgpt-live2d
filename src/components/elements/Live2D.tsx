import { useEffect } from "react";
import { useModel } from "@/hooks/useModel";
import { debounce } from "@/utils/conversions";

export const Live2D = () => {
  const { init, handleResize, model, app } = useModel();
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!model || !app) {
      return;
    }
    const debouncedHandleResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [model, app]);
  return (
    <>
      <canvas id="canvas" />
    </>
  );
};
