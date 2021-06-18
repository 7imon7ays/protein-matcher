import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';

export default class DnaUpload extends React.Component {
  render() {
    return (
      <Box>
        <TextField
            placeholder="Enter a DNA sequence"
            fullWidth id="dna_sequence"
            inputProps={{ style: { backgroundColor: 'white' } }}
            onChange={this.props.updateSearchString}
        />
        <input type="file" onChange={this.props.onFileChange} />
        <Button color="primary" variant="contained" onClick={this.props.runSearch}>
          Find a matching protein
        </Button>
      </Box>
    );
  }
}
