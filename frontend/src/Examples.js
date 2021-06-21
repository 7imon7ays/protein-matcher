import React from 'react';
import {
  Box, List, ListItem, ListItemText,
} from '@material-ui/core';

import { DNA_SEQUENCES_EXAMPLES } from './constants';

// TODO: Display expected protein IDs with Material UI Tooltip.
export default function Examples() {
  return (
    <div>
      <Box border={1} borderRadius="1%" m={7}>
        <h3>EXAMPLE SEQUENCES</h3>
        <List dense>
          {Object.keys(DNA_SEQUENCES_EXAMPLES).map((sequence, idx) => (
            <ListItem key={idx}>
              <ListItemText style={{ maxWidth: '100%', overflow: 'scroll' }} className="smallFont">{sequence}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
