import * as React from "react";
import * as api from "../../../api";
import ManualAdd from "./ManualAdd";
import SmallMovie from "./SmallMovie";

export default function AddAction(): JSX.Element {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [manual, setManual] = React.useState(false);
	const [movieData, setMovieData] = React.useState([] as api.MiniMovie[]);

	const updateSearch = async (newValue) => {
		setSearchTerm(newValue);
		if (newValue.length > 2) {
			const movies = await api.GET("movies/search", { title: searchTerm });
			setMovieData((movies as any).Results as api.MiniMovie[]);
		}
	};

	return <>
		<p className="block">Search by the title of the movie. Can't find a movie? <a onClick={() => setManual(!manual)}>Find it manually</a>.</p>
		<ManualAdd active={manual} onClose={() => setManual(false)} />
		<input
			className="input is-medium mb-4"
			type="text"
			value={searchTerm}
			onChange={(e) => updateSearch(e.target.value)}
			placeholder="Start typing..." />

		{movieData.map((movie, i) => <SmallMovie
			posterPath={movie.poster_path}
			genres={movie.genre_ids}
			overview={movie.overview}
			releaseDate={movie.release_date}
			title={movie.title}
			tmdbId={movie.id}
			key={i}
			showAdd
		/>)}
	</>;
}