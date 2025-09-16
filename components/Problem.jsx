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
  const shouldListenRef = useRef(false); // 🔧 Added ref to track intended listening state
  const audioInitialized = useRef(false); // Track if audio context is initialized

  // ✅ UseMemo for stable audio instance with Android handling
  const audio = useMemo(() => {
    const audioInstance = new Audio("./success.mp3");
    audioInstance.volume = 0.5; // Lower volume for better UX
    audioInstance.preload = "auto";
    return audioInstance;
  }, []);

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

      // ✅ Try to play success sound (skip on mobile to avoid issues)
      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (!isMobile) {
        const playAudio = async () => {
          try {
            audio.currentTime = 0;
            await audio.play();
          } catch (err) {
            console.log("Audio autoplay blocked:", err.name);
          }
        };
        playAudio();
      }

      // ⏱ wait before moving to next
      const timer = setTimeout(() => onCorrect(elapsed), 200);
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

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setListening(true);
      };

      recognition.onresult = (event) => {
        try {
          const transcript =
            event.results[event.results.length - 1][0].transcript.trim();
          console.log("Speech recognized:", transcript);
          const spokenNumber = transcript.replace(/[^0-9.-]/g, "");
          if (spokenNumber) setUserAnswer(spokenNumber);
        } catch (error) {
          console.error("Error processing speech result:", error);
        }
      };

      recognition.onerror = (event) => {
        const errorMessage = event?.error || "Unknown speech recognition error";
        console.error("Speech recognition error:", errorMessage);
        setListening(false);
        shouldListenRef.current = false;
      };

      // 🔧 Fixed onend handler
      recognition.onend = () => {
        console.log("Speech recognition ended");
        setListening(false);

        // Only restart if we should still be listening
        if (shouldListenRef.current) {
          // Small delay to prevent immediate restart issues
          setTimeout(() => {
            if (shouldListenRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error("Error restarting recognition:", error);
                setListening(false);
                shouldListenRef.current = false;
              }
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error initializing speech recognition:", error);
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        shouldListenRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error("Error stopping recognition on cleanup:", error);
        }
      }
    };
  }, []); // 🔧 Removed 'listening' dependency to prevent recreation

  // ----------------- Toggle Listening -----------------
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    // Initialize audio on first user interaction (fixes Android autoplay)
    if (!audioInitialized.current) {
      audio.load();
      // Try to play and immediately pause to unlock audio context
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audioInitialized.current = true;
        })
        .catch(() => {
          // Still blocked, but we tried
          console.log("Audio initialization blocked");
        });
    }

    if (listening || shouldListenRef.current) {
      // Stop listening
      console.log("Stopping speech recognition");
      shouldListenRef.current = false;
      recognitionRef.current.stop();
    } else {
      // Start listening
      console.log("Starting speech recognition");
      shouldListenRef.current = true;
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        shouldListenRef.current = false;
      }
    }
  }, [listening, audio]);

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
