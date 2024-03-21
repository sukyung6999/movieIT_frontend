import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SelectItem from "../CommonItem/SelectItem";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setAddCate, setMinusCate } from "../../../store/slice/book";
import styledCommon from "../../../pages/Book/book.module.css";
import styled from "./StepTwo.module.css";
import SeatArrange from "../SeatItem/SeatArrange";
import SeatDimmed from "../SeatItem/SeatDimmed";
import { setAlert } from "../../../store/slice/alert";
import { useFetchSeatsOccupiedQuery } from "../../../hooks/useSeatsOccupied";

const BoxSeat = () => {
  const [occupiedSeatsList, setoOccupiedSeatsList] = useState(['F14', 'F15']);

  const dispatch = useDispatch();

  const {rating, theater, movie, date, runningTime} = useSelector(state => state.book.stepOne);
  const {totalNum, selectedSeats} = useSelector(state => state.book.stepTwo);

  const [count, setCount] = useState({
    adult: 0,
    teenager: 0,
    senior: 0,
    challenged: 0,
  });

  const resetCountsAndSeats = () => {
    setCount({
      adult: 0,
      teenager: 0,
      senior: 0,
      challenged: 0,
    });

    dispatch(setBook({ step: "stepTwo", type: "selectedSeats", data: [] }));
    dispatch(setBook({ step: "stepTwo", type: "seatCategory", data: {adult: 0, teenager: 0, senior: 0, challenged: 0} }));
  };

  const {data: occupiedSeats} = useFetchSeatsOccupiedQuery({
    movieId: movie.id,
    theaterId: theater.id,
    date: date.slice(0,10) + ' '  + runningTime.timeStart,
    activate: !!(movie.id && theater.id)
  });

  useEffect(() => {
    occupiedSeats && setoOccupiedSeatsList(occupiedSeats);
  }, [occupiedSeats]);

  useEffect(() => {
    const total = count.adult + count.teenager + count.senior + count.challenged;

    dispatch(setBook({ step: "stepTwo", type: "totalNum", data: total }));
  }, [count])

  const onAddCount = (id) => {
    if (totalNum >= 8) {
      dispatch(setAlert({
        open: true,
        title: '인원선택은 총 8명까지 가능합니다.',
        btnList: [{autoFocus: true, txt: '확인'}]
      }))
      return;
    }

    setCount((prev) => {
      return {
        ...prev,
        [id]: prev[id] < 8 ? prev[id] + 1 : 8,
      };
    });

    dispatch(setAddCate({ step: "stepTwo", type: "seatCategory", dataId: id}))
  };

  const onMinusCount = (id) => {

    if (totalNum <= selectedSeats.length) {
      if (confirm('선택하신 좌석을 모두 취소하고 다시 선택하시겠습니까?')) { 
        resetCountsAndSeats();
        return;
      } else {
        return 
      }
    }

    setCount((prev) => {
      return {
        ...prev,
        [id]: prev[id] > 0 ? prev[id] - 1 : 0,
      };
    });
    dispatch(setMinusCate({ step: "stepTwo", type: "seatCategory", dataId: id}))
  };

  
  useEffect(() => {
    return () => {
      resetCountsAndSeats();
    };
  }, []);

  return (
    <div className={styled.wrap_seat}>
      <div className={styled.head_book}>
        <h4>관람인원선택</h4>
        <button type="button" onClick={resetCountsAndSeats}>
          <RestartAltIcon fontSize="small">이전</RestartAltIcon>초기화
        </button>
      </div>
      <div className={styled.box_select}>
        <SelectItem
          id="adult"
          label="성인"
          count={count}
          onAddCount={onAddCount}
          onMinusCount={onMinusCount}
        />
        {rating !== '18' && <SelectItem
          id="teenager"
          label="청소년"
          count={count}
          onAddCount={onAddCount}
          onMinusCount={onMinusCount}
        />}
        <SelectItem
          id="senior"
          label="경로"
          count={count}
          onAddCount={onAddCount}
          onMinusCount={onMinusCount}
        />
        <SelectItem
          id="challenged"
          label="우대"
          count={count}
          onAddCount={onAddCount}
          onMinusCount={onMinusCount}
        />
      </div>
      <div
        className={`${styled.box_seat} ${styledCommon.scroll}`}
        style={{ overflowY: totalNum ? "scroll" : "hidden" }}
      >
        {totalNum === 0 && <SeatDimmed />}
        <SeatArrange occupiedSeatsList={occupiedSeatsList} />
      </div>
    </div>
  );
};
export default BoxSeat;
