import { Outlet } from 'react-router-dom';
import { useRef } from 'react';

import {Navbar} from '../components/index.js';

export default function DashboardLayout() {
  const navbarInLayout = useRef(null);


  return (
    <div className="both">
      <div ref={navbarInLayout} className="navbarinlayout">
        <Navbar />
        <div className="Outletstyle">
          <Outlet />

        </div>
      </div>
    </div>
  );
}
