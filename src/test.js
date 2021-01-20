import "./styles.css";
import React, { useState } from "react";
import { Box, Grid, Typography, TextField } from "@material-ui/core";
import Combustible from "./components/combustible";
import Chimique from "./components/chimique";
import Zone from "./components/zone";

export default function Risque() {
  /*--------------Instanntiate Global function-------------------*/
  const TAB_INDICE_RISQUE_COMBUSTIBLE = [
    { seuilMin: 0, seuilMax: 500, indice: 1 },
    { seuilMin: 500, seuilMax: 2000, indice: 2 },
    { seuilMin: 2000, seuilMax: 4000, indice: 3 },
    { seuilMin: 4000, seuilMax: 6000, indice: 4 },
    { seuilMin: 6000, seuilMax: 100000, indice: 5 }
  ];
  const TAB_INDICE_RISQUE_CHEMICAL = [
    { seuilMin: 0, seuilMax: 1, indice: 0 },
    { seuilMin: 1, seuilMax: 5, indice: 1 },
    { seuilMin: 5, seuilMax: 10, indice: 2 },
    { seuilMin: 10, seuilMax: 50, indice: 3 },
    { seuilMin: 50, seuilMax: 100, indice: 4 },
    { seuilMin: 100, seuilMax: 100000, indice: 5 }
  ];
  const NOTE_MAX = 3;
  const NOTE_INTERMEDIAIRE = 1;
  const COEF_VAL_FAIBLE = 0.5;
  const [resultIndicePrimSec, setResultIndicePrimSec] = useState([
    {
      indiceCombustible: 0,
      indiceChemical: 0
    }
  ]);
  const [resultRisque, setResultRisque] = useState({
    primaire: 0,
    secondaire: 0,
    annexe: 0
  });
  const indiceRisqueGlobal = () => {
    let indiceGenerale;
    let sum =
      resultRisque.primaire + resultRisque.secondaire + resultRisque.annexe;
    if (sum >= 6) {
      indiceGenerale = 5;
    } else {
      indiceGenerale = sum;
    }
    return indiceGenerale;
  };
  const instantiateResultRisque = () => {
    let totalChem = 0;
    let totalComb = 0;
    if (
      resultIndicePrimSec.indiceCombustible <=
      resultIndicePrimSec.indiceChemical
    ) {
      totalChem = resultIndicePrimSec.indiceChemical;
      totalComb = resultIndicePrimSec.indiceCombustible * COEF_VAL_FAIBLE;
      const totalPicto = indiceRisqueAnnexe();
      setResultRisque({
        ...resultRisque,
        [primaire]: totalChem,
        [secondaire]: totalComb,
        [annexe]: totalPicto
      });
    }
    if (
      resultIndicePrimSec.indiceCombustible > resultIndicePrimSec.indiceChemical
    ) {
      totalComb = resultIndicePrimSec.indiceCombustible;
      totalChem = resultIndicePrimSec.indiceChemical * COEF_VAL_FAIBLE;
      const totalPicto = indiceRisqueAnnexe();
      setResultRisque({
        ...resultRisque,
        [primaire]: totalComb,
        [secondaire]: totalChem,
        [annexe]: totalPicto
      });
    }
  };
  const indiceRisqueAnnexe = () => {
    let noteCourante = 0;
    let indiceAnnexe = 0;
    let sumPicto = 0;
    if (resultRisque.primaire === 0) {
      noteCourante = NOTE_MAX;
      sumPicto = picto.atex + picto.rad + picto.bio;
      if (sumPicto === 1) {
        indiceAnnexe =
          noteCourante * picto.atex +
          noteCourante * picto.rad +
          noteCourante * picto.bio;
      } else if (sumPicto > 1) {
        if (picto.atex === 1) {
          indiceAnnexe = noteCourante * picto.atex;
          noteCourante = NOTE_INTERMEDIAIRE;
        }
        if (picto.rad === 1) {
          indiceAnnexe += noteCourante * picto.rad;
          noteCourante = NOTE_INTERMEDIAIRE;
        }
        if (picto.bio === 1) {
          indiceAnnexe += noteCourante * picto.bio;
        }
      }
    } else {
      noteCourante = NOTE_INTERMEDIAIRE;
      indiceAnnexe =
        noteCourante * picto.atex +
        noteCourante * picto.rad +
        noteCourante * picto.bio;
    }
    return indiceAnnexe;
  };
  const instantiateIndiceIntermediaire = () => {
    let sommeSurface = calculSurface();
    let indiceStock = getIndiceRisque(
      TAB_INDICE_RISQUE_COMBUSTIBLE,
      sommeSurface
    );
    let sommeVol = calculVolume();
    let indiceChimie = getIndiceRisque(TAB_INDICE_RISQUE_CHEMICAL, sommeVol);
    setResultIndicePrimSec({
      ...resultIndicePrimSec,
      [indiceCombustible]: indiceStock,
      [indiceChemical]: indiceChimie
    });
  };
  const handleTextFieldChange = (event) => {
    const values = [...resultIndicePrimSec];
    if (event.target.name === "indiceCombustible") {
      values.indiceCombustible = event.target.value;
    } else if (event.target.name === "indiceChemical") {
      values.indiceChemical = event.target.value;
    }
    setResultIndicePrimSec(values);
    instantiateResultRisque();
  };
  const getIndiceRisque = (array, value) => {
    let indice = 0;
    array.forEach((item) => {
      if (value > item.seuilMin && value <= item.seuilMax) {
        indice = item.indice;
      }
    });
    return indice;
  };
  /*---------------------------------------------risque combustible----------------------------*/
  const [combustible, setCombustible] = useState([
    {
      surface: 0,
      produit: 0,
      surfaceGlobale: 0
    }
  ]);
  const handleAddSurface = () => {
    const values = [...combustible];
    values.push({ surface: "", produit: "" });
    setCombustible(values);
  };
  const handleRemoveSurface = (pos) => {
    const values = [...combustible];
    values.splice(pos, 1);
    setCombustible(values);
  };
  const handleSurfaceChange = (pos, name, value) => {
    const values = [...combustible];

    if (name === "surface") {
      values[pos].surface = value;
    } else {
      values[pos].produit = value;
    }
    instantiateIndiceIntermediaire();
    instantiateResultRisque();
    setCombustible(values);
  };
  const calculSurface = () => {
    let totalSurface = 0;
    combustible.forEach((e) => {
      e.surfaceGlobale = e.surface * e.produit;
      totalSurface += Number(e.surfaceGlobale);
    });
    return totalSurface;
  };
  /*------------------------------------const de debug----------------------------*/
  const sommeSurfacique = calculSurface();
  /*------------------------------------risque chimique---------------------------*/
  const [chimique, setChimique] = useState([
    {
      volume: 0
    }
  ]);
  const handleAddVolChemical = () => {
    const values = [...chimique];
    values.push({ volume: "" });
    setChimique(values);
  };
  const handleRemoveVolChemical = (pos) => {
    const values = [...chimique];
    values.splice(pos, 1);
    setChimique(values);
  };
  const handleChemicalChange = (pos, name, value) => {
    const values = [...chimique];

    if (name === "volume") {
      values[pos].volume = value;
    }
    instantiateIndiceIntermediaire();
    instantiateResultRisque();
    setChimique(values);
  };
  const calculVolume = () => {
    let totalChemical = 0;
    chimique.forEach((e) => {
      totalChemical += Number(e.volume);
    });
    return totalChemical;
  };
  /*-------------------------const de debug--------------------------------*/
  const sommeVolumique = calculVolume();
  /*-------------------------picto atex rad bio----------------------------*/
  const [picto, setPicto] = useState({
    atex: 0,
    rad: 0,
    bio: 0
  });
  const handleChangePicto = (name, value) => {
    setPicto({ ...picto, [name]: value });
  };
  return (
    <React.Fragment>
      {
        /* && */ <Grid container spacing={2}>
          <Grid item xs={9}>
            <Typography variant="h4" gutterBottom>
              Indice de Risque : {indiceGeneralRisque()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Risque primaire : {resultRisque.primaire}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Risque secondaire : {resultRisque.secondaire}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Risque annexe :{resultRisque.annexe}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Box flexDirection="row">
              <Typography variant="subtitle1" gutterBottom>
                indice de risque combustible : {}
              </Typography>
              <TextField
                type="Number"
                id="outlined-basic"
                variant="outlined"
                name="indiceCombustible"
                value={}
                onChange={}
              />
              <Typography variant="subtitle1" gutterBottom>
                total surface equivalent : {sommeSurfacique}
              </Typography>
              <Combustible
                combustible={combustible}
                onChange={handleSurfaceChange}
                add={handleAddSurface}
                remove={handleRemoveSurface}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box flexDirection="row">
              <Typography variant="subtitle1" gutterBottom>
                indice de risque chimique :{}
              </Typography>
              <TextField
                type="Number"
                id="outlined-basic"
                variant="outlined"
                name="indiceChemical"
                value={}
                onChange={}
              />
              <Typography variant="subtitle1" gutterBottom>
                total des volume : {sommeVolumique}
              </Typography>
              <Chimique
                chimique={chimique}
                onChange={handleChemicalChange}
                add={handleAddVolChemical}
                remove={handleRemoveVolChemical}
              />
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box flexDirection="row">
              <Zone picto={picto} onChange={handleChangePicto} />
            </Box>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  );
}
