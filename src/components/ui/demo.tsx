"use client";

import { SplineScene } from "./splite";
import { Card } from "./card";
import { Spotlight } from "./spotlight";

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[650px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="flex h-full items-center justify-center">
        <div
          className="flex-1 relative flex items-center justify-center"
          style={{ maxWidth: 600, maxHeight: 600 }}
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
