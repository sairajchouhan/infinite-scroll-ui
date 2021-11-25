// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Post = {
	id: number;
	title: string;
	createdAt: Date;
};

interface Data {
	posts: Post[];
	nextId: number | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	if (req.method === 'GET') {
		const limit = 5;
		const cursor = req.query.cursor ?? '';
		const cursorObj =
			cursor === '' ? undefined : { id: parseInt(cursor as string, 10) };

		const posts = await prisma.post.findMany({
			skip: cursor !== '' ? 1 : 0,
			cursor: cursorObj,
			take: limit,
		});
		return res.json({
			posts,
			nextId: posts.length === limit ? posts[limit - 1].id : undefined,
		});
	}
};
