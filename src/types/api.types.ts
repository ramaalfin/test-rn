// JSONPlaceholder API Types

/**
 * Generic item from JSONPlaceholder /posts endpoint
 * Replaces Movie type from TMDB API
 */
export interface Item {
  userId: number;
  id: number;
  title: string;
  body: string;
}

/**
 * User from JSONPlaceholder /users endpoint
 */
export interface ApiUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
