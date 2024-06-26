import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import SlideDate from "../SlideItem/SlideDate";

import styledCommon from "../../../pages/Book/book.module.css";
import styled from "./StepOne.module.css";
import { setBook } from "../../../store/slice/book";

const BoxDate = () => {
  const dispatch = useDispatch();

  const formatYear = (value) => {
    return new Date(value).getFullYear()
  }
  const formatMonth = (value) => {
    const month = new Date(value).getMonth() + 1;
    return month < 10 ? `0${month}` : month;
  }
  const formatDate = (value) => {
    const date = new Date(value).getDate();
    return date < 10 ? `0${date}` : date;
  }

  const [dates, setDates] = useState([]);

  const [year, setYear] = useState(new Date().getFullYear());

  const yearHandler = (date) => {
    setYear(new Date(date).getFullYear());
  };

  useEffect(() => {
    const DAY = 1000 * 60 * 60 * 24;
    const NOW = new Date().getTime();
    const defaultDates = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(NOW + i * DAY);
      const DayOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
      defaultDates.push({
        id: `${formatYear(date)}-${formatMonth(date)}-${formatDate(date)}`,
        num: date.getDate(),
        txt: DayOfWeek[date.getDay()],
      });
    }

    setDates(defaultDates);
    dispatch(
      setBook({
        step: 'stepOne',
        type: "date",
        data: `${year}-${formatMonth(NOW)}-${formatDate(NOW)}`
      })
    );
  }, []);

  return (
    <div className={styled.box_date}>
      <h3 className={styledCommon.screen_out}>날짜 선택</h3>
      <SlideDate
        list={dates}
        year={year}
        yearHandler={yearHandler}
      />
    </div>
  );
};
export default BoxDate;
