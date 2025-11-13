/**
 * Class Name utility (cn)
 *
 * A lightweight utility for conditionally joining classNames together.
 * Similar to clsx/classnames but without external dependencies.
 *
 * @param {...(string|Object|Array|undefined|null|boolean)} args - Class names to combine
 * @returns {string} Combined class names
 *
 * @example
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', { bar: true }) // 'foo bar'
 * cn('foo', { bar: false }) // 'foo'
 * cn('foo', ['bar', 'baz']) // 'foo bar baz'
 * cn('foo', null, undefined, 'bar') // 'foo bar'
 */
export function cn(...args) {
  const classes = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Skip falsy values (null, undefined, false, 0, '')
    if (!arg) continue;

    const argType = typeof arg;

    // String or number
    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    }
    // Object (conditional classes)
    else if (argType === 'object') {
      // Array
      if (Array.isArray(arg)) {
        // Recursively handle arrays
        const inner = cn(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
      // Plain object
      else {
        for (const key in arg) {
          // Only add class if value is truthy
          if (arg[key]) {
            classes.push(key);
          }
        }
      }
    }
  }

  return classes.join(' ');
}

export default cn;
