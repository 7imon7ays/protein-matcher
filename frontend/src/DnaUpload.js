import React from 'react';
import { Button, Grid, TextField } from '@material-ui/core';

const styles = {
  textField: { backgroundColor: '#d0cdcd', color: 'black', fontSize: 14 },
  uploadButton: { display: 'inline', color: 'white', backgroundColor: '#3f51b5', fontSize: 14 },
  submitButton: { display: 'inline', color: 'white', backgroundColor: "#562c84", fontSize: 14 }
};

export default class DnaUpload extends React.Component {
  render() {
    return (
      <Grid container direction="row" alignItems="center" justify="space-between">
        <Grid item xs={6}>
          <TextField
              placeholder="Enter a DNA sequence"
              fullWidth
              id="dna_sequence"
              style={styles.textField}
              onChange={this.props.updateSearchString}
              autoFocus
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" style={styles.uploadButton}>
            file
            <input type="file" hidden onChange={this.props.onFileChange}
            />
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" onClick={this.props.runSearch} style={styles.submitButton}>
            search
          </Button>
        </Grid>
      </Grid>
    );
  }
}
