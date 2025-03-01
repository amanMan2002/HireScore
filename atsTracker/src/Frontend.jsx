import { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, CircularProgress, Paper, Box, Grid, List, ListItem, ListItemText } from '@mui/material';

function App() {
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jd', jdText);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData);
      setResults(response.data);
    } catch (error) {
      alert('Error analyzing resume');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h3" component="h1" gutterBottom>
        HireScore
      </Typography>
      
      <Box my={3}>
        <TextField
          label="Paste job description here..."
          multiline
          rows={6}
          variant="outlined"
          fullWidth
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
      </Box>

      <Box my={3}>
        <Button
          variant="contained"
          component="label"
          fullWidth
        >
          Upload Resume
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept=".pdf,.docx"
          />
        </Button>
        {isLoading && <CircularProgress style={{ marginTop: '10px' }} />}
      </Box>

      {results && (
        <Paper elevation={3} style={{ padding: '20px', marginTop: '30px' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Results
          </Typography>
          <Typography variant="h5" component="h3" style={{ color: '#2ecc71' }}>
            Score: {results.score}%
          </Typography>
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <Typography variant="h6">✅ Matched Keywords:</Typography>
              <List>
                {results.matched.map((word, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={word} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">❌ Missing Keywords:</Typography>
              <List>
                {results.missing.map((word, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={word} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default App;