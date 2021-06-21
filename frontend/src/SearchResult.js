import React from 'react';
import { NCBI_PATH, FOUND, NOT_FOUND } from './constants';
import dnaLogoColor from './dna-logo-color.png';
import dnaLogoGray from './dna-logo-gray.png';

const ResultLink = ({ search }) => (
  <a
    href={NCBI_PATH + search.proteinId}
    className="resultLink"
    target="_blank"
    rel="noopener noreferrer"
  >
    {search.proteinId}
  </a>
);

const ResultLogo = ({ logo, isStillLooking }) => (
  <img
    style={{ height: '1.5em', width: '1.5em' }}
    src={logo}
    className={isStillLooking ? 'spinner' : ''}
    alt={isStillLooking ? 'Looking...' : 'Not found'}
  />
);

/**
 * Display a search result by branching on its state.
 */
export default function SearchResult({ search }) {
  let display;

  if (search.state === FOUND) {
    display = <ResultLink search={search} />;
  } else if (search.state === NOT_FOUND) {
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
