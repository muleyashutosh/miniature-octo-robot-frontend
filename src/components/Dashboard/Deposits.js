import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Backdrop,
  Modal,
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
  StepButton,
  Stepper,
  Step,
  Table,
  TableContainer,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Radio,
  TextField,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const steps = ["Select File to Send", "Enter Reciever's Public Key", "Finish"];

export default function Deposits() {
  const axiosPrivate = useAxiosPrivate();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [tabValue, setTabValue] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [recieverPublicKey, setReceiverPublicKey] = useState("");

  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const handleRadioChange = (id) => {
    setSelectedDocument((prev) => {
      if (!prev && documents[id]) handleComplete();

      return documents[id];
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTransactions = async () => {
      try {
        const response = await axiosPrivate.get("/transactions", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setDocuments(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getTransactions();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [open]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const markIncomplete = () => {
    const newCompleted = completed;
    delete newCompleted[activeStep];
    setCompleted(newCompleted);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const validatePublicKey = (key) => {
    if (key.length > 8) return true;
  };

  const handleChangeReceiverPublicKey = (e) => {
    if (validatePublicKey(e.target.value)) handleComplete();
    else markIncomplete();
    setReceiverPublicKey(e.target.value);
  };

  const sendFile = async () => {
    const formData = {
      hash: selectedDocument.hash,
      receiver: recieverPublicKey,
      file: selectedDocument.name,
    };

    console.log(formData);
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.put("/transactions", formData, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      if (response.data === "Sending Successful") {
        handleReset();
        handleClose();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
  };

  const getTabContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return (
          <Typography id="modal-modal-content0" sx={{ mt: 2 }}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="My Items" {...a11yProps(0)} />
                  <Tab label="Upload" {...a11yProps(1)} disabled />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Document Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Upload Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Hash
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {documents.length ? (
                        documents.map((row, id) => (
                          <TableRow
                            className="selectableTableRow"
                            key={row.name}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                            }}
                            onClick={() => handleRadioChange(id)}
                          >
                            <TableCell component="th" scope="row">
                              <Radio
                                checked={selectedDocument === row}
                                onChange={() => handleRadioChange(id)}
                                value={id}
                                name="selected-document"
                                inputProps={{ "aria-label": `${id}` }}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">
                              {new Date(row.timestamp).toLocaleDateString()}
                            </TableCell>
                            <TableCell align="right">{row.hash}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {
                              "No Documents Uploaded. Please Upload something first"
                            }
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                Item Two
              </TabPanel>
            </Box>
          </Typography>
        );
      case 1:
        return (
          <Typography id="modal-modal-content1" sx={{ mt: 2 }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 10,
              }}
            >
              <Box
                sx={{
                  width: "80%",
                }}
              >
                <TextField
                  fullWidth
                  label="Receiver's Public Key"
                  id="receiver-public-key"
                  value={recieverPublicKey}
                  onChange={handleChangeReceiverPublicKey}
                />
              </Box>
            </Box>
          </Typography>
        );

      case 2:
        return (
          <Typography id="modal-modal-content2" sx={{ mt: 2 }}>
            <Box
              sx={{
                width: "100%",
                height: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                my: 7,
              }}
            >
              {/* {completedSteps[0] && completedSteps[1] ? ( */}
                <React.Fragment>
                  <Button variant="contained" onClick={sendFile}>Send</Button>
                  {/* <CircularProgress /> */}
                  {/* <div>Sending...</div> */}
                </React.Fragment>
              {/* ) : (
                <div>"Pls complete previous steps"</div>
              )} */}
            </Box>
          </Typography>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Send File
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Box sx={style}>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              {allStepsCompleted() ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <Box sx={{ m: 3, px: 2 }}>
                  {/* <Typography id="modal-modal-title" variant="h6" component="h3" color='primary'>
                    Select File to Send
                  </Typography> */}
                  {getTabContent(activeStep)}
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#0F9D58",
                          }}
                        >
                          Step {activeStep + 1} already completed
                        </Typography>
                      ) : null)}
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                    </Button>
                  </Box>
                </Box>
              )}
            </div>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
