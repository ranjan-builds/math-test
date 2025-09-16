import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Plus, Minus, Divide, X, Mic, MicOff } from "lucide-react";

// ----------------- Operation Icon -----------------
const OperationIcon = ({ op }) => {
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
    default:
      return <span>{op}</span>;
  }
};

// ----------------- Problem Component -----------------
const Problem = ({ problem, onCorrect }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [startTime, setStartTime] = useState(Date.now());
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ UseMemo for stable audio instance
  const audio = useMemo(() => new Audio("/success.mp3"), []);

  // ----------------- Reset on New Problem -----------------
  useEffect(() => {
    setStartTime(Date.now());
    setUserAnswer("");
    inputRef.current?.focus();
  }, [problem]);

  // ----------------- Check Answer -----------------
  useEffect(() => {
    if (userAnswer !== "" && parseFloat(userAnswer) === problem.answer) {
      const endTime = Date.now();
      const elapsed = (endTime - startTime) / 1000;

      // ✅ play success sound
      audio.currentTime = 0;
      audio.play().catch((err) => console.error("Audio play error:", err));

      // ⏱ wait before moving to next
      const timer = setTimeout(() => onCorrect(elapsed), 1000);
      return () => clearTimeout(timer);
    }
  }, [userAnswer, problem, startTime, onCorrect, audio]);

  // ----------------- Setup Speech Recognition -----------------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();
      const spokenNumber = transcript.replace(/[^0-9.-]/g, "");
      if (spokenNumber) setUserAnswer(spokenNumber);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      if (listening) recognition.start(); // auto-restart
    };

    recognitionRef.current = recognition;
  }, [listening]);

  // ----------------- Toggle Listening -----------------
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  }, [listening]);

  // ----------------- Input Validation -----------------
  const handleChange = (e) => {
    const val = e.target.value;
    if (/^-?\d*\.?\d*$/.test(val)) setUserAnswer(val);
  };

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-t from-neutral-950 to-neutral-900 rounded-t-2xl lg:rounded-2xl pt-10">
      <div className="flex flex-col items-end text-5xl">
        <span>{problem.num1}</span>
        <div className="flex items-center">
          <span className="mr-3">
            <OperationIcon op={problem.op} />
          </span>
          <span>{problem.num2}</span>
        </div>
        <span className="w-full bg-white h-1 mt-2"></span>

        {/* Answer Input + Mic */}
        <div className="mt-1 flex flex-col items-center">
          <input
            ref={inputRef}
            className="inp w-22 outline-0 text-right text-4xl bg-transparent"
            type="text"
            inputMode="decimal"
            value={userAnswer}
            onChange={handleChange}
          />

          <button
            onClick={toggleListening}
            aria-label={listening ? "Stop listening" : "Start listening"}
            className={`w-10 h-10 rounded-full flex items-center justify-center my-4 border transition ${
              listening
                ? "bg-red-600 text-white animate-pulse"
                : "bg-neutral-800 text-white"
            }`}
          >
            {listening ? <Mic /> : <MicOff />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Problem;
