import React, { useEffect } from 'react';

const UserActivityCheck = ({ children }) => {
  useEffect(() => {
    let lastActivityTime = Date.now();

    const trackActivity = () => {
      lastActivityTime = Date.now();
    };

    const checkInactivity = () => {
        console.log("checkActivity")
      const currentTime = Date.now();
      const inactiveDuration = currentTime - lastActivityTime;
      const maxInactiveTime = 10 * 60 * 1000; // 10 minutes

      if (inactiveDuration >= maxInactiveTime) {
        localStorage.clear();
        window.location.href = '/logout'; // Redirect to logout page
      }
    };

    const activityInterval = setInterval(checkInactivity, 60000); // Check every minute

    // Cleanup interval on unmount
    return () => clearInterval(activityInterval);
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};

export default UserActivityCheck;
