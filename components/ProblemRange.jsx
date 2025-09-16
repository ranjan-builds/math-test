import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "./ui/input";
const ProblemRange = ({ count, onSliderChange, onInputChange }) => {
  return (
    <div className=" px-1 my-4 flex flex-col  justify-center">
      <label className="text-sm font-medium text-neutral-300">
        Number of Problems
      </label>
      <div className="grid grid-cols-[80%_20%] gap-2 items-center">
        <Slider
          value={[count]}
          onValueChange={onSliderChange}
          max={100}
          min={5}
          step={5}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Enter your answer"
          className="w-full text-center"
          value={count}
          onChange={onInputChange}
          min={1}
          max={100}
        />
      </div>
    </div>
  );
};

export default ProblemRange;
