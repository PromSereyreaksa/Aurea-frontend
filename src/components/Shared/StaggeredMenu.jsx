import React, {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { motion } from "framer-motion";
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

  // Memoize colors array to prevent recreating on every render
  const prelayerColors = useMemo(() => {
    const raw =
      colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
    let arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  }, [colors]);

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

      // Animate from top instead of side
      gsap.set([panel, ...preLayers], { yPercent: -100 });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

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

    // Use more efficient selectors and cache them
    const itemEls = panel.querySelectorAll(".sm-panel-itemLabel");
    const numberEls = panel.querySelectorAll(
      ".sm-panel-list[data-numbering] .sm-panel-item"
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = panel.querySelectorAll(".sm-socials-link");

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "yPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "yPercent"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { yPercent: ls.start },
        { yPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { yPercent: panelStart },
      { yPercent: 0, duration: panelDuration, ease: "power4.out" },
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

    // Animate to top instead of side
    closeTweenRef.current = gsap.to(all, {
      yPercent: -100,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = panel.querySelectorAll(".sm-panel-itemLabel");
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = panel.querySelectorAll(
          ".sm-panel-list[data-numbering] .sm-panel-item"
        );
        if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });

        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = panel.querySelectorAll(".sm-socials-link");
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
      {/* Backdrop overlay - outside the pointer-events-none container */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50"
          style={{ zIndex: 35 }}
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      <div className="sm-scope w-full h-full pointer-events-none">
        <div
          className={
            (className ? className + " " : "") +
            "staggered-menu-wrapper relative w-full h-full pointer-events-none"
          }
          style={{
            ...(accentColor ? { ["--sm-accent"]: accentColor } : {}),
            zIndex: 40,
          }}
          data-position={position}
          data-open={open || undefined}
        >
          <div
            ref={preLayersRef}
            className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
            aria-hidden="true"
          >
            {prelayerColors.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ))}
          </div>
          <header
            className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between p-[2em] bg-transparent pointer-events-none"
            style={{ zIndex: 45 }}
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
                    href="/signup"
                    className="px-6 py-2.5 text-sm font-bold bg-[#fb8500] text-white rounded-lg hover:bg-[#e07400] transition-all duration-200 hover:shadow-lg"
                  >
                    Get Started
                  </a>
                </>
              )}

              {/* View Dashboard button for authenticated users */}
              {isAuthenticated && user && (
                <a
                  href="/dashboard"
                  className="px-6 py-2.5 text-sm font-bold bg-[#fb8500] text-white rounded-lg hover:bg-[#e07400] transition-all duration-200 hover:shadow-lg"
                >
                  View Dashboard
                </a>
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
            className="staggered-menu-panel"
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: "6em 4em 2em 4em",
            }}
            id="staggered-menu-panel"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            {/* Desktop Grid Layout - Only visible on lg+ screens */}
            <div className="!hidden lg:!block h-full">
              <div className="grid grid-cols-12 gap-8 h-full">
                {/* Left: Image */}
                <div className="col-span-3 flex items-start pt-32">
                  <div className="w-full max-w-xs rounded-lg overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop"
                      alt="Team collaboration"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* Center: Menu Items */}
                <div className="col-span-6 flex items-center justify-center">
                  <ul className="sm-panel-list flex flex-col gap-6 w-full">
                    {items.map((item, idx) => (
                      <li
                        key={item.label}
                        className="sm-panel-item"
                        style={{
                          fontSize: "clamp(2.5rem, 5vw, 4rem)",
                          fontWeight: 800,
                          letterSpacing: "-0.04em",
                          lineHeight: 1.2,
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        <span
                          className="sm-panel-itemLabel relative hover:text-[#fb8500] transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleMenu(); // Close menu
                            if (item.onClick) {
                              item.onClick();
                            } else if (item.link && item.link !== "#") {
                              window.location.href = item.link;
                            }
                          }}
                        >
                          {item.link && item.link !== "#" ? (
                            <a
                              href={item.link}
                              target="_self"
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                                display: "inline-block",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                toggleMenu(); // Close menu
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
                                  size={28}
                                  className="inline-block ml-3 text-[#fb8500] align-middle"
                                  strokeWidth={2.5}
                                />
                              )}
                            </a>
                          ) : (
                            <>{item.label}</>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Empty space for balance */}
                <div className="col-span-3"></div>

                {/* Bottom Left: Contact Info */}
                <div className="col-span-3 self-end pb-8">
                  <div className="text-xs font-medium mb-3 text-gray-400 uppercase tracking-wider">
                    General Inquiries
                  </div>
                  <a
                    href="mailto:work@aurea.com"
                    className="text-sm font-bold uppercase hover:text-[#fb8500] transition-colors block"
                  >
                    WORK@AUREA.COM
                  </a>
                </div>

                {/* Bottom Center: Empty */}
                <div className="col-span-6"></div>

                {/* Bottom Right: Social Links */}
                {displaySocials && socialItems && socialItems.length > 0 && (
                  <div className="col-span-3 self-end pb-8">
                    <div className="text-xs font-medium mb-3 text-gray-400 uppercase tracking-wider">
                      Social:
                    </div>
                    <ul className="flex flex-col gap-2">
                      {socialItems.map((social) => (
                        <li key={social.label}>
                          <a
                            href={social.link}
                            className="text-sm font-bold uppercase hover:text-[#fb8500] transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
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

            {/* Mobile Layout - Only visible on screens smaller than lg */}
            <div className="flex lg:!hidden flex-col justify-center h-full px-6 py-12">
              <ul className="sm-panel-list flex flex-col gap-12 mb-12">
                {items.map((item, idx) => (
                  <li
                    key={item.label}
                    className="sm-panel-item text-center"
                    style={{
                      fontSize: "clamp(1.85rem, 6.5vw, 3.5rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.3,
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      className="sm-panel-itemLabel relative cursor-pointer hover:text-[#fb8500] transition-colors block"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleMenu(); // Close menu
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.link && item.link !== "#") {
                          window.location.href = item.link;
                        }
                      }}
                    >
                      {item.link && item.link !== "#" ? (
                        <a
                          href={item.link}
                          target="_self"
                          style={{
                            color: "inherit",
                            textDecoration: "none",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleMenu(); // Close menu
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
                              size={24}
                              className="inline-block ml-3 text-[#fb8500] align-middle"
                              strokeWidth={2.5}
                            />
                          )}
                        </a>
                      ) : (
                        <>{item.label}</>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Mobile Contact & Social at bottom */}
              <div className="mt-auto space-y-8">
                {/* Contact Info */}
                <div className="text-center">
                  <div className="text-xs font-medium mb-2 text-gray-400 uppercase tracking-wider">
                    General Inquiries
                  </div>
                  <a
                    href="mailto:work@aurea.com"
                    className="text-sm font-bold uppercase hover:text-[#fb8500] transition-colors"
                  >
                    WORK@AUREA.COM
                  </a>
                </div>

                {/* Mobile Social Links */}
                {displaySocials && socialItems && socialItems.length > 0 && (
                  <div className="text-center">
                    <div className="text-xs font-medium mb-3 text-gray-400 uppercase tracking-wider">
                      Social:
                    </div>
                    <ul className="flex flex-col gap-2 items-center">
                      {socialItems.map((social) => (
                        <li key={social.label}>
                          <a
                            href={social.link}
                            className="text-sm font-bold uppercase hover:text-[#fb8500] transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
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
        </div>
      </div>
      <style>{`
        .sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; pointer-events: none; }
        .sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 2em; background: transparent; pointer-events: none; z-index: 45; }
        .sm-scope .staggered-menu-header > * { pointer-events: auto; }
        .sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
        .sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
        .sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #fb8500; line-height: 1; overflow: visible; padding: 0.5rem; transition: color 0.2s ease; }
        .sm-scope .sm-toggle:hover { color: #e07400; }
        .sm-scope .sm-toggle:hover .text-\[#fb8500\] { color: #e07400; }
        .sm-scope .sm-toggle:focus-visible { outline: 2px solid #fb8500; outline-offset: 2px; }
        .sm-scope .sm-line:last-of-type { margin-top: 6px; }
        .sm-scope .sm-line { display: none !important; }
        .sm-scope .staggered-menu-panel { position: absolute; top: 0; left: 0; right: 0; width: 100%; height: 100vh; background: white; padding: 7em 4em 2em 4em; overflow-y: auto; z-index: 40; pointer-events: auto; border-bottom: 4px solid #fb8500; will-change: transform; }
        .sm-scope .sm-prelayers { position: absolute; top: 0; left: 0; right: 0; width: 100%; height: 100vh; pointer-events: none; z-index: 36; }
        .sm-scope .sm-prelayer { position: absolute; top: 0; left: 0; right: 0; height: 100%; width: 100%; transform: translateY(0); will-change: transform; }
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
        .sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 800; font-size: clamp(1.8rem, 5vw, 2.8rem); cursor: pointer; line-height: 1.2; letter-spacing: -0.04em; text-transform: uppercase; transition: color 0.25s; display: inline-block; text-decoration: none; padding-right: 0.5em; white-space: normal; word-break: break-word; overflow: visible; max-width: 100%; }
        .sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
        .sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
        .sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
        .sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
        @media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: clamp(280px, 85vw, 360px); max-width: 360px; padding: 5em 1.5em 2em 1.5em; } .sm-scope .sm-panel-item { font-size: clamp(1.6rem, 4.5vw, 2.4rem); } }
        @media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: clamp(260px, 80vw, 320px); max-width: 320px; padding: 5em 1.2em 1.5em 1.2em; } .sm-scope .sm-panel-item { font-size: clamp(1.4rem, 4vw, 2rem); line-height: 1.3; padding-right: 0.3em; } .sm-scope .sm-panel-list { gap: 0.3rem; } }
      `}</style>
    </>
  );
};

export default StaggeredMenu;
