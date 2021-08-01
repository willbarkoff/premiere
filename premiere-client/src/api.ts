export const baseurl = process.env.API_BASEURL || "http://localhost:8675";

const formURLEncode = (body: Record<string, string>): string => {
	if (!body) {
		return "";
	}

	let paramStr = "";

	let first = true;
	for (const key in body) {
		const value = body[key];
		if (first) {
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

export const decodeError = (error: string): string => {
	switch (error) {
		case "movie_added":
			return "That movie is already on the list.";
		default:
			return `An unknown error occured (${error})`;
	}
};

export const GET = async function <T>(endpoint: string, parameters?: Record<string, string>): Promise<T> {
	const queryString = parameters ? "?" + formURLEncode(parameters) : "";
	const response = await fetch(baseurl + "/" + endpoint + queryString, { credentials: "include" });
	const json = await response.json() as PremiereApiResponse;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export const POST = async function <T>(endpoint: string, body: Record<string, string>): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, {
		method: "POST",
		body: formURLEncode(body),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		credentials: "include"
	});
	const json = await response.json() as PremiereApiResponse;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export interface PremiereApiResponse {
	status: string
	error?: string
	data?: any
}

export interface MiniMovie {
	adult: boolean;
	backdrop_path: string;
	id: number;
	original_title: string;
	genre_ids: number[];
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	overview: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}


export interface ContextData {
	genres: Genres;
	tmdb: Tmdb;
	user: User;
}

export interface Genres {
	Genres: Genre[];
}

export interface Genre {
	ID: number;
	Name: string;
}

export interface Tmdb {
	Images: Images;
	change_keys: string[];
}

export interface Images {
	base_url: string;
	secure_base_url: string;
	backdrop_sizes: string[];
	logo_sizes: string[];
	poster_sizes: string[];
	profile_sizes: string[];
	still_sizes: string[];
}

export interface User {
	Email: string;
	Name: string;
}

export interface Movie {
	Adult: boolean;
	backdrop_path: string;
	belongs_to_collection: BelongsToCollection;
	Budget: number;
	Genres: Genre[];
	Homepage: string;
	ID: number;
	imdb_id: string;
	original_language: string;
	original_title: string;
	Overview: string;
	Popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: Date;
	Revenue: number;
	Runtime: number;
	spoken_languages: SpokenLanguage[];
	Status: string;
	Tagline: string;
	Title: string;
	Video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface Genre {
	ID: number;
	Name: string;
}

export interface BelongsToCollection {
	ID: number;
	Name: string;
	poster_path: string;
	backdrop_path: string;
}

export interface ProductionCompany {
	ID: number;
	Name: string;
	logo_path: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	Name: string;
}

export interface SpokenLanguage {
	iso_639_1: string;
	Name: string;
}
