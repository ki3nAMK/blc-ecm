import { Markdown } from 'src/components/markdown';

// ----------------------------------------------------------------------

type Props = {
  description?: string;
};

export function ProductDetailsDescription({ description }: Props) {
  return (
    <Markdown
      children={description}
      sx={{
        p: 3,
        '& p, li, ol': {
          typography: 'body2',
        },
        '& h3': {
          typography: 'h6',
          mt: 3,
          mb: 1,
        },
        '& ul': {
          pl: 3,
          mb: 2,
          listStyleType: 'disc',
        },
        '& ol': {
          p: 0,
          display: { md: 'flex' },
          listStyleType: 'none',
          '& li': {
            '&:first-of-type': { minWidth: 240, mb: { xs: 0.5, md: 0 } },
          },
        },
      }}
    />
  );
}
