import { useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { postsQueryOptions } from '../utils/posts'
import { Link } from '~/components/Link'

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Posts' }],
  }),
  component: PostsComponent,
})

function PostsComponent() {
  const postsQuery = useSuspenseQuery(postsQueryOptions())

  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[
          ...postsQuery.data,
          { id: 'i-do-not-exist', title: 'Non-existent Post' },
        ].map((post) => {
          return (
            <li key={post.id} className="whitespace-nowrap">
              <Link
                to="/posts/$postId"
                preload={false}
                params={{
                  postId: post.id,
                }}
                placeholderData={(post as any).body ? post : undefined}
                className="block py-1 text-blue-800 hover:text-blue-600"
                activeProps={{ className: 'text-black font-bold' }}
              >
                <div>{post.title.substring(0, 20)}</div>
              </Link>
            </li>
          )
        })}
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
