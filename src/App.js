import logo from './logo.svg';
import './App.css';
import { AppBar, Container, Stack, Typography } from '@mui/material';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notification from './components/Notification';

function App() {
  return (
    <>
      <Container maxWidth='xl'>
        <AppBar position='static' color='inherit'
          sx={{
            borderRadius: 15,
            marginY: 6,
            marginX: 'auto',
            border: '2px solid grey'
          }}
        >
          <Typography variant='h2' align='center'>Video chat</Typography>
        </AppBar>
        <Stack justifyContent='center'>
          {/* Video player */}
          <VideoPlayer />
          {/* Call notification */}
          <Options>
            <Notification />
          </Options>
        </Stack>
      </Container>
    </>
  );
}

export default App;
