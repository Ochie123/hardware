import * as Yup from 'yup';

export const yupProductValidation = Yup.object().shape({
  url: Yup.string().url().required(),
  tags: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().url(),
      title: Yup.string().max(255),
    })
  ),
  hasVariants: Yup.boolean(),
  variants: Yup.array().of(
    Yup.object().shape({
      optionValues: Yup.array().of(
        Yup.object().shape({
          url: Yup.string().url(),
          value: Yup.string().required('Option Value is required'),
          option: Yup.string().required('Option is required'),
        })
      ),
      price: Yup.string().required('Price is required'),
      stock: Yup.number().required('Stock is required'),
      image: Yup.string().url(),
      product: Yup.string().url(),
    })
  ),
  uploaded_images: Yup.array()
    .min(1, "Minimum 1 files are required")
    .required("Files are required"),
  categories: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().url().required(),
      title: Yup.string().max(255).required(),
      created: Yup.string().required(),
      updated: Yup.string().required(),
      lft: Yup.number().integer().min(0).required(),
      rght: Yup.number().integer().min(0).required(),
      treeId: Yup.number().integer().min(0).required(),
      level: Yup.number().integer().min(0).required(),
      parent: Yup.string().url().required(),
    })
  ),
  deliveryZone: Yup.object().shape({
    url: Yup.string().url().required(),
    countries: Yup.array().of(
      Yup.object().shape({
        url: Yup.string().url().required(),
        name: Yup.string().max(255).required(),
      })
    ).required(),
    name: Yup.string().max(255).required(),
    shop: Yup.string().url().required(),
  }),
  type: Yup.string().required(),
  quantity: Yup.number().integer().min(0).required(),
  toprated: Yup.boolean(),
  bestseller: Yup.boolean(),
  title: Yup.string().max(255).required(),
  slug: Yup.string().max(255),
  file: Yup.string().url(),
  description: Yup.string().max(5000).required(),
  price: Yup.string().required(),
  isActive: Yup.boolean(),
  publish: Yup.string(),
  created: Yup.string(),
  updated: Yup.string(),
  status: Yup.string().required(),
  downloadUrl: Yup.string().required(),
  shop: Yup.string().url().required(),
  salePrice: Yup.string()
});
