import React, { Fragment } from "react";

/*import {
  TextField,
  AddIcon,
  IconButton,
  Box,
  Typography
} from "@material-ui/core";*/
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import { Box, Typography } from "@material-ui/core";

export default function Combustible(props) {
  const { chimique, onChange, add, remove } = props;

  return (
    <Box display="inline">
      {chimique.map((chimique, index) => (
        <Fragment key={`${chimique}~${index}`}>
          <Box id="act1" display={"inline"}>
            <TextField
              id="volume"
              label="Volule en m3"
              value={chimique.volume}
              name="volume"
              type="Number"
              onChange={(event) =>
                onChange(index, event.target.name, event.target.value)
              }
              variant="outlined"
            />
          </Box>
          <Typography variant="subtitle1" gutterBottom>
            volume chimique: {chimique.volume}
          </Typography>
          {index !== 0 && (
            <IconButton
              color="secondary"
              aria-label="rm"
              onClick={() => remove(index)}
              component="span"
              gutterBottom
            >
              <DeleteForeverIcon />
            </IconButton>
          )}
        </Fragment>
      ))}
      <IconButton
        color="secondary"
        aria-label="add"
        onClick={() => add()}
        component="span"
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}
