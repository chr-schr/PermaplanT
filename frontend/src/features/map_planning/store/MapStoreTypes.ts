import { PlantLayerObjectDto } from '@/bindings/definitions';
import Konva from 'konva';
import { Shape, ShapeConfig } from 'konva/lib/Shape';

export type Action<T, U> = {
  /**
   * Get the reverse action for this action.
   * The reverse action is populated with the current state of the object on the map.
   * @param state The current state of the map.
   * @returns The reverse action or null if the action cannot be reversed.
   */
  reverse(state: TrackedMapState): Action<U, T> | null;

  /**
   * Apply the action to the map state.
   * @param state The current state of the map.
   */
  apply(state: TrackedMapState): TrackedMapState;

  /**
   * Execute the action by informing the backend.
   */
  execute(): Promise<T>;
};

/**
 * Part of store which is affected by the History
 */
export interface TrackedMapSlice {
  trackedState: TrackedMapState;
  step: number;
  history: History;
  canUndo: boolean;
  canRedo: boolean;
  /**
   * The transformer is a reference to the Konva Transformer.
   * It is used to transform selected objects.
   * The transformer is coupled with the selected objects in the trackedState, so it should be here.
   */
  transformer: React.RefObject<Konva.Transformer>;
  /** Event listener responsible for adding a single shape to the transformer */
  addShapeToTransformer: (shape: Shape<ShapeConfig>) => void;
  executeAction: <T, U>(action: Action<T, U>) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * The type of the history.
 */
export type History = Array<Action<unknown, unknown>>;

/**
 * Part of store which is unaffected by the History
 */
export interface UntrackedMapSlice {
  untrackedState: UntrackedMapState;
  updateSelectedLayer: (selectedLayer: LayerName) => void;
  updateLayerVisible: (layerName: LayerName, visible: UntrackedLayerState['visible']) => void;
  updateLayerOpacity: (layerName: LayerName, opacity: UntrackedLayerState['opacity']) => void;
}

/**
 * Utility array of the map layer's names.
 */
export const LAYER_NAMES = [
  'Base',
  'Plant',
  'Drawing',
  'Dimension',
  'Fertilization',
  'Habitats',
  'Hydrology',
  'Infrastructure',
  'Labels',
  'Landscape',
  'Paths',
  'Shade',
  'Soil',
  'Terrain',
  'Trees',
  'Warnings',
  'Winds',
  'Zones',
] as const;

/**
 * A union type of the map layer's names.
 */
export type LayerName = (typeof LAYER_NAMES)[number];

/**
 * The state of a layer's object.
 */
export type ObjectState = {
  index: LayerName;
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};

/**
 * The state of a map's layer.
 */
export type TrackedLayerState = {
  index: LayerName;
  /**
   * The state of the objects on the layer.
   */
  objects: ObjectState[];
};

/**
 * The state of a map's layer.
 */
export type UntrackedLayerState = {
  index: LayerName;
  visible: boolean;
  opacity: number;
};

/**
 * The state of the layers of the map.
 */
export type TrackedLayers = {
  [key in Exclude<LayerName, 'Plant'>]: TrackedLayerState;
} & {
  Plant: TrackedPlantLayerState;
};

export type TrackedPlantLayerState = {
  index: 'Plant';

  objects: PlantLayerObjectDto[];
};

/**
 * The state of the layers of the map.
 */
export type UntrackedLayers = {
  [key in LayerName]: UntrackedLayerState;
};

/**
 * The state of the map tracked by the history.
 */
export type TrackedMapState = {
  layers: TrackedLayers;
};

/**
 * The state of the map untracked by the history.
 */
export type UntrackedMapState = {
  selectedLayer: LayerName;
  layers: UntrackedLayers;
};
