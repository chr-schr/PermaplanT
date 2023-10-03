import PaginatedSelectMenu, {
  PageAdditionalInfo,
} from '../../../components/Form/PaginatedSelectMenu';
import SelectMenu from '../../../components/Form/SelectMenu';
import { searchPlants } from '../api/searchPlants';
import { NewSeedDto, Quality, Quantity, SeedDto } from '@/bindings/definitions';
import SimpleButton, { ButtonVariant } from '@/components/Button/SimpleButton';
import { SelectOption } from '@/components/Form/SelectMenuTypes';
import SimpleFormInput from '@/components/Form/SimpleFormInput';
import SimpleFormTextArea from '@/components/Form/SimpleFormTextArea';
import { findPlantById } from '@/features/seeds/api/findPlantById';
import { enumToSelectOptionArr } from '@/utils/enum';
import { partialPlantName } from '@/utils/plantName';
import { useTranslatedQuality, useTranslatedQuantity } from '@/utils/translated-enums';
import { Suspense, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { LoadOptions } from 'react-select-async-paginate';

/** Options for CreateSeedForm */
interface CreateSeedFormProps {
  isUploadingSeed: boolean;
  /** If you want to modify a seed instead of creating a new one, you can submit it here. */
  existingSeed?: SeedDto;
  /** Text displayed on the form submit button. */
  submitButtonTitle: string;
  /** Callback for the cancel button. */
  onCancel: () => void;
  /** Callback for any modification of form inputs. */
  onChange: () => void;
  /** Callback for the submit button. */
  onSubmit: (newSeed: NewSeedDto) => void;
}

const CreateSeedForm = ({
  isUploadingSeed,
  existingSeed,
  submitButtonTitle,
  onCancel,
  onChange,
  onSubmit,
}: CreateSeedFormProps) => {
  const { t } = useTranslation(['common', 'seeds', 'enums']);

  const translatedQuality = useTranslatedQuality();
  const translatedQuantity = useTranslatedQuantity();

  const quality: SelectOption[] = enumToSelectOptionArr(Quality, translatedQuality).reverse();
  const quantity: SelectOption[] = enumToSelectOptionArr(Quantity, translatedQuantity).reverse();

  const currentYear = new Date().getFullYear();

  const { register, handleSubmit, control, setValue } = useForm<NewSeedDto>();

  // SelectMenu components can't automatically convert from values to select options.
  // We work around this by managing the necessary state ourselves.
  const [plantOption, setPlantOption] = useState<SelectOption | undefined>(undefined);
  const [quantityOption, setQuantityOption] = useState<SelectOption | undefined>(quantity[0]);
  const [qualityOption, setQualityOption] = useState<SelectOption | undefined>(quality[0]);

  useEffect(
    () => {
      // Makes sure that the default select values are stored in the form data..
      const currentQuantity = quantityOption?.value as Quantity;
      const currentQuality = qualityOption?.value as Quality;
      setValue('quantity', currentQuantity);
      setValue('quality', currentQuality);

      if (existingSeed) {
        setValue('harvest_year', existingSeed?.harvest_year);
        setValue('name', existingSeed?.name);
        setValue('generation', existingSeed?.generation);
        setValue('origin', existingSeed?.origin);
        setValue('taste', existingSeed?.taste);
        setValue('yield_', existingSeed?.yield_);
        setValue('use_by', existingSeed?.use_by);
        setValue('price', existingSeed.price === undefined ? undefined : existingSeed.price / 100);
        setValue('quality', existingSeed?.quality);
        setValue('quantity', existingSeed?.quantity);
        setValue('notes', existingSeed?.notes);
        setValue('plant_id', existingSeed?.plant_id);

        // Convert existing values to select menu options.
        if (existingSeed.plant_id) loadInitialPlant(existingSeed.plant_id);
        setQuantityOption(quantity.filter((x) => x.value === existingSeed?.quantity)[0]);
        setQualityOption(quality.filter((x) => x.value === existingSeed?.quality)[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [existingSeed, setValue],
  );

  const onFormSubmit: SubmitHandler<NewSeedDto> = async (data) => {
    if (data.origin === '') delete data.origin;
    if (data.taste === '') delete data.taste;
    if (data.yield_ === '') delete data.yield_;
    if (data.use_by === '') delete data.use_by;
    if (Number.isNaN(data.generation)) delete data.generation;
    if (Number.isNaN(data.price)) delete data.price;
    if (data.use_by) {
      // Change the date to YYYY-MM-DD format so it can be parsed by the backend
      data.use_by = new Date(String(data.use_by)).toISOString().split('T')[0];
    }

    onSubmit({
      ...data,
      price: data.price === undefined ? undefined : data.price * 100,
    });
  };

  /** calls searchPlants and creates options for the select input */
  const loadPlants: LoadOptions<SelectOption, GroupBase<SelectOption>, PageAdditionalInfo> = async (
    inputValue: string,
    options: OptionsOrGroups<SelectOption, GroupBase<SelectOption>>,
    additional: PageAdditionalInfo | undefined,
  ) => {
    const pageNumber = additional ? additional.pageNumber : 1;
    const page = await searchPlants(inputValue, pageNumber);

    const plant_options: SelectOption[] = page.results.map((plant) => {
      return {
        value: plant.id,
        label: partialPlantName(plant),
      };
    });

    return {
      options: plant_options,
      hasMore: page.total_pages > pageNumber,
      additional: {
        pageNumber: pageNumber + 1,
      },
    };
  };

  /**
   *  Convert a plantId into an option for PaginatedSelectMenu.
   *  @param plantId The id that will be converted.
   */
  const loadInitialPlant = async (plantId: number) => {
    const plant = await findPlantById(plantId);
    const common_name_en = plant.common_name_en ? ' (' + plant.common_name_en[0] + ')' : '';

    setPlantOption({
      value: plant.id,
      label: plant.unique_name + common_name_en,
    });
  };

  return (
    <Suspense>
      <div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-6 grid gap-8 md:grid-cols-2">
            <PaginatedSelectMenu<NewSeedDto, SelectOption, false>
              id="plant_id"
              control={control}
              labelText={t('seeds:binomial_name')}
              placeholder={t('seeds:create_seed_form.placeholder_binomial_name')}
              required={true}
              loadOptions={loadPlants}
              value={plantOption}
              handleOptionsChange={(option) => {
                if (!option) {
                  setValue('plant_id', undefined);
                } else {
                  const temp = option as SelectOption;
                  const mapped = temp.value as number;
                  setValue('plant_id', mapped);
                }
                setPlantOption(option as SelectOption);
              }}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:additional_name')}
              placeholder=""
              required={true}
              id="name"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              type="number"
              labelText={t('seeds:harvest_year')}
              defaultValue={currentYear}
              placeholder={currentYear.toString()}
              required={true}
              id="harvest_year"
              register={register}
              onChange={onChange}
            />
            <SelectMenu
              id="quantity"
              control={control}
              options={quantity}
              labelText={t('seeds:quantity')}
              placeholder={t('enums:Quantity.Enough')}
              value={quantityOption}
              required={true}
              handleOptionsChange={(option) => {
                const temp = option as SelectOption;
                const mapped = temp.value as Quantity;
                setValue('quantity', mapped);
                setQuantityOption(option as SelectOption);
              }}
              isClearable={false}
              onChange={onChange}
            />
            <SimpleFormInput
              type="date"
              labelText={t('seeds:use_by')}
              placeholder=""
              id="use_by"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:origin')}
              placeholder={t('seeds:create_seed_form.placeholder_origin')}
              id="origin"
              register={register}
              onChange={onChange}
            />
            <SelectMenu
              id="quality"
              control={control}
              options={quality}
              labelText={t('seeds:quality')}
              placeholder={t('enums:Quality.Organic')}
              value={qualityOption}
              handleOptionsChange={(option) => {
                const temp = option as SelectOption;
                const mapped = temp.value as Quality;
                setValue('quality', mapped);
                setQualityOption(option as SelectOption);
              }}
              isClearable={false}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:taste')}
              placeholder={t('seeds:create_seed_form.placeholder_taste')}
              id="taste"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:yield')}
              placeholder={t('seeds:create_seed_form.placeholder_yield')}
              id="yield_"
              register={register}
              onChange={onChange}
            />
            <SimpleFormInput
              labelText={t('seeds:price')}
              placeholder={t('seeds:create_seed_form.placeholder_price')}
              id="price"
              register={register}
              valueAsNumber={true}
              errorTitle={t('seeds:create_seed_form.error_price_must_be_number')}
              onChange={onChange}
              min={0}
              max={327.0 /* The backend won't accept any number higher than this. */}
              type="number"
              step="0.01"
            />
            <SimpleFormInput
              type="number"
              min={0}
              labelText={t('seeds:generation')}
              placeholder={t('seeds:create_seed_form.placeholder_generation')}
              id="generation"
              register={register}
              onChange={onChange}
            />
          </div>
          <div className="mb-6">
            <SimpleFormTextArea
              type="textarea"
              labelText={t('seeds:notes')}
              placeholder="..."
              id="notes"
              register={register}
              onChange={onChange}
            />
          </div>
          <div className="flex flex-row justify-between space-x-4">
            <SimpleButton
              type="button"
              onClick={onCancel}
              className="max-w-[240px] grow sm:w-auto"
              variant={ButtonVariant.secondaryBase}
            >
              {t('common:cancel')}
            </SimpleButton>
            <SimpleButton
              title={submitButtonTitle}
              type="submit"
              className="max-w-[240px] grow sm:w-auto"
            >
              {submitButtonTitle}
              {isUploadingSeed && (
                <svg
                  className="ml-4 inline-block h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </SimpleButton>
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default CreateSeedForm;
