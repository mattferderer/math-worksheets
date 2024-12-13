import { createSignal, For, Show } from "solid-js";

function shuffleArray<T>(array: T[]): T[] {
  // Simple Fisher-Yates shuffle
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Bingo = () => {
  // We have 24 inputs since one cell (center) is FREE
  const [terms, setTerms] = createSignal<string[]>(Array(24).fill(""));
  const [numberOfCards, setNumberOfCards] = createSignal(1);
  const [generatedCards, setGeneratedCards] = createSignal<string[][]>([]);

  const updateTerm = (index: number, value: string) => {
    const newTerms = terms().slice();
    newTerms[index] = value;
    setTerms(newTerms);
  };

  const handleGenerate = (e: Event) => {
    e.preventDefault();

    const baseTerms = terms().filter((t) => t.trim() !== "");
    // If not enough terms, prompt user or just fill with blanks
    const filledTerms =
      baseTerms.length < 24
        ? [...baseTerms, ...Array(24 - baseTerms.length).fill("")]
        : baseTerms.slice(0, 24);

    const cards: string[][] = [];
    for (let i = 0; i < numberOfCards(); i++) {
      const shuffled = shuffleArray(filledTerms);
      // Insert "FREE" in the center position
      const card = [...shuffled.slice(0, 12), "FREE", ...shuffled.slice(12)];
      cards.push(card);
    }
    setGeneratedCards(cards);
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4 print:hidden">Bingo Card Generator</h1>
      <p class="print:hidden mb-4">
        Generate bingo cards with your own terms. Great for classroom
        activities, parties, and more. Fill in the terms you want to use, then
        generate the cards with the terms randomized. Each card will have a
        unique layout & print on its own page.
      </p>

      {/* Form Section */}
      <form onSubmit={handleGenerate} class="mb-8 space-y-4 print:hidden">
        <div>
          <label class="block font-semibold mb-2">
            Enter Bingo Terms (24 total):
          </label>
          <div class="grid grid-cols-3 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <input
                type="text"
                value={terms()[i]}
                onInput={(e) =>
                  updateTerm(i, (e.target as HTMLInputElement).value)
                }
                placeholder={`Term ${i + 1}`}
                class="mt-1 p-2 border rounded-md w-full"
              />
            ))}
          </div>
          <p class="text-sm text-gray-500 mt-2">
            The center space will be "FREE".
          </p>
        </div>

        <div>
          <label class="block font-semibold mb-2">Number of Cards:</label>
          <input
            type="number"
            min="1"
            value={numberOfCards()}
            onInput={(e) =>
              setNumberOfCards(
                parseInt((e.target as HTMLInputElement).value, 10)
              )
            }
            class="mt-1 p-2 border rounded-md w-20"
          />
        </div>

        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Generate
        </button>
      </form>

      {/* Generated Bingo Cards */}
      <Show when={generatedCards().length > 0}>
        <div class="print:hidden">
          <p class="text-sm text-center">
            Click print to preview pages laid out. Each card will be on a
            separate page.
          </p>
        </div>
      </Show>

      {/* add column gap in tailwind css */}
      <div class="lg:grid lg:grid-cols-2 lg:gap-4">
        <For each={generatedCards()}>
          {(card, cardIndex) => (
            <div class="w-full h-fit mx-auto print:break-after-page">
              <h2 class="text-center font-bold text-xl my-4 print:hidden">
                Bingo Card #{cardIndex() + 1}
              </h2>
              <div class="grid grid-cols-5 gap-px print:w-full ">
                <div class="text-5xl py-2 text-center font-extrabold">B</div>
                <div class="text-5xl py-2 text-center font-extrabold">I</div>
                <div class="text-5xl py-2 text-center font-extrabold">N</div>
                <div class="text-5xl py-2 text-center font-extrabold">G</div>
                <div class="text-5xl py-2 text-center font-extrabold">O</div>
                <For each={card}>
                  {(term, termIndex) => (
                    <div
                      class=" outline-1 outline-black outline flex items-center justify-center h-28 text-center text-sm font-medium p-2 overflow-clip"
                      style="min-width: 2.5rem; min-height: 2.5rem;"
                    >
                      {term}
                    </div>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Bingo;
