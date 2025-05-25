import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY1;

export async function getLyrics(artist, song, album, year,language) {
  
  const genAI = new GoogleGenerativeAI(API_KEY);
 
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
export async function getSongRecommendations(song, artist, historySummary = [], forceNew = false) {    // Validate inputs
  if (!song || !artist || song === 'undefined' || artist === 'undefined' || 
      typeof song !== 'string' || typeof artist !== 'string') {
 
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
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Consider using a model that might be better for nuanced understanding if needed

  let prompt = `You are a music recommendation expert. Recommend strictly 10 songs similar to "${trimmedSong}" by ${trimmedArtist}. 
Consider the potential tone, emotions, and genre of the input song.`;

  if (historySummary && historySummary.length > 0) {
    prompt += `\n\nThe user has recently listened to the following songs (most recent first):\n`;
    historySummary.forEach(histSong => {
      prompt += `- "${histSong.name}" by ${histSong.artists}\n`;
    });
    prompt += `\nPlease provide recommendations that complement this listening history, 
weighting towards similar tones and emotions, while trying to avoid direct duplicates from this recent history. 
If the history suggests a certain mood (e.g., upbeat, melancholic, energetic), try to align recommendations with that, unless the primary song ("${trimmedSong}") strongly contrasts it.`;
  }
  
  if (forceNew) {
    prompt += `\nProvide a fresh set of recommendations, distinct from any previous suggestions for this song if possible.`;
  }

  prompt += `\n\nPlease provide the recommendations ONLY in the following strict format, with each song on a new line, and parts separated by " - " and " ~ ":
Song Name - Artist Name ~ Movie Name (if applicable, otherwise omit the " ~ Movie Name" part)

Example:
"Kun Faya Kun" - "A.R. Rahman" ~ "Rockstar"
"Aadat" - "Atif Aslam" ~ "Kalyug"
"Namo Namo" - "Amit Trivedi"
"Let It Be" - "The Beatles"

Do NOT include any other text, numbering, or explanations.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Check if candidates and parts exist before accessing them
    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0]) {
        console.error("Unexpected response structure from Gemini:", response);
        return [];
    }
    const data = response.candidates[0].content.parts[0].text;
    
     let recommendationsArray = [];
        if (typeof data === "string") {
          // Split by newline, as each recommendation is expected on a new line
          const recommendations = data.split('\n').map((item) => item.trim()).filter(item => item.length > 0);
    
          recommendations.forEach((rec) => {
           const [songArtist, movie] = rec.split("~").map((part) => part.trim());
            let [song, artist] = songArtist.split("-").map((part) => part.trim());
            
            // Remove quotes from song and artist names
            if (song) {
              song = song.replace(/^["\'](.*)["\']$/, '$1'); // Remove surrounding quotes
            }
            
            if (artist) {
              artist = artist.replace(/^["\'](.*)["\']$/, '$1'); // Remove surrounding quotes
            }
            
            // Remove quotes from movie name if present
            let cleanedMovie = movie;
            if (cleanedMovie) {
              cleanedMovie = cleanedMovie.replace(/^["\'](.*)["\']$/, '$1');
            }            if (song && artist) {
              recommendationsArray.push({ song, artist, movie: cleanedMovie || '' }); // Ensure movie is always a string
            }
          });
        }
        return recommendationsArray;
      
    
  } catch (error) {
    console.error("Error fetching song recommendations:", error);
    return [];
    }
  }
