import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core';

import DnaUpload from './DnaUpload';
import SearchResult from './SearchResult';

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
            <TableCell style={{ fontSize: '2em' }}>Sequence</TableCell>
            <TableCell style={{ fontSize: '2em' }} align="right">Protein ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2} style={{ padding: '0' }}>
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
            <TableRow key={idx}>
              <TableCell style={{ maxWidth: '6em', overflow: 'scroll' }}>{search.dnaSequence}</TableCell>
              <TableCell align="right"><SearchResult search={search} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
