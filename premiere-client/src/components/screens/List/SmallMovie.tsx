import * as React from "react";
import { ContextData } from "../../App";
import AddButton from "./AddButton";
import MovieModal from "./MovieModal";

interface SmallMovieProps {
	posterPath: string
	releaseDate: string
	title: string
	genres: number[]
	overview: string
	tmdbId: number
	showAdd?: boolean
}

export default function SmallMovie(props: SmallMovieProps): JSX.Element {
	const [isSelected, setSelected] = React.useState(false);

	return <ContextData.Consumer children={(contextData) => <>
		{isSelected && <MovieModal onClose={() => setSelected(false)} movie={props.tmdbId} showAdd={props.showAdd} />}
		<div className="columns">
			<div className="column is-1">
				<img src={`${contextData.context.tmdb.Images.secure_base_url}t/p/w92${props.posterPath}`} alt="" />
			</div>
			<div className="column">
				<strong>{props.title}</strong> ({props.releaseDate.split("-")[0]})
				<div className="tags mb-0 mt-1">
					{props.genres.map((genre, i) => <span className="tag" key={i}>
						{contextData.context.genres.Genres.find((item) => item.ID == genre)?.Name}
					</span>)}
				</div>
				<p>{props.overview}</p>
				<div className="buttons">
					{props.showAdd && <AddButton id={props.tmdbId} />}
					<button className="button is-secondary is-small mt-1" onClick={() => setSelected(true)}>More...</button>
				</div>
			</div>
		</div>
	</>} />;
}