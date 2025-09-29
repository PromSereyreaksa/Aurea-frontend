import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, X, ExternalLink } from "lucide-react";

export const StaggeredMenu = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/favicon-16x16.png",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  accentColor = "#5227FF",
  onMenuOpen,
  onMenuClose,
  user = null,
  isAuthenticated = false,
  onLogout = null,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const iconRef = useRef(null);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const itemEntranceTweenRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      if (!panel) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  // Close user dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity"]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(
          panel.querySelectorAll(".sm-panel-itemLabel")
        );
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll(
            ".sm-panel-list[data-numbering] .sm-panel-item"
          )
        );
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(
          panel.querySelectorAll(".sm-socials-link")
        );
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      },
    });
  }, [position]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    if (!icon) return;

    gsap.killTweensOf(icon);

    if (opening) {
      // Animate to X with rotation and scale
      gsap
        .timeline()
        .to(icon, {
          rotation: 180,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.inOut",
        })
        .set(icon, { rotation: 0 })
        .to(icon, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
    } else {
      // Animate back to hamburger with rotation and scale
      gsap
        .timeline()
        .to(icon, {
          rotation: -180,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.inOut",
        })
        .set(icon, { rotation: 0 })
        .to(icon, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback(() => {
    // No text animation needed for hamburger icon
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  return (
    <>
      <div className="sm-scope w-full h-full pointer-events-none">
        <div
          className={
            (className ? className + " " : "") +
            "staggered-menu-wrapper relative w-full h-full z-40 pointer-events-none"
          }
          style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
          data-position={position}
          data-open={open || undefined}
        >
          <div
            ref={preLayersRef}
            className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
            aria-hidden="true"
          >
            {(() => {
              const raw =
                colors && colors.length
                  ? colors.slice(0, 4)
                  : ["#1e1e22", "#35353c"];
              let arr = [...raw];
              if (arr.length >= 3) {
                const mid = Math.floor(arr.length / 2);
                arr.splice(mid, 1);
              }
              return arr.map((c, i) => (
                <div
                  key={i}
                  className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                  style={{ background: c }}
                />
              ));
            })()}
          </div>
          <header
            className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none z-20"
            aria-label="Main navigation header"
          >
            <div
              className="sm-logo flex items-center select-none pointer-events-auto"
              aria-label="Logo"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
                style={{ cursor: "pointer", display: "block" }}
              >
                <img
                  src={logoUrl || "/src/assets/logos/reactbits-gh-white.svg"}
                  alt="Logo"
                  className="sm-logo-img block h-8 w-auto object-contain"
                  draggable={false}
                  width={110}
                  height={24}
                />
              </a>
            </div>
            <div className="flex items-center gap-4 pointer-events-auto">
              {/* Authentication buttons for non-authenticated users */}
              {!isAuthenticated && (
                <>
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#fb8500] transition-colors duration-200"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium bg-[#fb8500] text-white rounded-lg hover:bg-[#e07400] transition-colors duration-200"
                  >
                    Sign Up
                  </a>
                </>
              )}

              {/* User dropdown for authenticated users */}
              {isAuthenticated && user && (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#fb8500] transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#fb8500] flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span>{user.name || "User"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showUserDropdown ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <a
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#fb8500] transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                        Dashboard
                      </a>
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#fb8500] transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </a>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout?.();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                ref={toggleBtnRef}
                className="sm-toggle relative inline-flex items-center justify-center bg-transparent text-[#fb8500] leading-none overflow-visible p-2 hover:text-[#e07400] transition-colors duration-200 border-0 cursor-pointer"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="staggered-menu-panel"
                onClick={toggleMenu}
                type="button"
              >
                <div
                  ref={iconRef}
                  className="transition-transform duration-300 ease-in-out"
                >
                  {open ? (
                    <X size={28} strokeWidth={2.5} className="text-[#fb8500]" />
                  ) : (
                    <Menu
                      size={28}
                      strokeWidth={2.5}
                      className="text-[#fb8500]"
                    />
                  )}
                </div>
              </button>
            </div>
          </header>
          {/* Main menu panel */}
          <div
            ref={panelRef}
            className="staggered-menu-panel flex flex-col"
            style={{
              width: "clamp(320px, 44vw, 600px)",
              padding: "7em 2.5em 2.5em 2.5em",
            }}
            id="staggered-menu-panel"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="sm-panel-inner flex-1 flex flex-col gap-8">
              <ul
                className="sm-panel-list flex flex-col gap-4"
                data-numbering={displayItemNumbering ? "true" : undefined}
              >
                {items.map((item, idx) => (
                  <li
                    key={item.label}
                    className="sm-panel-item"
                    style={{
                      fontSize: "clamp(2.2rem, 6vw, 3.7rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      paddingRight: "1.2em",
                      lineHeight: 1.08,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      overflow: "visible",
                      maxWidth: "100%",
                    }}
                  >
                    <span
                      className="sm-panel-itemLabel relative"
                      onClick={(e) => {
                        e.preventDefault();
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.link && item.link !== "#") {
                          window.location.href = item.link;
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.link && item.link !== "#" ? (
                        <a
                          href={item.link}
                          target="_self"
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                            display: "inline-block",
                            width: "100%",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.onClick) {
                              item.onClick();
                            } else {
                              window.location.href = item.link;
                            }
                          }}
                        >
                          {item.label}
                          {item.label.toLowerCase() === "about" && (
                            <ExternalLink
                              size={20}
                              className="inline-block ml-2 text-[#fb8500]"
                              strokeWidth={2.5}
                            />
                          )}
                        </a>
                      ) : (
                        <>
                          {item.label}
                          {item.label.toLowerCase() === "about" && (
                            <ExternalLink
                              size={20}
                              className="inline-block ml-2 text-[#fb8500]"
                              strokeWidth={2.5}
                            />
                          )}
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-8 flex flex-col gap-3">
                <div
                  className="sm-socials-title text-lg font-semibold mb-2"
                  style={{ color: "var(--sm-accent, #ff0000)" }}
                >
                  Connect with us
                </div>
                <ul className="sm-socials-list flex flex-row items-center gap-4 flex-wrap">
                  {socialItems.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.link}
                        className="sm-socials-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "1.3rem", fontWeight: 600 }}
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
        .sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 2em; background: transparent; pointer-events: none; z-index: 20; }
        .sm-scope .staggered-menu-header > * { pointer-events: auto; }
        .sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
        .sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
        .sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #fb8500; line-height: 1; overflow: visible; padding: 0.5rem; transition: color 0.2s ease; }
        .sm-scope .sm-toggle:hover { color: #e07400; }
        .sm-scope .sm-toggle:hover .text-\[#fb8500\] { color: #e07400; }
        .sm-scope .sm-toggle:focus-visible { outline: 2px solid #fb8500; outline-offset: 2px; }
        .sm-scope .sm-line:last-of-type { margin-top: 6px; }
        .sm-scope .sm-line { display: none !important; }
        .sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(320px, 44vw, 600px); height: 100%; background: white; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 7em 2.5em 2.5em 2.5em; overflow-y: auto; z-index: 10; pointer-events: auto; }
        .sm-scope .staggered-menu-panel::before { content: ''; position: absolute; left: -12px; top: 0; height: 100%; width: 4px; background: #e07400; }
        .sm-scope .staggered-menu-panel::after { content: ''; position: absolute; left: -8px; top: 0; height: 100%; width: 4px; background: #fb8500; }
        .sm-scope .staggered-menu-panel { border-left: 4px solid #ff8f00; }
        .sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; border-left: none; border-right: 4px solid #ff8f00; }
        .sm-scope [data-position='left'] .staggered-menu-panel::before { left: auto; right: -12px; background: #e07400; }
        .sm-scope [data-position='left'] .staggered-menu-panel::after { left: auto; right: -8px; background: #fb8500; }
        .sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(320px, 44vw, 600px); pointer-events: none; z-index: 5; }
        .sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
        .sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
        .sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 2rem; }
        .sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
        .sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
        .sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
        .sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
        .sm-scope .sm-socials-list .sm-socials-link:hover,
        .sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
        .sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
        .sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
        .sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
        .sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
        .sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 800; font-size: clamp(2.2rem, 6vw, 3.7rem); cursor: pointer; line-height: 1.08; letter-spacing: -0.04em; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.2em; white-space: nowrap; overflow: visible; max-width: 100%; }
        .sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
        .sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
        @media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
        @media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-img { filter: invert(100%); } }
      `}</style>
    </>
  );
};

export default StaggeredMenu;
