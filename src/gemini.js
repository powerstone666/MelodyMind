import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY1;

export async function getLyrics(artist, song, album, year,language) {
  
  const genAI = new GoogleGenerativeAI(API_KEY);
 
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

const API_KEY2 = import.meta.env.VITE_GEMINI_API_KEY2;
export async function getSongRecommendations(song, artist) {    // Validate inputs
  if (!song || !artist || song === 'undefined' || artist === 'undefined' || 
      typeof song !== 'string' || typeof artist !== 'string') {
    console.error("Invalid song or artist provided to recommendation API:", { song, artist });
    return [];
  }
  
  // Trim any whitespace
  const trimmedSong = song.trim();
  const trimmedArtist = artist.trim();
  
  // Further validation
  if (trimmedSong.length < 2 || trimmedArtist.length < 2) {
    console.error("Song or artist name too short:", { song: trimmedSong, artist: trimmedArtist });
    return [];
  }
  
  const genAI = new GoogleGenerativeAI(API_KEY2);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `Recommend strictly only 10 songs that are similar in style, genre, or mood to the song "${trimmedSong}" by ${trimmedArtist}. 
    Please provide the recommendations in the following format, with comma seperator between the song:
    Song Name - Artist Name ~ Movie Name 
     follow  format strictly dont jumble each part
    Example: 
    "Kun Faya Kun" - "A.R. Rahman" ~ "Rockstar" 
    "Aadat" - "Atif Aslam" ~ "Kalyug" 
    "Tum Se Hi" - "Mohit Chauhan" ~ "Jab We Met" `;  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = response.candidates[0].content.parts[0].text;
    
     let recommendationsArray = [];
        if (typeof data === "string") {
          const recommendations = data.split(",").map((item) => item.trim());
    
          recommendations.forEach((rec) => {
           const [songArtist, movie] = rec.split("~").map((part) => part.trim());
            let [song, artist] = songArtist.split("-").map((part) => part.trim());
            
            // Remove quotes from song and artist names
            if (song) {
              song = song.replace(/^["'](.*)["']$/, '$1'); // Remove surrounding quotes
            }
            
            if (artist) {
              artist = artist.replace(/^["'](.*)["']$/, '$1'); // Remove surrounding quotes
            }
            
            // Remove quotes from movie name if present
            let cleanedMovie = movie;
            if (cleanedMovie) {
              cleanedMovie = cleanedMovie.replace(/^["'](.*)["']$/, '$1');
            }            if (song && artist) {
              recommendationsArray.push({ song, artist, movie: cleanedMovie });
            }
          });
        }
        return recommendationsArray;
      
    
  } catch (error) {
    console.error("Error fetching song recommendations:", error);
    return [];
    }
  }
  