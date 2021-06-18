import { DONE_STATE } from "./constants";

const displayResult = (search) => search.proteinId || '[No matches]'

export default function SearchHistoryItem ({ search }) {
  const isDone = search.state === DONE_STATE;

  return (
    <div>
      <span>{search.dnaSequence}</span>
      <span>
        {isDone && displayResult(search)}
        {!isDone && '[pending]'}
        </span>
    </div>
  );
}
