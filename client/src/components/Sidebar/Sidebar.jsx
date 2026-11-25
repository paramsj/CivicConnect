// Sidebar navigation for dashboard
import React from "react";
import clsx from "classnames";
import styles from "./Sidebar.module.css";

const Sidebar = ({ items, activeIdx, setActiveIdx }) => {
  return (
    <aside
      className={clsx(
        styles.sidebar,
        "fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 lg:w-[250px] md:w-16 w-16 bg-gradient-to-b from-[#1e3a8a] to-[#1e40af] shadow-lg"
      )}
    >
      <div className="flex items-center justify-center h-[70px]">
        <img
          src="/src/assets/logo.png"
          alt="Logo"
          className="w-10 h-10 opacity-80"
        />
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-4 items-center lg:items-stretch">
        {items.map((item, idx) => (
          <button
            key={item.label}
            type="button"
            className={clsx(
              styles.item,
              "flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-0 lg:gap-3 px-2 lg:px-4 py-2 lg:py-3 text-white/80 hover:text-white transition-all w-12 lg:w-full h-12 lg:h-auto rounded-lg lg:rounded-none",
              activeIdx === idx ? styles.active : ""
            )}
            aria-current={activeIdx === idx ? "page" : undefined}
            onClick={() => {
              if (activeIdx !== idx) setActiveIdx(idx);
            }}
          >
            <span
              className={clsx(
                styles.icon,
                "text-xl mb-0 lg:mb-0 mr-0 lg:mr-2 transition-all duration-150"
              )}
            >
              {item.icon}
            </span>
            <span
              className={clsx(
                "hidden lg:inline text-base font-medium"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
