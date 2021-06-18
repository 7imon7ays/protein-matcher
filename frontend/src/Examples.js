import { DNA_SEQUENCES_EXAMPLES } from "./constants";

// TODO: Display expected protein IDs with Material UI Tooltip.
export default function Examples () {
  return (
    <div>
      <h1>Try these</h1>
      <ul>
        {Object.keys(DNA_SEQUENCES_EXAMPLES).map((sequence, idx) => (
            <li key={idx}>{sequence}</li>
        ))}
      </ul>
    </div>
  );
}