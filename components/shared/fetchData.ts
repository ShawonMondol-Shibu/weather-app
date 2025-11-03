// export async function fetchWeather(city: string = "London") {
//   const url = `https://weather-api-by-any-city.p.rapidapi.com/weather/${city}`;
//   const options = {
//     method: "GET",
//     headers: {
//       "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
//       "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
//     },
//   };

//   try {
//     const response = await fetch(url, options);
//     if (!response.ok) throw new Error("Failed to fetch weather data");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("❌ Weather Fetch Error:", error);
//     return null;
//   }
// }
