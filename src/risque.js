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
  const [saisieManuel, setSaisieManuel] = useState(false);
  const [surfaceRetenue, setSurfaceRetenue] = useState(0);
  console.log(resultIndicePrimSec);
  const [resultRisque, setResultRisque] = useState({
    primaire: 0,
    secondaire: 0,
    annexe: 0
  });
  console.log("indiceRisqueGlobal");
  const indiceRisqueGlobal = () => {
    let indiceGenerale;
    let sum = Math.round(
      resultRisque.primaire + resultRisque.secondaire + resultRisque.annexe
    );
    if (sum >= 6) {
      indiceGenerale = 5;
    } else {
      indiceGenerale = sum;
    }
    return indiceGenerale;
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
  console.warn("surfaceRetenue:", surfaceRetenue);
  const instantiateIndiceIntermediaire = (_combustible, _chimique) => {
    console.log("instantiateIndiceIntemediaire");
    const calculSurface = _combustible.reduce(function (
      accumulator,
      currentValue
    ) {
      return accumulator + Number(currentValue.surface * currentValue.produit);
    },
    0);
    setSurfaceRetenue(calculSurface);
    let indiceStock = getIndiceRisque(
      TAB_INDICE_RISQUE_COMBUSTIBLE,
      calculSurface
    );
    const calculVolume = _chimique.reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue.volume),
      0
    );
    let indiceChimie = getIndiceRisque(
      TAB_INDICE_RISQUE_CHEMICAL,
      calculVolume
    );
    setResultIndicePrimSec({
      ...resultIndicePrimSec,
      indiceCombustible: indiceStock,
      indiceChemical: indiceChimie
    });
    console.log(calculVolume);
  };
  const handleTextFieldChange = (event) => {
    console.log("handleTextFieldChange");
    setSaisieManuel(true);

    if (event.target.name === "indiceCombustible") {
      setCombustible([
        {
          surface: 0,
          produit: 0,
          surfaceGlobale: 0
        }
      ]);
      setResultIndicePrimSec({
        ...resultIndicePrimSec,
        indiceCombustible: Number(event.target.value)
      });
    } else if (event.target.name === "indiceChemical") {
      setChimique([
        {
          volume: 0
        }
      ]);
      setResultIndicePrimSec({
        ...resultIndicePrimSec,
        indiceChemical: Number(event.target.value)
      });
    }
    // instantiateResultRisque(resultIndicePrimSec);
  };
  /*------------instantiation de mes notes primaire/secondaire/annexe--------*/
  const indiceRisqueAnnexe = (_picto) => {
    console.log("IndiceRisqueAnnexe");
    let noteCourante = 0;
    let indiceAnnexe = 0;
    let sumPicto = 0;
    if (resultRisque.primaire === 0) {
      noteCourante = NOTE_MAX;
      sumPicto = _picto.atex + _picto.rad + _picto.bio;
      if (sumPicto === 1) {
        indiceAnnexe =
          noteCourante * _picto.atex +
          noteCourante * _picto.rad +
          noteCourante * _picto.bio;
      } else if (sumPicto > 1) {
        if (_picto.atex === 1) {
          indiceAnnexe = noteCourante * _picto.atex;
          noteCourante = NOTE_INTERMEDIAIRE;
        }
        if (_picto.rad === 1) {
          indiceAnnexe += noteCourante * _picto.rad;
          noteCourante = NOTE_INTERMEDIAIRE;
        }
        if (_picto.bio === 1) {
          indiceAnnexe += noteCourante * _picto.bio;
        }
      }
    } else {
      noteCourante = NOTE_INTERMEDIAIRE;
      indiceAnnexe =
        noteCourante * _picto.atex +
        noteCourante * _picto.rad +
        noteCourante * _picto.bio;
    }

    setResultRisque({
      ...resultRisque,
      annexe: indiceAnnexe
    });
    console.log(indiceAnnexe);
  };
  const instantiateResultRisque = (_resultIndicePrimSec) => {
    let totalPrim = 0;
    let totalSec = 0;
    if (
      _resultIndicePrimSec.indiceCombustible <=
      _resultIndicePrimSec.indiceChemical
    ) {
      totalPrim = _resultIndicePrimSec.indiceChemical;
      totalSec = _resultIndicePrimSec.indiceCombustible * COEF_VAL_FAIBLE;
    } else if (
      _resultIndicePrimSec.indiceCombustible >
      _resultIndicePrimSec.indiceChemical
    ) {
      totalPrim = _resultIndicePrimSec.indiceCombustible;
      totalSec = _resultIndicePrimSec.indiceChemical * COEF_VAL_FAIBLE;
    }
    setResultRisque({
      ...resultRisque,
      primaire: totalPrim,
      secondaire: totalSec
    });
    console.log(totalPrim);
    console.log(totalSec);
  };
  /*------------------------risque combustible----------------------------*/
  const [combustible, setCombustible] = useState([
    {
      surface: 0,
      produit: 0
    }
  ]);
  const handleAddSurface = () => {
    const values = [...combustible];
    values.push({ surface: 0, produit: 0 });
    setCombustible(values);
  };
  const handleRemoveSurface = (pos) => {
    const values = [...combustible];
    values.splice(pos, 1);
    setCombustible(values);
  };
  const handleSurfaceChange = (pos, name, value) => {
    setSaisieManuel(false);
    const values = [...combustible];
    if (name === "surface") {
      values[pos].surface = value;
    } else {
      values[pos].produit = value;
    }
    setCombustible(values);
  };
  /*------------------------------------risque chimique---------------------------*/
  const [chimique, setChimique] = useState([
    {
      volume: 0
    }
  ]);
  const handleAddVolChemical = () => {
    const values = [...chimique];
    values.push({ volume: 0 });
    setChimique(values);
  };
  const handleRemoveVolChemical = (pos) => {
    const values = [...chimique];
    values.splice(pos, 1);
    setChimique(values);
  };
  const handleChemicalChange = (pos, name, value) => {
    console.log("HandleChemicalChange");
    setSaisieManuel(false);
    const values = [...chimique];
    if (name === "volume") {
      values[pos].volume = value;
    }
    setChimique(values);
  };

  React.useMemo(
    () => {
      console.log("UseMemo");
      console.log(chimique);
      console.log(combustible);
      console.warn("saisieManuel", saisieManuel);
      if (!saisieManuel) {
        instantiateIndiceIntermediaire(combustible, chimique);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [combustible, chimique]
  );
  React.useEffect(
    () => {
      console.log("UseeffectprimSec");
      instantiateResultRisque(resultIndicePrimSec);
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [resultIndicePrimSec]
  );
  /*-------------------------picto atex rad bio----------------------------*/
  const [picto, setPicto] = useState({
    atex: 0,
    rad: 0,
    bio: 0
  });
  const handleChangePicto = (name, value) => {
    console.log("handleChangePicto");
    console.log(picto);
    setPicto({ ...picto, [name]: value });
  };
  React.useEffect(
    () => {
      console.log("useEffect");
      console.log(picto);
      indiceRisqueAnnexe(picto);
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [picto]
  );
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Typography variant="h4" gutterBottom>
            Indice de Risque : {indiceRisqueGlobal()}
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
            <TextField
              type="number"
              id="indiceCombustible"
              variant="outlined"
              name="indiceCombustible"
              value={resultIndicePrimSec.indiceCombustible}
              onChange={(event) => {
                handleTextFieldChange(event);
              }}
            />
            <Typography variant="subtitle1" gutterBottom>
              Surface retenue: {surfaceRetenue}
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
            <TextField
              type="number"
              id="IndiceRisqueChimique"
              variant="outlined"
              name="indiceChemical"
              value={resultIndicePrimSec.indiceChemical}
              onChange={(event) => handleTextFieldChange(event)}
            />
            <Typography variant="subtitle1" gutterBottom>
              volume chimique
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
    </React.Fragment>
  );
}
