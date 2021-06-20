import { NCBI_PATH, FOUND, NOT_FOUND } from './constants';
import dna_logo_color from './dna-logo-color.png';
import dna_logo_gray from './dna-logo-gray.png';

const ResultLogo = ({ logo, shouldSpin }) => (
  <img
    style={{ height: '1.5em', width: '1.5em' }}
    src={logo} className={shouldSpin ? 'spinner' : ''} alt="logo"
  />
);

export default function SearchResult({ search }) {
  let display;

  if (search.state === FOUND) {
    display = <a href={NCBI_PATH + search.proteinId} className="resultLink">{search.proteinId}</a>;
  } else if (search.state === NOT_FOUND ) {
    display = <ResultLogo logo={dna_logo_gray} shouldSpin={false} />;
  } else {
    // TODO: Add branch for searches that ran out of retries.
    display = <ResultLogo logo={dna_logo_color} shouldSpin={true} />
  }

  return (
    <span>{display}</span>
  );
}