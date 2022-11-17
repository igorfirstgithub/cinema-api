import React from "react";

export default function Movie(props) {
  //const [detailsTrigger, setDetailsTrigger] = useState(false);

  // function showDetails() {
  //   setDetailsTrigger((prevState) => !prevState);
  // }
  return (
    <div id="current-movie-poster" className="poster movie-poster">
      <img
        //onClick={showDetails}
        onClick={() => {
          props.selectPoster();
          console.log("Postion of movie poster");
          console.log(
            document.getElementById("current-movie-poster").offsetLeft
          );
        }}
        src={"https://image.tmdb.org/t/p/w185" + props.movie.poster_path}
        alt={"picture " + props.movie.id}
      />
      <h6>{props.movie.original_title}</h6>
      <p>{`(${props.movie.release_date.slice(0, 4)}), rating ${
        props.movie.vote_average
      }`}</p>
      {/* {detailsTrigger && <p>{props.movie.overview}</p>} */}
    </div>
  );
}
