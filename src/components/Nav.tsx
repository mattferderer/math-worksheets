import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-sky-800 print:hidden">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        {/* <li
          class={`border-b-2 ${active(
            "/math-problem-generator"
          )} mx-1.5 sm:mx-6`}
        >
          <a href="/addition">Math Problem Generator</a>
        </li>
        <li class={`border-b-2 ${active("/patterns")} mx-1.5 sm:mx-6`}>
          <a href="/patterns">Pattern Recognition</a>
        </li> */}
      </ul>
    </nav>
  );
}
