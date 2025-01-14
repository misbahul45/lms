import ListArticle from '@/components/article/show/ListArticle'
import PostersArticle from '@/components/article/show/PostersArticle'
import ShowRecomTags from '@/components/article/show/ShowRecomTags'
import ArticleLoader from '@/components/Loaders/ArticleLoader'
import PosterLoader from '@/components/Loaders/PosterLoader'
import RecomTagsLoader from '@/components/Loaders/RecomTagsLoader'
import { searchParamsCache } from '@/lib/nuqs'
import { Metadata } from 'next'
import { type SearchParams } from 'nuqs'
import React, { Suspense } from 'react'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata:Metadata={
  title: "Be Learning | Article", 
  description: "Be Learning is a platform for learning and teaching.",
}

export const revalidate = 60

const page = async ({ searchParams }: PageProps) => {
  const { page, tag, search } = await searchParamsCache.parse(searchParams)
  const isTagOrSearchPresent = (tag && tag.trim() !== '') || (search && search.trim() !== '');


  return (
    <div className='w-full max-w-6xl mx-auto ms:px-0 px-2 py-2'>
      {isTagOrSearchPresent &&
        <p className='mb-4 md:text-4xl font-semibold text-gray-400'>Result for <span className='text-gray-800'>{(tag && search)? tag +" & "+ search : tag || search}</span></p>
      }
      {!isTagOrSearchPresent && (
        <>
            <Suspense fallback={<PosterLoader />}>
              <PostersArticle />
            </Suspense>
            <Suspense fallback={<RecomTagsLoader />}>
              <ShowRecomTags />
            </Suspense>
        </>
      )}
      <Suspense fallback={<ArticleLoader />}>
        <ListArticle page={page} search={search} tag={tag} />
      </Suspense>
    </div>
  )
}

export default page