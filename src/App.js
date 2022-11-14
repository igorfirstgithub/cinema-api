import { useState } from "react";
import "./App.css";
import Movie from "./Movie";

function App() {
  const [actorName, setActorName] = useState("Depp");
  const [actorName2, setActorName2] = useState("Bloom");
  const [myKey] = useState("cfaedb638a5d13a0f766eec3431c2568");
  const [isInfaReady, setIsInfaReady] = useState(false);
  const [commonMoviesArray, setCommonMoviesArray] = useState([]);
  const [actorsArray, setActorsArray] = useState([]);
  const [actorsPreciseInfo, setActorsPreciseInfo] = useState([]);

  const [actorAdditionalInfo, setActorAdditionalInfo] = useState(null);
  const [triggerActorAdditionalInfo_0, setTriggerActorAdditionalInfo_0] =
    useState(false);
  const [triggerActorAdditionalInfo_1, setTriggerActorAdditionalInfo_1] =
    useState(false);

  async function searchMovie() {
    setCommonMoviesArray([]);
    setActorsArray([]);
    setActorsPreciseInfo([]);
    setActorAdditionalInfo(null);

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

    console.log("First actor initial info");
    console.log(data.results[0]);

    setActorsArray([data.results[0]]);

    let idActor = data.results[0].id;

    let moviesOfActor = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/movie_credits?api_key=${myKey}&language=en-US`
    );
    data = await moviesOfActor.json();
    const movies1 = data.cast;

    let actorMoreInfo = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}?api_key=${myKey}&language=en-US`
    );
    data = await actorMoreInfo.json();
    setActorsPreciseInfo([data]);
    console.log("First actor more info");
    console.log(data);

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

    //--
    actorMoreInfo = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}?api_key=${myKey}&language=en-US`
    );
    data = await actorMoreInfo.json();
    setActorsPreciseInfo((prevArray) => [...prevArray, data]);

    //--
    console.log("Second actor more info");
    console.log(data);
    console.log("Two actors more info");
    console.log(actorsPreciseInfo);

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

  function actorClickShowInfo(index) {
    //console.log(actorsPreciseInfo[index]);
    setActorAdditionalInfo(actorsPreciseInfo[index]);

    if (index === 0) {
      setTriggerActorAdditionalInfo_0((prevState) => !prevState);
      setTriggerActorAdditionalInfo_1(false);
    } else {
      setTriggerActorAdditionalInfo_1((prevState) => !prevState);
      setTriggerActorAdditionalInfo_0(false);
    }
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
        {commonMoviesArray
          .sort((movie1, movie2) => movie1.release_date - movie2.release_date)
          .map((movie) => (
            <li key={movie.id}>
              {movie.original_title +
                " (" +
                movie.release_date.slice(0, 4) +
                ")"}
            </li>
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
      <div className="actors-block">
        <div className="actors-posters">
          {actorsArray.map((actor, index) => (
            <img
              onClick={() => actorClickShowInfo(index)}
              className="poster"
              key={actor.id}
              src={"https://image.tmdb.org/t/p/w185/" + actor.profile_path}
              alt={"picture" + actor.id}
            />
          ))}
        </div>
        {isInfaReady &&
          (triggerActorAdditionalInfo_0 || triggerActorAdditionalInfo_1) && (
            <div className="actor-info">
              <h5>{actorAdditionalInfo.name}</h5>
              <p>{actorAdditionalInfo.birthday}</p>
            </div>
          )}
      </div>
      <div className="movies-gallery">
        {commonMoviesArray.map((movie) => (
          <Movie movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
}

export default App;
