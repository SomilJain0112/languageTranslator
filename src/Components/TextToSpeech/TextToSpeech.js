import React, { useState, useEffect } from "react";
import "./style.css";

const TextToSpeech = ({ text, languageCode }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = languageCode;
    setUtterance(u);

    return () => synth.cancel();
  }, [text, languageCode]);

  useEffect(() => {
    if (!utterance) return;
    const synth = window.speechSynthesis;

    const onEnd = () => setIsPaused(false);
    synth.addEventListener("end", onEnd);

    return () => synth.removeEventListener("end", onEnd);
  }, [utterance]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    isPaused ? synth.resume() : synth.speak(utterance);
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
  };

  return (
    <div className="outerdiv">
      <button className="buttonCSS" onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
      <button className="buttonCSS" onClick={handlePause}>Pause</button>
      <button className="buttonCSS" onClick={handleStop}>Stop</button>
    </div>
  );
};

export default TextToSpeech;
