import React from 'react';

// TODO: Switch to stateless component?
export default class PendingSearch extends React.Component {
  render() {
    const isDone = this.props.search.state === 'DONE';
    return (
      <div>
        {isDone && this.props.search.proteinId}
        {!isDone && 'pending...'}
      </div>
    );
  }
}