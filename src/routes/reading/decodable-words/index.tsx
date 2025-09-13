import { For, Show, createMemo, createSignal } from "solid-js";
import ErrorMessage from "~/components/Error";
import type { decodableWords } from "./decodable_words_interface";
import data from "./decodable_words_k_to_4.json";

type Grade = string; // e.g., "K", "1", "2", "3", "4"

interface CategoryChoice {
  key: string; // unique key per category (category name)
  label: string; // category title
  focus: string; // short focus text
  words: string[];
  checked: boolean;
}

export default function DecodableWordsPage() {
  // Data assumptions: imported JSON is `decodableWords[]`
  const all = data as decodableWords[];

  const [grade, setGrade] = createSignal<Grade>(all[0]?.grade ?? "K");
  const [choices, setChoices] = createSignal<CategoryChoice[]>([]);

  // Initialize / update choices when grade changes
  const current = createMemo(() => all.find((g) => g.grade === grade()));

  const initChoices = (g: decodableWords | undefined) => {
    if (!g) return [] as CategoryChoice[];
    return g.categories.map((c) => ({
      key: c.category,
      label: c.category,
      focus: c.focus,
      // copy words so we can safely shuffle without mutating source JSON
      words: [...c.words],
      // default: all categories selected per requirement
      checked: true,
    }));
  };

  // Recompute choices whenever grade changes
  const syncChoices = () => setChoices(initChoices(current()));
  // first load
  if (choices().length === 0) syncChoices();

  const selectedChoices = createMemo(() => choices().filter((c) => c.checked));

  const toggleChoice = (key: string, checked: boolean) => {
    setChoices((prev) =>
      prev.map((c) => (c.key === key ? { ...c, checked } : c))
    );
  };

  // Select / Unselect all categories
  const setAllChecked = (checked: boolean) => {
    setChoices((prev) => prev.map((c) => ({ ...c, checked })));
  };

  // Shuffle words across all categories using Fisher–Yates
  const shuffleInPlace = <T,>(arr: T[]): void => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const shuffleAllWords = () => {
    setChoices((prev) =>
      prev.map((c) => {
        const words = [...c.words];
        shuffleInPlace(words);
        return { ...c, words };
      })
    );
  };

  const onGradeChange = (g: string) => {
    setGrade(g);
    syncChoices();
  };

  return (
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:p-0">
      <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl print:p-0 print:shadow-none">
        <h1 class="text-2xl font-bold mb-6 text-center print:hidden">
          Decodable Words
        </h1>

        <form class="space-y-4 print:hidden">
          {/* Grade select */}
          <div>
            <label for="grade" class="block text-sm font-medium text-gray-700">
              Grade Level
            </label>
            <select
              id="grade"
              value={grade()}
              onInput={(e) => onGradeChange(e.currentTarget.value)}
              class="mt-1 block w-full p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <For each={all}>
                {(g) => <option value={g.grade}>{g.grade}</option>}
              </For>
            </select>
          </div>

          {/* Category checklist */}
          <div>
            <div class="flex items-center justify-between mb-2">
              <p class="block text-sm font-medium text-gray-700">Categories</p>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="text-sm px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                  onClick={() => setAllChecked(true)}
                >
                  Select All
                </button>
                <button
                  type="button"
                  class="text-sm px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                  onClick={() => setAllChecked(false)}
                >
                  Unselect All
                </button>
              </div>
            </div>
            <Show when={current()}>
              <ul class="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                <For each={choices()}>
                  {(c) => (
                    <li class="flex items-start gap-2">
                      <input
                        id={`cat-${c.key}`}
                        type="checkbox"
                        checked={c.checked}
                        onChange={(e) =>
                          toggleChoice(c.key, e.currentTarget.checked)
                        }
                        class="mt-1 rounded text-indigo-600"
                      />
                      <label for={`cat-${c.key}`} class="text-sm text-gray-800">
                        <span class="font-medium">{c.label}</span>
                        <span class="ml-1 text-gray-500">({c.focus})</span>
                      </label>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>

          {/* Print button */}
          <div class="flex items-center justify-between">
            <ErrorMessage
              show={selectedChoices().length === 0}
              message="Select at least one category to print."
            />
            <div class="ml-auto flex items-center gap-2">
              <button
                type="button"
                class="bg-white text-gray-800 py-2 px-3 rounded-md border border-gray-300 hover:bg-gray-50"
                onClick={shuffleAllWords}
              >
                Shuffle Words
              </button>
              <button
                type="button"
                class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={selectedChoices().length === 0}
                onClick={() => window.print()}
              >
                Print Selected
              </button>
            </div>
          </div>
        </form>

        {/* Printable content */}
        <section class="mt-8 print:mt-0">
          <Show when={selectedChoices().length > 0}>
            <div class="space-y-8">
              <For each={selectedChoices()}>
                {(c) => (
                  <div class="print:break-inside-avoid">
                    <h2 class="text-lg font-semibold mb-2 text-gray-900 print:mb-1">
                      {c.label}{" "}
                      <span class="text-gray-500 font-normal">— {c.focus}</span>
                    </h2>
                    <div class="overflow-hidden rounded border border-gray-200">
                      <table class="w-full border-collapse">
                        <tbody>
                          <For each={chunk(c.words, 4)}>
                            {(row) => (
                              <tr>
                                <For each={row}>
                                  {(w) => (
                                    <td class="p-2 border border-gray-200 align-top tabular-nums">
                                      {w}
                                    </td>
                                  )}
                                </For>
                                {/* pad to 4 cols if needed */}
                                <For
                                  each={Array.from({
                                    length: Math.max(0, 4 - row.length),
                                  })}
                                >
                                  {() => (
                                    <td class="p-2 border border-gray-200">
                                      &nbsp;
                                    </td>
                                  )}
                                </For>
                              </tr>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </section>
      </div>
    </div>
  );
}

// Utility: chunk array into rows
function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}
