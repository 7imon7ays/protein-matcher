import React from 'react';
import { Button, Grid, TextField, withStyles } from '@material-ui/core';

const styles = {
  uploadButton: { display: 'inline', color: 'white', backgroundColor: '#3f51b5', fontSize: 14 },
  submitButton: { display: 'inline', color: 'white', backgroundColor: "#562c84", fontSize: 14 }
};

const DnaTextField = withStyles({
  root: {
    '& label': { color: 'gray' },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'gray',
    }
  }
})(TextField);

 export default class DnaUpload extends React.Component {
  render() {
    return (
      <Grid container direction="row" alignItems="center" justify="space-between">
        <Grid item xs={6}>
          <DnaTextField
            autoFocus
            label="DNA sequence"
            fullWidth
            margin="dense"
            InputProps={{ style: { paddingLeft: '9%' }}}
            onChange={this.props.updateSearchString}
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
