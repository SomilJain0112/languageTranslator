import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import GoogleTranslateAPI from "../../services/GoogleTranslateAPI.js";
import "./style.css";
import TextToSpeech from "../TextToSpeech/TextToSpeech.js";

const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_LIST_LANGUAGES;

const SpeechToText = () => {
  const [languages, setLanguages] = useState([]);
  const [translatingText, setTranslatingText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [speechRecognitionLanguage, setSpeechRecognitionLanguage] = useState("");

  // This useEffect hook will fetch all possible languages in which client can receive input or output
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}?key=${API_KEY}`);
        setLanguages(response.data.data.languages);
      } catch (error) {
        console.error("Error fetching Languages :", error);
      }
    };
    fetchData();
  }, []);

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // For copy text to clipboard
  const [isLeftCopied, setLeftCopied] = useClipboard(transcript, { successDuration: 1000 });
  const [isRightCopied, setRightCopied] = useClipboard(translatingText, { successDuration: 1000 });

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: speechRecognitionLanguage });

  // This function will translate the transcript into targetLanguage
  const handleTranslate = async () => {
    if (transcript) {
      const translatedText = await GoogleTranslateAPI(transcript, targetLanguage);
      setTranslatingText(translatedText);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="firstdiv">
      <h1 className="h1div">Language Translator</h1>
      <br />
      <div className="div2">
        <div className="leftDiv">
          <select value={speechRecognitionLanguage} onChange={(e) => setSpeechRecognitionLanguage(e.target.value)}>
            <option value="">--Please choose an option--</option>
            {languages.map((language, index) => (
              <option key={index} value={language.language}>{new Intl.DisplayNames(["en"], { type: "language" }).of(language.language)}</option>
            ))}
          </select>
          <button className="copyButton" onClick={setLeftCopied}>{isLeftCopied ? "Copied!" : "Copy"}</button>
          <br />
          {transcript}
          <br />
          <div className="buttonDiv">
            <button className="buttonCSS" onClick={startListening}>Start Listening</button>
            <button className="buttonCSS" onClick={SpeechRecognition.stopListening}>Stop Listening</button>
          </div>
        </div>
        <div className="rightDiv">
          <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
            <option value="">--Please choose an option--</option>
            {languages.map((language, index) => (
              <option key={index} value={language.language}>{new Intl.DisplayNames(["en"], { type: "language" }).of(language.language)}</option>
            ))}
          </select>
          <button onClick={handleTranslate}>Translate</button>
          <button className="copyButton" onClick={setRightCopied}>{isRightCopied ? "Copied!" : "Copy"}</button>
          <br />
          {translatingText}
          <br />
          <TextToSpeech className="rightdivButtons" text={translatingText} languageCode={targetLanguage} />
        </div>
      </div>
      <br />
    </div>
  );
};

export default SpeechToText;
