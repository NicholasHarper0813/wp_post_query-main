import { omitBy } from 'lodash';

const DEFAULT_POST_QUERY = {
	_embed: true,
	offset: 0,
	order: 'DESC',
	order_by: 'date',
	type: 'post',
	status: 'publish',
	search: '',
};

export function getNormalizedPostsQuery( query )
{
	return omitBy( query, ( value, key ) => DEFAULT_POST_QUERY[ key ] === value );
}

export function getSerializedPostsQuery( query = {} ) 
{
	const normalizedQuery = getNormalizedPostsQuery( query );
	return JSON.stringify( normalizedQuery ).toLocaleLowerCase();
}
