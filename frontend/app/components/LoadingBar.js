"use client";

import {
  Progress
} from "@heroui/react";

export default function LoadingBar() {

  return (
    <div className="flex items-center mb-4 min-h-1">
      <Progress aria-label="Loading..." isIndeterminate color="primary" size="sm" />
    </div>
  );
}
