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
          <Grid item direction="column" xs={2}>
              <DnaUpload registerNewSearch={this.registerNewSearch} />
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