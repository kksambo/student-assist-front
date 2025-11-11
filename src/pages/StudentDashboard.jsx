import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  TextField,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import BookIcon from "@mui/icons-material/Book";
import SchoolIcon from "@mui/icons-material/School";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoodIcon from "@mui/icons-material/Mood";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function StudentDashboard({ setUser }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("resources");

  const [resourceSearch, setResourceSearch] = useState("");
  const [resources, setResources] = useState([]);

  const [moduleSearch, setModuleSearch] = useState("");
  const [pdfs, setPdfs] = useState([]);

  const [financialResources, setFinancialResources] = useState([]);
  const [financialSearch, setFinancialSearch] = useState("");

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfSummary, setPdfSummary] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [chatMessages]);

  const fetchResources = async (search = "") => {
    try {
      let url = "https://student-assist.onrender.com/resources/";
      if (search) url += `?q=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch resources");
    }
  };

  const fetchPdfs = async () => {
    try {
      let url =
        "https://student-assist.onrender.com/student-resources/resources";
      if (moduleSearch) url += `/module/${moduleSearch}`;
      const res = await fetch(url);
      const data = await res.json();
      setPdfs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch PDFs");
    }
  };

  const fetchFinancialAidResources = async (search = "") => {
    try {
      let url = "https://student-assist.onrender.com/financial-aid/";
      if (search) url += `?q=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      setFinancialResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch financial aid resources");
    }
  };

  useEffect(() => {
    fetchResources();
    fetchPdfs();
    fetchFinancialAidResources();
  }, []);

  const downloadPdf = async (id, title) => {
    try {
      const res = await fetch(
        `https://student-assist.onrender.com/student-resources/resources/download/${id}`
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = title || "document.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const studentEmail = user?.email || "student@example.com";
    const studentMsg = { sender: "student", message: chatInput };
    setChatMessages((prev) => [...prev, studentMsg]);
    setChatInput("");

    try {
      const res = await fetch("https://student-assist.onrender.com/tut-chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: studentEmail, question: chatInput }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot", message: data.answer };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { sender: "bot", message: "Sorry, something went wrong!" };
      setChatMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleAiAsk = async () => {
    if (!aiPrompt.trim()) return;
    setAiResponse("Thinking...");
    try {
      const res = await fetch("https://student-assist.onrender.com/llama/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      setAiResponse(data.answer || "No response from AI.");
    } catch (err) {
      console.error(err);
      setAiResponse("Error contacting AI model. Please try again later.");
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfFile(file);
    setPdfSummary("Uploading and summarizing...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://student-assist.onrender.com/llama/summarize-pdf",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setPdfSummary(data.summary || "No summary available.");
    } catch (err) {
      console.error(err);
      setPdfSummary("Error uploading or summarizing PDF.");
    }
  };

  const sections = [
    {
      key: "resources",
      title: "Available Resources",
      icon: <BookIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#1a237e" }}>
            TUT Available Resources
          </Typography>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="Search by Name or Campus"
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#b71c1c" }}
              onClick={() => fetchResources(resourceSearch)}
            >
              Search
            </Button>
          </Box>
          <Grid container spacing={3}>
            {resources.length > 0 ? (
              resources.map((res) => (
                <Grid item xs={12} sm={6} md={4} key={res.id}>
                  <Card sx={{ bgcolor: "#fbc02d", borderRadius: 3 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1a237e" }}
                      >
                        {res.name}
                      </Typography>
                      <Typography variant="body2">
                        Campus: {res.campus_name || "N/A"}
                      </Typography>
                      <Typography variant="body2">Info: {res.info}</Typography>
                      {res.contact && (
                        <Typography variant="body2">
                          Contact: {res.contact}
                        </Typography>
                      )}
                      {res.email && (
                        <Typography variant="body2">
                          Email: {res.email}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No resources found</Typography>
            )}
          </Grid>
        </Box>
      ),
    },
    {
      key: "finance",
      title: "Financial Assistance",
      icon: <AttachMoneyIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={3} sx={{ color: "#1a237e" }}>
            Financial Assistance & Support
          </Typography>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              label="Search Financial Resources"
              value={financialSearch}
              onChange={(e) => setFinancialSearch(e.target.value)}
              variant="outlined"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#b71c1c" }}
              onClick={() => fetchFinancialAidResources(financialSearch)}
            >
              Search
            </Button>
          </Box>
          <Grid container spacing={3}>
            {financialResources.length > 0 ? (
              financialResources.map((res) => (
                <Grid item xs={12} sm={6} md={4} key={res.id}>
                  <Card sx={{ bgcolor: "#fbc02d", borderRadius: 3 }}>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1a237e" }}
                      >
                        {res.name}
                      </Typography>
                      <Typography variant="body2">{res.description}</Typography>
                      {res.requirements && (
                        <Typography variant="body2">
                          Requirements: {res.requirements}
                        </Typography>
                      )}
                      {res.link && (
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                          onClick={() => window.open(res.link, "_blank")}
                        >
                          View More
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>No financial resources found</Typography>
            )}
          </Grid>
        </Box>
      ),
    },
    {
      key: "aiassistant",
      title: "AI Study Assistant",
      icon: <SmartToyIcon />,
      content: (
        <Box>
          <Typography variant="h5" mb={2} sx={{ color: "#1a237e" }}>
            AI Study Assistant
          </Typography>
          <Typography variant="body2" mb={3}>
            Ask the AI or upload a study PDF for automatic summarization.
          </Typography>

          {/* Manual AI Chat */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <TextField
              label="Ask the AI anything..."
              multiline
              rows={4}
              variant="outlined"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#b71c1c", alignSelf: "flex-start" }}
              onClick={handleAiAsk}
            >
              Ask AI
            </Button>
          </Box>

          <Paper sx={{ p: 2, borderRadius: 3, mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              AI Response:
            </Typography>
            {aiResponse ? (
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            ) : (
              <Typography variant="body1">
                Ask a question to see the AI’s response.
              </Typography>
            )}
          </Paper>

          {/* PDF Upload + Summary */}
          <Typography variant="h6" sx={{ color: "#1a237e", mb: 1 }}>
            Upload a PDF to Summarize
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ mb: 2 }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handlePdfUpload}
            />
          </Button>
          {pdfFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Uploaded: {pdfFile.name}
            </Typography>
          )}
          <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: "#f9f9f9" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
              PDF Summary:
            </Typography>
            {pdfSummary ? (
              <ReactMarkdown>{pdfSummary}</ReactMarkdown>
            ) : (
              <Typography variant="body1">No PDF summary yet.</Typography>
            )}
          </Paper>
        </Box>
      ),
    },
    {
      key: "chat",
      title: "Chat Bot",
      icon: <ChatIcon />,
      content: (
        <Paper
          elevation={3}
          sx={{
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            p: 2,
            borderRadius: 3,
            bgcolor: "#f5f5f5",
          }}
        >
          <Typography variant="h5" mb={2}>
            TUT Chat Bot
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
              p: 1,
              bgcolor: "#e0e0e0",
              borderRadius: 2,
            }}
          >
            {chatMessages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf:
                    msg.sender === "student" ? "flex-end" : "flex-start",
                  bgcolor: msg.sender === "student" ? "#b71c1c" : "#1a237e",
                  color: "#fff",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "75%",
                  wordBreak: "break-word",
                }}
              >
                <Typography variant="body1">{msg.message}</Typography>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1a237e" }}
              onClick={sendChatMessage}
            >
              <SendIcon />
            </Button>
          </Box>
        </Paper>
      ),
    },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: "#fff" }}>
          TUT Student
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "#fff" }} />
      <List>
        {sections.map((section) => (
          <ListItem disablePadding key={section.key}>
            <ListItemButton
              selected={selected === section.key}
              onClick={() => setSelected(section.key)}
              sx={{
                color: "#fff",
                "&.Mui-selected": { backgroundColor: "#b71c1c" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{section.icon}</ListItemIcon>
              <ListItemText primary={section.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const selectedSection = sections.find((s) => s.key === selected);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#b71c1c",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#1a237e",
            color: "#fff",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#1a237e",
            color: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        {selectedSection?.content}
      </Box>
    </Box>
  );
}
