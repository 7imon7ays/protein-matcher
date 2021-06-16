import '@fontsource/roboto';
import { Box, Button, Grid, TextField } from '@material-ui/core';

import logo from './logo.svg';
import './App.css';

function App() {
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
        <form>
          <Grid item xs={12}>
            <Box m={5}>
              <TextField
                 variant="filled"
                 placeholder="Enter a DNA sequence"
                 fullWidth id="dna_sequence"
                 inputProps={{ style: { 'background-color': 'white' } }}
              />
            </Box>
            <Button color="primary" variant="contained">
              Find a matching protein
            </Button>
          </Grid>
        </form>
      </Grid>
    </div>
  );
}

export default App;
