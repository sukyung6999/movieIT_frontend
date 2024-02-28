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

const BoxSeat = () => {
  const dispatch = useDispatch();

  const {totalNum, selectedSeats} = useSelector(state => state.book.stepTwo);

  const [count, setCount] = useState({
    adult: 0,
    teenager: 0,
    senior: 0,
    challenged: 0,
  });

  useEffect(() => {
    const total = count.adult + count.teenager + count.senior + count.challenged;

    dispatch(setBook({ step: "stepTwo", type: "totalNum", data: total }));
  }, [count]);

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
    setCount((prev) => {
      return {
        ...prev,
        [id]: prev[id] > 0 ? prev[id] - 1 : 0,
      };
    });

    if (totalNum <= selectedSeats.length) {
      if (confirm('선택하신 좌석을 모두 취소하고 다시 선택하시겠습니까?')) { 
        setCount({
          adult: 0,
          teenager: 0,
          senior: 0,
          challenged: 0,
        });
        dispatch(setBook({ step: "stepTwo", type: "selectedSeats", data: [] }));
        dispatch(setBook({ step: "stepTwo", type: "seatCategory", data: {adult: 0, teenager: 0, senior: 0, challenged: 0} }));
      }
    }
    dispatch(setMinusCate({ step: "stepTwo", type: "seatCategory", dataId: id}))
  };

  const handleResetCount = () => {
    setCount({
      adult: 0,
      teenager: 0,
      senior: 0,
      challenged: 0,
    });

    dispatch(setBook({ step: "stepTwo", type: "selectedSeats", data: [] }));
    dispatch(setBook({ step: "stepTwo", type: "seatCategory", data: {adult: 0, teenager: 0, senior: 0, challenged: 0} }));
  };

  useEffect(() => {
    return () => {
      dispatch(setBook({ step: "stepTwo", type: "selectedSeats", data: [] }));

      dispatch(setBook({ step: "stepTwo", type: "seatCategory", data: {adult: 0, teenager: 0, senior: 0, challenged: 0} }));
    };
  }, []);

  return (
    <div className={styled.wrap_seat}>
      <div className={styled.head_book}>
        <h4>관람인원선택</h4>
        <button type="button" onClick={handleResetCount}>
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
        <SelectItem
          id="teenager"
          label="청소년"
          count={count}
          onAddCount={onAddCount}
          onMinusCount={onMinusCount}
        />
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
        style={{ overflowY: totalNum ? "hidden" : "scroll" }}
      >
        {totalNum === 0 && <SeatDimmed />}
        <SeatArrange />
      </div>
    </div>
  );
};
export default BoxSeat;