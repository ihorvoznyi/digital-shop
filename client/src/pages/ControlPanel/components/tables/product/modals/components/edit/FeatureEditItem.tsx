import { FC, useCallback, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { Box, TextField, Typography } from '@mui/material'

import { customization } from '../../../Styles';
import { debounce } from '../../../../../../../../utils';

type FeatureType = {
  id: string;
  name: string;
  value: string;
}

interface PropsType {
  feature: FeatureType;
  onChange: (id: string, value: string) => void;
}

const FeatureEditItem: FC<PropsType> = (props) => {
  const { feature, onChange } = useMemo(() => props, []);

  const [state, setState] = useState(feature.value);

  const debounseChange = useCallback(debounce(onChange, 200), []);

  return (
    <Box key={feature.id} sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Typography
          variant='body2'
          component='span'
          color='aliceblue'
        >
          {feature.name}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <TextField
          label='Значення'
          variant='standard'
          InputLabelProps={{ style: { color: 'aliceblue' } }}
          sx={{ ...customization.inputFeature }}
          value={state}
          onChange={(e: any) => {
            setState(e.target.value);
            debounseChange(feature.id, e.target.value);
          }}
        />
      </Box>
    </Box>
  )
};

export default observer(FeatureEditItem);