import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core';

import DnaUpload from './DnaUpload';
import SearchResult from './SearchResult';

/**
 * Table that includes both new search input elements and recent search history.
 */
export default function SearchResultsTable({
  registerNewSearch,
  onFileChange,
  recentSearches,
  runSearch,
  searchString,
  selectedFile,
  updateSearchString,
}) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontSize: '1em' }}>Sequence</TableCell>
            <TableCell style={{ fontSize: '1em' }} align="justify">Match Start Position</TableCell>
            <TableCell style={{ fontSize: '1em' }} align="justify">Match End Position</TableCell>
            <TableCell style={{ fontSize: '1em' }} align="justify">Protein ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} style={{ padding: '0' }}>
              <DnaUpload
                onFileChange={onFileChange}
                registerNewSearch={registerNewSearch}
                runSearch={runSearch}
                updateSearchString={updateSearchString}
                searchString={searchString}
                isFileSelected={!!selectedFile}
              />
            </TableCell>
          </TableRow>
          {recentSearches.map((search, idx) => (
            <SearchResult search={search} key={idx} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
