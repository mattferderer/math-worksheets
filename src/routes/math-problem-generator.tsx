// src/routes/index.tsx
import { createSignal, For } from "solid-js";
import ErrorMessage from "../components/Error";

type ProblemType = "addition" | "subtraction" | "multiplication" | "division";

interface MathProblem {
  num1: number;
  num2: number;
  operator: string;
}

export default function Addition() {
  const [problemType, setProblemType] = createSignal<ProblemType>("addition");
  const [minNumber, setMinNumber] = createSignal<number>(0);
  const [maxNumber, setMaxNumber] = createSignal<number>(10);
  const [numProblems, setNumProblems] = createSignal<number>(28);
  const [problems, setProblems] = createSignal<MathProblem[]>([]);
  const [showAnswers, setShowAnswers] = createSignal<boolean>(false);

  const generateProblems = (e: Event) => {
    e.preventDefault();

    // Input validation
    if (minNumber() > maxNumber()) {
      alert("Minimum number cannot be greater than maximum number.");
      return;
    }

    if (numProblems() < 1) {
      alert("Number of problems must be at least 1.");
      return;
    }

    const generated: MathProblem[] = [];

    for (let i = 0; i < numProblems(); i++) {
      const num1 = getRandomInt(minNumber(), maxNumber());
      let num2 = getRandomInt(minNumber(), maxNumber());

      // For division, ensure no division by zero and integer results
      if (problemType() === "division") {
        while (num2 === 0) {
          num2 = getRandomInt(minNumber(), maxNumber());
        }
      }

      generated.push({
        num1,
        num2,
        operator: getOperatorSymbol(problemType()),
      });
    }

    setProblems(generated);
  };

  const getAnswer = (problem: MathProblem): number => {
    switch (problem.operator) {
      case "+":
        return problem.num1 + problem.num2;
      case "−":
        return problem.num1 - problem.num2;
      case "×":
        return problem.num1 * problem.num2;
      case "÷":
        return problem.num1 / problem.num2;
      default:
        return 0;
    }
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getOperatorSymbol = (type: ProblemType): string => {
    switch (type) {
      case "addition":
        return "+";
      case "subtraction":
        return "−";
      case "multiplication":
        return "×";
      case "division":
        return "÷";
      default:
        return "?";
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:p-0">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl print:p-0 print:shadow-none">
        <h1 class="text-2xl font-bold mb-6 text-center print:hidden">
          Math Problem Generator
        </h1>
        <form onSubmit={generateProblems} class="space-y-4 print:hidden">
          {/* Problem Type */}
          <div>
            <label
              for="problemType"
              class="block text-sm font-medium text-gray-700"
            >
              Type of Problem
            </label>
            <select
              id="problemType"
              value={problemType()}
              onInput={(e) =>
                setProblemType(e.currentTarget.value as ProblemType)
              }
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="addition">Addition</option>
              <option value="subtraction">Subtraction</option>
              <option value="multiplication">Multiplication</option>
              <option value="division">Division</option>
            </select>
          </div>
          {/* Minimum Number */}
          <div>
            <label
              for="minNumber"
              class="block text-sm font-medium text-gray-700"
            >
              Minimum Number
            </label>
            <input
              type="number"
              id="minNumber"
              value={minNumber()}
              onInput={(e) => setMinNumber(parseInt(e.currentTarget.value))}
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <ErrorMessage
            show={minNumber() > maxNumber()}
            message="Minimum number cannot be greater than maximum number."
          />
          {/* Maximum Number */}
          <div>
            <label
              for="maxNumber"
              class="block text-sm font-medium text-gray-700"
            >
              Maximum Number
            </label>
            <input
              type="number"
              id="maxNumber"
              value={maxNumber()}
              onInput={(e) => setMaxNumber(parseInt(e.currentTarget.value))}
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {/* Number of Problems */}
          <div>
            <label
              for="numProblems"
              class="block text-sm font-medium text-gray-700"
            >
              Number of Problems
            </label>
            <input
              type="number"
              id="numProblems"
              value={numProblems()}
              onInput={(e) => setNumProblems(parseInt(e.currentTarget.value))}
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              min="1"
            />
          </div>
          {/* Error Message */}
          <ErrorMessage
            message="Number of problems must be at least 1."
            show={numProblems() < 1}
          />
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAnswers"
              checked={showAnswers()}
              onChange={(e) => setShowAnswers(e.currentTarget.checked)}
              class="rounded text-indigo-600"
            />
            <label for="showAnswers" class="text-sm font-medium text-gray-700">
              Show Answer Key
            </label>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={minNumber() > maxNumber() || numProblems() < 1}
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Generate Problems
            </button>
          </div>
        </form>

        {/* Display Problems */}
        {problems().length > 0 && (
          <section class="mt-8 print:mt-0">
            <h2 class="text-xl font-semibold mb-4 text-center print:hidden">
              Generated Math Problems {showAnswers() && "(Answer Key)"}
            </h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-6 print:gap-8">
              <For each={problems()}>
                {(problem, index) => (
                  <li class="flex items-center justify-center my-8 print:break-inside-avoid">
                    <div class="text-2xl font-mono print:text-xl">
                      <div
                        class="flex flex-col items-end"
                        style="min-width: 6ch"
                      >
                        <span class="tabular-nums">{problem.num1}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-lg">{problem.operator}</span>
                          <span class="tabular-nums">{problem.num2}</span>
                        </div>
                        <span
                          class="border-b-2 border-gray-400 mt-2"
                          style="width: 6ch"
                        ></span>
                      </div>
                      <div class="text-right">
                        {showAnswers() ? (
                          getAnswer(problem)
                        ) : (
                          <span class="w-10 inline-block">&nbsp;</span>
                        )}
                      </div>
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
