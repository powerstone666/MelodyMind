import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getLyrics(artist, song, album, year,language) {
  console.log(artist+song+album+year)
  const genAI = new GoogleGenerativeAI(API_KEY);
  console.log(API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp" });

  let prompt = `You are a lyricist. Provide the exact,full lyrics for the song "${song}" by ${artist} and language the song was sung was ${language}. `;

  if (album) {
    prompt += `The song is from the album "${album}". `;
  }
    prompt+=`Ensure there are proper line breaks between each line of the lyrics, and add extra spacing between verses and chorus. Only provide the full song lyrics without any other text or explanations. Make it like:
    sample:In fields of green, where rivers flow,
    A gentle breeze begins to blow.

    Oh, the world unfolds, a vibrant hue,
    With every dawn, dreams start anew.
    Through winding paths, we softly tread,
    Where whispers of the past are spread.
    Oh, the world unfolds, a vibrant hue,
    With every dawn, dreams start anew.
    In moments shared, and stories told, 
    A tapestry of life, in silver and gold.
    Oh, the world unfolds, a vibrant hue,
    With every dawn, dreams start anew.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (text) {
        console.log(text)
      return text;
    }
      else {
      console.error("Error: No lyrics found in the response", response);
      return "Lyrics not found";
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return "Lyrics not found";
  }
}


export async function getSongRecommendations(song, artist) {  
   const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Recommend strictly only 10 songs that are similar in style, genre, or mood to the song "${song}" by ${artist}. 
    Please provide the recommendations in the following format, with comma seperator between the song:
    Song Name - Artist Name ~ Movie Name 
     follow  format strictly dont jumble each part
    Example: 
    "Kun Faya Kun" - "A.R. Rahman" ~ "Rockstar" 
    "Aadat" - "Atif Aslam" ~ "Kalyug" 
    "Tum Se Hi" - "Mohit Chauhan" ~ "Jab We Met" `;
   
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = response.candidates[0].content.parts[0].text;
    
     let recommendationsArray = [];
        if (typeof data === "string") {
          const recommendations = data.split(",").map((item) => item.trim());
    
          recommendations.forEach((rec) => {
           const [songArtist, movie] = rec.split("~").map((part) => part.trim());
            const [song, artist] = songArtist.split("-").map((part) => part.trim());
    
            if (song && artist) {
              recommendationsArray.push({ song, artist, movie: movie});
            }
          });
        }
        console.log(recommendationsArray);
        return recommendationsArray;
      
    
  } catch (error) {
    console.error("Error fetching song recommendations:", error);
    return [];
    }
  }
  