import { useState } from "react";
import "./App.css";
import Movie from "./Movie";
import actors from "./actorsList.js";
import actorsList from "./actorsList.js";

function App() {
  console.log("actors list");
  console.log(actors);

  const actorsNames = actorsList.map((actor) => actor.name.split(" "));
  console.log("Only names of all actors");
  console.log(actorsNames);

  const [actorName, setActorName] = useState("");
  const [actorName2, setActorName2] = useState("");
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
  //const [triggerMovieAdditionalInfo, setTtriggerMovieAdditionalInfo] = useState(false);
  const [movieAdditionalInfo, setMovieAdditionalInfo] = useState(null);
  const [isMovieAddInfoAllowedToShow, setIsMovieAddInfoAllowedToShow] =
    useState(false);
  const [topOffsetForDetails, setTopOffsetForDetails] = useState(null);
  const [arraySuggestFilteredNames, setArraySuggestFilteredNames] = useState(
    []
  );

  async function searchMovie() {
    setCommonMoviesArray([]);
    setActorsArray([]);
    setActorsPreciseInfo([]);
    setActorAdditionalInfo(null);
    setMovieAdditionalInfo(null);
    setIsMovieAddInfoAllowedToShow(false);
    setIsInfaReady(false);
    setTriggerActorAdditionalInfo_0(false);
    setTriggerActorAdditionalInfo_1(false);

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
    const additionalActorPhoto_0 = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/images?api_key=${myKey}`
    );
    const additionalActorPhotoJson_0 = await additionalActorPhoto_0.json();
    data.secondPhoto = additionalActorPhotoJson_0.profiles[1].file_path;

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
    const additionalActorPhoto_1 = await fetch(
      `https://api.themoviedb.org/3/person/${idActor}/images?api_key=${myKey}`
    );
    const additionalActorPhotoJson_1 = await additionalActorPhoto_1.json();
    data.secondPhoto = additionalActorPhotoJson_1.profiles[1].file_path;
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

    console.log("Filtered names");
    setArraySuggestFilteredNames(
      actorsNames.filter((actor) => {
        if (
          actor.filter((partName) => partName.slice(0, value.length) === value)
            .length
        ) {
          return true;
        }
      })
    );
  }

  function changeQuery2(event) {
    const value = event.target.value;
    setActorName2(value);

    console.log("Filtered names");
    console.log(
      actorsNames.filter((actor) => {
        actor.filter((partName) => partName.slice(0, value.length) === value);
      })
    );
  }

  function actorClickShowInfo(index) {
    //console.log(actorsPreciseInfo[index]);
    setActorAdditionalInfo(actorsPreciseInfo[index]);
    setIsMovieAddInfoAllowedToShow(false);

    if (index === 0) {
      setTriggerActorAdditionalInfo_0((prevState) => !prevState);
      setTriggerActorAdditionalInfo_1(false);
    } else {
      setTriggerActorAdditionalInfo_1((prevState) => !prevState);
      setTriggerActorAdditionalInfo_0(false);
    }
  }

  function showInfoAboutMovie(index) {
    setMovieAdditionalInfo(commonMoviesArray[index]);
    console.log("Show a certain movie info");
    console.log(commonMoviesArray[index]);
    console.log("Show movie info from state");
    console.log(movieAdditionalInfo);
    setIsMovieAddInfoAllowedToShow(true);
    setTriggerActorAdditionalInfo_0(false);
    setTriggerActorAdditionalInfo_1(false);
    if (index > 2) {
      setTopOffsetForDetails(Math.floor((index + 3) / 3) * 300);
    } else {
      setTopOffsetForDetails(null);
    }

    //window.scrollTo(0, 0); // very useful in some cases
  }

  return (
    <div className="whole-page">
      <div className="searching-block">
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
        <ul>
          {arraySuggestFilteredNames.map((fullName) => (
            <li key={fullName}>
              {fullName.reduce((acc, part) => {
                return acc + " " + part;
              }, "")}
            </li>
          ))}
        </ul>
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
        {isInfaReady &&
          !commonMoviesArray.length &&
          actorName &&
          actorName2 && <p>No common movies</p>}
      </div>
      <div className="all-found-posters">
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
              <div>
                <h3 className="actor-poster">{actor.name}</h3>
                <img
                  onClick={() => actorClickShowInfo(index)}
                  className="poster actor-poster"
                  key={actor.id}
                  src={"https://image.tmdb.org/t/p/w185/" + actor.profile_path}
                  alt={"picture" + actor.id}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="movies-gallery">
          {commonMoviesArray.map((movie, index) => (
            <Movie
              movie={movie}
              key={movie.id}
              selectPoster={() => showInfoAboutMovie(index)}
              //showMovieAdditionalInfo={showMovieAdditionalInfo}
            />
          ))}
        </div>
      </div>
      <div className="details-actor-or-movie">
        <h4>Additional info on an actor or movie (click on a poster)</h4>
        {isInfaReady &&
          (triggerActorAdditionalInfo_0 || triggerActorAdditionalInfo_1) && (
            <div className="actor-info add-details">
              <h3>{actorAdditionalInfo.name}</h3>
              <img
                src={
                  "https://image.tmdb.org/t/p/w185" +
                  actorAdditionalInfo.secondPhoto
                }
                alt={actorAdditionalInfo.secondPhoto}
              />
              <p>{actorAdditionalInfo.birthday}</p>
              <p>{actorAdditionalInfo.biography}</p>
            </div>
          )}
        {isMovieAddInfoAllowedToShow && (
          <div
            style={{ position: "relative", top: topOffsetForDetails }}
            className="details-movie add-details"
          >
            <h6>{movieAdditionalInfo.original_title}</h6>
            <img
              style={{ marginTop: "10px" }}
              src={
                "https://image.tmdb.org/t/p/w185" +
                movieAdditionalInfo.poster_path
              }
              alt={"picture " + movieAdditionalInfo.id}
            />
            <p>{movieAdditionalInfo.overview}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
