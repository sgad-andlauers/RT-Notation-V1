import React, { Fragment } from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 210
  }
}));
export default function Combustible(props) {
  const { combustible, onChange, add, remove } = props;
  const classes = useStyles();
  return (
    <Box display={"inline"}>
      {combustible.map((combustible, index) => (
        <Fragment key={`${combustible}~${index}`}>
          <Typography variant="subtitle1" gutterBottom>
            Surface saisie: {combustible.surface}
          </Typography>
          <Box display={"flex"}>
            <TextField
              id="outlined-basic"
              label="Surface en m2"
              value={combustible.surface}
              name="surface"
              type="Number"
              onChange={(event) =>
                onChange(index, event.target.name, event.target.value)
              }
              variant="outlined"
            />
          </Box>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="typeProduct">Produit</InputLabel>
            <Select
              labelId="typeProduct"
              id="typeProduct"
              value={combustible.produit}
              onChange={(event) =>
                onChange(index, event.target.name, event.target.value)
              }
              label="Product"
            >
              <MenuItem value={0}></MenuItem>
              <MenuItem value={0.5}>papier, bois, tissus</MenuItem>
              <MenuItem value={1}>plastique, dechet mousses, etc</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="subtitle1" gutterBottom>
            produit selectionné : {combustible.produit}
          </Typography>
          {index !== 0 && (
            <IconButton
              color="secondary"
              aria-label="rm"
              onClick={() => remove(index)}
              component="span"
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
