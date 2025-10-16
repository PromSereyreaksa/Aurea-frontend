# Animation Optimization - Quick Reference

## 🎯 Quick Start

### 1. Import the Config

```jsx
import animations from "@/utils/animationConfig";
```

### 2. Use Presets Instead of Manual Config

**❌ Before (Laggy on weak devices):**

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>
```

**✅ After (Optimized):**

```jsx
<motion.div {...animations.fadeInUp}>
```

---

## 📦 Available Animations

### Basic Animations

```jsx
{...animations.fadeIn}         // Fade in only
{...animations.fadeInUp}       // Fade in + slide up
{...animations.fadeInDown}     // Fade in + slide down
{...animations.slideInLeft}    // Slide from left
{...animations.slideInRight}   // Slide from right
{...animations.scaleIn}        // Scale from 95% to 100%
```

### Hover Effects (Auto-disabled on weak devices)

```jsx
{...animations.hoverScale}     // Scale to 1.05 on hover
{...animations.hoverLift}      // Lift up 5px on hover
```

### Scroll Animations

```jsx
<motion.div
  {...animations.fadeInUp}
  viewport={animations.viewportConfig}
>
```

### Stagger Lists

```jsx
<motion.div
  variants={animations.staggerContainer}
  initial="hidden"
  whileInView="show"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={animations.staggerItem}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🔧 Complex Animations

### Floating Elements (Disabled on weak devices)

```jsx
{
  !animations.isWeakDevice && (
    <motion.div {...animations.getFloatingAnimation()} />
  );
}
```

### Background Blobs (Disabled on weak devices)

```jsx
{
  !animations.isWeakDevice && (
    <motion.div {...animations.getBlobAnimation(20)} />
  );
}
```

---

## 🎨 CSS Utilities

### Add to className

```jsx
className = "will-change-transform transition-optimized";
className = "gpu-accelerated shadow-optimized-lg";
```

### Available Classes

- `will-change-transform` - Prepare for animation
- `will-change-opacity` - Prepare for fade
- `gpu-accelerated` - Force GPU rendering
- `transition-optimized` - Fast transitions
- `shadow-optimized` - Light shadow
- `shadow-optimized-lg` - Light large shadow

---

## ⚡ Performance Rules

### ✅ DO

- Animate `opacity` and `transform` only
- Use presets from `animations`
- Add `viewport={animations.viewportConfig}` for scroll
- Use CSS transitions for simple hovers
- Add `will-change-transform` to animated elements

### ❌ DON'T

- Animate `width`, `height`, `margin`, `padding`
- Use manual `transition={{ duration: 0.6 }}`
- Apply `will-change` to everything
- Ignore weak device detection
- Use complex blur on mobile

---

## 🧪 Testing

### Check Performance

```bash
# Chrome DevTools
F12 → Performance → Record → Scroll → Stop

# Look for green bars (60 FPS) ✅
# Avoid red bars (< 60 FPS) ❌
```

### Test on Weak Devices

```bash
# DevTools → Performance
CPU: 4x slowdown

# Should still be 30+ FPS
```

---

## 🐛 Common Issues

### Issue: Animations not working

**Solution:** Check import and spread operator

```jsx
import animations from "@/utils/animationConfig";
<motion.div {...animations.fadeInUp} />; // ✅ Correct
```

### Issue: Still laggy on mobile

**Solution:** Use CSS instead of motion

```jsx
// Change from:
<motion.div whileHover={{ scale: 1.05 }}>

// To:
<div className="hover:scale-105 transition-transform duration-200">
```

### Issue: Hover effects don't work

**Solution:** They're disabled on weak devices (intentional)

```jsx
// Check if device is weak
console.log("Weak device:", animations.isWeakDevice);
```

---

## 📱 Responsive Animations

### Different Animations by Screen Size

```jsx
<motion.div
  {...animations.fadeInUp}
  // Override on mobile
  className="md:transform-none" // Disable on desktop if needed
>
```

---

## 🔗 Full Documentation

See `ANIMATION_OPTIMIZATION.md` for complete details.

---

**Quick Checklist:**

- [ ] Imported `animations` config
- [ ] Replaced manual animations with presets
- [ ] Added `viewport={animations.viewportConfig}` to scroll animations
- [ ] Used CSS transitions for simple hovers
- [ ] Disabled complex animations on weak devices
- [ ] Tested on CPU throttled mode
- [ ] Verified 60 FPS on Chrome DevTools
