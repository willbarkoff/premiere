import * as React from "react";
import * as api from "../../../api";
import LoadingIndicator from "../../LoadingIndicator";
import SmallMovie from "./SmallMovie";

export default function MovieList(): JSX.Element {
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [movieList, setMovieList] = React.useState(null as api.MovieItem[] | null);

	React.useEffect(() => {
		const fetchMovies = async () => {
			try {
				const details = await api.GET("list");
				setMovieList(details as api.MovieItem[]);
			} catch {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, []);


	if (isLoading) {
		return <LoadingIndicator minimal />;
	}


	return <>
		{movieList.map((movie, i) => <SmallMovie
			key={i}
			genres={movie.Genres}
			overview={movie.Overview}
			posterPath={movie.Poster}
			releaseDate={movie.Release}
			title={movie.Title}
			tmdbId={movie.TMDBID}
		/>)}
	</>;
}