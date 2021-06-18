import React from 'react';
import '@fontsource/roboto';
import { Grid } from '@material-ui/core';
import axios from 'axios';

import DnaUpload from './DnaUpload';
import Examples from './Examples';
import SearchHistory from './SearchHistory';
import { DONE_STATE } from './constants';

import logo from './logo.svg';
import './App.css';

export default class App extends React.Component  {
  constructor() {
    super()
    this.state = { searchString: '', selectedFile: null, recentSearches: [] };

    this.refreshSearches = this.refreshSearches.bind(this);
    this.registerNewSearch = this.registerNewSearch.bind(this);
    this.runSearch = this.runSearch.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  // Input handlers.

  updateSearchString({ target: value }) {
    this.setState(state => ({ ...state, searchString: value }));
  }

  onFileChange({ target: { files }}) {
    this.setState(state => ({ ...state, selectedFile: files[0] }))
  }

  runSearch() {
    // Prefer text input over file upload because the file is easier to recover.
    if (this.state.searchString !== '') {
      axios.post('searches', { dnaSequence: this.state.searchString })
      .then(this.registerNewSearch);
      return
    }

    // TODO: Support FASTA file formats by branching on file extension.
    const formData = new FormData();
    formData.append(
      "dna_sequence",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

      axios.post("searches", formData)
      .then(this.registerNewSearch);
  }

  registerNewSearch({ data }) {
    // Don't hold more than 10 searches total.
    const recentSearches = [data, ...this.state.recentSearches].slice(0, 10);

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

  render() {
    return (
      <div className="App">
        <Grid item xs={12}>
          <Grid item m={5}>
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
            </header>
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={2}>
              <DnaUpload
                onFileChange={this.onFileChange}
                registerNewSearch={this.registerNewSearch}
                runSearch={this.runSearch}
              />
              <SearchHistory searches={this.state.recentSearches} />
          </Grid>
          <Grid item xs={6}>
            <Examples />
          </Grid>
        </Grid>
      </div>
    );
  }
};