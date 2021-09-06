import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface IProps {
  phrase: string;
  type: string;
  createdAt: string;
  definition: string;
  examples: { value: string; id: number }[]
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


const PhraseCard: React.FC<IProps> = (props) => {
  const [expanded, setExpanded] = React.useState(false);

  const {
    phrase,
    type,
    createdAt,
    definition,
    examples
  } = props;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="elevation">
        <CardContent>
          {/*<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>*/}
          {/*  Phrase*/}
          {/*</Typography>*/}
          <Typography variant="h5" component="div">
            {phrase}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {type}
          </Typography>
          <Typography variant="body2">
            {definition}
            <br/>
          </Typography>
          <Divider sx={{margin: '2% 0'}}/>
          <Typography variant="body2">
            Created at: <i>{createdAt}</i>
          </Typography>
        </CardContent>
        <CardActions>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon/>
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph align="center" fontWeight="bold">Examples</Typography>
            {
              examples.map(example => <Typography key={example.id + 'example'} paragraph>{example.value}</Typography>)
            }
          </CardContent>
        </Collapse>
      </Card>
    </Box>
  );
}

export default PhraseCard;