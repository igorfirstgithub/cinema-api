import { useState } from "react";
import "./App.css";

function App() {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieTitle2, setMovieTitle2] = useState("");
  const [myKey] = useState("cfaedb638a5d13a0f766eec3431c2568");
  const [commonFilmsList, setCommonFilmsList] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [isInfaReady, setIsInfaReady] = useState(false);
  const [commonMoviesArray, setCommonMoviesArray] = useState([]);

  async function searchMovie() {
    setCommonFilmsList([]);
    setCommonMoviesArray([]);
    setPictures([]);
    //const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${myKey}&language=en-US&query=${movieTitle}`;
    //const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${movieTitle}`;
    const urlPerson = `https://api.themoviedb.org/3/search/person?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${movieTitle}`;
    const urlPerson2 = `https://api.themoviedb.org/3/search/person?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${movieTitle2}`;
    //const urlSean = `https://api.themoviedb.org/3/person/738?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;
    //const moviesFishburne = `https://api.themoviedb.org/3/person/2975/movie_credits?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;

    //console.log(movieTitle);
    let res = await fetch(urlPerson);
    let data = await res.json();
    console.log(data);

    if (!data.results.length) {
      return;
    }
    setPictures([
      "https://image.tmdb.org/t/p/w185/" + data.results[0].profile_path,
    ]);

    let idActor = data.results[0].id;

    let moviesOfActor = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/movie_credits?api_key=${myKey}&language=en-US`
    );
    data = await moviesOfActor.json();
    const movies1 = data.cast;
    console.log("Movies of the first actor");
    console.log(movies1);

    res = await fetch(urlPerson2);
    data = await res.json();
    console.log(data);
    if (!data.results.length) {
      return;
    }
    setPictures((prevPictures) => [
      ...prevPictures,
      "https://image.tmdb.org/t/p/w185/" + data.results[0].profile_path,
    ]);

    idActor = data.results[0].id;

    moviesOfActor = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/movie_credits?api_key=${myKey}&language=en-US`
    );
    data = await moviesOfActor.json();
    const movies2 = data.cast;

    const onlyTitles1 = [];
    for (let i = 0; i < movies1.length; i++) {
      onlyTitles1.push(movies1[i].original_title);
    }

    const onlyTitles2 = [];
    for (let i = 0; i < movies2.length; i++) {
      onlyTitles2.push(movies2[i].original_title);
    }

    const commonMovies = movies1
      .filter(
        (movie1) => movies2.filter((movie2) => movie2.id === movie1.id).length
      )
      .sort((a, b) => a.release_date.slice(0, 4) - b.release_date.slice(0, 4));

    setCommonMoviesArray(commonMovies);

    if (!commonMovies.length) {
      console.log("No common films");
    } else {
      console.log(commonMovies);
    }

    setCommonFilmsList(
      commonMovies.map((el) => (
        <li key={el.id}>
          {el.original_title + " (" + el.release_date.slice(0, 4) + ")"}
        </li>
      ))
    );

    setIsInfaReady(true);
  }

  function changeQuery(event) {
    const value = event.target.value;
    setMovieTitle(value);
  }

  function changeQuery2(event) {
    const value = event.target.value;
    setMovieTitle2(value);
  }

  return (
    <div>
      <h2>Searching common movies of two actors</h2>
      <h4>(Provided by TMDB movie API)</h4>
      <input
        placeholder="Enter the name of a 1st actor"
        value={movieTitle}
        onChange={changeQuery}
      />{" "}
      <br />
      <input
        placeholder="Enter the name of a 2nd actor"
        value={movieTitle2}
        onChange={changeQuery2}
      />{" "}
      <br />
      <button
        className="button"
        disabled={!movieTitle.length || !movieTitle2.length}
        onClick={searchMovie}
      >
        Search common movies
      </button>
      {isInfaReady && pictures.length < 2 && movieTitle && movieTitle2 && (
        <p>One or both of the names were misspelled</p>
      )}
      <ol>{commonFilmsList}</ol>
      {isInfaReady && !commonFilmsList.length && movieTitle && movieTitle2 && (
        <p>No common movies</p>
      )}
      <div>
        {pictures.map((picture) => (
          <img className="poster" key={picture} src={picture} alt={picture} />
        ))}
      </div>
      <div>
        {commonMoviesArray.map((movie) => (
          <img
            className="poster"
            key={movie.id}
            src={"https://image.tmdb.org/t/p/w185" + movie.poster_path}
            alt={"picture " + movie.id}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
