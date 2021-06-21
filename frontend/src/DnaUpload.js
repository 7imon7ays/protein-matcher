import React from 'react';
import {
  Button, Grid, TextField, withStyles,
} from '@material-ui/core';
import PublishSharpIcon from '@material-ui/icons/PublishSharp';
import SearchSharp from '@material-ui/icons/SearchSharp';

const styles = {
  uploadButton: {
    display: 'inline',
    color: 'white',
    backgroundColor: '#70717b',
    fontSize: '.8em',
    minWidth: 0,
    padding: '.5em',
  },
  submitButton: {
    display: 'inline',
    color: 'white',
    backgroundColor: '#562c84',
    fontSize: '.8em',
  },
};

const DnaSequenceField = withStyles({
  root: {
    '& label': { color: 'gray' },
    '& label.Mui-focused': {
      color: '#c8d1ffde',
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none',
    },
  },
})(TextField);

/**
 * Handle user input for a new search.
 */
export default class DnaUpload extends React.Component {
  constructor() {
    super();
    this.handleClickUpload = this.handleClickUpload.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.hiddenFileUpload = React.createRef();
  }

  handleClickUpload() {
    this.hiddenFileUpload.current.click();
  }

  handleKeyPress({ key }) {
    if (key === 'Enter') {
      // To satisfy linter.
      const { runSearch } = this.props;
      runSearch();
    }
  }

  render() {
    const {
      isFileSelected, onFileChange, runSearch, searchString, updateSearchString,
    } = this.props;

    return (
      <Grid container direction="row" alignItems="center" justify="space-around">
        <Grid item xs={7}>
          <DnaSequenceField
            autoFocus
            label="DNA sequence"
            fullWidth
            margin="dense"
            InputProps={{ style: { paddingLeft: '5%' } }}
            onChange={updateSearchString}
            value={searchString}
            onKeyPress={this.handleKeyPress}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="contained"
            style={styles.uploadButton}
            onClick={this.handleClickUpload}
            id="upload"
          >
            <PublishSharpIcon color={isFileSelected ? 'disabled' : 'action'} />
            <input type="file" hidden onChange={onFileChange} ref={this.hiddenFileUpload} />
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            onClick={runSearch}
            style={styles.submitButton}
            id="search"
          >
            <SearchSharp />
          </Button>
        </Grid>
      </Grid>
    );
  }
}
