import * as React from "react";
import * as api from "../../../api";
import { ContextData } from "../../App";
import AddButton from "./AddButton";
import ManualAdd from "./ManualAdd";
import MovieModal from "./MovieModal";

export default function AddAction(): JSX.Element {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [manual, setManual] = React.useState(false);
	const [movieData, setMovieData] = React.useState([] as api.MiniMovie[]);
	const [selection, setSelection] = React.useState(0);

	const updateSearch = async (newValue) => {
		setSearchTerm(newValue);
		if (newValue.length > 2) {
			const movies = await api.GET("movies/search", { title: searchTerm });
			setMovieData((movies as any).Results as api.MiniMovie[]);
		}
	};

	return <ContextData.Consumer children={(contextData) => <>
		{selection != 0 && <MovieModal onClose={() => setSelection(0)} movie={selection} showAdd />}
		<p className="block">Search by the title of the movie. Can't find a movie? <a onClick={() => setManual(!manual)}>Find it manually</a>.</p>
		<ManualAdd active={manual} onClose={() => setManual(false)} />
		<input
			className="input is-medium mb-4"
			type="text"
			value={searchTerm}
			onChange={(e) => updateSearch(e.target.value)}
			placeholder="Start typing..." />

		{movieData.map((movie, i) => <div key={i} className="columns">
			<div className="column is-1">
				<img src={`${contextData.context.tmdb.Images.secure_base_url}t/p/w92${movie.poster_path}`} alt="" />
			</div>
			<div className="column">
				<strong>{movie.title}</strong> ({movie.release_date.split("-")[0]})
				<div className="tags mb-0 mt-1">
					{movie.genre_ids.map((genre, i) => <span className="tag" key={i}>
						{contextData.context.genres.Genres.find((item) => item.ID == genre)?.Name}
					</span>)}
				</div>
				<p>{movie.overview}</p>
				<div className="buttons">
					<AddButton id={movie.id} />
					<button className="button is-secondary is-small mt-1" onClick={() => setSelection(movie.id)}>More...</button>
				</div>
			</div>
		</div>)}
	</>} />;
}