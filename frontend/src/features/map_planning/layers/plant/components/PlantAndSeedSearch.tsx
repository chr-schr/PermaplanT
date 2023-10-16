import { useIsReadOnlyMode } from '../../../utils/ReadOnlyModeContext';
import { usePlantSearch } from '../hooks/usePlantSearch';
import { useSelectPlantForPlanting } from '../hooks/useSelectPlantForPlanting';
import { PlantListItem } from './PlantListItem';
import { PlantsSummaryDto } from '@/api_types/definitions';
import IconButton from '@/components/Button/IconButton';
import SearchInput, { SearchInputHandle } from '@/components/Form/SearchInput';
import { SeedListItem } from '@/features/map_planning/layers/plant/components/SeedListItem';
import { useFindPlantById } from '@/features/map_planning/layers/plant/hooks/useFindPlantById';
import { useSeedSearch } from '@/features/map_planning/layers/plant/hooks/useSeedSearch';
import useMapStore from '@/features/map_planning/store/MapStore';
import { resetSelection } from '@/features/map_planning/utils/ShapesSelection';
import { ReactComponent as CloseIcon } from '@/svg/icons/close.svg';
import { ReactComponent as SearchIcon } from '@/svg/icons/search.svg';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** UI component intended for searching plants that can planted on the plants layer */
export const PlantAndSeedSearch = () => {
  const { plants, actions: plantSearchActions } = usePlantSearch();
  const { seeds, actions: seedSearchActions } = useSeedSearch();
  const { actions } = useSelectPlantForPlanting();

  const isReadOnlyMode = useIsReadOnlyMode();

  const [searchVisible, setSearchVisible] = useState(false);
  const searchInputRef = useRef<SearchInputHandle>(null);
  const { t } = useTranslation(['plantSearch']);

  const clearSearch = () => {
    plantSearchActions.clearSearchTerm();
    seedSearchActions.clearSearchTerm();
    setSearchVisible(false);
  };

  const transformerRef = useMapStore((state) => state.transformer);

  const selectPlantForPlanting = (plant: PlantsSummaryDto) => {
    const storeChosenPlantInUntrackedStore = () => actions.selectPlantForPlanting(plant);

    storeChosenPlantInUntrackedStore();
    resetSelection(transformerRef);
  };

  // We must first load the plant associated to the seed selected by the user
  // before we can be planted on the map.
  const {
    actions: { findPlant: selectSeedForPlanting },
  } = useFindPlantById((plant) => selectPlantForPlanting(plant));

  const handleClickOnPlantListItem = useCallback(selectPlantForPlanting, [actions, transformerRef]);

  const handleClickOnSeedListItem = useCallback(selectSeedForPlanting, [
    actions,
    transformerRef,
    selectSeedForPlanting,
  ]);

  useEffect(() => {
    searchInputRef.current?.focusSearchInputField();
  }, [searchVisible]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h2>{t('plantSearch:planting')}</h2>
        {searchVisible ? (
          <IconButton onClick={clearSearch} data-testid="plant-search-close-icon">
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setSearchVisible(true);
            }}
            data-tourid="search_button"
            data-testid="plant-search-icon"
          >
            <SearchIcon />
          </IconButton>
        )}
      </div>
      <AnimatePresence>
        {searchVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 100,
              transition: { delay: 0, duration: 0.2 },
            }}
            exit={{
              opacity: 0,
              transition: { delay: 0, duration: 0.2 },
            }}
          >
            <SearchInput
              disabled={isReadOnlyMode}
              placeholder={t('plantSearch:placeholder')}
              handleSearch={(event) => {
                plantSearchActions.searchPlants(event.target.value);
                seedSearchActions.searchSeeds(event.target.value);
              }}
              ref={searchInputRef}
              data-testid="plant-search-input"
            ></SearchInput>
            {/* TODO: welcome tour! */}
            <h2 className="mb-2 mt-3 font-medium" hidden={seeds.length === 0}>
              Seeds:
            </h2>
            <ul data-tourid="seed_list" hidden={seeds.length === 0}>
              {seeds.map((seed) => (
                <SeedListItem
                  disabled={isReadOnlyMode}
                  seed={seed}
                  key={seed.id}
                  onClick={() => {
                    if (seed.plant_id) handleClickOnSeedListItem(seed.plant_id);
                  }}
                />
              ))}
            </ul>
            <hr className="my-5" hidden={seeds.length === 0} />
            <h2 className="mb-2 mt-3 font-medium">Plants:</h2>
            <ul data-tourid="plant_list">
              {plants.map((plant) => (
                <PlantListItem
                  disabled={isReadOnlyMode}
                  plant={plant}
                  key={plant.id}
                  onClick={() => {
                    handleClickOnPlantListItem(plant);
                  }}
                />
              ))}
            </ul>
            {plants.length === 0 && (
              <div className="m-4" data-testid="plant-search-results-empty">
                {t('plantSearch:search_empty')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
