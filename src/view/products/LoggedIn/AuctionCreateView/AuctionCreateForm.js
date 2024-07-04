"use client";
import React, { useEffect, useState } from 'react';

import axios from "axios";
import { Formik, FieldArray } from 'formik';
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router"
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Dynamically import components with no SSR
import FilesDropzone from "../../../../components/Files-Dropzone";
import QuillEditor from "../../../../components/Quill-Editor";

import { postProductAxios } from '../../../../services/AuctionService';
import { yupProductValidation } from './schema/yupProductValidation';
import { productDefaultValue } from './schema/productDefaultValue';
import { options } from 'numeral';


const ProductCreateForm = ({ className, ...rest }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const [error, setError] = useState('');
  const [productType, setProductType] = useState('physical');
  const [showCustomVariantDialog, setShowCustomVariantDialog] = useState(false);
  const [customOptionTitle, setCustomOptionTitle] = useState('');
  const [customOptionValues, setCustomOptionValues] = useState('');
  const [customOptionTitles, setCustomOptionTitles] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [optionTitles, setOptionTitles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [hasVariants, setHasVariants] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleProductTypeChange = (event) => {
    setProductType(event.target.value);
  };

  const handleAddTag = (values, setFieldValue) => {
    if (tagInput.trim() && !values.tags.includes(tagInput.trim())) {
      setFieldValue('tags', [...values.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tag, values, setFieldValue) => {
    const newTags = values.tags.filter(t => t !== tag);
    setFieldValue('tags', newTags);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/categories/");
        setCategories(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const childCategories = categories.filter(category => category.parent !== null);

  useEffect(() => {
    const fetchOptionTitles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/product-variant-options/");
        const options = response.data.results.map((option) => ({
          id: option.id,
          name: option.name,
        }));
        setOptionTitles(options);
        console.log("Fetched option titles:", options);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchOptionTitles();
  }, []);

  const saveCustomOption = async (customOptionTitle, customOptionValues) => {
    try {
      const requestData = {
        name: customOptionTitle,
        values: customOptionValues.split(',').map(value => ({
          value: value.trim()
        }))
      };
      
      // Log the request data
      //console.log('Request data:', requestData);
  
      const response = await axios.post("http://127.0.0.1:8000/api/product-variant-options/", requestData);
  
      // Log the response data
      console.log('Response data:', response.data);
  
      return response.data.id; // Assuming the response contains the new option ID
      
    } catch (error) {
      console.error("Error saving custom option:", error);
      throw error;
    }
  };
  
  return (
    <Formik
      initialValues={{
        ...productDefaultValue,
        categories: [], // Ensure categories field is an empty array initially
        variants: [{
          optionTitle: '',
          optionValues: '',
          price: 0,
          quantity: 0,
          isActive: false,
          includeImage: false,
          imageId: null 
        }],
        showCustomVariantDialog: false,
        customOptionTitle: '',
        customOptionValues: '',
        errors: {},
        touched: {},
        values: {},
        setFieldValue: () => {},
        category_url: '',
      }}
      //validationSchema={yupProductValidation}
      onSubmit={async (values, formikHelpers) => {
        //console.log('Form values:', values);
        try {
          const formData = new FormData();
          // Append images
          values.uploaded_images.forEach((file, index) => {
            formData.append(`uploaded_images[${index}]`, file);
          });

          values.tags.forEach((tag, index) => {
            formData.append(`tag_titles[${index}]`, tag);
          });
      
          // Append the category URL
          if (selectedCategory) {
            formData.append('category', selectedCategory.url);
          } else {
            formData.append('category', ''); // or handle the case where no category is selected
          }
          formData.append('deliveryZone[url]', values.deliveryZone.url);
          values.deliveryZone.countries.forEach((country, index) => {
            formData.append(`deliveryZone[countries][${index}][url]`, country.url);
            formData.append(`deliveryZone[countries][${index}][name]`, country.name);
          });
          formData.append('deliveryZone[name]', values.deliveryZone.name);
          formData.append('deliveryZone[shop]', values.deliveryZone.shop);

          // Append other fields
          formData.append('type', values.type);
          formData.append('quantity', values.quantity.toString());
          formData.append('title', values.title);
          formData.append('slug', values.slug);
          formData.append('file', values.file);
          formData.append('description', values.description);
          formData.append('price', values.price);
          formData.append('status', values.status);
          formData.append('shop', values.shop);
          formData.append('salePrice', values.salePrice);

          // Create the product first
          const response = await postProductAxios(formData);
          const product = response.data;
      
          // Extract product ID from the URL
          // After creating the product
          const productId = product.url.split('/').filter(part => part).pop();

          // Extract image IDs from the response
          const uploadedImages = product.images.map((image, index) => ({
            id: image.id,
            url: image.image_url, // Assuming the API returns image URLs
            index: index
          }));

          // Update state with uploaded images
          setUploadedImages(uploadedImages);

          // Update Formik state with new image IDs
          formikHelpers.setFieldValue('uploadedImageIds', uploadedImages.map(img => img.id));


          const variantsData = values.variants.map(variant => {
            let optionValues;
            
            if (variant.optionId) {
              optionValues = variant.optionValues.split(',').map(value => ({
                value: value.trim(),
                option: variant.optionId
              }));
            } else {
              const selectedOption = optionTitles.find(opt => opt.id.toString() === variant.optionTitle);
              optionValues = variant.optionValues.split(',').map(value => ({
                value: value.trim(),
                option: selectedOption ? selectedOption.id : null
              })).filter(ov => ov.option !== null);
            }
    
            const variantData = {
              option_values: optionValues,
              product: productId,
              price: parseFloat(variant.price) || 0,
              quantity: parseInt(variant.quantity) || 0,
              is_active: Boolean(variant.isActive)
            };
          
            return {
              ...variantData,
              imageId: variant.imageId !== null ? uploadedImages.find(img => img.index === variant.imageId)?.id : null
            };
          }).filter(variant => variant.option_values.length > 0);
    
         // console.log('Prepared variants data:', variantsData);
    
          // Create the variants
          const createVariantsPromises = variantsData.map(async variantData => {
            const { imageId, ...variantPostData } = variantData;
            const variantResponse = await axios.post('http://127.0.0.1:8000/api/product-variants/', variantPostData);
            
            if (imageId) {
              await axios.post('http://127.0.0.1:8000/api/variant-mappings/', {
                variant: variantResponse.data.id,
                image: imageId
              });
            }
      
            return variantResponse;
          });
 
          await Promise.all(createVariantsPromises);


          try {
            const variantsResponses = await Promise.all(createVariantsPromises);
            // Log the responses
           // console.log('Variants responses:', variantsResponses);
          } catch (error) {
            //console.error('Error creating variants:', error);
            // Handle the error (e.g., show an error message to the user)
          }
          const variantsResponses = await Promise.all(createVariantsPromises);

          // Log the responses
         // console.log('Variants responses:', variantsResponses);

          formikHelpers.setStatus({ success: true });
          formikHelpers.setSubmitting(false);
          enqueueSnackbar('Product Created', {
            variant: 'success',
          });
         // console.log('Product created:', response);
          navigate('/');
        } catch (err) {
          alert('Something happened. Please try again.');
          setError(err.message);
          formikHelpers.setStatus({ success: false });
          formikHelpers.setSubmitting(false);
        }
      }}
    >
      {formikProps => {
        const handleCategoryChange = (event, value) => {
          setSelectedCategory(value);
          formikProps.setFieldValue('categories', value ? [value] : []); // Update Formik state
          if (value?.parent) {
            const parent = categories.find(category => category.url === value.parent);
            setParentCategory(parent);
          } else {
            setParentCategory(null);
          }
        };

        return (
          <form
            onSubmit={formikProps.handleSubmit}
            className={className}
            {...rest}
          >
            <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <TextField
                    error={Boolean(
                      formikProps.touched.title && formikProps.errors.title,
                    )}
                    fullWidth
                    helperText={
                      formikProps.touched.title && formikProps.errors.title
                    }
                    label="Product Title"
                    name="title"
                    onBlur={formikProps.handleBlur}
                    onChange={formikProps.handleChange}
                    value={formikProps.values.title}
                    variant="outlined"
                  />
                  <Box mt={3} mb={1}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Description
                    </Typography>
                  </Box>
                  <Paper variant="outlined">
                    <QuillEditor
                      className=''
                      value={formikProps.values.description}
                      onChange={(value) =>
                        formikProps.setFieldValue('description', value)
                      }
                    />
                  </Paper>
                  {formikProps.touched.description &&
                    formikProps.errors.description && (
                      <Box mt={2}>
                        <FormHelperText error>
                          {formikProps.errors.description}
                        </FormHelperText>
                      </Box>
                    )}
                </CardContent>
              </Card>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Upload Images" />
                  <Divider />
                  <CardContent>
                  <FilesDropzone onFilesChange={(files) => formikProps.setFieldValue('uploaded_images', files)} />

                  {formikProps.touched.uploaded_images &&
                    formikProps.errors.uploaded_images && (
                      <Box mt={2}>
                        <FormHelperText error>
                          {formikProps.errors.uploaded_images}
                        </FormHelperText>
                      </Box>
                    )}
                </CardContent>
                </Card>
              </Box>
              <Box mt={3}>
                <Card>
                  <CardHeader title="Product Details" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            formikProps.touched.price && formikProps.errors.price,
                          )}
                          fullWidth
                          helperText={
                            formikProps.touched.price && formikProps.errors.price
                              ? formikProps.errors.price
                              : 'If you have a sale price this will be shown as old price'
                          }
                          label="Price"
                          name="price"
                          type="number"
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          value={formikProps.values.price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          error={Boolean(
                            formikProps.touched.salePrice && formikProps.errors.salePrice,
                          )}
                          fullWidth
                          helperText={
                            formikProps.touched.salePrice && formikProps.errors.salePrice
                          }
                          label="Sale price"
                          name="salePrice"
                          type="number"
                          onBlur={formikProps.handleBlur}
                          onChange={formikProps.handleChange}
                          value={formikProps.values.salePrice}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={hasVariants}
                          onChange={(e) => setHasVariants(e.target.checked)}
                          name="hasVariants"
                        />
                      }
                      label="Has Variants"
                    />
                    </Box>
                   
                    {hasVariants && (

    <>
<FieldArray name="variants">
  {({ push, remove }) => (
    <>
      {formikProps.values.variants.map((variant, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardHeader
            title={`Variant ${index + 1}`}
            action={<IconButton onClick={() => remove(index)} aria-label="delete">
              <DeleteIcon />
            </IconButton>}
          />
          <CardContent>
          <TextField
  select
  fullWidth
  label="Option Title"
  name={`variants.${index}.optionTitle`}
  onChange={(e) => {
    formikProps.handleChange(e);
    const optionIndex = formikProps.values.variants.findIndex((variant, i) => i === index);
    if (optionIndex !== -1) {
      const newVariants = [...formikProps.values.variants];
      newVariants[optionIndex].optionTitle = e.target.value;
      formikProps.setFieldValue('variants', newVariants);

      // Remove optionId for predefined options
      formikProps.setFieldValue(`variants.${index}.optionId`, undefined);
    }
  }}
  value={variant.optionTitle}
  variant="outlined"
  SelectProps={{ native: true }}
>
  <option value="" disabled>
    Select an option title
  </option>
  {optionTitles.map((title) => (
    <option key={title.id} value={title.id.toString()}>
      {title.name}
    </option>
  ))}
</TextField>

            <Box mt={2}>
              <TextField
                fullWidth
                label="Option Values"
                name={`variants.${index}.optionValues`}
                onChange={formikProps.handleChange}
                value={variant.optionValues}
                helperText="Comma separated values (e.g., Red,Blue,Green)"
                variant="outlined"
              />
            </Box>
            <Box mt={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={variant.includeImage}
                  onChange={(e) => {
                    const newVariants = [...formikProps.values.variants];
                    newVariants[index].includeImage = e.target.checked;
                    formikProps.setFieldValue('variants', newVariants);
                  }}
                  name={`variants.${index}.includeImage`}
                />
              }
              label="Include Image"
            />
 {variant.includeImage && (
  <FormControl fullWidth>
    <InputLabel>Select Image</InputLabel>
    <Select
      value={variant.imageId || ''}
      onChange={(e) => {
        const newVariants = [...formikProps.values.variants];
        newVariants[index].imageId = e.target.value;
        formikProps.setFieldValue('variants', newVariants);
      }}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {uploadedImages.map((image) => (
        <MenuItem key={image.id} value={image.index}>
          <img src={image.preview} alt="preview" style={{ width: 50, height: 50, marginRight: 10 }} />
          Image {image.index + 1}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}
          </Box>
          
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        onClick={() => push({
          optionTitle: '',
          optionValues: '',
          includeImage: false,
        })}
        startIcon={<AddIcon />}
      >
        Add Variant
      </Button>
      <Button
        variant="outlined"
        onClick={() => setShowCustomVariantDialog(true)}
        sx={{ ml: 2 }}
      >
        Add Custom Variant
      </Button>
      <Dialog open={showCustomVariantDialog} onClose={() => setShowCustomVariantDialog(false)}>
  <DialogTitle>Add Custom Variant</DialogTitle>
  <DialogContent>
    <Box paddingBottom={2}>
      <TextField
        fullWidth
        label="Custom Option Title"
        name="customOptionTitle"
        onChange={(e) => setCustomOptionTitle(e.target.value)}
        value={customOptionTitle}
        variant="outlined"
      />
    </Box>
    <TextField
      fullWidth
      label="Custom Option Values"
      name="customOptionValues"
      onChange={(e) => setCustomOptionValues(e.target.value)}
      value={customOptionValues}
      variant="outlined"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setShowCustomVariantDialog(false)}>Cancel</Button>
    <Button
  onClick={async () => {
    try {
      // Save the custom option and get the new option ID
      const newOptionId = await saveCustomOption(customOptionTitle, customOptionValues);
      
      // Add the custom option to the state
      setOptionTitles(prevTitles => [...prevTitles, { id: newOptionId, name: customOptionTitle }]);
      
      // Add the custom variant with the new option ID
      push({
        optionTitle: customOptionTitle,
        optionId: newOptionId, // Use the new option ID
        optionValues: customOptionValues, // Store as a single value
        includeImage: false,
      });

      // Reset the dialog fields
      setCustomOptionTitle('');
      setCustomOptionValues('');
      setShowCustomVariantDialog(false);
    } catch (error) {
      console.error("Error adding custom variant:", error);
      alert("Failed to add custom variant. Please try again.");
    }
  }}
  disabled={!customOptionTitle || !customOptionValues}
>
  Add
</Button>
  </DialogActions>
</Dialog>

    </>
  )}
</FieldArray>


                        
                        <Box mt={3}>
                            <TableContainer component={Paper}>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Variant</TableCell>
                                    <TableCell>Update Price</TableCell>
                                    <TableCell>Update Quantity</TableCell>
                                    <TableCell>Active</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {formikProps.values.variants.map((variant, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{variant.optionValues}</TableCell>
                                      <TableCell>
                                        <TextField
                                          fullWidth
                                          type="number"
                                          name={`variants.${index}.price`}
                                          value={variant.price || ''}
                                          onChange={formikProps.handleChange}
                                          variant="outlined" />
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          fullWidth
                                          type="number"
                                          name={`variants.${index}.quantity`}
                                          value={variant.quantity || ''}
                                          onChange={formikProps.handleChange}
                                          variant="outlined" />
                                      </TableCell>
                                      <TableCell>
                                        <Checkbox
                                          checked={variant.isActive || false}
                                          onChange={formikProps.handleChange}
                                          name={`variants.${index}.isActive`} />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box></>
)}



                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card>
                <CardHeader title="Organize" />
                <Divider />
                <CardContent>
                <Autocomplete
                  id="categories"
                  options={childCategories}
                  getOptionLabel={(option) => option.title}
                  onChange={handleCategoryChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Categories"
                      name="categories"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'categories',
                      }}
                    />
                  )}
                />
                  <Box mt={2}>
                    {selectedCategory && parentCategory && (
                      <Typography variant="body2">
                        Your category is {selectedCategory.title} in {parentCategory.title}.
                      </Typography>
                    )}
                  </Box>
      
                  <Box mt={2}>
                    <TextField
                      error={Boolean(
                        formikProps.touched.quantity &&
                          formikProps.errors.quantity,
                      )}
                      fullWidth
                      helperText={
                        formikProps.touched.quantity &&
                        formikProps.errors.quantity
                      }
                      label="Quantity"
                      name="quantity"
                      type="number"
                      onBlur={formikProps.handleBlur}
                      onChange={formikProps.handleChange}
                      value={formikProps.values.quantity}
                      variant="outlined"
                    />
                  </Box>
                    <Box mt={2}>
                      <TextField
                        fullWidth
                        label="Status"
                        name="status"
                        onBlur={formikProps.handleBlur}
                        onChange={formikProps.handleChange}
                        value={formikProps.values.status}
                        variant="outlined"
                      />
                    </Box>
 
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {error && (
            <Box mt={3}>
              <FormHelperText error>{error}</FormHelperText>
            </Box>
          )}
            <Box sx={{ mt: 2 }}>
              <Button
                color="primary"
                disabled={formikProps.isSubmitting}
                size="large"
                type="submit"
                variant="contained"
              >
                Create Product
              </Button>
            </Box>
          </form>
        );
      }}
    </Formik>
  );
};

export default ProductCreateForm;
