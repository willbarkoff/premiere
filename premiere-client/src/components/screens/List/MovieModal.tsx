import * as React from "react";
import * as api from "../../../api";
import { ContextData } from "../../App";
import LoadingIndicator from "../../LoadingIndicator";
import Modal from "../../Modal";
import ModalCard from "../../ModalCard";
import AddButton from "./AddButton";

export default function MovieModal(props: { onClose(): void, movie: number, showAdd?: boolean }): JSX.Element {
	const [isLoading, setIsLoading] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [movieInfo, setMovieInfo] = React.useState(null as api.Movie | null);

	React.useEffect(() => {
		const fetchMovie = async () => {
			try {
				const details = await api.GET("movies/fetch", { "id": "" + props.movie });
				setMovieInfo(details as api.Movie);
			} catch {
				setError(true);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovie();
	}, [props.movie]);


	if (isLoading) {
		return <Modal active={true}>
			<LoadingIndicator />
		</Modal>;
	}

	if (error) {
		return <ModalCard
			title={"Error"}
			active={true}
			onClose={props.onClose}
			buttons={[
				<button onClick={props.onClose} className="button">Close</button>
			]}
		>
			Something went wrong when fetching this movie.
		</ModalCard>;
	}

	return <ContextData.Consumer children={(contextData) => <>
		<ModalCard
			backdrop={`${contextData.context.tmdb.Images.secure_base_url}t/p/original${movieInfo.backdrop_path}`}
			title={movieInfo.Title}
			active={true}
			onClose={props.onClose}
			buttons={[
				<button onClick={props.onClose} className="button">Close</button>
			]}
		>
			<div className="columns">
				<div className="column is-one-third">
					<img src={`${contextData.context.tmdb.Images.secure_base_url}t/p/w300${movieInfo.poster_path}`} />
					<p className="heading pt-2">Released</p>
					<span>{new Date(movieInfo.release_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
					<p className="heading pt-2">Rating</p>
					<span>{movieInfo.vote_average}/10 ({movieInfo.vote_count} reviews)</span>
				</div>
				<div className="column">
					<h1 className="title">{movieInfo.Title}&nbsp;
						{props.showAdd && <AddButton id={movieInfo.ID} />}
					</h1>
					<h2 className="subtitle mb-2">{movieInfo.Tagline}</h2>
					<div className="tags mb-0 mt-1">
						{movieInfo.Genres.map((genre, i) => <span className="tag" key={i}>
							{genre.Name}
						</span>)}
					</div>
					<p className="block">{movieInfo.Overview}</p>
					<div className="columns">
						{/* <div className="column">
						</div> */}

						<div className="column">
							<p className="heading pt-2">Running time</p>
							<span>{movieInfo.Runtime}min</span>
						</div>

						{movieInfo.Budget != 0 && <div className="column"> <p className="heading pt-2">Budget</p>
							<span>${movieInfo.Budget.toLocaleString()}</span> </div>}


						{movieInfo.Revenue != 0 && <div className="column"> <p className="heading pt-2">Box office</p>
							<span>${movieInfo.Revenue.toLocaleString()}</span> </div>}

					</div>
				</div>
			</div>
		</ModalCard>
	</>} />;
}