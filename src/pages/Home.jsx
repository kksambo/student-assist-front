import React from "react";
import { Container, Typography, Button, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #800000 0%, #b30000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated Circles */}
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
        }}
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ textAlign: "center", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            gutterBottom
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            TUT Resources
          </Typography>

          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              fontFamily: "'Open Sans', sans-serif",
            }}
          >
            Your one-stop hub for learning materials, assignments, and notes.
          </Typography>

          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#fff",
                color: "#800000",
                fontWeight: "bold",
                px: 4,
                borderRadius: "50px",
                "&:hover": { backgroundColor: "#f2f2f2" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#fff",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                borderRadius: "50px",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </Stack>
        </motion.div>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          textAlign: "center",
          width: "100%",
          opacity: 0.8,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Tshwane University of Technology • All
          Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
}
