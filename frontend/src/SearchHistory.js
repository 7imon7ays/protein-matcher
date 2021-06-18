import React from 'react';
import { Grid } from '@material-ui/core';

import PendingSearch from './PendingSearch'

// TODO: Turn to stateless component?
// TODO: Show something helpful when no protein was matched.
export default class SearchHistory extends React.Component {
  render() {
    return (
      <div>
        <Grid item xs={12}>
          <h1>Your searches</h1>
          <ol>
            {this.props.pendingSearches.map(pendingSearch => (
                <li key={pendingSearch.id}><PendingSearch search={pendingSearch} /></li>
            ))}
            {this.props.completedSearches.map(completedSearch => (
                <li key={completedSearch.id}><p>{completedSearch.proteinId}</p></li>
            ))}
          </ol>
        </Grid>
      </div>
    );
  }
}