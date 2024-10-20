"use client";

import React from "react";
import Button from "./Button";
import { ChevronRight } from "lucide-react";

const TryAnimo = ({ tryAnimoLabel }: { tryAnimoLabel: string }) => {
  return (
    <Button className="flex gap-x-2 p-12" onClick={() => window.open("https://animo.video", "_blank")}>
      {tryAnimoLabel}
      <ChevronRight />
    </Button>
  );
};

export default TryAnimo;
