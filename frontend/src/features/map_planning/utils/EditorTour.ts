import { offset } from '@floating-ui/dom';
import i18next from 'i18next';
import { ShepherdOptionsWithType, Tour } from 'react-shepherd';

const t = i18next.t;

const standardButtons = [
  {
    text: t('guidedTour:back'),
    type: 'back',
  },
  {
    text: t('guidedTour:next'),
    type: 'next',
  },
];

const arrowOptions = {
  middleware: [offset(15)],
};

export const mapEditorSteps: ShepherdOptionsWithType[] = [
  {
    id: 'welcome',
    title: t('guidedTour:mapEditor.welcome_title'),
    text: t('guidedTour:mapEditor.welcome_text'),
    buttons: [
      {
        text: t('guidedTour:next'),
        type: 'next',
      },
    ],
  },
  {
    id: 'toolboxIntro',
    title: t('guidedTour:mapEditor.toolbox_intro_title'),
    text: t('guidedTour:mapEditor.toolbox_intro_text'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="toolbox"]',
      on: 'right',
    },
  },
  {
    id: 'layersIntro',
    title: t('guidedTour:mapEditor.layers_intro_title'),
    text: t('guidedTour:mapEditor.layers_intro_text'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="layers"]',
      on: 'left',
    },
  },
  {
    id: 'timelineIntro',
    title: t('guidedTour:mapEditor.timeline_intro_title'),
    text: t('guidedTour:mapEditor.timeline_intro_text'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="timeline"]',
      on: 'top',
    },
  },
  {
    id: 'baseLayerIntro',
    title: `${t('guidedTour:mapEditor.base_layer_title')} (1/2)`,
    text: t('guidedTour:mapEditor.base_layer_intro'),
    buttons: standardButtons,
  },
  {
    id: 'baseLayerToolbar',
    title: `${t('guidedTour:mapEditor.base_layer_title')} (2/2)`,
    text: t('guidedTour:mapEditor.base_layer_toolbar'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="bottom_right_toolbar"]',
      on: 'left',
    },
  },
  {
    id: 'plantsLayerIntro',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (1/16)`,
    text: t('guidedTour:mapEditor.plants_layer_intro'),
    buttons: standardButtons,
  },
  {
    id: 'plantsLayerSelect',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (2/16)`,
    text: t('guidedTour:mapEditor.plants_layer_select'),
    buttons: [
      {
        text: t('guidedTour:back'),
        type: 'back',
      },
    ],
    attachTo: {
      element: '[data-tourid="plants_select"]',
      on: 'left',
    },
    advanceOn: {
      selector: '[data-tourid="plants_select"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerRightToolbar',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (3/16)`,
    text: t('guidedTour:mapEditor.plants_layer_right_toolbar'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="bottom_right_toolbar"]',
      on: 'left',
    },
  },
  {
    id: 'plantsLayerFirstPlantingSearch',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (4/16)`,
    text: t('guidedTour:mapEditor.plants_layer_first_planting_search'),
    attachTo: {
      element: '[data-tourid="search_button"]',
      on: 'left',
    },
    advanceOn: {
      selector: '[data-tourid="search_button"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerFirstPlantingSelect',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (5/16)`,
    text: t('guidedTour:mapEditor.plants_layer_first_planting_select'),
    attachTo: {
      element: '[data-tourid="bottom_right_toolbar"]',
      on: 'left',
    },
    advanceOn: {
      selector: '[data-tourid="plant_list"]',
      event: 'click',
    },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(() => resolve(null), 10);
      });
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerFirstPlantingPlace',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (6/16)`,
    text: t('guidedTour:mapEditor.plants_layer_first_planting_place'),
    attachTo: {
      element: '[data-tourid="canvas"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="canvas"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantLayerChangeDate',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (7/16)`,
    text: t('guidedTour:mapEditor.plants_layer_change_date'),
    attachTo: {
      element: '[data-tourid="date_picker"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="date_picker"]',
      event: 'change',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerSecondPlantingSearch',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (8/16)`,
    text: t('guidedTour:mapEditor.plants_layer_second_planting_search'),
    attachTo: {
      element: '[data-tourid="search_button"]',
      on: 'left',
    },
    advanceOn: {
      selector: '[data-tourid="search_button"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerSecondPlantingSelect',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (9/16)`,
    text: t('guidedTour:mapEditor.plants_layer_second_planting_select'),
    attachTo: {
      element: '[data-tourid="bottom_right_toolbar"]',
      on: 'left',
    },
    advanceOn: {
      selector: '[data-tourid="plant_list"]',
      event: 'click',
    },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(() => resolve(null), 10);
      });
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerSecondPlantingPlace',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (10/16)`,
    text: t('guidedTour:mapEditor.plants_layer_second_planting_place'),
    attachTo: {
      element: '[data-tourid="canvas"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="canvas"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerRelations',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (11/16)`,
    text: t('guidedTour:mapEditor.plants_layer_relations'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="canvas"]',
      on: 'top',
    },
  },
  {
    id: 'plantsLayerPlacementCancel',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (12/16)`,
    text: t('guidedTour:mapEditor.plants_layer_placement_cancel'),
    attachTo: {
      element: '[data-tourid="placement_cancel"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="placement_cancel"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerUndo',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (13/16)`,
    text: t('guidedTour:mapEditor.plants_layer_undo'),
    attachTo: {
      element: '[data-tourid="undo"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="undo"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerPlacedSelect',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (14/16)`,
    text: t('guidedTour:mapEditor.plants_layer_placed_select'),
    attachTo: {
      element: '[data-tourid="canvas"]',
      on: 'top',
    },
    advanceOn: {
      selector: '[data-tourid="canvas"]',
      event: 'selectPlant',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'plantsLayerLeftToolbar',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (15/16)`,
    text: t('guidedTour:mapEditor.plants_layer_left_toolbar'),
    buttons: standardButtons,
    attachTo: {
      element: '[data-tourid="bottom_left_toolbar"]',
      on: 'right',
    },
  },
  {
    id: 'plantsLayerPlantingDelete',
    title: `${t('guidedTour:mapEditor.plants_layer_title')} (16/16)`,
    text: t('guidedTour:mapEditor.plants_layer_delete'),
    attachTo: {
      element: '[data-tourid="planting_delete"]',
      on: 'right',
    },
    advanceOn: {
      selector: '[data-tourid="bottom_left_toolbar"]',
      event: 'click',
    },
    classes: 'action-step',
    canClickTarget: true,
  },
  {
    id: 'congratulations',
    title: t('guidedTour:mapEditor.congratulations_title'),
    text: t('guidedTour:mapEditor.congratulations_text'),
    buttons: [
      {
        text: t('guidedTour:finish'),
        type: 'next',
      },
    ],
  },
];

export const tourOptions: Tour.TourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
    floatingUIOptions: arrowOptions,
    canClickTarget: false,
    highlightClass: 'highlighted',
  },
  useModalOverlay: true,
};
