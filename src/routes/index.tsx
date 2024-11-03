import { A } from "@solidjs/router";

const links = [
  {
    href: "/math-problem-generator",
    text: "Basic Math Generator",
    description:
      "Create quick math problems for addition, subtraction, multiplication, and division practice.",
  },
  {
    href: "/patterns",
    text: "Pattern Recognition Worksheet",
    description:
      "Find and complete the number patterns to improve logical thinking and pattern recognition skills.",
  },
];

export default function Home() {
  return (
    <div class="p-6 font-sans bg-gradient-to-r from-blue-50 to-green-50 min-h-screen">
      <h1 class="text-3xl font-bold mb-6 text-center">
        Ready-to-Use Math Worksheets for Home and Classroom
      </h1>
      <p class="text-gray-700 mb-10 text-center max-w-2xl mx-auto">
        Generate custom math worksheets for students, perfect for quick practice
        at home or in the classroom. This is just a simple tool I created for my
        kids. If you would like changes/updates feel free to request them with
        the link at the bottom.
      </p>
      {/* Links */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {links.map((link) => (
          <div class="bg-white shadow-md rounded-lg p-6">
            <p class="text-gray-600 mb-4">{link.description}</p>
            <A
              href={link.href}
              class="inline-block px-6 py-3 bg-blue-600 bg-opacity-75 text-white rounded-lg font-semibold hover:bg-opacity-100"
            >
              {link.text}
            </A>
          </div>
        ))}
      </div>

      <div class="mt-12 text-center">
        <a
          href="https://github.com/mattferderer/math-worksheets/issues"
          class="text-blue-600 underline hover:text-blue-700"
        >
          Need More Options? Request a Worksheet
        </a>
      </div>
    </div>
  );
}
