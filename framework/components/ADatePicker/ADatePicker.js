import PropTypes from "prop-types";
import React, {forwardRef, useMemo, useState} from "react";

import AButton from "../AButton";
import AIcon from "../AIcon";
import {
  isDateBetweenRange,
  isDateTipOfRange,
  isSameDate,
  sortDates } from "./helpers";
import "./ADatePicker.scss";

const fullMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const getInitialCalendarSelection = (value) => {
  const isRange = Array.isArray(value);

  if (!isRange) {
    return value;
  }

  // If range has a Date object, use the latest one
  // to initialize the calendar UI
  const dates = value.filter(d => d instanceof Date);
  if (!dates.length) {
    return new Date();
  }
  return sortDates(dates)[dates.length - 1];
}

const ADatePicker = forwardRef(
  ({className: propsClassName, onChange, value = new Date(), ...rest}, ref) => {
    const isRange = Array.isArray(value);
    const [calendarDate, setCalendarDate] = useState(() => getInitialCalendarSelection(value));
    const firstCalendarDate = useMemo(() => {
      let currDate = new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() - calendarDate.getDay()
      );

      while (
        currDate.getFullYear() >= calendarDate.getFullYear() &&
        currDate.getMonth() >= calendarDate.getMonth() &&
        currDate.getDate() > 1
      ) {
        currDate.setDate(currDate.getDate() - 7);
      }

      return currDate;
    }, [calendarDate]);
    let className = "a-date-picker";

    if (propsClassName) {
      className += ` ${propsClassName}`;
    }

    return (
      <div {...rest} ref={ref} className={className}>
        <div className="a-date-picker__header">
          <AButton
            tertiaryAlt
            icon
            className="a-date-picker__prev"
            onClick={() => {
              setCalendarDate(
                new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1)
              );
            }}>
            <AIcon size={13.6}>chevron-left</AIcon>
          </AButton>
          <AButton
            tertiaryAlt
            icon
            className="a-date-picker__next"
            onClick={() => {
              setCalendarDate(
                new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1)
              );
            }}>
            <AIcon size={13.6}>chevron-right</AIcon>
          </AButton>
          <div className="a-date-picker__title">
            <span className="a-date-picker__month">
              {fullMonthNames[calendarDate.getMonth()]}
            </span>{" "}
            <span className="a-date-picker__year">
              {calendarDate.getFullYear()}
            </span>
          </div>
        </div>
        <table className="a-date-picker__calendar">
          <thead>
            <tr>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Sunday">Su</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Monday">Mo</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Tuesday">Tu</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Wednesday">We</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Thursday">Th</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Friday">Fr</span>
              </th>
              <th className="a-date-picker__week" scope="col">
                <span aria-label="Saturday">Sa</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((x, i) => {
              const sunday = new Date(+firstCalendarDate);
              sunday.setDate(sunday.getDate() + i * 7);
              return (
                <tr key={i}>
                  {[...Array(7)].map((y, j) => {
                    const currWeekDay = new Date(+sunday);
                    currWeekDay.setDate(currWeekDay.getDate() + j);
                    const isDisabled = currWeekDay.getMonth() !== calendarDate.getMonth();
                    const isSelected = isRange ?
                      isDateTipOfRange(currWeekDay, value) :
                      isSameDate(currWeekDay, value);
                    const isBetweenRange = isRange && isDateBetweenRange(currWeekDay, value);
                    return (
                      <td
                        key={j}
                        className={`a-date-picker__day
                          ${isDisabled ? " disabled" : ""}
                          ${isSelected ? " selected" : ""}
                          ${isBetweenRange ? " between" : ""}`}
                      >
                        {isDisabled ? (
                          currWeekDay.getDate()
                        ) : (
                          <button
                            type="button"
                            className="a-date-picker__day__label"
                            onClick={() => {
                              onChange && onChange(currWeekDay);
                            }}>
                            {currWeekDay.getDate()}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
);

const isValidDateTuple = (range) => {
  const isArray = Array.isArray(range);
  const isValidTypes = isArray && range.every(value => value instanceof Date || value === null);
  const isValidLength = isValidTypes && range.length <= 2;
  return isArray && isValidDateTuple && isValidLength;
};

function rangeTupleValidator(propValue, key, componentName) {
  if (!isValidDateTuple(propValue)) {
    throw new Error(
      "Invalid prop 'value' supplied to '" + componentName + "'. "
      + "When using a range, pass a tuple indicting a start and end "
      + "date, or 'null' if empty."   
    )
  }
  return null;
}

ADatePicker.propTypes = {
  /**
   * Handles the `change` event for when a date is selected.
   */
  onChange: PropTypes.func,
  /**
   * Sets the selected date(s). If selecting a single date, a JavaScript
   * `Date` object should be passed. If selecting a date range, however,
   * then a two-item array should be supplied representing the starting
   * date and ending date. If either the starting date or ending date is
   * not yet selected, you should pass in the date as `null`.
   * @example supplying the starting date with an unselected ending date
   * value={[new Date(2022, 2, 28), null]}
   */
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(rangeTupleValidator),
  ])
};

ADatePicker.displayName = "ADatePicker";

export default ADatePicker;
