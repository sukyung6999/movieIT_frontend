import styledCommon from "../../../pages/Book/book.module.css";
import styled from "./StepOne.module.css";
import SlideTime from "../SlideItem/SlideTime";

import TheatersIcon from "@mui/icons-material/Theaters";
import { useFetchUserQuery } from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setBook, setPage } from "../../../store/slice/book";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchSeatsLeftQuery } from "../../../hooks/useSeatsLeft";

const BoxTime = () => {
  const [hour, setHour] = useState(new Date().getHours());
  const hourCondition = new Date().getMinutes() < 50 ? hour : hour + 1;

  const dispatch = useDispatch();
  const { date, movie, theater } = useSelector((state) => state.book.stepOne);
  const { data } = useFetchUserQuery();
  const { data: seatsLeftdata } = useFetchSeatsLeftQuery({
    movieId: movie.id,
    theaterId: theater.id,
    date,
    hour,
    activate: !!(movie.id && theater.id),
  });

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [screenList, setScreenList] = useState([]);

  const [seatLeftList, setSeatLeftList] = useState([]);

  const onChangeHour = (hour) => {
    setHour(hour);
  };

  const handleHourClick = (event) => {
    const screen = event.currentTarget.getAttribute("data-screen");
    const timeStart = event.currentTarget.getAttribute("data-timestart");
    const timeEnd = event.currentTarget.getAttribute("data-timeend");

    dispatch(
      setBook({
        step: "stepOne",
        type: "runningTime",
        data: {
          timeStart,
          timeEnd,
        },
      })
    );

    dispatch(
      setBook({
        step: "stepOne",
        type: "screen",
        data: screen,
      })
    );

    if (data) {
      dispatch(setPage(2));
    }

    navigate("/login", { state: pathname });
  };

  useEffect(() => {
    seatsLeftdata && setSeatLeftList(seatsLeftdata);
  }, [seatsLeftdata]);

  useEffect(() => {
    const nowMinutes = new Date().getMinutes();
    let minutesListLength = 10,
      minutesList = [],
      formatDate = new Date(`${date} ${hour}:00:00`);

    if (new Date() > formatDate && nowMinutes > 10) {
      minutesListLength = (Math.round(nowMinutes / 10) - 1 || 1) * 2;

      minutesList = Array.from({ length: 10 - minutesListLength }).map(
        (_, idx) => {
          return {
            minute: 10 * Math.round(nowMinutes / 10) + idx * 5,
            screen: `컴포트${idx + 1}관`,
          };
        }
      );

      if (movie.id && theater.id) {
        setSeatLeftList((prev) => {
          if (prev.length > 10 - minutesListLength) {
            return [...prev].slice(minutesListLength);
          }

          return prev;
        });
      } 
    } else {
      minutesList = Array.from({ length: minutesListLength }).map((_, idx) => {
        return {
          minute: 10 + idx * 5,
          screen: `컴포트${idx + 1}관`,
        };
      });

      setSeatLeftList(seatsLeftdata);
    }
    setScreenList(minutesList);
  }, [seatsLeftdata, date]);

  return (
    <div className={styled.box_time}>
      <h3 className={styledCommon.tit_box}>
        시간<span className={styledCommon.screen_out}>선택</span>
      </h3>
      <SlideTime moveX={35} hour={hourCondition} onChangeHour={onChangeHour} />
      {!(movie.txt && theater.txt) ? (
        <div className={styled.area_empty}>
          <TheatersIcon fontSize="large" color="disabled" />
          <p>
            영화와 극장을 선택하시면
            <br />
            상영시간표를 비교하여 볼 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className={`${styled.list_movies} ${styledCommon.scroll}`}>
          {screenList.map((ele, idx) => {
            return (
              <li key={"hour" + idx}>
                <button
                  type="button"
                  data-screen={ele.screen}
                  data-timestart={`${hourCondition}:${ele.minute}`}
                  data-timeend={`${hourCondition + 2}:${ele.minute}`}
                  onClick={handleHourClick}
                >
                  <div className={styled.item_time}>
                    <span className={styled.emph_time}>
                      {hourCondition} : {ele.minute}
                    </span>
                    <div className={styled.txt_time}>
                      ~ {hourCondition + 2} : {ele.minute}
                    </div>
                  </div>
                  <div className={styled.item_tit}>
                    <strong className={styled.txt_tit}>{movie.txt}</strong>
                    <span className={styled.txt_desc}>2D (자막)</span>
                  </div>
                  <div className={styled.item_info}>
                    <span className={styled.txt_theater}>
                      {theater.txt}
                      <br /> {ele.screen}
                    </span>
                    <span className={styled.wrap_seat}>
                      <span className={styled.num_left}>
                      {seatLeftList ? 440 - seatLeftList[idx] : 440}
                      </span>
                      /<span className={styled.num_total}>440</span>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
export default BoxTime;
