import React from 'react';
import { Grid } from '@material-ui/core';

import SearchHistoryItem from './SearchHistoryItem'

// TODO: Show something helpful when no protein was matched.
// TODO: Don't split pending and completed searches, keep global ordering.
// TODO: Turn to stateless component?
export default class SearchHistory extends React.Component {
  render() {
    return (
      <div>
        <Grid item xs={12}>
          <h1>Your searches</h1>
          <ol>
            {this.props.searches.map(search => (
                <li key={search.id}><SearchHistoryItem search={search} /></li>
            ))}
          </ol>
        </Grid>
      </div>
    );
  }
}