import React, { useState, useEffect } from "react";
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
  Modal,
  Backdrop,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Support as SupportIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Storage as StorageIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState("dashboard");

  // Data states
  const [users, setUsers] = useState([]);
  const [supportList, setSupportList] = useState([]);
  const [resources, setResources] = useState([]);
  const [financialAid, setFinancialAid] = useState([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "user" | "support" | "resource" | "financialAid"
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Proper Logout
  const logout = () => {
    localStorage.removeItem("user"); // clear user session
    navigate("/"); // redirect to login/home
  };

  // Fetch data functions
  const fetchUsers = async () => {
    try {
      const res = await fetch("https://student-assist.onrender.com/auth/");
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const fetchSupport = async () => {
    try {
      const res = await fetch(
        "https://student-assist.onrender.com/admin/support"
      );
      const data = await res.json();
      setSupportList(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch support entries");
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch("https://student-assist.onrender.com/resources/");
      const data = await res.json();
      setResources(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch resources");
    }
  };

  const fetchFinancialAid = async () => {
    try {
      const res = await fetch(
        "https://student-assist.onrender.com/financial-aid/"
      );
      const data = await res.json();
      setFinancialAid(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch financial aid resources");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSupport();
    fetchResources();
    fetchFinancialAid();
  }, []);

  // Modal Handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setFormData(item || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save data (Add/Edit)
  const handleSave = async () => {
    try {
      let url = "";
      let method = editingItem ? "PUT" : "POST";

      if (modalType === "user")
        url = editingItem
          ? `https://student-assist.onrender.com//auth/${editingItem.id}`
          : "https://student-assist.onrender.com/auth/";
      else if (modalType === "support")
        url = editingItem
          ? `https://student-assist.onrender.com/admin/support/${editingItem.id}`
          : "https://student-assist.onrender.com/admin/support";
      else if (modalType === "resource")
        url = editingItem
          ? `https://student-assist.onrender.com/resources/${editingItem.id}`
          : "https://student-assist.onrender.com/resources/";
      else if (modalType === "financialAid")
        url = editingItem
          ? `https://student-assist.onrender.com/financial-aid/${editingItem.id}`
          : "https://student-assist.onrender.com/financial-aid/";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Refresh data
      if (modalType === "user") fetchUsers();
      else if (modalType === "support") fetchSupport();
      else if (modalType === "resource") fetchResources();
      else if (modalType === "financialAid") fetchFinancialAid();

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save data");
    }
  };

  // Delete handler
  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      let url = "";
      if (type === "users")
        url = `https://student-assist.onrender.com/auth/${id}`;
      else if (type === "support")
        url = `https://student-assist.onrender.com/admin/support/${id}`;
      else if (type === "resources")
        url = `https://student-assist.onrender.com/resources/${id}`;
      else if (type === "financialAid")
        url = `https://student-assist.onrender.com/financial-aid/${id}`;

      await fetch(url, { method: "DELETE" });

      if (type === "users") fetchUsers();
      else if (type === "support") fetchSupport();
      else if (type === "resources") fetchResources();
      else if (type === "financialAid") fetchFinancialAid();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // Render table helper
  const renderTable = (title, data, columns, type) => (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" color="#b71c1c">
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#FFD700", color: "#1a237e" }}
          onClick={() => openModal(type)}
        >
          Add
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead sx={{ bgcolor: "#1a237e" }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{ color: "#FFD700" }}>
                  {col.toUpperCase()}
                </TableCell>
              ))}
              <TableCell sx={{ color: "#FFD700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} hover>
                {columns.map((col) => (
                  <TableCell key={col}>{item[col] || "-"}</TableCell>
                ))}
                <TableCell>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => openModal(type, item)}
                    sx={{ mr: 1, color: "#1a237e" }}
                  />
                  <Button
                    startIcon={<DeleteIcon />}
                    sx={{ color: "#b71c1c" }}
                    onClick={() => handleDelete(type, item.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );

  // Render modal fields dynamically
  const renderModalFields = () => {
    switch (modalType) {
      case "user":
        return (
          <>
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
            <TextField
              label="Role"
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
            />
          </>
        );
      case "support":
        return (
          <>
            <TextField
              label="Type"
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
            />
            <TextField
              label="Info"
              name="info"
              value={formData.info || ""}
              onChange={handleChange}
            />
          </>
        );
      case "resource":
        return (
          <>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
            <TextField
              label="Campus Name"
              name="campus_name"
              value={formData.campus_name || ""}
              onChange={handleChange}
            />
            <TextField
              label="Info"
              name="info"
              value={formData.info || ""}
              onChange={handleChange}
            />
            <TextField
              label="Contact"
              name="contact"
              value={formData.contact || ""}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </>
        );
      case "financialAid":
        return (
          <>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
            <TextField
              label="Requirements"
              name="requirements"
              value={formData.requirements || ""}
              onChange={handleChange}
            />
            <TextField
              label="Link"
              name="link"
              value={formData.link || ""}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Render main content
  const renderContent = () => {
    switch (selected) {
      case "dashboard":
        return (
          <Box>
            <Typography variant="h4" gutterBottom color="#b71c1c">
              Welcome, Admin!
            </Typography>
            <Typography color="#1a237e">
              Use the sidebar to manage users, support entries, resources, and
              financial aid.
            </Typography>
          </Box>
        );
      case "users":
        return renderTable("Users", users, ["id", "email", "role"], "user");
      case "support":
        return renderTable(
          "Support Entries",
          supportList,
          ["id", "type", "info"],
          "support"
        );
      case "resources":
        return renderTable(
          "Resources",
          resources,
          ["id", "name", "campus_name", "info", "contact", "email"],
          "resource"
        );
      case "financialAid":
        return renderTable(
          "Financial Aid Resources",
          financialAid,
          ["id", "name", "description", "requirements", "link"],
          "financialAid"
        );
      default:
        return null;
    }
  };

  // Drawer component
  const drawer = (
    <Box sx={{ textAlign: "center", bgcolor: "#1a237e", height: "100%" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "#FFD700", fontWeight: "bold" }}
      >
        TUT Admin
      </Typography>
      <Divider sx={{ bgcolor: "#FFD700" }} />
      <List>
        {[
          { text: "Dashboard", key: "dashboard", icon: <DashboardIcon /> },
          { text: "Users", key: "users", icon: <GroupIcon /> },
          { text: "Support", key: "support", icon: <SupportIcon /> },
          { text: "Resources", key: "resources", icon: <StorageIcon /> },
          {
            text: "Financial Aid",
            key: "financialAid",
            icon: <AttachMoneyIcon />,
          },
        ].map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              sx={{
                color: "#FFD700",
                "&.Mui-selected": { bgcolor: "#b71c1c", color: "#fff" },
              }}
              selected={selected === item.key}
              onClick={() => setSelected(item.key)}
            >
              <ListItemIcon sx={{ color: "#FFD700" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ bgcolor: "#FFD700" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            sx={{ color: "#FFD700", "&:hover": { bgcolor: "#b71c1c" } }}
            onClick={logout}
          >
            <ListItemIcon sx={{ color: "#FFD700" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#b71c1c",
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
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#1a237e" },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#1a237e" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}

        {/* Modal */}
        <Modal
          open={modalOpen}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "#ffffff",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6" color="#1a237e">
                {editingItem ? "Edit" : "Add"}{" "}
                {modalType === "user"
                  ? "User"
                  : modalType === "support"
                  ? "Support"
                  : modalType === "resource"
                  ? "Resource"
                  : "Financial Aid"}
              </Typography>
              {renderModalFields()}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button onClick={closeModal}>Cancel</Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#b71c1c", color: "#FFD700" }}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}
