import { makeStyles } from '@mui/styles';

export const useStyles: any = makeStyles({
  select: {
    color: 'aliceblue',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'aliceblue',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'aliceblue',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'aliceblue',
    },
  },
  standardInput: {
    '& .MuiInput-root': {
      color: 'aliceblue',

      '&:before': {
        borderColor: 'aliceblue',
      },
      '&:hover::before': {
        borderColor: 'aliceblue',
      }
    }
  },
  inputLabelRoot: {
    color: 'aliceblue',
  }
});