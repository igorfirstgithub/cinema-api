import { useState } from "react";
import "./App.css";
import Movie from "./Movie";
//import actors from "./actorsList.js";
import actorsList from "./actorsList.js";

function App() {
  // console.log("actors list");
  // console.log(actors);

  // const actorsNames = actorsList.map((actor) => actor.name.split(" "));
  // console.log("Only names of all actors");
  // console.log(actorsNames);

  // const [actorsNames, setActorsNames] = useState(
  //   actorsList.map((actor) => actor.name.split(" "))
  // );

  //const [actorsNames, setActorsNames] = useState([]);

  //console.log(actorsList.map((actor) => actor.name.split(" ")));
  //console.log(actorsNames);

  const [actorName, setActorName] = useState("Ol");
  const [actorName2, setActorName2] = useState("Depp");
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
  //const [topOffsetForDetails, setTopOffsetForDetails] = useState(null);
  const [arraySuggestFilteredNames, setArraySuggestFilteredNames] = useState(
    []
  );
  const [numberActor, setNumberActor] = useState(0);
  const [isNameMisspelled, setIsNameMisspelled] = useState(false);
  const [isDataListClosed, setIsDataListClosed] = useState(true);
  const [isDataListClicked, setIsDataListClicked] = useState(false);

  // console.log("Actor 1 name length", actorName.length);
  // console.log("Actor 2 name length", actorName2.length);
  // console.log("Number actor", numberActor);

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

    const urlPerson = `https://api.themoviedb.org/3/search/person?api_key=${myKey}&language=en-US&query=`;

    //-------------------------------------------- First actor block --------------------------

    let res = await fetch(urlPerson + actorName);
    let data = await res.json();

    if (!data.results.length) {
      // setActorsArray([null]);
      // setActorsPreciseInfo([null]);
      setIsNameMisspelled(true);
      return;
    }

    setActorsArray([data.results[0]]);
    console.log("First actor initial info");
    console.log([data.results[0]]);

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
    console.log("First actor additional info with more fotos");
    console.log(additionalActorPhotoJson_0);
    data.secondPhoto = additionalActorPhotoJson_0.profiles[1]?.file_path;

    setActorsPreciseInfo([data]);
    console.log("First actor more info");
    console.log(data);

    //--------------------------------------- Second actor block -----------------------------------

    res = await fetch(urlPerson + actorName2);
    data = await res.json();

    if (!data.results.length) {
      // setActorsArray((prevActorsArray) => [...prevActorsArray, null]);
      // setActorsPreciseInfo((prevArray) => [...prevArray, null]);
      setIsNameMisspelled(true);
      return;
    }

    // console.log("Second actor initial info");
    // console.log(data.results[0]);

    setActorsArray((prevActorsArray) => [...prevActorsArray, data.results[0]]);

    console.log("First and Second actor initial info");
    console.log(actorsArray);

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
    data.secondPhoto = additionalActorPhotoJson_1.profiles[1]?.file_path;

    console.log("Additional second actor info with more fotos");
    console.log(additionalActorPhotoJson_1);
    data.secondPhoto = additionalActorPhotoJson_1.profiles[1]?.file_path;
    setActorsPreciseInfo((prevArray) => [...prevArray, data]);

    //--
    console.log("Second actor more info");
    console.log(actorsPreciseInfo[1]);
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
    setNumberActor(0);

    console.log("Actors array");
    console.log(actorsArray);
    console.log("Actors precise info");
    console.log(actorsPreciseInfo);
  }

  // async function getNameHints(partOfName) {
  //   const urlPerson = `https://api.themoviedb.org/3/search/person?api_key=${myKey}&language=en-US&query=`;
  //   let res = await fetch(urlPerson + partOfName);
  //   let data = await res.json();
  //   return data;
  // }

  async function changeQuery(event) {
    const value = event.target.value;
    setActorName(value);
    setNumberActor(1);

    // if (isDataListClicked) {
    //   setIsDataListClosed(true);
    // } else {
    //   setIsDataListClosed(false);
    // }

    setIsDataListClosed(false);

    let actorsNames;

    if (value.length >= 3) {
      const urlPerson = `https://api.themoviedb.org/3/search/person?api_key=${myKey}&language=en-US&query=`;
      let res = await fetch(urlPerson + value);
      let data = await res.json();
      console.log(
        data.results.slice(0, 10).map((actor) => actor.name.split(" "))
      );

      actorsNames = data.results.slice(0, 10).map((actor) => actor.name);
    }

    if (actorsNames) {
      setArraySuggestFilteredNames(["Select name", ...actorsNames]);
    } else {
      setArraySuggestFilteredNames([value]);
    }

    if (!value) {
      setIsNameMisspelled(false);
    }
  }

  async function changeQuery2(event) {
    const value = event.target.value;
    setActorName2(value);
    setNumberActor(2);

    let actorsNames;

    if (value.length >= 3) {
      const urlPerson = `https://api.themoviedb.org/3/search/person?api_key=${myKey}&language=en-US&query=`;
      let res = await fetch(urlPerson + value);
      let data = await res.json();
      console.log(
        data.results.slice(0, 10).map((actor) => actor.name.split(" "))
      );

      actorsNames = data.results.slice(0, 10).map((actor) => actor.name);
    }

    if (actorsNames) {
      setArraySuggestFilteredNames(["Select name", ...actorsNames]);
    } else {
      setArraySuggestFilteredNames([value]);
    }

    //console.log("Filtered names");
    // setArraySuggestFilteredNames([
    //   ["Select ", "name"],
    //   ...actorsNames.filter((actor) => {
    //     if (
    //       actor.filter((partName) => partName.slice(0, value.length) === value)
    //         .length
    //     ) {
    //       return true;
    //     }
    //   }),
    // ]);

    if (!value) {
      setIsNameMisspelled(false);
    }
  }

  function actorClickShowInfo(index) {
    console.log("Click on poster", actorsPreciseInfo[index]);
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
    // if (index > 2) {
    //   setTopOffsetForDetails(Math.floor((index + 3) / 3) * 300);
    // } else {
    //   setTopOffsetForDetails(null);
    // }

    //window.scrollTo(0, 0); // very useful in some cases
  }

  function selectActorFromVariants(event) {
    console.log("Number actor", numberActor);
    if (numberActor === 1) {
      setActorName(event.target.value);
    } else if (numberActor === 2) {
      setActorName2(event.target.value);
    }

    // setActorName2(event.target.value);
    console.log("Selected second name");
    console.log(event.target.value);
  }

  function closeDataList() {
    setIsDataListClosed(true);
    setIsDataListClicked(true);
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
          list="listid"
        />
        {!isDataListClosed && (
          <datalist onClick={closeDataList} id="listid">
            {arraySuggestFilteredNames.map((fullName) => (
              <option value={fullName}>{fullName}</option>
            ))}
          </datalist>
        )}{" "}
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
        <br />
        {((actorName && numberActor === 1) ||
          (actorName2 && numberActor === 2)) && (
          <div>
            <ul>
              {arraySuggestFilteredNames.map((fullName) => (
                <li
                  onClick={selectActorFromVariants}
                  // value={fullName.reduce((acc, part) => {
                  //   return acc + " " + part;
                  // }, "")}
                  value={fullName}
                  key={fullName}
                >
                  {/* {fullName.reduce((acc, part) => {
                    return acc + " " + part;
                  }, "")} */}
                  {fullName}
                </li>
              ))}
            </ul>
            <select
              // id="name-selector"
              onChange={selectActorFromVariants}
              //onSelect={() => console.log("Selector on Select")}
              //onChange={() => console.log("Selector on Change")}
            >
              {arraySuggestFilteredNames.map((fullName) => (
                <option
                  key={fullName}
                  // value={fullName.reduce((acc, part) => {
                  //   return acc + " " + part;
                  // }, "")}
                  value={fullName}
                >
                  {/* {fullName.reduce((acc, part) => {
                    return acc + " " + part;
                  }, "")} */}
                  {fullName}
                </option>
              ))}
            </select>
          </div>
        )}
        {isNameMisspelled && actorsArray.length === 0 && (
          <p className="misspelled-name">
            At least the first name is misspelled
          </p>
        )}
        {isNameMisspelled && actorsArray.length === 1 && (
          <p className="misspelled-name">The second name is misspelled</p>
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
      {actorsArray.length === 2 && (
        <div className="all-found-posters">
          {/* <p>
          {actorsArray.reduce((acc, actor, index) => {
            if (index) {
              acc += " and " + actor.name;
            } else {
              acc += actor.name;
            }
            return acc;
          }, "")}
        </p> */}
          <div className="actors-block">
            <div className="actors-posters">
              {actorsArray.map((actor, index) => (
                <div>
                  <h3 className="actor-poster">
                    {actor.name ? actor.name : "No such an actor"}
                  </h3>
                  <img
                    onClick={() => actorClickShowInfo(index)}
                    className="poster actor-poster"
                    key={index}
                    src={
                      actor.profile_path
                        ? "https://image.tmdb.org/t/p/w185/" +
                          actor.profile_path
                        : process.env.PUBLIC_URL + "/unknown.jpg"
                    }
                    alt={"picture" + index}
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
      )}
      {actorsArray.length === 2 && (
        <div className="details-actor-or-movie">
          <h4>Additional info on an actor or movie (click on a poster)</h4>
          {isInfaReady &&
            (triggerActorAdditionalInfo_0 || triggerActorAdditionalInfo_1) && (
              <div className="actor-info add-details">
                <h3>{actorAdditionalInfo.name}</h3>
                {!actorAdditionalInfo.secondPhoto && (
                  <p>{"(no additional foto is available)"}</p>
                )}
                {actorAdditionalInfo.secondPhoto && (
                  <img
                    src={
                      actorAdditionalInfo.secondPhoto
                        ? "https://image.tmdb.org/t/p/w185" +
                          actorAdditionalInfo.secondPhoto
                        : process.env.PUBLIC_URL + "/unknown.jpg"
                    }
                    alt={
                      actorAdditionalInfo.secondPhoto
                        ? "another foto"
                        : "no another foto"
                    }
                  />
                )}
                <p>{actorAdditionalInfo.birthday}</p>
                <div className="biography">
                  <p>{actorAdditionalInfo.biography}</p>
                </div>
              </div>
            )}
          {isMovieAddInfoAllowedToShow && (
            <div
              // style={{ position: "relative", top: topOffsetForDetails }}
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
      )}
    </div>
  );
}

export default App;

// Different api requests

//const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=${myKey}&language=en-US&query=${movieTitle}`;
//const urlMovie = `https://api.themoviedb.org/3/search/movie?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${movieTitle}`;
//const urlPerson2 = `https://api.themoviedb.org/3/search/person?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US&query=${actorName2}`;
//const urlSean = `https://api.themoviedb.org/3/person/738?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;
//const moviesFishburne = `https://api.themoviedb.org/3/person/2975/movie_credits?api_key=cfaedb638a5d13a0f766eec3431c2568&language=en-US`;
