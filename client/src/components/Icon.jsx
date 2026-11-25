// Icon wrapper for react-icons (future use)
// Usage: <Icon icon={FaHome} className="..." />
import React from "react";

const Icon = ({ icon: IconComp, ...props }) => {
  return <IconComp {...props} />;
};

export default Icon;
