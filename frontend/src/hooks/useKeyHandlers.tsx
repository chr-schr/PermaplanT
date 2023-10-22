import { useEffect } from 'react';

/**
 * Custom React Hook: useKeyHandlers
 *
 * This hook allows you to manage key press event handlers in your React components.
 * It takes a mapping of key names to callback functions, and when a corresponding key is
 * pressed, it triggers the associated callback.
 *
 * @param {Record<string, () => void>} keyHandlerMap - A dictionary where keys are key names
 *     (e.g., 'Enter', 'Escape') and values are callback functions to be executed when the
 *     corresponding key is pressed.
 *
 * @example
 * // Example usage:
 * const handleEnter = () => {
 *   // Do something when 'Enter' key is pressed
 * };
 *
 * const handleEscape = () => {
 *   // Do something when 'Escape' key is pressed
 * };
 *
 * const keyHandlers = {
 *   Enter: handleEnter,
 *   Escape: handleEscape,
 * };
 *
 * function MyComponent() {
 *   useKeyHandlers(keyHandlers);
 *
 *   return (
 *     <div>
 *       // Your component content
 *     </div>
 *   );
 * }
 * */

export function useKeyHandlers(keyHandlerMap: Record<string, () => void>) {
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      const handler = keyHandlerMap[event.key];
      if (handler) {
        handler();
      }
    }

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [keyHandlerMap]);
}