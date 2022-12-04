export const styles = {
  modalBox: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#0F0F0F',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  inputStyle: {
    mt: 1,
    input: {
      color: 'aliceblue',
    },
    '&& .MuiInput-root': {
      '&:before': {
        borderColor: 'aliceblue',
      },
      '&:hover::before': {
        borderColor: 'aliceblue',
      }
    }
  }
};