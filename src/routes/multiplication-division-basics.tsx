import { createEffect, createSignal, For, Show } from "solid-js";
import ErrorMessage from "../components/Error";

export default function MultiplicationDivisionBasics() {
  const [baseNumber, setBaseNumber] = createSignal<number | null>(5);
  const [includeSkipCounting, setIncludeSkipCounting] =
    createSignal<boolean>(true);
  const [includeMultiplicationFeature, setIncludeMultiplicationFeature] =
    createSignal<boolean>(true);
  const [includeLongMultiplication, setIncludeLongMultiplication] =
    createSignal<boolean>(true);
  const [includeDivisionGrid, setIncludeDivisionGrid] =
    createSignal<boolean>(true);
  const [includeLongDivision, setIncludeLongDivision] =
    createSignal<boolean>(true);
  const [showAnswers, setShowAnswers] = createSignal<boolean>(false);
  const [randomizeLongMultiplication, setRandomizeLongMultiplication] =
    createSignal<boolean>(false);
  const [showBlocks, setShowBlocks] = createSignal<boolean>(false);

  const isValidBaseNumber = () => {
    return (
      baseNumber() !== null &&
      !isNaN(baseNumber()!) &&
      baseNumber()! >= -99 &&
      baseNumber()! <= 99 &&
      baseNumber()! !== 0
    );
  };

  const longNumbers = () => {
    const numbers = [...Array(11).keys()];
    return randomizeLongMultiplication()
      ? numbers.sort(() => Math.random() - 0.5)
      : numbers;
  };

  const isValidBlockVisualization = () =>
    baseNumber() !== null &&
    !isNaN(baseNumber()!) &&
    baseNumber()! > 0 &&
    baseNumber()! < 11;

  createEffect(() => {
    if (!isValidBlockVisualization()) {
      setShowBlocks(false);
    }
  });

  return (
    <div class="min-h-screen bg-gray-100 p-4 print:p-0">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto print:p-0 print:shadow-none">
        <h1 class="text-2xl font-bold mb-6 text-center print:hidden">
          Multiplication & Division Basics
        </h1>
        <form class="space-y-4 print:hidden">
          {/* Base Number Input */}
          <div>
            <label
              for="baseNumber"
              class="block text-sm font-medium text-gray-700"
            >
              Base Number
            </label>
            <input
              type="number"
              id="baseNumber"
              data-test-name="base-number-input"
              value={baseNumber() ?? ""}
              onInput={(e) => setBaseNumber(parseInt(e.currentTarget.value))}
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <ErrorMessage
              show={!isValidBaseNumber()}
              message="Base number must be a valid number between -99 and 99, and not zero."
            />
          </div>
          {/* Toggle Skip Counting */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeSkipCounting"
              data-test-name="include-skip-counting-checkbox"
              checked={includeSkipCounting()}
              onChange={(e) => setIncludeSkipCounting(e.currentTarget.checked)}
              class="rounded text-indigo-600"
            />
            <label
              for="includeSkipCounting"
              class="text-sm font-medium text-gray-700"
            >
              Include Skip Counting
            </label>
          </div>
          {/* Toggle Multiplication Feature */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeMultiplicationFeature"
              data-test-name="include-multiplication-grid-checkbox"
              checked={includeMultiplicationFeature()}
              onChange={(e) =>
                setIncludeMultiplicationFeature(e.currentTarget.checked)
              }
              class="rounded text-indigo-600"
            />
            <label
              for="includeMultiplicationFeature"
              class="text-sm font-medium text-gray-700"
            >
              Include Multiplication Grid
            </label>
          </div>
          {/* Toggle Long Multiplication */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeLongMultiplication"
              data-test-name="include-long-multiplication-checkbox"
              checked={includeLongMultiplication()}
              onChange={(e) =>
                setIncludeLongMultiplication(e.currentTarget.checked)
              }
              class="rounded text-indigo-600"
            />
            <label
              for="includeLongMultiplication"
              class="text-sm font-medium text-gray-700"
            >
              Include Long Multiplication
            </label>
          </div>
          {/* Toggle Division Grid */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeDivisionGrid"
              data-test-name="include-division-grid-checkbox"
              checked={includeDivisionGrid()}
              onChange={(e) => setIncludeDivisionGrid(e.currentTarget.checked)}
              class="rounded text-indigo-600"
            />
            <label
              for="includeDivisionGrid"
              class="text-sm font-medium text-gray-700"
            >
              Include Division Grid
            </label>
          </div>
          {/* Toggle Long Division */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeLongDivision"
              data-test-name="include-long-division-checkbox"
              checked={includeLongDivision()}
              onChange={(e) => setIncludeLongDivision(e.currentTarget.checked)}
              class="rounded text-indigo-600"
            />
            <label
              for="includeLongDivision"
              class="text-sm font-medium text-gray-700"
            >
              Include Long Division
            </label>
          </div>
          {/* Toggle Randomize Long Multiplication */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="randomizeLongMultiplication"
              data-test-name="randomize-long-multiplication-checkbox"
              checked={randomizeLongMultiplication()}
              onChange={(e) =>
                setRandomizeLongMultiplication(e.currentTarget.checked)
              }
              class="rounded text-indigo-600"
            />
            <label
              for="randomizeLongMultiplication"
              class="text-sm font-medium text-gray-700"
            >
              Randomize Long Multiplication & Division Order
            </label>
          </div>
          {/* Show Blocks Visualization */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showBlocks"
              data-test-name="show-blocks-checkbox"
              checked={showBlocks()}
              onChange={(e) => setShowBlocks(e.currentTarget.checked)}
              class={`rounded text-indigo-600 ${
                !isValidBlockVisualization()
                  ? "cursor-not-allowed border-gray-300 bg-gray-100"
                  : ""
              }`}
              disabled={!isValidBlockVisualization()}
            />
            <label
              for="showBlocks"
              class={`text-sm font-medium ${
                !isValidBlockVisualization()
                  ? "text-gray-300 line-through cursor-not-allowed"
                  : "text-gray-700"
              } `}
            >
              Show Blocks Visualization
              <Show when={!isValidBlockVisualization()}>
                <span class="pl-2 italic">
                  (Base number must be between 1 and 10)
                </span>
              </Show>
            </label>
          </div>
          {/* Show Answer Key */}
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAnswers"
              data-test-name="show-answers-checkbox"
              checked={showAnswers()}
              onChange={(e) => setShowAnswers(e.currentTarget.checked)}
              class="rounded text-indigo-600"
            />
            <label for="showAnswers" class="text-sm font-medium text-gray-700">
              Show Answer Key
            </label>
          </div>
        </form>

        {/* Skip Counting Section */}
        <Show when={isValidBaseNumber() && includeSkipCounting()}>
          <section
            class="mt-8 print:mt-0"
            data-test-name="skip-counting-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Skip Counting by {baseNumber()}
            </h2>
            <div class="grid grid-cols-10 gap-2">
              <For each={[...Array(10).keys()]}>
                {(i) => (
                  <div class="border border-gray-300 p-4 text-center">
                    {showAnswers()
                      ? baseNumber()! * (i + 1)
                      : i < 2
                      ? baseNumber()! * (i + 1)
                      : ""}
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>

        {/* Multiplication Grid Section */}
        <Show when={isValidBaseNumber() && includeMultiplicationFeature()}>
          <section
            class="mt-8 print:mt-8"
            data-test-name="multiplication-grid-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Multiplication Grid with {baseNumber()}
            </h2>
            <div class="overflow-x-auto">
              <table class="table-auto w-full text-center">
                <thead>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(i) => <th class="px-2 py-2">{i}</th>}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(_) => (
                        <td class="border px-2 py-2">&times; {baseNumber()}</td>
                      )}
                    </For>
                  </tr>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(i) => (
                        <td
                          class="border px-2 py-2"
                          data-test-name="multiplication-result-cell"
                        >
                          {showAnswers() ? (
                            i * baseNumber()!
                          ) : (
                            <input
                              type="text"
                              data-test-name="multiplication-result-input"
                              class="w-full text-center border-none focus:ring-0"
                            />
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </Show>

        {/* Long Multiplication Section */}
        <Show when={isValidBaseNumber() && includeLongMultiplication()}>
          <section
            class="mt-8 print:mt-8 break-after-page"
            data-test-name="long-multiplication-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Long Multiplication with {baseNumber()}
            </h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-6 print:gap-8">
              <For each={longNumbers()}>
                {(i) => (
                  <li
                    class="flex items-center justify-center my-4 print:break-inside-avoid"
                    data-test-name="long-multiplication-item"
                  >
                    <div class="text-2xl font-mono print:text-xl">
                      <div
                        class="flex flex-col items-end"
                        style="min-width: 6ch"
                      >
                        <span class="tabular-nums">{i}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-lg">&times;</span>
                          <span class="tabular-nums">{baseNumber()}</span>
                        </div>
                        <span
                          class="border-b-2 border-gray-400 mt-2"
                          style="width: 6ch"
                        ></span>
                      </div>
                      <div class="text-right">
                        {showAnswers() ? (
                          i * baseNumber()!
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
        </Show>

        {/* Multiplication Blocks Visualization */}
        <Show when={showBlocks()}>
          <section
            class="mt-8 print:mt-8 break-after-page"
            data-test-name="multiplication-blocks-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Multiplication Blocks Visualization
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <For each={[...Array(11).keys()].slice(1)}>
                {(i) => (
                  <div
                    class="flex flex-col items-center"
                    style="break-inside: avoid-page; page-break-inside: avoid;"
                    data-test-name="multiplication-group"
                  >
                    <div class="border p-2 w-full">
                      <div class="flex flex-wrap justify-center">
                        <For each={[...Array(i).keys()]}>
                          {() => (
                            <div class="flex mr-2 mb-2">
                              <For
                                each={[
                                  ...Array(Math.abs(baseNumber()!)).keys(),
                                ]}
                              >
                                {() => (
                                  <div
                                    class="w-4 h-4 bg-blue-500 m-0.5"
                                    style="-webkit-print-color-adjust: exact; color-adjust: exact;"
                                    data-test-name="multiplication-block"
                                  ></div>
                                )}
                              </For>
                            </div>
                          )}
                        </For>
                      </div>
                      <div class="mt-2 text-center">
                        {`${i} x ${baseNumber()} = `}
                        {showAnswers() ? (
                          i * baseNumber()!
                        ) : (
                          <span class="w-16 inline-block border-gray-700 border-b">
                            &nbsp;
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>

        {/* Division Grid Section */}
        <Show when={isValidBaseNumber() && includeDivisionGrid()}>
          <section
            class="mt-8 print:mt-8"
            data-test-name="division-grid-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Division Grid with {baseNumber()}
            </h2>
            <div class="overflow-x-auto">
              <table class="table-auto w-full text-center">
                <thead>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(i) => <th class="px-2 py-2">{baseNumber()! * i}</th>}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(_) => (
                        <td class="border px-2 py-2">
                          &divide; {baseNumber()}
                        </td>
                      )}
                    </For>
                  </tr>
                  <tr>
                    <For each={[...Array(11).keys()]}>
                      {(i) => (
                        <td
                          class="border px-2 py-2"
                          data-test-name="division-result-cell"
                        >
                          {showAnswers() ? (
                            i
                          ) : (
                            <input
                              type="text"
                              class="w-full text-center border-none focus:ring-0"
                            />
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </Show>

        {/* Long Division Section */}
        <Show when={isValidBaseNumber() && includeLongDivision()}>
          <section
            class="mt-8 print:mt-8 break-after-page"
            data-test-name="long-division-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Long Division with {baseNumber()}
            </h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-6 print:gap-8">
              <For each={longNumbers()}>
                {(i) => (
                  <li
                    class="flex items-center justify-center my-8 print:break-inside-avoid"
                    data-test-name="long-division-item"
                  >
                    <div class="text-2xl font-mono print:text-xl">
                      <div
                        class="flex flex-col items-end"
                        style="min-width: 6ch"
                      >
                        <span class="tabular-nums">{i * baseNumber()!}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-lg">&divide;</span>
                          <span class="tabular-nums">{baseNumber()}</span>
                        </div>
                        <span
                          class="border-b-2 border-gray-400 mt-2"
                          style="width: 6ch"
                        ></span>
                      </div>
                      <div class="text-right">
                        {showAnswers() ? (
                          i
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
        </Show>

        {/* Division Blocks Visualization */}
        <Show when={showBlocks()}>
          <section
            class="mt-8 print:mt-8 break-after-page"
            data-test-name="division-blocks-section"
          >
            <h2 class="text-xl font-semibold mb-4 text-center">
              Division Blocks Visualization
            </h2>
            <div class="grid grid-cols-2 gap-6">
              <For each={[...Array(11).keys()].slice(1)}>
                {(i) => (
                  <div
                    class="flex flex-col items-center"
                    style="break-inside: avoid-page; page-break-inside: avoid;"
                  >
                    <div class="border p-2 w-full">
                      <div class="flex flex-wrap justify-center">
                        <For each={[...Array(i).keys()]}>
                          {() => (
                            <div class="flex mr-2 mb-2">
                              <For
                                each={[
                                  ...Array(Math.abs(baseNumber()!)).keys(),
                                ]}
                              >
                                {() => (
                                  <div
                                    class="w-4 h-4 bg-green-500 m-0.5"
                                    data-test-name="division-block"
                                    style="-webkit-print-color-adjust: exact; color-adjust: exact;"
                                  ></div>
                                )}
                              </For>
                            </div>
                          )}
                        </For>
                      </div>
                      <div class="mt-2 text-center">
                        {`${i * baseNumber()!} ÷ ${baseNumber()} = `}
                        {showAnswers() ? (
                          i
                        ) : (
                          <span class="w-16 inline-block border-gray-700 border-b">
                            &nbsp;
                          </span>
                        )}
                      </div>{" "}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>
      </div>
    </div>
  );
}
