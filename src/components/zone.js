import React from "react";
//import { Box, Typography, Checkbox, FormControlLabel } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export default function ZoneRisque(props) {
  const { picto, onChange } = props;
  const handleChangeCheck = (event) => {
    onChange(event.target.name, event.target.checked ? 1 : 0);
  };
  return (
    <React.Fragment>
      <Box display={"inline"}>
        <Typography variant="subtitle1" gutterBottom>
          Zone Atex:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={picto.atex === 1}
              onChange={handleChangeCheck}
              name="atex"
            />
          }
          label="Zone Atex présente"
        ></FormControlLabel>
      </Box>
      <Box id="act1" display={"inline"}>
        <Typography variant="subtitle1" gutterBottom>
          Risque Rad:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={picto.rad === 1}
              onChange={handleChangeCheck}
              name="rad"
            />
          }
          label="RAD présent"
        />
      </Box>
      <Box id="act1" display={"inline"}>
        <Typography variant="subtitle1" gutterBottom>
          Risque Bio:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={picto.bio === 1}
              onChange={handleChangeCheck}
              name="bio"
            />
          }
          label="Bio présent"
        />
      </Box>
    </React.Fragment>
  );
}
