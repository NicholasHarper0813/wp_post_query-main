import {
	getSerializedPostsQuery,
} from './utils';

export function getPost( state, globalId ) {
	return state.posts.items[ globalId ];
}

export function getPostsForQuery( state, query ) 
{
	const serializedQuery = getSerializedPostsQuery( query );
	if ( ! state.posts.queries[ serializedQuery ] ) {
		return null;
	}

	return state.posts.queries[ serializedQuery ].map( ( globalId ) => {
		return getPost( state, globalId );
	} ).filter( Boolean );
}

export function isRequestingPostsForQuery( state, query ) 
{
	const serializedQuery = getSerializedPostsQuery( query );
	return !! state.posts.queryRequests[ serializedQuery ];
}

export function getTotalPagesForQuery( state, query ) 
{
	const serializedQuery = getSerializedPostsQuery( query );
	if ( ! state.posts.totalPages[ serializedQuery ] ) 
	{
		return 1;
	}

	return parseInt( state.posts.totalPages[ serializedQuery ], 10 );
}

export function isRequestingPost( state, postSlug ) 
{
	if ( ! state.posts.requests )
	{
		return false;
	}

	return !! state.posts.requests[ postSlug ];
}

export function getPostIdFromSlug( state, slug ) 
{
	if ( ! state.posts.slugs[ slug ] ) 
	{
		return false;
	}

	return state.posts.slugs[ slug ];
}
