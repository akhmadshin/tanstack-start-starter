import { ErrorComponent, Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { postQueryOptions } from '../utils/posts'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { NotFound } from '~/components/NotFound'
import React from 'react';

const NotFoundRouteComponent = () => <NotFound>Post not found</NotFound>
export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params: { postId }, context, cause }) => {
    console.info('cause = ', cause);
    if (cause === 'stay') {
      return;
    }

    const data = await context.queryClient.ensureQueryData(
      postQueryOptions(postId),
    )

    return {
      title: data.title,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : undefined,
  }),
  errorComponent: PostErrorComponent,
  notFoundComponent: NotFoundRouteComponent,
  component: PostComponent,
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function PostComponent() {
  const { postId } = Route.useParams()
  const queryData = useQuery(postQueryOptions(postId, typeof window !== 'undefined' ? window.placeholderData : undefined))
  const { data, isLoading, isFetching, isError, error } = queryData;

  if ((error as unknown as { isNotFound: boolean })?.isNotFound) {
    return (
      <NotFound>Post not found</NotFound>
    )
  }
  if (error) {
    return <ErrorComponent error={error} />
  }

  if (!data) {
    // Suspense loader
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{data.title}</h4>
      <div className="text-sm">{data.body}</div>
      <Link
        to="/posts/$postId/deep"
        params={{
          postId: data.id,
        }}
        activeProps={{className: 'text-black font-bold'}}
        className="block py-1 text-blue-800 hover:text-blue-600"
      >
        Deep View
      </Link>
    </div>

  )
}
