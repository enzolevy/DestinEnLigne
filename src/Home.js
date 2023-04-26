import React from 'react';
import { Link as MuiLink } from '@mui/material';
import { Box, Typography, Button, Container } from '@mui/material';
import { FaHeart, FaMoon } from 'react-icons/fa';
import { GiCrystalBall } from 'react-icons/gi';

function Home() {
    return (
        <Container>
            <Box textAlign="center" paddingTop={4}>
                <Typography variant="h2">Bienvenue sur Destin en ligne !</Typography>
                <Typography variant="body1" mt={2}>
                    Explorez votre avenir et dévoilez les secrets de l'amour et des relations grâce à nos outils divinatoires en ligne.
                </Typography>

                <Box display="flex" justifyContent="space-around" flexWrap="wrap" mt={4}>
                    <MuiLink href="/SimpleQuestion" underline="none" sx={{ textDecoration: 'none' }}>
                        <Button variant="contained" startIcon={<GiCrystalBall />} sx={{ mb: 2 }}>
                            <Typography variant="h6">Boule de cristal</Typography>
                            <Typography variant="body2">Obtenez des réponses à vos questions</Typography>
                        </Button>
                    </MuiLink>
                    <MuiLink href="/CompatibilityTab" underline="none" sx={{ textDecoration: 'none' }}>
                        <Button variant="contained" startIcon={<FaHeart />} sx={{ mb: 2 }}>
                            <Typography variant="h6">Compatibilité</Typography>
                            <Typography variant="body2">
                                Découvrez la compatibilité amoureuse, professionnelle et amicale entre deux personnes
                            </Typography>
                        </Button>
                    </MuiLink>
                    <MuiLink href="/DreamTab" underline="none" sx={{ textDecoration: 'none' }}>
                        <Button variant="contained" startIcon={<FaMoon />} sx={{ mb: 2 }}>
                            <Typography variant="h6">Interprétation des rêves</Typography>
                            <Typography variant="body2">Décrivez vos rêves et comprennez leur signification !</Typography>
                        </Button>
                    </MuiLink>
                </Box>
            </Box>
        </Container>
    );
}

export default Home;
