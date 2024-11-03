import { createSignal, For } from "solid-js";

interface Operator {
  symbol: string;
  label: string;
}

const OPERATORS: Operator[] = [
  { symbol: "+", label: "Addition" },
  { symbol: "−", label: "Subtraction" },
  { symbol: "×", label: "Multiplication" },
  { symbol: "÷", label: "Division" },
  { symbol: "=", label: "Equals" },
];

interface PatternNumber {
  number: number;
  visible: boolean;
}

interface PatternProblem {
  numbers: PatternNumber[];
  rule: number;
  operator: string;
}

export default function Patterns() {
  const [selectedOperators, setSelectedOperators] = createSignal<string[]>([
    "+",
    "−",
  ]);
  const [minNumber, setMinNumber] = createSignal<number>(1);
  const [maxNumber, setMaxNumber] = createSignal<number>(50);
  const [numProblems, setNumProblems] = createSignal<number>(8);
  const [problems, setProblems] = createSignal<PatternProblem[]>([]);
  const [showAnswers, setShowAnswers] = createSignal<boolean>(false);

  const generateProblems = (e: Event) => {
    e.preventDefault();

    if (minNumber() > maxNumber()) {
      alert("Minimum number cannot be greater than maximum number.");
      return;
    }

    if (numProblems() < 1) {
      alert("Number of problems must be at least 1.");
      return;
    }

    if (selectedOperators().length === 0) {
      alert("Please select at least one operator.");
      return;
    }

    const generated: PatternProblem[] = [];
    const maxAttempts = numProblems() * 10; // Prevent infinite loops
    let attempts = 0;

    while (generated.length < numProblems() && attempts < maxAttempts) {
      attempts++;
      try {
        // Select operator
        const operator =
          selectedOperators()[getRandomInt(0, selectedOperators().length - 1)];
        // Select rule
        const rule = operator === "=" ? 0 : getRandomInt(1, 10);

        let firstNum: number | null = null;

        switch (operator) {
          case "+":
            // For addition, start number needs room to grow by 3*rule
            const maxAddStart = maxNumber() - 3 * rule;
            if (maxAddStart < minNumber()) continue;
            firstNum = getRandomInt(minNumber(), maxAddStart);
            break;
          case "−":
            // For subtraction, start number needs room to decrease by 3*rule
            const minSubStart = minNumber() + 3 * rule;
            if (minSubStart > maxNumber()) continue;
            firstNum = getRandomInt(minSubStart, maxNumber());
            break;
          case "×":
            // For multiplication, start number needs room to multiply by rule^3
            const maxMulStart = Math.floor(maxNumber() / Math.pow(rule, 3));
            if (maxMulStart < minNumber()) continue;
            firstNum = getRandomInt(minNumber(), maxMulStart);
            break;
          case "÷":
            // For division, start number must be divisible by rule^3
            const ruleCubed = Math.pow(rule, 3);
            const minDivStart = Math.max(minNumber(), ruleCubed);
            const maxDivStart = maxNumber();

            // Find all multiples of rule^3 within the range
            const possibleFirstNums: number[] = [];
            for (let n = minDivStart; n <= maxDivStart; n++) {
              if (n % ruleCubed === 0) {
                possibleFirstNums.push(n);
              }
            }

            if (possibleFirstNums.length === 0) continue; // No valid firstNum found
            firstNum =
              possibleFirstNums[getRandomInt(0, possibleFirstNums.length - 1)];
            break;
          default:
            firstNum = getRandomInt(minNumber(), maxNumber());
        }

        if (firstNum === null) continue; // Safety check

        // Generate sequence
        const sequence = generateSequence(firstNum, rule, operator);
        // Verify all numbers are within bounds
        if (sequence.some((num) => num < minNumber() || num > maxNumber())) {
          console.log("skipping", sequence);
          continue; // Skip if any number is out of bounds
        }

        // Randomly choose exactly 2 positions to be blank
        const blanks = getRandomBlanks();
        const numbersWithBlanks: PatternNumber[] = sequence.map(
          (num, index) => ({
            number: num,
            visible: !blanks.includes(index),
          })
        );

        generated.push({
          numbers: numbersWithBlanks,
          rule,
          operator,
        });
      } catch (error) {
        // If we get any error, try again
        continue;
      }
    }

    if (generated.length < numProblems()) {
      alert(
        `Could only generate ${generated.length} problems with the given constraints. Please adjust the settings.`
      );
    }

    setProblems(generated);
  };

  const generateSequence = (
    start: number,
    rule: number,
    operator: string
  ): number[] => {
    const sequence = [start];
    for (let i = 1; i < 4; i++) {
      const prev = sequence[i - 1];
      let next: number;
      switch (operator) {
        case "+":
          next = prev + rule;
          break;
        case "−":
          next = prev - rule;
          break;
        case "×":
          next = prev * rule;
          break;
        case "÷":
          if (prev % rule !== 0) {
            throw new Error("Division resulted in a non-integer.");
          }
          next = prev / rule;
          break;
        default:
          next = prev;
      }

      sequence.push(next);
    }
    return sequence;
  };

  const getRandomBlanks = (): number[] => {
    const positions = [0, 1, 2, 3];
    const blanks: number[] = [];
    while (blanks.length < 2) {
      const index = getRandomInt(0, positions.length - 1);
      blanks.push(positions[index]);
      positions.splice(index, 1);
    }
    return blanks.sort((a, b) => a - b); // Sort for consistency
  };

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:p-0">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl print:p-0 print:shadow-none">
        <h1 class="text-2xl font-bold mb-6 text-center print:hidden">
          Number Pattern Practice
        </h1>

        <form onSubmit={generateProblems} class="space-y-4 print:hidden">
          {/* Operator Selection */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Allowed Operators
            </label>
            <div class="space-y-2">
              {OPERATORS.map((op) => (
                <label
                  class="flex items-center space-x-2"
                  for={`operator-${op.symbol}`}
                >
                  <input
                    type="checkbox"
                    id={`operator-${op.symbol}`}
                    checked={selectedOperators().includes(op.symbol)}
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setSelectedOperators([
                          ...selectedOperators(),
                          op.symbol,
                        ]);
                      } else {
                        setSelectedOperators(
                          selectedOperators().filter((o) => o !== op.symbol)
                        );
                      }
                    }}
                    class="rounded text-indigo-600"
                  />
                  <span>{op.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Number Range and Amount */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                onInput={(e) =>
                  setMinNumber(parseInt(e.currentTarget.value) || minNumber())
                }
                class="mt-1 block w-full p-2 border rounded-md"
                required
                min="1"
              />
            </div>

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
                onInput={(e) =>
                  setMaxNumber(parseInt(e.currentTarget.value) || maxNumber())
                }
                class="mt-1 block w-full p-2 border rounded-md"
                required
                min={minNumber()}
              />
            </div>

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
                onInput={(e) =>
                  setNumProblems(
                    parseInt(e.currentTarget.value) || numProblems()
                  )
                }
                class="mt-1 block w-full p-2 border rounded-md"
                required
                min="1"
              />
            </div>
          </div>

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

          <button
            type="submit"
            class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Generate Problems
          </button>
        </form>

        {/* Display Problems */}
        {problems().length > 0 && (
          <div class="mt-8">
            <h2 class="text-xl font-semibold mb-4 text-center print:hidden">
              Generated Pattern Problems {showAnswers() && "(Answer Key)"}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-8">
              <For each={problems()}>
                {(problem) => (
                  <div class="border-2 border-gray-200 p-4 rounded-lg">
                    <div class="flex flex-col space-y-6">
                      {/* Numbers */}
                      <div class="flex justify-between items-center">
                        <For each={problem.numbers}>
                          {(num, index) => (
                            <div class="w-16 h-10 border border-gray-300 flex items-center justify-center">
                              {showAnswers() || num.visible ? num.number : ""}
                            </div>
                          )}
                        </For>
                      </div>

                      {/* Rule and Operators */}
                      <div class="flex flex-col items-center space-y-4">
                        <div class="text-center">
                          <div class="text-sm mb-1">Rule</div>
                          <div class="w-12 h-8 border border-gray-300 flex items-center justify-center">
                            {showAnswers() ? problem.rule : ""}
                          </div>
                        </div>
                        <div class="flex flex-wrap gap-3 justify-center mt-2">
                          {OPERATORS.filter((op) =>
                            selectedOperators().includes(op.symbol)
                          ).map((op) => (
                            <div
                              class={`w-8 h-8 flex items-center justify-center
                                ${
                                  showAnswers() &&
                                  op.symbol === problem.operator
                                    ? "border-2 border-indigo-600 rounded-full"
                                    : ""
                                }`}
                            >
                              {op.symbol}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
