import React from "react";
import { Plus, Minus, X, Divide, CircleDot } from "lucide-react";

export const OperationIcon = ({ op }) => {
  switch (op) {
    case "+":
      return <Plus />;
    case "-":
      return <Minus />;
    case "×":
    case "*":
      return <X />;
    case "÷":
    case "/":
      return <Divide />;
    case "digitSum":
      return <CircleDot />;
    default:
      return <span>{op}</span>; // fallback if op is unknown
  }
};
