import * as React from "react";
import * as api from "../../../api";

export default function AddAction(): JSX.Element {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [manual, setManual] = React.useState(false);
	const [movieData, setMovieData] = React.useState([] as api.Movie[]);

	const updateSearch = async (newValue) => {
		setSearchTerm(newValue);
		if (newValue.length > 2) {
			const movies = await api.GET("movies/search", { title: searchTerm });
			setMovieData((movies as any).Results as api.Movie[]);
		}
	};

	return <>
		<p className="block">Search by the title of the movie. Can't find a movie? <a onClick={() => setManual(!manual)}>Find it manually</a>.</p>

		<input
			className="input is-medium mb-4"
			type="text"
			value={searchTerm}
			onChange={(e) => updateSearch(e.target.value)}
			placeholder="Start typing..." />

		{movieData.map((movie, i) => <div key={i} className="columns">
			<div className="column is-1">
				<img src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`} alt="" />
			</div>
			<div className="column">
				<strong>{movie.title}</strong> ({movie.release_date.split("-")[0]})
				<p>{movie.overview}</p>
				<button className="button is-primary mt-2 is-small">Add to list</button>
			</div>
		</div>)}
	</>;
}