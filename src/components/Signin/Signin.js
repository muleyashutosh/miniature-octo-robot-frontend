import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useAuth from "../../hooks/useAuth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import axios from '../../api/axios';
import background from './background.jpg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();
const SIGNIN_URL = '/auth/signin';
const SIGNUP_URL = '/auth/signup';


export default function SignIn() {
    const { setAuth } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/home/dashboard";


    const [showError, setShowError] = useState("none")
    const [isPasswordValid, setIsPasswordValid] = useState(false)
    const [showPasswordChecks, setShowPasswordChecks] = useState(false)
    const defaultValidations = {
        minLen8: false,
        oneCapitalLetter: false,
        oneSmallLetter: false,
        oneNumber: false,
        oneSpecialCharacter: false,
    }
    const [validations, setValidations] = useState(defaultValidations)
    const [errorMsg, setErrorMsg] = useState("none")
    const [accountExists, setAccountExists] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [role, setRole] = useState("")

    const clearInputState = () => {
        setEmail("")
        setPassword("")
    }

    function validatePassword(inputPassword) {

        let passwordValid, passwordFormat;
        const newValidations = {
            minLen8: (inputPassword.length > 7) ? true : false,
            oneCapitalLetter: (/[A-Z]/.test(inputPassword)) ? true : false,
            oneSmallLetter: (/[a-z]/.test(inputPassword)) ? true : false,
            oneNumber: (/\d/.test(inputPassword)) ? true : false,
            oneSpecialCharacter: (/[^\w]/.test(inputPassword)) ? true : false,

        }
        setValidations(newValidations)

        if (Object.values(newValidations).every(value => value === true)) {
            passwordValid = true
            passwordFormat = false
        }
        else {
            passwordValid = false
            passwordFormat = true
        }
        setIsPasswordValid(passwordValid);
        setShowPasswordChecks(passwordFormat)
    }


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(SIGNIN_URL, {
                email: email,
                password: password,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            });
            if (res?.data?.status !== 'ok') throw Error(); 
            localStorage.setItem('app_access_token', res?.data?.accessToken)
            setAuth({ email, accessToken: res?.data?.accessToken })
            navigate(from, { replace: true });
        } catch (error) {
            setShowError("");
            setErrorMsg(error.response.data['message']);
        }

    };

    const signupSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(SIGNUP_URL, {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: role
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true
            })
            if (res?.data?.status !== 'ok') throw Error(); 
            localStorage.setItem('app_access_token', res?.data?.accessToken)
            setAuth({ email, accessToken: res?.data?.accessToken })
            navigate(from, { replace: true });
        } catch (error) {
            setShowError("");
            setErrorMsg(error.response.data['message']);
        }

    };


    return (
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${background})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {accountExists ? (
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 14,
                  mx: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    autoComplete="current-password"
                  />
                  {/* <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember me"
                                        /> */}
                  <Alert
                    severity="error"
                    sx={{ fontSize: 16, display: showError }}
                  >
                    {errorMsg}
                  </Alert>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid
                      item
                      onClick={() => {
                        clearInputState();
                        setAccountExists(false);
                        setShowError("none");
                      }}
                    >
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 12,
                  mx: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <Box component="form" onSubmit={signupSubmit} sx={{ mt: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        autoComplete="family-name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        type="email"
                        id="email"
                        label="Email Address"
                        name="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validatePassword(e.target.value);
                        }}
                        autoComplete="new-password"
                        onFocus={(e) => {
                          isPasswordValid
                            ? setShowPasswordChecks(false)
                            : setShowPasswordChecks(true);
                        }}
                        InputProps={
                          isPasswordValid
                            ? {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <CheckCircleIcon
                                      color="success"
                                      style={{ display: "hidden" }}
                                    />
                                  </InputAdornment>
                                ),
                              }
                            : {}
                        }
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="role"
                        label="Role"
                        type="text"
                        id="role"
                        onChange={(e) => {
                          setRole(e.target.value);
                        }}
                        autoComplete=""
                      />
                      {showPasswordChecks ? (
                        <Box sx={{ fontSize: 14 }}>
                          <ul>
                            <li
                              style={{
                                color: validations.minLen8 ? "green" : "red",
                              }}
                            >
                              Min Length 8
                            </li>
                            <li
                              style={{
                                color: validations.oneCapitalLetter
                                  ? "green"
                                  : "red",
                              }}
                            >
                              Must have Capital Letter
                            </li>
                            <li
                              style={{
                                color: validations.oneSmallLetter
                                  ? "green"
                                  : "red",
                              }}
                            >
                              Must have small Letter
                            </li>
                            <li
                              style={{
                                color: validations.oneNumber ? "green" : "red",
                              }}
                            >
                              Must have an Integer
                            </li>
                            <li
                              style={{
                                color: validations.oneSpecialCharacter
                                  ? "green"
                                  : "red",
                              }}
                            >
                              Must have special characters (*,#,$ etc)
                            </li>
                          </ul>
                        </Box>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                  <Alert
                    severity="error"
                    sx={{ fontSize: 16, display: showError }}
                  >
                    {errorMsg}
                  </Alert>
                  <Grid container justifyContent="flex-end">
                    <Grid
                      item
                      onClick={() => {
                        clearInputState();
                        setAccountExists(true);
                        setIsPasswordValid(false);
                        setValidations(defaultValidations);
                        setShowError("none");
                        setShowPasswordChecks(false);
                      }}
                    >
                      <Link href="#" variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </ThemeProvider>
    );
}