import type { DialogProps } from '@mui/material/Dialog';

import { z as zod } from 'zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

import { useProducts } from '@/states/products';
import productService from '@/lib/service/product.service';

// ----------------------------------------------------------------------

export type ReviewSchemaType = zod.infer<typeof ReviewSchema>;

export const ReviewSchema = zod.object({
  rating: zod.number().min(1, 'Rating must be greater than or equal to 1!'),
  review: zod.string().min(1, { message: 'Review is required!' }),
});

// ----------------------------------------------------------------------

type Props = DialogProps & {
  productId: string;
  onClose: () => void;
};

export function ProductReviewNewForm({ productId, onClose, ...other }: Props) {
  const { refetchProduct } = useProducts();

  const defaultValues = {
    rating: 0,
    review: '',
  };

  const methods = useForm<ReviewSchemaType>({
    mode: 'all',
    resolver: zodResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await productService.createReview(productId, {
        rating: data.rating,
        comment: data.review,
      });
      await refetchProduct();
      reset();
      onClose();
      toast.success('Review posted successfully!');
    } catch (error: any) {
      console.error('createReview error:', error);
      const message =
        error?.response?.data?.message || error?.message || 'Failed to post review';
      toast.error(message);
    }
  });

  const onCancel = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);

  return (
    <Dialog onClose={onClose} {...other}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle> Add Review </DialogTitle>

        <DialogContent>
          <div>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your review about this product:
            </Typography>
            <Field.Rating name="rating" />
          </div>

          <Field.Text name="review" label="Review *" multiline rows={3} sx={{ mt: 3 }} />
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
