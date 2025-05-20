import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  User,
  MultiFactorUser,
  Auth
} from 'firebase/auth';
import { auth } from '../../firebase';
import zxcvbn from 'zxcvbn';
import SessionModal from './SessionModal';
import { 
  Button, 
  TextField, 
  Box, 
  LinearProgress, 
  Typography, 
  Checkbox, 
  FormControlLabel 
} from '@mui/material';

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [sessionWarning, setSessionWarning] = useState(false);

  const passwordStrength = zxcvbn(password).score * 25;

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      if (multiFactor(user).enrolledFactors.length === 0) {
        await handleMFAEnrollment(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    }
  };

  const handleMFAEnrollment = async (user: User) => {
    try {
      const mfaSession = await multiFactor(user).getSession();
      const phoneInfoOptions = {
        phoneNumber: "+380XXXXXXXXX",
        session: mfaSession
      };
      
      const provider = new PhoneAuthProvider(auth as Auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneInfoOptions, 
        window.recaptchaVerifier
      );
      
      window.sessionStorage.setItem('verificationId', verificationId);
      setShowMFA(true);
    } catch (err: any) {
      setError('MFA Enrollment Failed: ' + err.message);
    }
  };

  const verifyMFA = async () => {
    try {
      const credential = PhoneAuthProvider.credential(
        sessionStorage.getItem('verificationId')!,
        verificationCode
      );
      
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
      if (auth.currentUser) {
        await multiFactor(auth.currentUser).enroll(multiFactorAssertion);
      } else {
        throw new Error('No authenticated user found for MFA enrollment.');
      }
      setShowMFA(false);
    } catch (err: any) {
      setError('MFA Verification Failed: ' + err.message);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        auth.signOut();
        localStorage.removeItem('rememberMe');
        setSessionWarning(true);
      }, 29 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);

  return (
    <Box sx={{ 
      maxWidth: 400,
      margin: 'auto',
      mt: 10,
      padding: 3,
      boxShadow: 3,
      borderRadius: 2
    }}>
      <Typography variant="h4" gutterBottom>
        Marketing Analytics Login
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        margin="normal"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        variant="outlined"
        margin="normal"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
      />

      <Box sx={{ my: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={passwordStrength}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#eee',
            '& .MuiLinearProgress-bar': {
              backgroundColor: passwordStrength < 50 ? '#ff4444' : 
                passwordStrength < 75 ? '#ffbb33' : '#00C851'
            }
          }}
        />
        <Typography variant="caption">
          Password Strength: {['Weak', 'Fair', 'Good', 'Strong'][Math.floor(passwordStrength/25)]}
        </Typography>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
          />
        }
        label="Remember Me"
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Sign In
      </Button>

      {showMFA && (
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Verification Code"
            variant="outlined"
            value={verificationCode}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
          />
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={verifyMFA}
          >
            Verify MFA Code
          </Button>
        </Box>
      )}

      {sessionWarning && <SessionModal onConfirm={() => setSessionWarning(false)} />}
    </Box>
  );
}