import React from 'react';
import { NCBI_PATH, FOUND, NOT_FOUND } from './constants';
import dnaLogoColor from './dna-logo-color.png';
import dnaLogoGray from './dna-logo-gray.png';

const ResultLogo = ({ logo, isStillLooking }) => (
  <img
    style={{ height: '1.5em', width: '1.5em' }}
    src={logo}
    className={isStillLooking ? 'spinner' : ''}
    alt={isStillLooking ? 'Looking...' : 'Not found'}
  />
);

export default function SearchResult({ search }) {
  let display;

  if (search.state === FOUND) {
    display = <a href={NCBI_PATH + search.proteinId} className="resultLink">{search.proteinId}</a>;
  } else if (search.state === NOT_FOUND ) {
    display = <ResultLogo logo={dnaLogoGray} isStillLooking={false} />;
  } else {
    // Still looking.
    // TODO: Add branch for searches that ran out of retries.
    display = <ResultLogo logo={dnaLogoColor} isStillLooking />;
  }

  return (
    <span>{display}</span>
  );
}
