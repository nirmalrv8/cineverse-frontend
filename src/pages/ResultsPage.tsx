import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';

export default function ResultsPage() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 10;
      if (scrollPosition >= threshold && hasMore) setPage(prev => prev + 1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!hasMore) return;
    const genres = searchParams.get('genres');
    const url = `${BASE_URL}/movies/suggest${genres ? `?genres=${genres}` : ''}&page=${page}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const newResults = data.results || [];
        // Append while removing duplicates by movie id (keep first occurrence)
        setMovies(prev => {
          const map = new Map<number, any>();
          // keep existing movies first
          prev.forEach(m => map.set(m.id, m));
          // append new ones (will overwrite only if same id appears later)
          newResults.forEach((m: any) => map.set(m.id, m));
          return Array.from(map.values());
        });
        setHasMore(page < data.total_pages);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, [page, BASE_URL, searchParams, hasMore]);

  const handleCardClick = (movie: any) => {
    Promise.all([
      fetch(`${BASE_URL}/movies/${movie.id}`).then(res => res.json()),
      fetch(`${BASE_URL}/movies/${movie.id}/trailers`).then(res => res.json())
    ]).then(([movieDetails, trailers]) => {
      setSelectedMovie(movieDetails);
      const trailer = (trailers || []).find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
      setTrailerKey(trailer ? trailer.key : null);
    });
  };

  const handleClose = () => {
    setSelectedMovie(null);
    setTrailerKey(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {movies.map((movie: any) => (
          <Grid item key={movie.id} sx={{ p: 1 }}>
            <Card sx={{ cursor: 'pointer', width: 200 }} onClick={() => handleCardClick(movie)}>
              {movie.poster_path && (
                <CardMedia
                  component="img"
                  height="350"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedMovie}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: 500,
            maxHeight: '90vh',
            backgroundColor: selectedMovie?.backdrop_path ? 'rgba(20, 20, 30, 0.98)' : '#000',
          }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, minHeight: 400 }}>
          <IconButton onClick={handleClose} sx={{ color: '#fff', position: 'absolute', right: 8, top: 8, zIndex: 2 }}>
            <CloseIcon />
          </IconButton>

          {selectedMovie && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
                width: '100%',
                minHeight: 600,
                height: '100%',
                backgroundImage: selectedMovie?.backdrop_path
                  ? `linear-gradient(to right, rgb(22, 21, 21) calc(-510px + 50vw), rgba(31, 24, 46, 0.84) 50%, rgba(42, 34, 58, 0.84) 100%), url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 2,
                overflow: 'hidden',
                p: 0,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40%', p: 3 }}>
                {selectedMovie.poster_path ? (
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    sx={{ width: 300, height: 400, objectFit: 'cover', borderRadius: 1 }}
                  />
                ) : (
                  <Box sx={{ width: 300, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#222', color: '#fff', borderRadius: 1 }}>
                    No image
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, width: '100%', mt: '10%', mr: '10%' }}>
                <Box component="h2" sx={{ color: '#fff', fontSize: 40, m: 0 }}>{selectedMovie.title} ({new Date(selectedMovie.release_date).getFullYear()})</Box>
                <Box sx={{ color: '#fff', fontSize: 18 }}>{(() => {
                  const date = new Date(selectedMovie.release_date);
                  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                  const country = selectedMovie.production_countries?.[0]?.iso_3166_1 ?? '';
                  const hours = Math.floor(selectedMovie.runtime / 60);
                  const minutes = selectedMovie.runtime % 60;
                  const runtime = `${hours > 0 ? hours + 'h ' : ''}${minutes}m`;
                  const genres = selectedMovie.genres?.map((g: any) => g.name).join(', ');
                  const sections = [ `${formattedDate}${country ? ' (' + country + ')' : ''}`, genres, runtime ];
                  return (<span>{sections.map((s, i) => (<span key={i}>{s}{i < sections.length - 1 && <Box component="span" sx={{ mx: 1 }}>•</Box>}</span>))}</span>);
                })()}</Box>

                <Box sx={{ fontStyle: 'italic', fontSize: 18, color: '#fff', mb: 1 }}>{selectedMovie.tagline}</Box>
                <Box sx={{ fontSize: 18, color: '#fff', mb: 1 }}>Rating: {selectedMovie.vote_average} ({selectedMovie.vote_count} votes)</Box>
                <Box sx={{ fontSize: 18, color: '#fff' }}>{selectedMovie.overview}</Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
