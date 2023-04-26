import { ReactNode, useState, MouseEventHandler, useRef, KeyboardEventHandler } from 'react';

interface SliderProps {
  /** children passed to the slider appear in the Slider */
  children: Array<ReactNode> | ReactNode;
  /** onChange event is triggered whenever the current percentage value of the slider changes */
  onChange: (percentage: number) => void;
}

/**
 * A Slider with a label which can be controlled by dragging, clicking and arrow up/down.
 */
export const NamedSlider = (props: SliderProps) => {
  const [width, setWidth] = useState(0);
  const sliderDivRef = useRef<HTMLDivElement>(null);

  const minWidth = 0;
  const maxWidth = sliderDivRef.current ? sliderDivRef.current.clientWidth : 100;

  const dragHandler: MouseEventHandler = (pointerEvent) => {
    const startWidth = width;
    const startPosition = { x: pointerEvent.pageX, y: pointerEvent.pageY };

    function onMouseMove(pointerEvent: PointerEvent) {
      if (!sliderDivRef.current) return;
      const w = startWidth - startPosition.x + pointerEvent.pageX;
      const newWidth = w > minWidth ? (w < maxWidth ? w : maxWidth) : minWidth;
      const sliderWidth = sliderDivRef.current.clientWidth;
      setWidth(newWidth);
      props.onChange(newWidth / sliderWidth);
    }
    function onMouseUp() {
      document.body.removeEventListener('pointermove', onMouseMove);
    }

    document.body.addEventListener('pointermove', onMouseMove);
    document.body.addEventListener('pointerup', onMouseUp, { once: true });
  };

  const clickHandler: MouseEventHandler = (mouseClickEvent) => {
    if (!sliderDivRef.current) return;
    const offsetLeft = sliderDivRef.current.getBoundingClientRect().left;
    const newWidth = mouseClickEvent.pageX - offsetLeft;
    const sliderWidth = sliderDivRef.current.clientWidth;
    setWidth(newWidth);
    props.onChange(newWidth / sliderWidth);
  };

  const changePercentage = (value: number) => {
    if (!sliderDivRef.current) return 0;
    const sliderWidth = sliderDivRef.current.clientWidth;
    const p = width / sliderWidth + (sliderWidth * value) / sliderWidth;
    const percentage = p > 1 ? 1 : p < 0 ? 0 : p;
    setWidth(percentage * sliderWidth);
    props.onChange(percentage);
  };

  const keyDownHandler: KeyboardEventHandler = (event) => {
    if (event.key === 'j' || event.key === 'ArrowUp') {
      changePercentage(0.05);
    } else if (event.key === 'k' || event.key === 'ArrowDown') {
      changePercentage(-0.05);
    }
  };

  return (
    <div
      className="relative flex h-8 w-full items-center bg-neutral-200 dark:bg-neutral-100-dark"
      tabIndex={0}
      onClick={clickHandler}
      ref={sliderDivRef}
      onKeyDown={keyDownHandler}
    >
      <div className="h-full bg-secondary-400 dark:bg-secondary-600" style={{ width: width }}></div>
      <div
        className="h-full w-[4px] bg-secondary-500 hover:cursor-col-resize"
        onPointerDown={dragHandler}
      ></div>
      <span className="pointer-events-none absolute ml-2 select-none">{props.children}</span>
    </div>
  );
};
