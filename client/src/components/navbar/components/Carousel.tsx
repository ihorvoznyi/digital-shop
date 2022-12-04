import React, { useContext, FC } from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { Box, Typography } from '@mui/material';

const LeftArrow = () => {
  return (
    <Typography>
      LEFT
    </Typography>
  );
};

const RightArrow = () => {
  return (
    <Typography>
      RIGHT
    </Typography>
  );
};

type typeType = {
  id: string;
  name: string;
};

interface PropsType {
  data: typeType[];
};

const Carousel: FC<PropsType> = ({ data }) => {
  return (
    <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
      {data.map((item) =>
        <Box
          key={item.id || item}
          itemId={item.id || item}
          title={item.id || item}
          m="0 40px"
        >
          {isBodyParts
            ? <BodyPart item={item} bodyPart={bodyPart} setBodyPart={setBodyPart} />
            : <ExerciseCard exercise={item} />
          }
        </Box>
      )}
    </ScrollMenu>
  )
}

export default Carousel;