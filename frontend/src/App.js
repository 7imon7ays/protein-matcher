import React from 'react';
import '@fontsource/roboto';
import { Box, Grid } from '@material-ui/core';
import axios from 'axios';

import DnaUpload from './DnaUpload';
import SearchHistory from './SearchHistory';

import logo from './logo.svg';
import './App.css';

export default class App extends React.Component  {
  DONE_STATE = 'DONE';

  constructor() {
    super()
    this.state = { recentSearches: [] };

    this.refreshSearches = this.refreshSearches.bind(this);
    this.registerNewSearch = this.registerNewSearch.bind(this);
  }

  componentDidMount() {
    this.fetchSearches();
    this.timer = setInterval(this.refreshSearches, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  registerNewSearch(newSearch) {
    // Don't hold more than 10 searches total.
    const recentSearches = [newSearch, ...this.state.recentSearches].slice(0, 10);

    this.setState(state => {
      return {...state, recentSearches};
    });
  }

  refreshSearches() {
    const hasNoPendingSearches = this.state.recentSearches.every(search => {
      return search.state === this.DONE_STATE;
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
    const completedSearches = this.state.recentSearches.filter(search => search.state === this.DONE_STATE);
    const pendingSearches = this.state.recentSearches.filter(search => search.state !== this.DONE_STATE);

    return (
      <div className="App">
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={10}
        >
          <Grid item xs={12}>
            <Box m={5}>
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
              </header>
            </Box>
          </Grid>
          <DnaUpload registerNewSearch={this.registerNewSearch} />
          <SearchHistory completedSearches={completedSearches} pendingSearches={pendingSearches} />
        </Grid>
      </div>
    );
  }
};