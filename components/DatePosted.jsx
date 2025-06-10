
'use client'
import { useDispatch, useSelector } from "react-redux";
import { addDatePost } from "@/features/filter/candidateFilterSlice";
import { addDatePostCheck } from "@/features/candidate/candidateSlice";

const DatePosted = () => {
  const { datePost } = useSelector((state) => state.candidate) || {};
  const dispath = useDispatch();

  // date post handler
  const datePostHandler = (e, id) => {
    dispath(addDatePostCheck(id));
    dispath(addDatePost(e.target.value));
  };

  return (
    <ul className="ui-checkbox">
      {datePost?.map((item) => (
        <li key={item.id}>
          <label>
            <input
              value={item.value}
              onChange={(e) => datePostHandler(e, item.id)}
              type="radio"
              checked={item.isChecked}
            />
            <span></span>
            <p>{item.name}</p>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default DatePosted;
