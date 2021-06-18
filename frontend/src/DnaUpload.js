import React from 'react';
import axios from 'axios';

import { Box, Button, Grid, TextField } from '@material-ui/core';

export default class DnaUpload extends React.Component {

  constructor() {
    super();
    this.state = { searchString: '' };
    this.updateSearchString = this.updateSearchString.bind(this);
    this.runSearch = this.runSearch.bind(this);
  }

  updateSearchString(event) {
    this.setState({ searchString: event.target.value });
  }

  runSearch() {
    // TODO: Move request to parent.
    axios.post('searches', { dnaSequence: this.state.searchString })
    .then(response => {
      this.props.registerNewSearch(response.data);
    })
  }

  render() {
    return (
      <div>
        <form>
          <Grid item xs={12}>
            <Box m={5}>
              <TextField
                  variant="filled"
                  placeholder="Enter a DNA sequence"
                  fullWidth id="dna_sequence"
                  inputProps={{ style: { backgroundColor: 'white' } }}
                  onChange={this.updateSearchString}
              />
            </Box>
            <Button color="primary" variant="contained" onClick={this.runSearch}>
              Find a matching protein
            </Button>
          </Grid>
        </form>
      </div>
    );
  }
}
