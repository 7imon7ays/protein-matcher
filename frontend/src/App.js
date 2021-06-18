import React from 'react';
import axios from 'axios';
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import './App.css';
import DnaUpload from './DnaUpload';
import Examples from './Examples';
import Pending from './Pending';
import { DONE_STATE } from './constants';

export default class App extends React.Component  {
  constructor() {
    super()
    this.state = { searchString: '', selectedFile: null, recentSearches: [] };

    this.onFileChange = this.onFileChange.bind(this);
    this.refreshSearches = this.refreshSearches.bind(this);
    this.registerNewSearch = this.registerNewSearch.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.updateSearchString = this.updateSearchString.bind(this);
  }

  // Input handlers.

  updateSearchString({ target: { value }}) {
    this.setState(state => ({ ...state, searchString: value }));
  }

  onFileChange({ target: { files }}) {
    this.setState(state => ({ ...state, selectedFile: files[0] }))
  }

  runSearch() {
    // Prefer text input over file upload because the file is easier to recover.
    if (this.state.searchString !== '') {
      axios.post('searches', { dnaSequence: this.state.searchString })
        .then(({ data }) => {
          this.setState(state => ({ ...state, searchString: '' }));
          this.registerNewSearch(data);
        });
      return
    }

    if (this.state.selectedFile) {
      // TODO: Support FASTA file formats by branching on file extension.
      const formData = new FormData();
      formData.append(
        "dna_sequence",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      axios.post("searches", formData)
        .then(({ data }) => {
          this.setState(state => ({ ...state, selectedFile: null }));
          this.registerNewSearch(data);
        });
    }
  }

  registerNewSearch(newSearch) {
    // Don't hold more than 10 searches total.
    const recentSearches = [newSearch, ...this.state.recentSearches].slice(0, 10);

    this.setState(state => {
      return {...state, recentSearches};
    });
  }

  // Polling handlers.

  componentDidMount() {
    this.fetchSearches();
    this.timer = setInterval(this.refreshSearches, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  refreshSearches() {
    const hasNoPendingSearches = this.state.recentSearches.every(search => {
      return search.state === DONE_STATE;
    });
    if (hasNoPendingSearches) return;

    this.fetchSearches();
  }

  fetchSearches() {
    axios.get('searches')
    .then(({ data }) => {
      this.setState(state => ({ ...state, recentSearches: data }));
    });
  }

  // TODO: Break down component.
  render() {
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
                    <TableCell style={{ fontSize: 20 }}>Sequence</TableCell>
                    <TableCell style={{ fontSize: 20 }} align="right">Protein ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <DnaUpload
                      onFileChange={this.onFileChange}
                      registerNewSearch={this.registerNewSearch}
                      runSearch={this.runSearch}
                      updateSearchString={this.updateSearchString}
                      searchString={this.state.searchString}
                    />
                  </TableRow>
                  {this.state.recentSearches.map((search, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{search.dnaSequence}</TableCell>
                      <TableCell>{search.proteinId || <Pending />}</TableCell>
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
};