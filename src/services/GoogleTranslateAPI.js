import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY
const API_URL = process.env.React_APP_TRANSLATION_URL


const GoogleTranslateAPI = async (text, targetLanguage) => {
  const response = await axios.post(
    `${API_URL}?key=${API_KEY}`,
    {
      q: text,
      target: targetLanguage,
    }
  );

  return response.data.data.translations[0].translatedText;
};

export default GoogleTranslateAPI;