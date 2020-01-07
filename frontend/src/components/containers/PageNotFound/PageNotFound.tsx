import React from 'react';

const PageNotFound: React.FC = () => (
  <div className="null-screen">
    <div className="no-nav-bar">
      <h1>Uh Oh!</h1>
      <p>The page you’re looking for can’t be found. It may have moved, or it no longer exists.</p>
      <p>
        {/* <Link to={route.HOME_PAGE.route}>Return to the home page</Link> to get back on track. */}
      </p>
    </div>
  </div>
);

export default PageNotFound;
