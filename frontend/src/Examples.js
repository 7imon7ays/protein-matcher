import { Box, List, ListItem, ListItemText } from '@material-ui/core'

import { DNA_SEQUENCES_EXAMPLES } from "./constants";

// TODO: Display expected protein IDs with Material UI Tooltip.
export default function Examples () {
  return (
    <div>
      <Box border={1} borderRadius='1%' m={7}>
        <h3>Example sequences</h3>
        <List dense={true}>
          {Object.keys(DNA_SEQUENCES_EXAMPLES).map((sequence, idx) => (
              <ListItem key={idx}>
                <ListItemText className="smallFont">{sequence}</ListItemText>
              </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}