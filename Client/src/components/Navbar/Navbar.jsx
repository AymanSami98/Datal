import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Container,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import "./Navbar.css";

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
 
             <Typography
            variant="div"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
                <Link 
      to="/dashboard"
      style={{ color: "white", textDecoration: "none" }}
      >
            DATAL
      </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem key="home" onClick={handleCloseNavMenu}>
                <Button>
                  <NavLink
                    to="/dashboard"
                    style={{ color: "Black", textDecoration: "none" }}
                  >
                    Home
                  </NavLink>
                </Button>
              </MenuItem>
              <MenuItem key="users" onClick={handleCloseNavMenu}>
                <Button>
                  <NavLink
                    to="/dashboard/user"
                    style={{ color: "Black", textDecoration: "none" }}
                  >
                    Users
                  </NavLink>
                </Button>
              </MenuItem>
              <MenuItem key="content" onClick={handleCloseNavMenu}>
                <Button>
                  <NavLink
                    to="/dashboard/content"
                    style={{ color: "Black", textDecoration: "none" }}
                  >
                    Content
                  </NavLink>
                </Button>
              </MenuItem>
              <MenuItem key="finance" onClick={handleCloseNavMenu}>
                <Button>
                  <NavLink
                    to="/dashboard/finance"
                    style={{ color: "Black", textDecoration: "none" }}
                  >
                    Finance
                  </NavLink>
                </Button>
              </MenuItem>
              <MenuItem key="new-report" onClick={handleCloseNavMenu}>
                <Button>
                  <NavLink
                    to="/dashboard/new-report"
                    style={{ color: "Black", textDecoration: "none" }}
                  >
                    New Report
                  </NavLink>
                </Button>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="div"
            noWrap
            component="div"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
               <NavLink 
      to="/dashboard"
      style={{ color: "white", textDecoration: "none" }}
      >
           DATAL</NavLink>
            
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button>
              <NavLink
                to="/dashboard"
                style={{ color: "white", textDecoration: "none" }}
              >
                Home
              </NavLink>
            </Button>
            <Button>
              <NavLink
                to="/dashboard/user"
                style={{ color: "white", textDecoration: "none" }}
              >
                Users
              </NavLink>
            </Button>
            <Button>
              <NavLink
                to="/dashboard/content"
                style={{ color: "white", textDecoration: "none" }}
              >
                Content
              </NavLink>
            </Button>
            <Button>
              <NavLink
                to="/dashboard/finance"
                style={{ color: "white", textDecoration: "none" }}
              >
                Finance
              </NavLink>
            </Button>
            <Button>
              <NavLink
                to="/dashboard/new-report"
                style={{ color: "white", textDecoration: "none" }}
              >
                New Report
              </NavLink>
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Avatar
                alt="Nextup Comedy"
                src="https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/dehs6xpu1av0d5sawctf"
              />
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
