import { useState } from "react";
import "./App.css";

function App() {
  const [actorName, setActorName] = useState("");
  const [actorName2, setActorName2] = useState("");
  const [myKey] = useState("cfaedb638a5d13a0f766eec3431c2568");
  const [isInfaReady, setIsInfaReady] = useState(false);
  const [commonMoviesArray, setCommonMoviesArray] = useState([]);
  const [actorsArray, setActorsArray] = useState([]);

  async function searchMovie() {
    setCommonMoviesArray([]);
    setActorsArray([]);

    const urlPerson =
      "https://api.themoviedb.org/3/search/person?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=";

    //const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${myKey}&language=en-US&query=${movieTitle}`;
    //const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${movieTitle}`;
    //const urlPerson2 = `https://api.themoviedb.org/3/search/person?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${actorName2}`;
    //const urlSean = `https://api.themoviedb.org/3/person/738?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;
    //const moviesFishburne = `https://api.themoviedb.org/3/person/2975/movie_credits?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;

    let res = await fetch(urlPerson + actorName);
    let data = await res.json();

    if (!data.results.length) {
      return;
    }

    setActorsArray([data.results[0]]);

    let idActor = data.results[0].id;

    let moviesOfActor = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/movie_credits?api_key=${myKey}&language=en-US`
    );
    data = await moviesOfActor.json();
    const movies1 = data.cast;

    res = await fetch(urlPerson + actorName2);
    data = await res.json();

    if (!data.results.length) {
      return;
    }

    setActorsArray((prevActorsArray) => [...prevActorsArray, data.results[0]]);

    idActor = data.results[0].id;

    moviesOfActor = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/movie_credits?api_key=${myKey}&language=en-US`
    );
    data = await moviesOfActor.json();
    const movies2 = data.cast;

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

    setIsInfaReady(true);
  }

  function changeQuery(event) {
    const value = event.target.value;
    setActorName(value);
  }

  function changeQuery2(event) {
    const value = event.target.value;
    setActorName2(value);
  }

  return (
    <div>
      <h2>Searching common movies of two actors</h2>
      <h4>(Provided by TMDB movie API)</h4>
      <input
        placeholder="Enter the name of a 1st actor"
        value={actorName}
        onChange={changeQuery}
      />{" "}
      <br />
      <input
        placeholder="Enter the name of a 2nd actor"
        value={actorName2}
        onChange={changeQuery2}
      />{" "}
      <br />
      <button
        className="button"
        disabled={!actorName.length || !actorName2.length}
        onClick={searchMovie}
      >
        Search common movies
      </button>
      {isInfaReady && actorsArray.length < 2 && actorName && actorName2 && (
        <p>One or both of the names were misspelled</p>
      )}
      <ol>
        {commonMoviesArray.map((movie) => (
          <li key={movie.id}>{movie.original_title}</li>
        ))}
      </ol>
      {isInfaReady && !commonMoviesArray.length && actorName && actorName2 && (
        <p>No common movies</p>
      )}
      <p>
        {actorsArray.reduce((acc, actor, index) => {
          if (index) {
            acc += " and " + actor.name;
          } else {
            acc += actor.name;
          }
          return acc;
        }, "")}
      </p>
      <div>
        {actorsArray.map((actor) => (
          <img
            className="poster"
            key={actor.id}
            src={"https://image.tmdb.org/t/p/w185/" + actor.profile_path}
            alt={"picture" + actor.id}
          />
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
