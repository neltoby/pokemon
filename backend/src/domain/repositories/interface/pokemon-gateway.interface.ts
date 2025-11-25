export interface PokemonSummary {
  id: number;
  name: string;
  url: string;
  thumbUrl?: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  abilities: string[];
  types: string[];
  evolutions: string[];
  imageUrl: string | null;
  thumbUrl?: string | null;
  artworkUrl?: string | null;
}

export interface IPokemonGateway {
  listFirstGeneration(limit: number, offset: number): Promise<PokemonSummary[]>;
  getDetails(nameOrId: string | number): Promise<PokemonDetails>;
}
