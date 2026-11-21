return (
  <div className="dashboard-layout">
    <Navbar />

    <div className="dashboard-content">
      <Sidebar />

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  </div>
);
