// import React, { useState, useRef, useEffect } from 'react';
// import { Box, TextField, Typography, Paper } from '@mui/material';
// import { styled } from '@mui/system';
// import { Lock, Unlock } from 'lucide-react';
// import { motion, useAnimation } from 'framer-motion';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(4),
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   backgroundColor: '#f5f5f5',
//   borderRadius: '12px',
//   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
// }));

// const CodeInput = styled(TextField)(({ theme, isValid }) => ({
//   width: '48px',
//   height: '54px',
//   margin: theme.spacing(0, 0.5),
//   '& .MuiOutlinedInput-root': {
//     '& fieldset': {
//       borderColor: isValid === null ? theme.palette.grey[400] : 
//                    isValid ? theme.palette.success.main : 
//                    theme.palette.error.main,
//       transition: 'border-color 0.3s',
//     },
//     '&:hover fieldset': {
//       borderColor: theme.palette.primary.main,
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: theme.palette.primary.main,
//     },
//   },
//   '& input': {
//     fontSize: '24px',
//     padding: theme.spacing(1),
//     textAlign: 'center',
//   },
// }));

// const TwoFactorVerification = ({ onVerify, error, onSuccess, setError }) => {
//   const [code, setCode] = useState(['', '', '', '', '', '']);
//   const [isValid, setIsValid] = useState(null);
//   const [lastVerifiedCode, setLastVerifiedCode] = useState('');
//   const inputRefs = useRef([]);
//   const controls = useAnimation();

//   useEffect(() => {
//     if (code.every(digit => digit !== '')) {
//       const fullCode = code.join('');
//       if (fullCode !== lastVerifiedCode) {
//         onVerify(fullCode).then(isValid => {
//           setIsValid(isValid);
//           setLastVerifiedCode(fullCode);
//           if (isValid) {
//             controls.start("unlock");
//             setTimeout(() => {
//               onSuccess();
//             }, 2000);
//           } else {
//             controls.start("shake");
//           }
//         });
//       }
//     } else {
//       setIsValid(null);
//     }
//   }, [code, onVerify, controls, onSuccess, lastVerifiedCode]);

//   const handleChange = (index, value) => {
//     if (value.length <= 1) {
//       const newCode = [...code];
//       newCode[index] = value;
//       setCode(newCode);
//       setError(''); // Clear error when user starts modifying the code

//       if (value && index < 5) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === 'Backspace' && !code[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const lockVariants = {
//     initial: { scale: 1, color: "#3f51b5" },
//     shake: {
//       x: [0, -10, 10, -10, 10, 0],
//       transition: { duration: 0.5 },
//       color: "#f44336",
//     },
//     unlock: {
//       rotateY: 180,
//       scale: 1.2,
//       color: "#4caf50",
//       transition: { duration: 0.5 },
//     },
//   };

//   return (
//     <StyledPaper elevation={3}>
//       <motion.div
//         animate={controls}
//         variants={lockVariants}
//         initial="initial"
//       >
//         {isValid ? <Unlock size={48} /> : <Lock size={48} />}
//       </motion.div>
//       <Typography variant="h5" component="h2" gutterBottom>
//         Two-Factor Authentication
//       </Typography>
//       <Typography variant="body2" align="center" color="textSecondary" paragraph>
//         Enter the 6-digit code from your authenticator app
//       </Typography>
//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//         {code.map((digit, index) => (
//           <CodeInput
//             key={index}
//             inputRef={el => inputRefs.current[index] = el}
//             value={digit}
//             onChange={e => handleChange(index, e.target.value)}
//             onKeyDown={e => handleKeyDown(index, e)}
//             variant="outlined"
//             inputProps={{
//               maxLength: 1,
//               inputMode: 'numeric',
//               pattern: '[0-9]*',
//             }}
//             isValid={isValid}
//           />
//         ))}
//       </Box>
//       {error && (
//         <Typography color="error" align="center" variant="body2">
//           {error}
//         </Typography>
//       )}
//       {isValid && (
//         <Typography color="success.main" align="center" variant="body2">
//           Verification successful! Redirecting...
//         </Typography>
//       )}
//     </StyledPaper>
//   );
// };

// export default TwoFactorVerification;


import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { Lock, Unlock } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const CodeInput = styled(TextField)(({ theme, isValid }) => ({
  width: '48px',
  height: '54px',
  margin: theme.spacing(0, 0.5),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: isValid === null ? theme.palette.grey[400] : 
                   isValid ? theme.palette.success.main : 
                   theme.palette.error.main,
      transition: 'border-color 0.3s',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& input': {
    fontSize: '24px',
    padding: theme.spacing(1),
    textAlign: 'center',
  },
}));

const TwoFactorVerification = ({ onVerify, error, onSuccess, setError }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isValid, setIsValid] = useState(null);
  const [lastVerifiedCode, setLastVerifiedCode] = useState('');
  const inputRefs = useRef([]);
  const controls = useAnimation();

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      const fullCode = code.join('');
      if (fullCode !== lastVerifiedCode) {
        onVerify(fullCode).then(isValid => {
          setIsValid(isValid);
          setLastVerifiedCode(fullCode);
          if (isValid) {
            controls.start("unlock");
            setTimeout(() => {
              onSuccess();
            }, 2000);
          } else {
            controls.start("shake");
            setTimeout(() => {
              clearCode();
              inputRefs.current[0].focus();
            }, 1000); // Clear code after shake animation
          }
        });
      }
    } else {
      setIsValid(null);
    }
  }, [code, onVerify, controls, onSuccess, lastVerifiedCode]);

  const clearCode = () => {
    setCode(['', '', '', '', '', '']);
    setError('');
  };

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(''); // Clear error when user starts modifying the code

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const lockVariants = {
    initial: { scale: 1, color: "#3f51b5" },
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
      color: "#f44336",
    },
    unlock: {
      rotateY: 180,
      scale: 1.2,
      color: "#4caf50",
      transition: { duration: 0.5 },
    },
  };

  return (
    <StyledPaper elevation={3}>
      <motion.div
        animate={controls}
        variants={lockVariants}
        initial="initial"
      >
        {isValid ? <Unlock size={48} /> : <Lock size={48} />}
      </motion.div>
      <Typography variant="h5" component="h2" gutterBottom>
        Two-Factor Authentication
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary" paragraph>
        Enter the 6-digit code from your authenticator app
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        {code.map((digit, index) => (
          <CodeInput
            key={index}
            inputRef={el => inputRefs.current[index] = el}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            isValid={isValid}
          />
        ))}
      </Box>
      {error && (
        <Typography color="error" align="center" variant="body2">
          {error}
        </Typography>
      )}
      {isValid && (
        <Typography color="success.main" align="center" variant="body2">
          Verification successful! Redirecting...
        </Typography>
      )}
    </StyledPaper>
  );
};

export default TwoFactorVerification;