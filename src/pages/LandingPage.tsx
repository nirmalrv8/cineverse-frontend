import { useEffect, useState } from 'react';
import { Button, FormGroup, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    if (!BASE_URL) return;
    fetch(`${BASE_URL}/movies/genres`)
      .then(res => res.json())
      .then(data => {
        if (data?.genres && data.genres.length > 0) setGenres(data.genres);
      })
      .catch(err => console.error('Error fetching genres', err));
  }, [BASE_URL]);

  const handleGenreChange = (genreId: string) => {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  const handleFindClick = () => {
    const params = new URLSearchParams();
    if (selectedGenres.length > 0) params.set('genres', selectedGenres.join(','));
    navigate(`/results?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography component="h1" sx={{ fontSize: '2rem', mb: 2 }}>Welcome to CineVerse</Typography>
      <FormGroup sx={{ m: '16px 0', maxHeight: 200, overflowY: 'auto', width: 1000 }}>
        {genres.map((genre: any) => (
          <FormControlLabel
            key={genre.id}
            control={
              <Checkbox
                checked={selectedGenres.includes(String(genre.id))}
                onChange={() => handleGenreChange(String(genre.id))}
                sx={{ color: '#fff', '&.Mui-checked': { color: '#fff' } }}
              />
            }
            label={genre.name}
          />
        ))}
      </FormGroup>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleFindClick}>
        Find
      </Button>
    </Box>
  );
}
