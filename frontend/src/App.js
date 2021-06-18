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
    this.state = {
      completedSearches: [
        { id: 1, proteinId: 'NC_000852' },
        { id: 2, proteinId: 'NC_007346' },
        { id: 3, proteinId: 'NC_008724' },
      ],
      pendingSearches: []
    };

    this.refreshSearches = this.refreshSearches.bind(this);
    this.registerNewSearch = this.registerNewSearch.bind(this);
    this.updateSearches = this.updateSearches.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.refreshSearches, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  registerNewSearch(newSearch) {
    this.setState(state => {
      return {
        ...state, pendingSearches: [...state.pendingSearches, newSearch]
      };
    });
  }

  refreshSearches() {
    if (this.state.pendingSearches.length === 0) return;

    const pendingSearchIds = this.state.pendingSearches.map(search => search.id);

    axios.get('searches', { params: { searchIds: pendingSearchIds }})
      .then(response => {
        this.updateSearches(response.data);
      });
  }

  updateSearches(updatedSearches) {
    const pendingSearches = updatedSearches.filter(search => search.state !== this.DONE_STATE);
    const newlyCompletedSearches = updatedSearches.filter(search => search.state === this.DONE_STATE);

    // TODO: Order by date and limit to 10.
    // Maybe instead of doing all this client-side, just re-fetch all 10 searches from the server.
    const completedSearches = [...newlyCompletedSearches, ...this.state.completedSearches]

    this.setState(state => {
      return {...state, completedSearches, pendingSearches};
    });
  }

  render() {
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
          <SearchHistory
            pendingSearches={this.state.pendingSearches} completedSearches={this.state.completedSearches}
          />
        </Grid>
      </div>
    );
  }
};