import { CreatePlantAction, MovePlantAction, TransformPlantAction } from '../layers/plant/actions';
import useMapStore from '../store/MapStore';
import { SelectionRectAttrs } from '../types/SelectionRectAttrs';
import {
  deselectShapes,
  endSelection,
  selectIntersectingShapes,
  startSelection,
  updateSelection,
} from '../utils/ShapesSelection';
import { handleScroll, handleZoom } from '../utils/StageTransform';
import SimpleButton from '@/components/Button/SimpleButton';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import * as uuid from 'uuid';

interface BaseStageProps {
  zoomable?: boolean;
  scrollable?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  children: React.ReactNode;
}

/**
 * This component is responsible for rendering the base stage that the user is going to draw on.
 *
 * It supports the following features out of the box and are enabled by default:
 *  - Zooming
 *  - Scrolling
 *  - Select & Multi-Select
 *  - Dragging
 */
export const BaseStage = ({
  children,
  zoomable = true,
  scrollable = true,
  selectable = true,
  draggable = true,
}: BaseStageProps) => {
  // Represents the state of the stage
  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  // Represents the state of the current selection rectangle
  const [selectionRectAttrs, setSelectionRectAttrs] = useState<SelectionRectAttrs>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    isVisible: false,
    boundingBox: {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
    },
  });

  // Ref to the transformer
  const trRef = useRef<Konva.Transformer>(null);
  useEffect(() => {
    useMapStore.setState({ transformer: trRef });
  }, [trRef]);

  // https://konvajs.org/docs/react/Access_Konva_Nodes.html
  // Ref to the stage
  const stageRef = useRef<Konva.Stage>(null);

  const executeAction = useMapStore((map) => map.executeAction);
  const step = useMapStore((map) => map.step);
  const historyLength = useMapStore((map) => map.history.length);

  // Event listener responsible for allowing zooming with the ctrl key + mouse wheel
  const onStageWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage === null) return;

    const pointerVector = stage.getPointerPosition();
    if (pointerVector === null) return;

    if (e.evt.ctrlKey) {
      if (zoomable) {
        handleZoom(pointerVector, e.evt.deltaY, stage, setStage);
      }
    } else {
      if (scrollable) {
        handleScroll(e.evt.deltaX, e.evt.deltaY, stage);
      }
    }
  };

  // Event listener responsible for allowing dragging of the stage only with the wheel mouse button
  const onStageDragStart = (e: KonvaEventObject<DragEvent>) => {
    if (e.evt === null || e.evt === undefined) return;
    e.evt.preventDefault();

    const stage = e.target.getStage();
    if (stage === null) return;

    // If the mouse pointer is starting the drag on an element that is not a stage then we don't drag
    // It works for now but there should be a better way since it's a bit wonky
    // Should work better with .draggable(false)
    if (e.evt.buttons) {
      if (e.evt.buttons !== 4 && e.target === stage) {
        stage.stopDrag();
      }
      if (e.evt.buttons === 4 && e.target !== stage) {
        stage.stopDrag();
      }
    }
  };

  // Event listener responsible for updating the selection rectangle
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) return;

    if (e.evt.buttons !== 4) {
      document.body.style.cursor = 'default';
    }

    const stage = e.target.getStage();
    if (stage === null || !selectionRectAttrs.isVisible || !selectable) return;

    updateSelection(stage, setSelectionRectAttrs);
    selectIntersectingShapes(stageRef, trRef);
  };

  // Event listener responsible for positioning the selection rectangle to the current mouse position
  const onStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (e.evt.buttons === 4) {
      document.body.style.cursor = 'grabbing';
    }

    const stage = e.target.getStage();
    if (stage == null || !selectable) return;

    startSelection(stage, setSelectionRectAttrs);
  };

  // Event listener responsible for ending the selection rectangle
  const onStageMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();

    if (!selectable) return;
    endSelection(setSelectionRectAttrs, selectionRectAttrs);
  };

  // Event listener responsible for unselecting shapes when clicking on the stage
  const onStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const isStage = e.target instanceof Konva.Stage;
    const nodeSize = trRef.current?.getNodes().length || 0;
    if (nodeSize > 0 && isStage) {
      deselectShapes(trRef);
    }
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <div className="absolute z-10 flex h-10 items-center gap-2 pl-2 pt-12">
        {/* TODO: This is example code that shows how to interact with the store, the final code handling object creation is TBD */}
        <SimpleButton
          className="w-32"
          onClick={() =>
            executeAction(
              new CreatePlantAction({
                id: uuid.v4(), // The frontend must generate the id for all objects
                layerId: 2,
                plantId: 1,
                x: 100,
                y: 100,
                width: 100,
                height: 100,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
              }),
            )
          }
        >
          CREATE OBJECT
        </SimpleButton>
        <div>
          <div className="whitespace-nowrap text-sm">Step: {step}</div>
          <div className="whitespace-nowrap text-sm">History length: {historyLength}</div>
        </div>
      </div>
      <Stage
        ref={stageRef}
        draggable={draggable}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={onStageWheel}
        onDragStart={onStageDragStart}
        onMouseDown={onStageMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onStageMouseUp}
        onClick={onStageClick}
        scaleX={stage.scale}
        scaleY={stage.scale}
        x={stage.x}
        y={stage.y}
      >
        {children}
        <Layer>
          <Rect
            x={selectionRectAttrs.x}
            y={selectionRectAttrs.y}
            width={selectionRectAttrs.width}
            height={selectionRectAttrs.height}
            fill={'blue'}
            visible={selectionRectAttrs.isVisible}
            opacity={0.2}
            name="selectionRect"
          />
          <Transformer
            // We need to manually disable selection when we are transforming
            onTransformStart={() => {
              selectable = false;
            }}
            onTransformEnd={() => {
              selectable = true;
              const updates = (trRef.current?.getNodes() || []).map((node) => {
                return {
                  id: node.id(),
                  x: node.x(),
                  y: node.y(),
                  rotation: node.rotation(),
                  scaleX: node.scaleX(),
                  scaleY: node.scaleY(),
                };
              });

              executeAction(new TransformPlantAction(updates));
            }}
            onDragEnd={() => {
              const updates = (trRef.current?.getNodes() || []).map((node) => {
                return {
                  id: node.id(),
                  x: node.x(),
                  y: node.y(),
                };
              });

              executeAction(new MovePlantAction(updates));
            }}
            onMouseDown={() => {
              selectable = false;
            }}
            onMouseUp={() => {
              selectable = true;
            }}
            ref={trRef}
            name="transformer"
            anchorSize={8}
            // shouldOverdrawWholeAre allows us to use the whole transformer area for dragging.
            // It's an experimental property so we should keep an eye out for possible issues
            shouldOverdrawWholeArea={true}
          />
        </Layer>
      </Stage>
    </div>
  );
};
