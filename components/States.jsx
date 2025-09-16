import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

const States = ({ setAboart, count, currentIndex, finished }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Reset + start timer on new question
  useEffect(() => {
    if (finished) return; // stop if quiz ended

    setElapsedTime(0); // reset when question changes
    const interval = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [currentIndex, finished]);

  // Format to mm:ss
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-full flex justify-between items-center px-3 py-4">
      <Button onClick={setAboart} variant={"outline"}>
        Abort
      </Button>
      <span>{formatted}</span>
      <span>
        {currentIndex + 1}/{count}
      </span>
    </div>
  );
};

export default States;
