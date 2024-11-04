import { Component, Show } from "solid-js";

const ErrorMessage: Component<{ message: string; show: boolean }> = (props) => (
  <Show when={props.show}>
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{props.message}</span>
    </div>
  </Show>
);

export default ErrorMessage;
