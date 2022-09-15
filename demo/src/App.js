import React, { useEffect, useState } from "react";
import StockQuote from "./components/StockQuote";
import "./App.css";
import { useDispatch } from "react-redux";
import { getallDocs } from "./reduxToolkit/docslice/DocSlice";

function App(props) {
  const dispatch = useDispatch();
  const [ping, setPing] = useState(false);
  useEffect(() => {
    dispatch(getallDocs());
  }, [ping]);
  return (
    <div>
      <StockQuote ping={ping} setPing={setPing} symbol={props.symbol} />
    </div>
  );
}

export default App;
