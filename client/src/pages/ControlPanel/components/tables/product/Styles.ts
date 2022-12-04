import { makeStyles } from '@mui/styles';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'aliceblue',

    '& fieldset': {            // - The <fieldset> inside the Input-root
      borderColor: 'aliceblue',   // - Set the Input border
    },
    '&:hover fieldset': {
      borderColor: 'aliceblue', // - Set the Input border when parent has :hover
    },
    '&.Mui-focused fieldset': { // - Set the Input border when parent is focused 
      borderColor: 'primary.light',
    },
  }
};

export const customization = {
  modalBox: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1200px',
    bgcolor: '#0F0F0F',
    border: '2px solid #000',
    boxShadow: '0 0 20px black',
    p: 4,
  },
  inputName: {
    gridArea: 'name',
    ...inputStyle,
  },
  inputDescription: {
    gridArea: 'description',
    ...inputStyle,
  },
  inputType: {
    gridArea: 'type',
    ...inputStyle,
  },
  inputBrand: {
    gridArea: 'brand',
    ...inputStyle,
  },
  inputPrice: {
    width: '40%',
    gridArea: 'price',
    justifySelf: 'flex-end',
    ...inputStyle,
  },
  inputFeature: {
    '&& .MuiInput-root': {
      color: 'aliceblue',

      '&:before': {            // - The <fieldset> inside the Input-root
        borderColor: 'aliceblue',   // - Set the Input border
      },
      '&:hover::before': {
        borderColor: 'aliceblue',
      },
    }
  },
  imageIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    width: '42px',
    height: '42px',
    color: 'aliceblue'
  }
}

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