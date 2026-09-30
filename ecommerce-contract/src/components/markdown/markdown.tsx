import './code-highlight-block.css';

import type { Options } from 'react-markdown';

import { useMemo } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import { isExternalLink } from 'src/routes/utils';
import { RouterLink } from 'src/routes/components';

import { Image } from '../image';
import { markdownClasses } from './classes';
import { htmlToMarkdown, isMarkdownContent } from './html-to-markdown';

import type { MarkdownProps } from './types';

// ----------------------------------------------------------------------


export function Markdown({ children, sx, ...other }: MarkdownProps) {
  const content = useMemo(() => {
    if (isMarkdownContent(`${children}`)) return children;
    return htmlToMarkdown(`${children}`.trim());
  }, [children]);

  return (
    <Box className={markdownClasses.root} sx={sx}>
      <ReactMarkdown
        children={content}
        components={components as Options['components']}
        rehypePlugins={rehypePlugins as Options['rehypePlugins']}
        {...other}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

type ComponentTag = {
  [key: string]: any;
};

const rehypePlugins = [rehypeRaw, rehypeHighlight, [remarkGfm, { singleTilde: false }]];

const components = {
  img: ({ node, ...other }: ComponentTag) => (
    <Image
      ratio="16/9"
      sx={{ borderRadius: 2 }} // className loại bỏ
      {...other}
    />
  ),
  a: ({ href, children, ...other }: ComponentTag) => {
    const linkProps = isExternalLink(href)
      ? { target: '_blank', rel: 'noopener' }
      : { component: RouterLink };

    return (
      <Link {...linkProps} href={href} {...other}>
        {children}
      </Link>
    );
  },
  pre: ({ children }: ComponentTag) => (
    <div>
      <pre>{children}</pre>
    </div>
  ),
  code({ node, children, ...other }: ComponentTag) {
    const className = node?.properties?.className?.[0] || '';
    const language = /language-(\w+)/.exec(className);

    return language ? (
      <code {...other} className={className}>
        {children}
      </code>
    ) : (
      <code {...other} style={{ /* inline styles thay class */ }}>
        {children}
      </code>
    );
  },
};
