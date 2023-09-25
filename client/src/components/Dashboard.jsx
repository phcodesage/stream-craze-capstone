import React, { useState, useEffect, useRef } from 'react';
import "../styles/Dashboard.css";
import CardContainer from "../components/CardContainer";
import Container from "../components/Container";
import FeaturedMovieCard from "./FeaturedMovieCard";
import 'bootstrap/dist/css/bootstrap.min.css';
const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const topRef = useRef(null);
  const [clickedShowMore, setClickedShowMore] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
        // Handle search logic here
        console.log("Search for:", e.target.value);
    }
};
// Add a new state variable to manage the current page
const [currentPage, setCurrentPage] = useState(1);
  const getGenreName = (id) => {
    const genre = genres.find(gen => gen.id === id);
    return genre ? genre.name : 'Unknown';
  };

  const fetchMovies = (page = 1) => {
    setLoading(true);
    fetch(`http://localhost:5000/movies?page=${page}`)  // <-- Updated the fetch URL to include the page parameter
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMovies((prevMovies) => [...prevMovies, ...data]);
        setCurrentPage(page);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
        setError(error.message);
        setLoading(false);
      });
};

  const lastMovieRef = useRef(null);

  const handleShowMore = () => {
    setClickedShowMore(true); // update the state when "Show More" is clicked
    fetchMovies(currentPage + 1);
    fetchMovies(currentPage + 1);
  };



  useEffect(() => {

    // Fetch movies from the API when the component mounts
    fetch('http://localhost:5000/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
          // Set a random movie as the featured movie

  
  const randomIndex = Math.floor(Math.random() * data.length);
  setFeaturedMovie(data[randomIndex]);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error.message);
        setError(error.message);
      });
      fetchMovies();
  }, []);

  useEffect(() => {
    if (clickedShowMore && lastMovieRef.current) {
      lastMovieRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [movies, clickedShowMore]);

  useEffect(() => {
    if (movies.length === 0) return; // Don't set an interval if there are no movies
  
    // Change the featured movie every 2 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setFeaturedMovie(movies[randomIndex]);
    }, 2000);
  
    // Clear interval when component is unmounted
    return () => clearInterval(interval);
  }, [movies]); // Dependency on the movies array so it will reset if movies change
  
  return (
    <div className="home container-fluid">
          <div className="row">
        <Container className="col-12" />
    </div>
    <div className="row custom-full-width">
    <div className="home-child col-12"  ref={topRef} style={{maxWidth: '100%'}} >
    <FeaturedMovieCard featuredMovie={featuredMovie} loading={loading} />

    </div>
    </div>

    <div className="navbar navbar-expand-lg navbar-dark">
    <div className="container-fluid">
        <button className="btn btn-primary" onClick={fetchMovies}>Movies</button>

        <div className="mx-auto order-0">
            <div className="input-group">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search a movie..." 
                    onKeyDown={handleSearchEnter}
                />
                <div className="input-group-append">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
        </div>

        <div className="navbar-nav">
            <a className="nav-item nav-link active" href="#">
                <img className="rounded-circle mr-2" alt="Account" src="/ellipse-757@2x.png" style={{width: '30px', height: '30px'}} />
                TOM
            </a>
        </div>
    </div>
</div>


    <div className="row movie-div">
        <div className="parent-div">
          { error ? (
            <div className="col-12">Error: {error}</div>
          ) : (
movies.map((movie, index) => (
  <React.Fragment key={movie.id}>
    {index % 3 === 0}
    <div className="movie-list" ref={index === movies.length - 1 ? lastMovieRef : null}>
      <CardContainer
        image={movie.poster_path}
        title={movie.title}
        genreYear={`${new Date(movie.release_date).getFullYear()} | ${getGenreName(movie.genre_ids[0])}`}
        loading={loading}
      />
    </div>
  </React.Fragment>
))
          )}
        </div>
        <div className="buttons-wrapper">
  <button className="btn btn-primary back-to-top-button" onClick={() => topRef.current.scrollIntoView({ behavior: 'smooth' })}>
    Back to Top
  </button>
  <button className="btn btn-primary show-more-button" onClick={handleShowMore}>
    Show More
  </button>
</div>
      </div>



</div>

  );
};

export default Dashboard;
