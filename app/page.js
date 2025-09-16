"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import ProblemRange from "@/components/ProblemRange";
import Selections from "@/components/Selections";
import States from "@/components/States";
import Problem from "@/components/Problem";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, BadgeCheck } from "lucide-react";

// ------------------- Helpers -------------------
const getRandomNumber = (digits) => {
  const d = Number(digits);
  const min = Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const calculate = (num1, num2, op) => {
  switch (op) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return Math.floor(num1 / num2);
    default:
      return null;
  }
};

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return (
    (
      `${minutes ? `${minutes} minute${minutes > 1 ? "s " : " "}` : ""}` +
      `${seconds ? `${seconds} second${seconds > 1 ? "s" : ""}` : ""}`
    ).trim() || "0 seconds"
  );
};

// ------------------- Main Component -------------------
export default function Home() {
  // Group state for quiz setup
  const [settings, setSettings] = useState({
    count: 5,
    firstDigits: "2",
    secondDigits: "2",
    operation: "+",
  });

  // Quiz state
  const [isTesting, setIsTesting] = useState(false);
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ------------------- Generators -------------------
  const generateProblems = useCallback(() => {
    const { count, firstDigits, secondDigits, operation } = settings;

    return Array.from({ length: count }, () => {
      let num1 = getRandomNumber(firstDigits);
      let num2 = getRandomNumber(secondDigits);

      if ((operation === "-" || operation === "/") && num1 < num2) {
        [num1, num2] = [num2, num1]; // swap
      }

      if (operation === "/") {
        if (num2 === 0) num2 = 1;

        // ensure divisor is smaller than dividend but not equal
        while (num1 % num2 !== 0 || num1 === num2 || num2 === 1) {
          num1 = getRandomNumber(firstDigits);
          num2 = getRandomNumber(secondDigits) || 1;
        }
      }

      return {
        num1,
        num2,
        op: operation,
        answer: calculate(num1, num2, operation),
        time: null,
      };
    });
  }, [settings]);

  // ------------------- Handlers -------------------
  const handleGenerate = useCallback(() => {
    setProblems(generateProblems());
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setIsTesting(true);
  }, [generateProblems]);

  const handleAbort = () => {
    setIsTesting(false);
    setFinished(false);
    setProblems([]);
  };

  const handleCorrect = (elapsedTime) => {
    setScore((s) => s + 1);

    setProblems((prev) => {
      const updated = [...prev];
      updated[currentIndex].time = elapsedTime;
      return updated;
    });

    if (currentIndex + 1 < problems.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      setIsTesting(false);
    }
  };

  // ------------------- Keyboard Shortcuts -------------------
  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Enter" && !isTesting && !finished) {
        e.preventDefault();
        handleGenerate();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [isTesting, finished, handleGenerate]);

  // ------------------- Derived Data -------------------
  const totalTime = useMemo(
    () => problems.reduce((sum, p) => sum + (p.time || 0), 0),
    [problems]
  );

  // ------------------- Render -------------------
  return (
    <>
      <Header />
      <div className="flex items-center justify-center mt-12 lg:mt-0 min-h-screen mx-auto">
        <div className="w-full max-w-xl mx-auto bg-neutral-950 lg:bg-neutral-950 border-0 lg:border lg:border-neutral-800 rounded-none lg:rounded-2xl lg:shadow-sm p-1">
          {/* Setup Screen */}
          {!isTesting && !finished && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
            >
              <div className="flex flex-col gap-6 p-8 rounded-2xl lg:bg-gradient-to-t from-neutral-950/50 to-neutral-900/50">
                <Selections
                  firstDigits={settings.firstDigits}
                  onFirstChange={(val) =>
                    setSettings((s) => ({ ...s, firstDigits: val }))
                  }
                  operation={settings.operation}
                  onOperationChange={(val) =>
                    setSettings((s) => ({ ...s, operation: val }))
                  }
                  secondDigits={settings.secondDigits}
                  onSecondValueChange={(val) =>
                    setSettings((s) => ({ ...s, secondDigits: val }))
                  }
                />
                <ProblemRange
                  count={settings.count}
                  onSliderChange={(val) =>
                    setSettings((s) => ({ ...s, count: val[0] }))
                  }
                  onInputChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      count: Number(e.target.value),
                    }))
                  }
                />
                <Button type="submit" className="w-full mt-3">
                  Generate
                </Button>
              </div>
            </form>
          )}

          {/* Test Screen */}
          {isTesting && !finished && (
            <div className="flex flex-col">
              <States
                count={settings.count}
                currentIndex={currentIndex}
                setAboart={handleAbort}
                finished={finished}
              />
              {problems.length > 0 && (
                <Problem
                  problem={problems[currentIndex]}
                  onCorrect={handleCorrect}
                />
              )}
            </div>
          )}

          {/* Finish Screen */}
          {finished && (
            <div className="mt-6 text-center space-y-4 px-8 pb-8">
              <h3 className="text-lg font-bold flex items-center justify-center gap-2">
                <span className="text-green-400">
                  <BadgeCheck />
                </span>
                Quiz Finished!
              </h3>

              <p>
                <b>{problems.length}</b> Problems in{" "}
                <b>{formatTime(totalTime)}</b>
              </p>

              <div className="mt-4 text-left">
                <h4 className="font-semibold mb-2">Your Results:</h4>
                <ScrollArea className="w-full h-48">
                  <div>
                    {problems.map((p, i) => (
                      <p key={i} className="font-mono">
                        {i + 1}. {p.num1} {p.op} {p.num2} = {p.answer}
                        <span className="ml-2 text-sm text-gray-500">
                          ({p.time?.toFixed(2)}s)
                        </span>
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Button onClick={handleGenerate} className="mt-4 w-full">
                <RotateCcw /> Restart
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
