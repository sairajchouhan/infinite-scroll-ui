import React, { useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';

export default function Home() {
	const { ref, inView } = useInView();

	const {
		isLoading,
		isError,
		data,
		error,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery(
		'posts',
		async ({ pageParam = '' }) => {
			await new Promise((res) => setTimeout(res, 1000));
			const res = await axios.get('/api/post?cursor=' + pageParam);
			return res.data;
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextId ?? false,
		}
	);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView]);

	if (isLoading) return <div className='loading'>Loading...</div>;
	if (isError) return <div>Error! {JSON.stringify(error)}</div>;

	return (
		<div className='container'>
			{data &&
				data.pages.map((page) => {
					return (
						<React.Fragment key={page.nextId ?? 'lastPage'}>
							{page.posts.map(
								(post: { id: number; title: string; createdAt: Date }) => (
									<div className='post' key={post.id}>
										<p>{post.id}</p>
										<p>{post.title}</p>
										<p>{post.createdAt}</p>
									</div>
								)
							)}
						</React.Fragment>
					);
				})}

			{isFetchingNextPage ? <div className='loading'>Loading...</div> : null}

			<span style={{ visibility: 'hidden' }} ref={ref}>
				intersection observer marker
			</span>
		</div>
	);
}
