import { Grid } from '@material-ui/core';

export default function SearchHistory() {
  return (
    <div>
      <Grid item xs={12}>
        <h1>Previous searches</h1>
        <ul>
          <li>NC_000852</li>
          <li>NC_007346</li>
          <li>NC_008724</li>
          <li>NC_009899</li>
          <li>NC_014637</li>
          <li>NC_020104</li>
        </ul>
      </Grid>
    </div>
  );
}