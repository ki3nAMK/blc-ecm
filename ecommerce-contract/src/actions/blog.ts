import type { IPostItem } from 'src/types/blog';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type PostsData = {
  posts: IPostItem[];
};

export function useGetPosts() {
  const url = endpoints.post.list;

  const { data, isLoading, error, isValidating } = useSWR<PostsData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      posts: data?.posts || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.posts.length,
    }),
    [data?.posts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPostsDemo() {
  const data = {
    posts: [
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-04-05T09:39:15+00:00',
        title: 'The Future of Renewable Energy: Innovations and Challenges Ahead',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-1.webp',
        totalViews: 9911,
        totalShares: 9124,
        totalComments: 1947,
        totalFavorites: 6984,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Jayvion Simon',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-04-04T08:39:15+00:00',
        title: 'Exploring the Impact of Artificial Intelligence on Modern Healthcare',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-2.webp',
        totalViews: 1947,
        totalShares: 6984,
        totalComments: 9124,
        totalFavorites: 8488,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Lucian Obrien',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-04-03T07:39:15+00:00',
        title: 'Climate Change and Its Effects on Global Food Security',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-3.webp',
        totalViews: 9124,
        totalShares: 8488,
        totalComments: 6984,
        totalFavorites: 2034,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Deja Brady',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-04-02T06:39:15+00:00',
        title: 'The Rise of Remote Work: Benefits, Challenges, and Future Trends',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-4.webp',
        totalViews: 6984,
        totalShares: 2034,
        totalComments: 8488,
        totalFavorites: 3364,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Harrison Stein',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-04-01T05:39:15+00:00',
        title: 'Understanding Blockchain Technology: Beyond Cryptocurrency',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp',
        totalViews: 8488,
        totalShares: 3364,
        totalComments: 2034,
        totalFavorites: 8401,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Reece Chung',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-31T04:39:15+00:00',
        title: 'Mental Health in the Digital Age: Navigating Social Media and Well-being',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-6.webp',
        totalViews: 2034,
        totalShares: 8401,
        totalComments: 3364,
        totalFavorites: 8996,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Lainey Davidson',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-30T03:39:15+00:00',
        title: 'Sustainable Fashion: How the Industry is Going Green',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-7.webp',
        totalViews: 3364,
        totalShares: 8996,
        totalComments: 8401,
        totalFavorites: 5271,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Cristopher Cardenas',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-29T02:39:15+00:00',
        title: 'Space Exploration: New Frontiers and the Quest for Extraterrestrial Life',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-8.webp',
        totalViews: 8401,
        totalShares: 5271,
        totalComments: 8996,
        totalFavorites: 8478,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Melanie Noble',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-28T01:39:15+00:00',
        title: 'The Evolution of E-Commerce: Trends Shaping the Online Retail Landscape',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-9.webp',
        totalViews: 8996,
        totalShares: 8478,
        totalComments: 5271,
        totalFavorites: 1139,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Chase Day',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-27T00:39:15+00:00',
        title: 'Cybersecurity in the 21st Century: Protecting Data in a Digital World',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-10.webp',
        totalViews: 5271,
        totalShares: 1139,
        totalComments: 8478,
        totalFavorites: 8061,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Shawn Manning',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-25T23:39:15+00:00',
        title: 'The Role of Big Data in Transforming Business Strategies',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-11.webp',
        totalViews: 8478,
        totalShares: 8061,
        totalComments: 1139,
        totalFavorites: 3035,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Soren Durham',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b12',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-24T22:39:15+00:00',
        title: 'Genetic Engineering: Ethical Considerations and Future Prospects',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-12.webp',
        totalViews: 1139,
        totalShares: 3035,
        totalComments: 8061,
        totalFavorites: 6733,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Cortez Herring',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b13',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-23T21:39:15+00:00',
        title: 'Urban Farming: A Solution to Food Deserts and Urban Sustainability',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-13.webp',
        totalViews: 8061,
        totalShares: 6733,
        totalComments: 3035,
        totalFavorites: 3952,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Brycen Jimenez',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b14',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-22T20:39:15+00:00',
        title: 'The Psychology of Consumer Behavior: What Drives Our Purchasing Decisions?',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp',
        totalViews: 3035,
        totalShares: 3952,
        totalComments: 6733,
        totalFavorites: 2405,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Giana Brandt',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b15',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-21T19:39:15+00:00',
        title: 'Renewable Energy vs. Fossil Fuels: Which is the Future?',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-15.webp',
        totalViews: 6733,
        totalShares: 2405,
        totalComments: 3952,
        totalFavorites: 3127,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Aspen Schmitt',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b16',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-20T18:39:15+00:00',
        title: 'Artificial Intelligence in Education: Enhancing Learning Experiences',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-16.webp',
        totalViews: 3952,
        totalShares: 3127,
        totalComments: 2405,
        totalFavorites: 6843,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Colten Aguilar',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b17',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-19T17:39:15+00:00',
        title: 'The Impact of Climate Change on Global Migration Patterns',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-17.webp',
        totalViews: 2405,
        totalShares: 6843,
        totalComments: 3127,
        totalFavorites: 4672,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Angelique Morse',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b18',
        publish: 'published',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-18T16:39:15+00:00',
        title: '5G Technology: Revolutionizing Connectivity and Communication',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-18.webp',
        totalViews: 3127,
        totalShares: 4672,
        totalComments: 6843,
        totalFavorites: 6995,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Selina Boyer',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
      {
        id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b19',
        publish: 'draft',
        metaKeywords: ['Sports', 'Entertainment', 'Business'],
        content:
          '\n<h1 class="nml__editor__content__heading" style="text-align: start">Heading H1</h1>\n<h2 class="nml__editor__content__heading" style="text-align: start">Heading H2</h2>\n<h3 class="nml__editor__content__heading" style="text-align: start">Heading H3</h3>\n<h4 class="nml__editor__content__heading" style="text-align: start">Heading H4</h4>\n<h5 class="nml__editor__content__heading" style="text-align: start">Heading H5</h5>\n<h6 class="nml__editor__content__heading" style="text-align: start">Heading H6</h6>\n<hr class="nml__editor__content__hr">\n<h4 class="nml__editor__content__heading" style="text-align: start">Paragraph</h4>\n<p style="text-align: start">What is MTAweb Directory?</p>\n<p style="text-align: start">So you have heard about this site or you have been to it, but you cannot figure out what it is or what it can do. MTA web directory is the simplest way in which one can bid on a link, or a few links if they wish to do so. The link directory on MTA displays all of the links it currently has, and does so in alphabetical order, which makes it much easier for someone to find what they are looking for if it is something specific and they do not want to go through all the other sites and links as well. It allows you to start your bid at the bottom and slowly work your way to the top of the list.</p>\n<p style="text-align: start">With a very low costing starting bid of just $1, you are guaranteed to have a spot in MTA’s successful directory list. When you would like to increase your bid to one of the top positions, you have to know that this would be a wise decision to make as it will not only get your link to be at a higher point in the directory but it will also give you a chance to have your site advertised with the rest of the top ten on the home page of the website. This means that when visitors come to <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="http://MTAweb.com">MTAweb.com</a>, your site will be one of the first things they see. In other words, you stand a great chance at getting a comeback to your site sooner than you thought.</p>\n<p style="text-align: start"><strong>This is strong text.</strong></p>\n<p style="text-align: start"><em>This is italic text</em></p>\n<p style="text-align: start">This is underline text</p>\n<h4 class="nml__editor__content__heading" style="text-align: start">Unordered list</h4>\n<ul class="nml__editor__content__bullet__list">\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://docs-minimals.vercel.app/introduction">This is an external link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implements <a target="_blank" rel="noopener noreferrer nofollow" class="nml__editor__content__link" href="https://codebeautify.org/dashboard/blog">This is an inside link</a></p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Renders actual, "native" React DOM elements</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Allows you to escape or skip HTML (try toggling the checkboxes above)</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>If you escape or skip the HTML, no dangerouslySetInnerHTML is used! Yay!</p>\n   </li>\n</ul>\n<h4 class="nml__editor__content__heading" style="text-align: start">Ordered list</h4>\n<ol class="nml__editor__content__ordered__list">\n   <li class="nml__editor__content__listItem">\n      <p>Analysis</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Design</p>\n   </li>\n   <li class="nml__editor__content__listItem">\n      <p>Implementation</p>\n   </li>\n</ol>\n<h4 class="nml__editor__content__heading" style="text-align: start">Blockquote</h4>\n<blockquote class="nml__editor__content__blockquote">\n   <p>Life is short, Smile while you still have teeth!&nbsp;</p>\n</blockquote>\n<h4 class="nml__editor__content__heading" style="text-align: start"><br>Block code</h4>\n\n<pre class="nml__editor__content__code__block"><code class="language-javascript">for (var i=1; i &lt;= 20; i++) {\n  if (i % 15 == 0)\n    return "FizzBuzz"\n  else if (i % 3 == 0)\n    return "Fizz"\n  else if (i % 5 == 0)\n    return "Buzz"\n  else\n    return i\n  }</code></pre>\n\n<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>\n<h5 class="nml__editor__content__heading" style="text-align: start">Why do we use it?</h5>\n<p style="text-align: start">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-5.webp">\n<p>It is important that you buy links because the links are what get you the results that you want. The popularity of the links that are listed in the MTA directory is in fact one of the most important factors in the performance of the search engine. Links are important and this is why you have to purchase a link in order to bid on something and the best part is that a link will only cost you $1, which is nothing compared to what you would pay if you decided to do it through any other company or website.</p>\n<img class="nml__editor__content__image" src="https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-14.webp">\n',
        comments: [
          {
            id: '043bf6d4-925b-490f-bf6c-2d83cf628ffe',
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
            message: 'She eagerly opened the gift, her eyes sparkling with excitement.',
            postedAt: '2025-04-04T08:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                name: 'Jayvion Simon',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                name: 'Lucian Obrien',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                name: 'Deja Brady',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
              },
            ],
            replyComment: [
              {
                id: '49268f90-4ad9-442d-be07-a4ab26de8cbb',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2',
                message:
                  'The old oak tree stood tall and majestic, its branches swaying gently in the breeze.',
                postedAt: '2025-04-03T07:39:15+00:00',
              },
              {
                id: '79ecd08f-7fbb-4934-b134-1dd7b447f45c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1',
                message: 'The aroma of freshly brewed coffee filled the air, awakening my senses.',
                tagUser: 'Lucian Obrien',
                postedAt: '2025-04-02T06:39:15+00:00',
              },
              {
                id: 'fa27dfda-239e-43dc-96d2-e710c1d9eda4',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3',
                message:
                  'The children giggled with joy as they ran through the sprinklers on a hot summer day.',
                postedAt: '2025-04-01T05:39:15+00:00',
              },
            ],
          },
          {
            id: '6643f5b6-a122-4859-bcab-45043abee250',
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
            message:
              'He carefully crafted a beautiful sculpture out of clay, his hands skillfully shaping the intricate details.',
            postedAt: '2025-03-31T04:39:15+00:00',
            users: [
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                name: 'Lainey Davidson',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                name: 'Cristopher Cardenas',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
              },
              {
                id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                name: 'Melanie Noble',
                avatarUrl:
                  'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
              },
            ],
            replyComment: [
              {
                id: '2c7e4063-d9fa-4faa-8355-8065f0dc7b2f',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6',
                message:
                  'The concert was a mesmerizing experience, with the music filling the venue and the crowd cheering in delight.',
                postedAt: '2025-03-30T03:39:15+00:00',
              },
              {
                id: '5f04bfc0-7665-4548-846f-1f11cfce286c',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7',
                message:
                  'The waves crashed against the shore, creating a soothing symphony of sound.',
                postedAt: '2025-03-29T02:39:15+00:00',
              },
              {
                id: '0db5bd01-6c3a-4835-bb76-706cc247d450',
                userId: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8',
                message:
                  'The scent of blooming flowers wafted through the garden, creating a fragrant paradise.',
                postedAt: '2025-03-28T01:39:15+00:00',
              },
            ],
          },
          {
            id: '40a7455c-483b-4c2a-bd4e-6286db4be7a7',
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
            message:
              'She gazed up at the night sky, marveling at the twinkling stars that dotted the darkness.',
            postedAt: '2025-03-27T00:39:15+00:00',
            users: [],
            replyComment: [],
          },
          {
            id: '7eca0780-69cd-4d3b-816e-58ffd89d5ba2',
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
            message:
              'The professor delivered a captivating lecture, engaging the students with thought-provoking ideas.',
            postedAt: '2025-03-25T23:39:15+00:00',
            users: [],
            replyComment: [],
          },
        ],
        tags: ['Technology', 'Health and Wellness', 'Travel', 'Finance', 'Education'],
        metaTitle: 'Minimal UI Kit',
        createdAt: '2025-03-17T15:39:15+00:00',
        title: 'The Gig Economy: Opportunities, Risks, and the Future of Work',
        coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-19.webp',
        totalViews: 6843,
        totalShares: 6995,
        totalComments: 4672,
        totalFavorites: 6053,
        metaDescription: 'The starting point for your next project with Minimal UI Kit',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: {
          name: 'Lawson Bass',
          avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
        },
        favoritePerson: [
          {
            name: 'Jayvion Simon',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-1.webp',
          },
          {
            name: 'Lucian Obrien',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-2.webp',
          },
          {
            name: 'Deja Brady',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-3.webp',
          },
          {
            name: 'Harrison Stein',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-4.webp',
          },
          {
            name: 'Reece Chung',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-5.webp',
          },
          {
            name: 'Lainey Davidson',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-6.webp',
          },
          {
            name: 'Cristopher Cardenas',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-7.webp',
          },
          {
            name: 'Melanie Noble',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-8.webp',
          },
          {
            name: 'Chase Day',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-9.webp',
          },
          {
            name: 'Shawn Manning',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-10.webp',
          },
          {
            name: 'Soren Durham',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-11.webp',
          },
          {
            name: 'Cortez Herring',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-12.webp',
          },
          {
            name: 'Brycen Jimenez',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-13.webp',
          },
          {
            name: 'Giana Brandt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-14.webp',
          },
          {
            name: 'Aspen Schmitt',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-15.webp',
          },
          {
            name: 'Colten Aguilar',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-16.webp',
          },
          {
            name: 'Angelique Morse',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-17.webp',
          },
          {
            name: 'Selina Boyer',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-18.webp',
          },
          {
            name: 'Lawson Bass',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-19.webp',
          },
          {
            name: 'Ariana Lang',
            avatarUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-20.webp',
          },
        ],
      },
    ],
  };

  const memoizedValue = useMemo(
    () => ({
      posts: data?.posts || [],
      postsLoading: false,
      postsError: null,
      postsValidating: false,
      postsEmpty: !false && !data?.posts.length,
    }),
    [data?.posts]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type PostData = {
  post: IPostItem;
};

export function useGetPost(title: string) {
  const url = title ? [endpoints.post.details, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<PostData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      post: data?.post,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.post, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type LatestPostsData = {
  latestPosts: IPostItem[];
};

export function useGetLatestPosts(title: string) {
  const url = title ? [endpoints.post.latest, { params: { title } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<LatestPostsData>(
    url,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type SearchResultsData = {
  results: IPostItem[];
};

export function useSearchPosts(query: string) {
  const url = query ? [endpoints.post.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
