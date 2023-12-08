import TimelineDatePicker from './TimelineDatePicker';
import { render } from '@testing-library/react';
import ReactTestUtils, { act } from 'react-dom/test-utils';

describe('handleDayItemChange', () => {
  jest.useFakeTimers();
  it('should callback correct date when day item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-12-31" onSelectDate={onSelectChange} />,
    );
    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__day-slider'), {
        key: 'ArrowRight',
      });
    });
    jest.runAllTimers();

    expect(onSelectChange).toBeCalledWith('2021-01-01');
    expect(
      timeline.getByTestId('timeline__year-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('2021');
    expect(
      timeline.getByTestId('timeline__month-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('Jan');
    expect(
      timeline.getByTestId('timeline__day-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('1');
  });
});

describe('handleMonthItemChange', () => {
  jest.useFakeTimers();

  it('should callback correct date when month item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-12-01" onSelectDate={onSelectChange} />,
    );

    for (let i = 1; i <= 13; i++) {
      act(() => {
        ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__month-slider'), {
          key: 'ArrowLeft',
        });
      });
    }

    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2019-11-01');
    expect(
      timeline.getByTestId('timeline__year-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('2019');
    expect(
      timeline.getByTestId('timeline__month-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('Nov');
    expect(
      timeline.getByTestId('timeline__day-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('1');
  });

  it('should automatically select last day of month if new month has less days than previous selected day', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-03-31" onSelectDate={onSelectChange} />,
    );

    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__month-slider'), {
        key: 'ArrowLeft',
      });
    });

    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2020-02-29');
    expect(
      timeline.getByTestId('timeline__year-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('2020');
    expect(
      timeline.getByTestId('timeline__month-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('Feb');
    expect(
      timeline.getByTestId('timeline__day-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('29');
  });
});

describe('handleYearItemChange', () => {
  jest.useFakeTimers();
  it('should callback correct date when year item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2000-01-31" onSelectDate={onSelectChange} />,
    );

    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__year-slider'), {
        key: 'ArrowRight',
      });
    });

    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2001-01-31');
    expect(
      timeline.getByTestId('timeline__year-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('2001');
    expect(
      timeline.getByTestId('timeline__month-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('Jan');
    expect(
      timeline.getByTestId('timeline__day-slider').getElementsByClassName('selected-item')[0]
        .textContent,
    ).toBe('31');
  });
});
