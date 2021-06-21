import React from 'react';
import axios from 'axios';
import {
  Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@material-ui/core';

import './App.css';
import DnaUpload from './DnaUpload';
import Examples from './Examples';
import SearchResult from './SearchResult';
import { FOUND, NOT_FOUND } from './constants';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { searchString: '', selectedFile: null, recentSearches: [] };

    this.onFileChange = this.onFileChange.bind(this);
    this.refreshSearches = this.refreshSearches.bind(this);
    this.registerNewSearch = this.registerNewSearch.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.updateSearchString = this.updateSearchString.bind(this);
  }

  componentDidMount() {
    this.fetchSearches();
    this.timer = setInterval(this.refreshSearches, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // Input handlers.

  onFileChange({ target: { files } }) {
    this.setState((state) => ({ ...state, selectedFile: files[0] }));
  }

  updateSearchString({ target: { value } }) {
    this.setState((state) => ({ ...state, searchString: value }));
  }

  runSearch() {
    // Prefer text input over file upload because the file is easier to recover.
    const { searchString } = this.state;
    if (searchString !== '') {
      axios.post('searches', { dnaSequence: searchString })
        .then(({ data }) => {
          this.setState((state) => ({ ...state, searchString: '' }));
          this.registerNewSearch(data);
        });
      return;
    }

    const { selectedFile } = this.state;
    if (selectedFile) {
      // TODO: Support FASTA file formats by branching on file extension.
      const formData = new FormData();
      formData.append(
        'dna_sequence',
        selectedFile,
        selectedFile.name,
      );

      axios.post('searches', formData)
        .then(({ data }) => {
          this.setState((state) => ({ ...state, selectedFile: null }));
          this.registerNewSearch(data);
        });
    }
  }

  registerNewSearch(newSearch) {
    let { recentSearches } = this.state;
    // Don't hold more than 10 searches total.
    recentSearches = [newSearch, ...recentSearches].slice(0, 10);

    this.setState((state) => ({ ...state, recentSearches }));
  }

  // Polling handlers.

  refreshSearches() {
    const { recentSearches } = this.state;
    const hasNoPendingSearches = recentSearches.every(
      (search) => (search.state === FOUND || search.state === NOT_FOUND),
    );
    if (hasNoPendingSearches) return;

    this.fetchSearches();
  }

  fetchSearches() {
    axios.get('searches')
      .then(({ data }) => {
        this.setState((state) => ({ ...state, recentSearches: data }));
      });
  }

  // TODO: Break down component.
  render() {
    const { recentSearches, searchString, selectedFile } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Protein Matcher</h1>
        </header>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={12}>
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
                        onFileChange={this.onFileChange}
                        registerNewSearch={this.registerNewSearch}
                        runSearch={this.runSearch}
                        updateSearchString={this.updateSearchString}
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
          </Grid>
          <Grid item xs={12}>
            <Examples />
          </Grid>
        </Grid>
      </div>
    );
  }
}
