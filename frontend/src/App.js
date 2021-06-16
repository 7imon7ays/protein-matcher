import '@fontsource/roboto';
import { Box, Grid } from '@material-ui/core';

import DnaUpload from './DnaUpload';
import SearchHistory from './SearchHistory';

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
        <DnaUpload />
        <SearchHistory />
      </Grid>
    </div>
  );
}

export default App;
