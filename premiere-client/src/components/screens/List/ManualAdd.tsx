import * as React from "react";
import ModalCard from "../../ModalCard";

export default function ManualAdd(props: { active: boolean, onClose(): void }): JSX.Element {
	return <ModalCard
		title="Manual add"
		active={props.active}
		onClose={props.onClose}
		buttons={[
			<button onClick={props.onClose} className="button">Close</button>
		]}
	>
		<p className="block">
			Most movies can be added by simply searching for their title. If you can't find a movie that way, don't worry!
		</p>
		<p className="block">
			First, go to The Movie DB, at <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">tmdb.org</a>. Search
			for your movie using the advanced search features on the site.
		</p>
		<p className="block">
			When you find the movie that you're looking for, copy the link to the movie's page, and paste it below.
		</p>
		<div className="field is-grouped">
			<p className="control is-expanded">
				<input className="input" type="text" placeholder="TMDB link" />
			</p>
			<p className="control">
				<a className="button is-primary">
					Find Movie
				</a>
			</p>
		</div>

		<p className="block">
			If you can't find the movie on TMDb, you can <a href="https://www.themoviedb.org/movie/new" target="_blank" rel="noopener noreferrer">add it yourself</a>.
		</p>
	</ModalCard>;
}