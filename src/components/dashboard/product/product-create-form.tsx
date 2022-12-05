
import { useState, useEffect } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik, ErrorMessage } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Select,
  CardHeader,
  Link,
  InputLabel,
  FormControl,
  CircularProgress
} from "@mui/material";

import { ErrorOutline, Delete} from "@mui/icons-material";

import { useAsync } from "@hooks/use-async";
import axios from "axios";

import { SearchSelect } from "./product-search-select";
import MultipleSelectCheckmarks  from "./product-multi-select";
import SingleSelect from './product-single-select';
import CheckboxLabel from "./product-checkbox-label";
import ProductModal from "./product-modal";

const sizeOptions = ["18, 19", "20, 21", "22, 23", "24, 25"];

export const ProductCreateForm: FC = (props) => {
  const { t } = useTranslation();
  const { value, run, status } = useAsync();
  const router = useRouter();
  const [moreOption, setMoreOption] = useState<boolean>(false);
  const [sizeCount, setSizeCount] = useState<number[]>([1]);
  const [addMedia, setAddMedia] = useState<number[]>([1]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  
  const formik = useFormik({
    initialValues: {
      articleType: "",
      brandCode: "",
      targetGenders: [],
      targetAge: [],
      articleId: "",
      name: "",
      size:"",
      length:"",
      seasonCode: "",
      variantId: "",
      description: "",
      colorCode: "",
      secondary: "",
      ternary: "",
      url: [""],
      supplierCode: "",
      sizes: [
        {
          ean: "",
          sizeId: "",
          variantSize: "",
        },
      ],
      submit: null,
    },
    validationSchema: Yup.object({
      articleType: Yup.string().max(255),
      brandCode: Yup.string().max(255),
      targetGenders: Yup.array().length(1, t("TargetGenders must have 1 items.")).required(),
      targetAge: Yup.array().length(1, t("TargetAgeGroups must have 1 items.")).required(),
      articleId: Yup.number().max(255).required(t("Article ID is a required field.")),
      name: Yup.string().max(255).required(t("Name is a required field.")),
      size: Yup.string().max(255).required(t("Size is a required field.")),
      length: Yup.string().max(255),
      seasonCode: Yup.string().max(255),
      variantId: Yup.number().max(255).required(t("Variant ID is a required field.")),
      description: Yup.string().max(255),
      colorCode: Yup.string().max(255).required(t("Color Code is a required field.")),
      secondary: Yup.string().max(255),
      ternary: Yup.string().max(255),
      url: Yup.array(
        Yup.string().required("URL is a required field."),
      ),
      supplierCode: Yup.string().max(255),
      sizes: Yup.array().of(
        Yup.object().shape({
          ean: Yup.string().max(255).required(t("EAN is a required field.")),
          sizeId: Yup.string().max(255).required(t("Size ID is a required field.")),
          variantSize: Yup.string().max(255).required(t("Variant Size is a required field.")),
        })
      )
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const submittedData = {
    // outline name
    "outline": formik.values.articleType,
    "product_model":{
    
    
    // article id
      "merchant_product_model_id":formik.values.articleId,
      "product_model_attributes":{
    
    
      // article name	
        "name": formik.values.name,
      
      
      //** article brandcode
        "brand_code":formik.values.brandCode,
        "size_group":{
      
      
      //** size group
          "size":formik.values.size
        },
      
      
      // target_genders
        "target_genders": formik.values.targetGenders,
              
      // target age
        "target_age_groups": formik.values.targetAge

      },
      "product_configs":[
        {
      
      
      // article variant code
          "merchant_product_config_id": formik.values.variantId,
          "product_config_attributes":{
      
      
      // color primary
            "color_code.primary":formik.values.colorCode,
        
        
        // description
            "description":{
              "en": formik.values.description
            },
        
        
            "material.upper_material_clothing":[
              {
                "material_code":"li",
                "material_percentage":97.5
              },
              {
                "material_code":"el",
                "material_percentage":2.5
              }
            ],
        
        
            "media":[
              {
                "media_path":formik.values.url,
                "media_sort_key":1
              },
            ],
        
        
        // season code
            "season_code": formik.values.seasonCode,
        
        
        // suplier color
            "supplier_color": formik.values.supplierCode
          },
      
          "product_simples": formik.values.sizes.map((item)=>({
            "merchant_product_simple_id":item.sizeId,
              "product_simple_attributes":{
                "ean":item.ean,
                "size_codes":{
                  "size":item.variantSize
                }
              }
          }))
        },
      ]
    }
  };

  const getAllData = async () => {
    const articles = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/articles`
    );

    const variants = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/variants_adv`
    );

    const outlines = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/outlines`
    );

    const brandCodes = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/brandcode`
    );

    const targetGender = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/target_genders`
    );
    
    const targetAgeGroups = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/target_age_groups`
    );

    const size = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/size`
    );

    console.log("test7")

    const seasonCode = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/season_code`
    );
    
    const colorCode = await axios.get(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/attribute/color_code`
    );
    
    return {
      articles: articles.data.data,
      variants: variants.data.data,
      outlines: outlines.data.data,
      brandCodes: brandCodes.data.data,
      targetGender: targetGender.data.data,
      targetAgeGroups: targetAgeGroups.data.data,
      size: size.data.data,
      seasonCode: seasonCode.data.data,
      colorCode: colorCode.data.data
    };
  }; 

  const handleAnotherVariantsChange = async () => {
    const params = {
      // outline name
      "outline": formik.values.articleType,
      "product_model":{
      
      
      // article id
        "merchant_product_model_id":formik.values.articleId,
        "product_model_attributes":{
      
      
        // article name	
          "name": formik.values.name,
        
        
        //** article brandcode
          "brand_code":formik.values.brandCode,
          "size_group":{
        
        
        //** size group
            "size":formik.values.size
          },
        
        
        // target_genders
          "target_genders": formik.values.targetGenders,
                
        // target age
          "target_age_groups": formik.values.targetAge
  
        },
        "product_configs":[
          {
        
        
        // article variant code
            "merchant_product_config_id": formik.values.variantId,
            "product_config_attributes":{
        
        
        // color primary
              "color_code.primary":formik.values.colorCode,
          
          
          // description
              "description":{
                "en": formik.values.description
              },
          
          
              "material.upper_material_clothing":[
                {
                  "material_code":"li",
                  "material_percentage":97.5
                },
                {
                  "material_code":"el",
                  "material_percentage":2.5
                }
              ],
          
          
              "media":[
                {
                  "media_path":formik.values.url,
                  "media_sort_key":1
                },
              ],
          
          
          // season code
              "season_code": formik.values.seasonCode,
          
          
          // suplier color
              "supplier_color": formik.values.supplierCode
            },
        
            "product_simples": formik.values.sizes.map((item)=>({
              "merchant_product_simple_id":item.sizeId,
                "product_simple_attributes":{
                  "ean":item.ean,
                  "size_codes":{
                    "size":item.variantSize
                  }
                }
            }))
          },
        ]
      }
    }
    
    if(formik.values.targetGenders.length && formik.values.targetAge.length && formik.values.articleId && formik.values.name && formik.values.size && formik.values.variantId && formik.values.url && formik.values.colorCode && !formik.values.sizes.filter((item)=> !item.ean ||!item.sizeId || !item.variantSize ).length) {
      setIsSubmitting(true)
      console.log("ss")
      const res = await axios.post(`${process.env.NEXT_PUBLIC_HOST_URL}/api/zalando/submission`, { params })
    
      if (res.data.data === 200)
        toast.success("Successfully submitted");
      else
        toast.error("Submit failed");
      setIsSubmitting(false)
    }
    else {
      // if (formik.errors.sizes && formik.errors.sizes.length) {
      //   setSizesError((prev)=>{
      //     const newErrorState = [];
      //     formik.errors.sizes.forEach((item: SizeErrorProps)=>{
      //       newErrorState.push({ean:item.ean, sizeId: item.sizeId, variantSize: item.variantSize})
      //     })
      //     return newErrorState
      //   })
      // }
    }
  };

  useEffect(() => {
    run(getAllData());
  }, []);

  useEffect(()=>{
    formik.values.name = value?.articles?.filter((item)=> item.id === formik.values?.articleId).length && value.articles?.filter((item)=> item.id === formik.values?.articleId)[0].name;
    formik.values.description = value?.articles?.filter((item)=> item.id === formik.values?.articleId).length && value.articles?.filter((item)=> item.id === formik.values?.articleId)[0].description;
    formik.values.variantId = value?.variants?.filter((item)=> item.articleId == formik.values?.articleId).length && value.variants?.filter((item)=> item.articleId == formik.values?.articleId)[0].id;
  }, [formik.values.articleId])

  return (
    <Box sx={{
      height: "100%",
      position: "relative",
      background: (theme) => (
        {
          md: theme.palette.background.paper
        }
      ),
    }}>
      <Card>
        <CardHeader 
          title={<Typography variant="h5" 
            sx={{
              paddingBottom: '12px',
              borderBottom: (theme) => (
                {
                  md: `1px solid ${theme.palette.divider}`
                }
              ),
            }}>{t("Choose your Article Type")}
            </Typography>} 
          titleColor="black" 
          sx={{paddingBottom: "0px", fontWeight: 'bold'}}></CardHeader>
      </Card>
      { status === "loading" ? 
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box> : 
        <Box>
          <form onSubmit={formik.handleSubmit} {...props} style={{height: "100%"}}>
            <Box>
              <Card>
                <CardContent>
                  <Grid container spacing={5}>
                    <Grid item md={6} xs={12}>
                    <SearchSelect 
                      allOptions={value?.outlines?.map((item)=>({value:item.name.en, show:item.name.en}))} 
                      label={t('Article Type')}
                      name="articleType"
                      formik={formik}
                    />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              <Card>
                <CardHeader 
                  title={<Typography variant="h5" 
                    sx={{
                      paddingBottom: '12px',
                      borderBottom: (theme) => (
                        {
                          md: `1px solid ${theme.palette.divider}`
                        }
                      ),
                    }}>{t("Article Details")}
                    </Typography>} 
                  titleColor="black" 
                  sx={{paddingBottom: "0px", fontWeight: 'bold'}}></CardHeader>
                <CardContent>
                <Grid container spacing={5} sx={{mb: 3}}>
                  <Grid item md={6} xs={12}>
                    <SingleSelect 
                      label={t("Brand Code")} 
                      allOptions={value?.brandCodes?.map((item)=>({value: item.name.en, show: item.name.en}))}
                      name="brandCode"
                      formik={formik}
                    />
                  </Grid>
                  <Grid item md={6} xs={12} sx={{display: "flex"}}>
                    <MultipleSelectCheckmarks 
                      label={t("Target Genders")} 
                      allOptions={value?.targetGender?.map((item)=>({value:item.value.string, show: item.name.en}))} 
                      name='targetGenders' 
                      formik={formik}/>
                    <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{mb: 3}}>
                  <Grid item md={6} xs={12} sx={{display: "flex"}}>
                    <MultipleSelectCheckmarks 
                      label={t("Target Age Groups")} 
                      allOptions={value?.targetAgeGroups?.map((item)=>({value:item.value.string, show: item.name.en}))} 
                      name='targetAge' 
                      formik={formik}/>
                  <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                  <Grid item md={6} xs={12} sx={{display: "flex"}}>
                    <SearchSelect 
                      allOptions={value?.articles?.map((item)=>({value:item.id, show: item.mainDetail?.number}))} 
                      label={t('Article ID')}
                      name="articleId"
                      formik={formik}
                    />
                  <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{mb: 3}}>
                  <Grid item md={6} xs={12} sx={{display: "flex"}}>
                    <TextField
                      sx={{width: "calc(100% - 40px)"}}
                      fullWidth
                      type="text"
                      autoComplete={formik.values.name}
                      variant="outlined"
                      label={t("Name")}
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={formik.touched.name && formik.errors.name}
                      error={Boolean(formik.touched.name && formik.errors.name)}
                    />  
                  <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                </Grid>
                <Box>
                  <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Typography variant="h6" sx={{mb: 3,}}>
                      {t('Size Group')}
                      <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                    </Typography>
                    <Button variant="outlined"
                      sx={{
                        marginRight: "40px",
                        color: (theme) => (
                          {
                            md: theme.palette.primary.main
                          }
                        ),
                      }}
                    >
                      {t('Size Chart')}</Button>
                  </Box>
                  <Grid container spacing={5} sx={{mb: 3}}>
                    <Grid item md={6} xs={12}>
                      <SingleSelect 
                        label={t("Size")} 
                        allOptions={value ?.size?.map((item)=>({
                          value: item.value.string,
                          show: item._meta.dimension.name + " - " + item._meta.descriptions.en
                        }))} 
                        formik={formik} 
                        name="size"/>
                    </Grid>
                    { value?.outlines?.filter((item)=>item.name.en === formik.values.articleType).length && 
                      value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.model.optional_types.length ? 
                        value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.model.optional_types.map((list)=> 
                          <Grid item md={6} xs={12} sx={{paddingTop: "16px !important"}} key={list}>
                            <TextField 
                              autoFocus
                              fullWidth
                              type="text"
                              variant="outlined"
                              sx={{width: "calc(100% - 40px)"}}
                              label={list}
                              />
                          </Grid>
                    ) : null}    
                  </Grid>
                </Box>
                </CardContent>
              </Card>
            </Box>
            <Box>
              <Card 
                sx={{
                  display:"flex", 
                  justifyContent:"space-between", 
                  alignItems:"center",
                  px: 2,
                  borderBottom: (theme) => (
                    {
                      md: `1px solid ${theme.palette.divider}`
                    }
                  ),
                  }}>
                <CardHeader 
                  title={<Typography variant="h5" 
                    sx={{
                      paddingBottom: '20px',
                    }}>{t('Article Varaint 1')}
                    </Typography>} 
                  titleColor="black" 
                  sx={{
                    paddingBottom: "0px",
                    fontWeight: 'bold',
                  }}
                />
                <CheckboxLabel checked={moreOption} setMoreOption={setMoreOption}/>
              </Card>
              <Card 
                sx={{
                  p:5
                }}
              >
                <Grid container spacing={5}>
                  <Grid item md={6} xs={12}>
                    <SingleSelect label={t("Season Code")} allOptions={value?.seasonCode?.map((item)=>({value:item.value.localized.en, show:item.value.localized.en}))} formik={formik} name="seasonCode"/>
                  </Grid> 
                  <Grid item md={6} xs={12}>
                    <TextField
                      sx={{width: "calc(100% - 40px)"}}
                      fullWidth
                      type="text"
                      label={t("Article Variant ID")}
                      variant="outlined"
                      name="variantId"
                      value={formik.values.variantId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={formik.touched.variantId && formik.errors.variantId}
                      error={Boolean(formik.touched.variantId && formik.errors.variantId)}
                      />
                    <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{mt: 1}}>
                  <Grid item md={6} xs={12}>
                  <TextField
                    sx={{width: "calc(100% - 40px)"}}
                    fullWidth={true}
                    multiline={true}
                    rows={5}
                    label={t('Description')}  
                    variant='outlined'
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText={formik.touched.description && formik.errors.description}
                    error={Boolean(formik.touched.description && formik.errors.description)}
                  />
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{mt: 1}}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h6">Media</Typography>
                  </Grid>
                  <Grid item md={12} xs={12} sx={{paddingTop: "16px !important"}}>
                    {formik?.values.url.length && formik?.values.url.map((item, index)=>
                      <Box key={index}>
                        <TextField
                          sx={{width: "calc(100% - 70px)"}}
                          id="outlined-helperText"
                          label={t("URL")}
                          placeholder="https://www.example.com"
                          name={`url${index}`}
                          value={formik.values.url[index]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          helperText={formik.errors && formik.errors.url && formik.errors.url.length && formik.errors.url[index] && formik.errors.url[index]}
                          error={Boolean(formik.errors && formik.errors.url && formik.errors.url.length && formik.errors.url[index] && formik.errors.url[index])}
                        />
                        <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                        {formik?.values.url.length > 1 && 
                          <Delete 
                            width="20px" 
                            sx={{marginLeft: "10px"}} 
                            onClick={()=>{
                              formik.values.url.splice(index,1)
                              setAddMedia((prevState)=>
                              prevState.length === 1 ? prevState : prevState.filter((li, ind)=> ind !== index))
                            }}
                          />
                        }
                      </Box>
                      )}
                    
                  </Grid>
                  <Grid item md={12} xs={12} sx={{paddingTop: "16px !important"}}>
                    <Button variant="outlined" onClick={()=>{
                      formik.values.url.push('');
                      setAddMedia((prevState)=>(prevState.concat(prevState.length + 1)));
                    }}>{t('Add Another Image')}</Button>
                  </Grid>
                </Grid>
                <Grid container spacing={5} sx={{mt: 1}}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h6">Colors</Typography>
                  </Grid>
                  <Grid item md={6} xs={12} sx={{display:"flex", paddingTop: "16px !important"}}>
                    <SingleSelect label={t("Color Code - Primary")} allOptions={value?.colorCode?.map((item)=>({value:item.value.localized.en + "-" + item.label,show:item.value.localized.en + "-" + item.label}))} formik={formik} name='colorCode'/> 
                    <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                  </Grid>
                  <Grid item md={6} xs={12} sx={{paddingTop: "16px !important"}}>
                    <TextField
                      sx={{width: "calc(100% - 40px)"}}
                      autoFocus
                      fullWidth
                      type="text"
                      label={t("Supplier Code")}
                      name="supplierCode"
                      value={formik.values.supplierCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText={formik.touched.supplierCode && formik.errors.supplierCode}
                      error={Boolean(formik.touched.supplierCode && formik.errors.supplierCode)}
                    />  
                  </Grid>
                    {moreOption && value?.outlines?.filter((item)=>item.name.en === formik.values.articleType).length && 
                      value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.config.optional_types.length && 
                        value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.config.optional_types.map((list)=> 
                          <Grid item md={6} xs={12} sx={{paddingTop: "16px !important"}} key={list}>
                            <TextField 
                              autoFocus
                              fullWidth
                              type="text"
                              variant="outlined"
                              sx={{width: "calc(100% - 40px)"}}
                              label={list}
                              />
                          </Grid>
                    )}    
                </Grid>
              </Card>
              <Card>
                <Box 
                  sx={{
                    mx:2,
                    py:2, 
                    display:"flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    borderBottom : (theme) => (
                      {
                        md: `1px solid ${theme.palette.divider}`
                      }
                    ),
                    }}>
                  <Box>
                    <Typography variant="h6">Sizes</Typography>
                    <Typography>{t('Add sizes for your variant, or import sizes using the important functionality')}</Typography>
                  </Box>
                  <Button 
                    variant='outlined'
                    sx={{
                      color: (theme) => (
                        {
                          md: theme.palette.primary.main
                        }
                      ),
                    }}
                  >{t('Import Size Data')}
                  </Button>
                </Box>
                {formik.values.sizes.map((item, index)=>
                  <CardContent key={index}>
                    <Box sx={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                      <Typography sx={{fontWeight: "bold"}}>{t('Size')}</Typography>
                      {formik.values.sizes.length > 1 && 
                        <Delete 
                          onClick={()=>{
                            formik.values.sizes.splice(index,1)
                            setSizeCount((prevState)=>
                            prevState.length === 1 ? prevState : prevState.filter((li, ind)=> ind !== index))
                          }}
                          sx={{marginRight: "8px", zIndex: "999999",}}
                        />}
                    </Box>
                    <Box sx={{py: 1}}>
                      <Grid container spacing={5}>
                        <Grid item md={6} xs={12} sx={{mt:0, display: "flex"}}>
                          <TextField
                            autoFocus
                            fullWidth
                            type="text"
                            sx={{width: "calc(100% - 40px)"}}
                            label={t("EAN")}
                            name={`sizes.${index}.ean`}
                            value={formik.values.sizes[index].ean}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.errors && formik.errors.sizes && formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["ean"]}
                            error={Boolean(formik.errors && formik.errors.sizes && formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["ean"])}
                          />  
                          <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                        </Grid>
                        <Grid item md={6} xs={12} sx={{mt:0, display: "flex"}}>
                          <TextField
                            autoFocus
                            fullWidth
                            type="text"
                            sx={{width: "calc(100% - 40px)"}}
                            label={t("Variant Size ID")}
                            name={`sizes.${index}.sizeId`}
                            value={formik.values.sizes[index].sizeId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            helperText={formik.errors && formik.errors.sizes && formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["sizeId"]}
                            error={Boolean(formik.errors && formik.errors.sizes &&  formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["sizeId"])}
                          />  
                          <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                        </Grid>
                        <Grid item md={6} xs={12} sx={{mt:0, display: "flex"}}>
                          <Box sx={{ width: "calc(100% - 40px)"}}>
                            <FormControl sx={{ width: "100%" }}>
                              <InputLabel 
                                sx={formik.errors && formik.errors.sizes &&  formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["variantSize"]&& {
                                  color: (theme) => (
                                    {
                                      md: theme.palette.error.main
                                    }
                                  ),
                                }}
                              >
                                {t('Size')}
                              </InputLabel>
                              <Select
                                value={item.variantSize}
                                name={`sizes.${index}.variantSize`}
                                label={t("Size")}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.errors && formik.errors.sizes &&  formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["variantSize"])}
                              >
                                {value?.size?.filter((item)=>item.value.string === formik.values.size).length && 
                                  value?.size?.filter((item)=>item.value.string === formik.values.size)[0]._meta.sizes.filter((size)=>size.sort_key === 1)[0].conversions.map((list)=>                         
                                  <MenuItem value={list.raw} key={list}>{list.raw}</MenuItem>
                                )}
                              </Select>
                              <Typography sx={{
                                fontSize:'12px',
                                marginLeft:"14px",
                                marginTop: "3px",
                                color: (theme) => (
                                  {
                                    md: theme.palette.error.main
                                  }
                                ),}}>
                                {formik.errors && formik.errors.sizes &&  formik.errors.sizes.length && formik.errors.sizes[index] && formik.errors.sizes[index]["variantSize"]}
                              </Typography>
                            </FormControl>
                          </Box>
                          <ErrorOutline width="20px" sx={{marginLeft: "10px"}}/>
                        </Grid>
                        {moreOption && value?.outlines?.filter((item)=>item.name.en === formik.values.articleType).length && 
                          value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.simple.optional_types.length ? 
                            value?.outlines?.filter((item)=>item.name.en === formik.values.articleType)[0].tiers.simple.optional_types.map((list)=> 
                              <Grid item md={6} xs={12} sx={{mt:0, display: 'flex'}} key={list}>
                                <TextField 
                                  autoFocus
                                  fullWidth
                                  type="text"
                                  variant="outlined"
                                  sx={{width: "calc(100% - 40px)"}}
                                  label={list}
                                  />
                              </Grid>
                        ): null}    
                      </Grid>
                      <Link href="#" underline="always" variant="body2" sx={{mt:2, display:"inline-block"}}>
                        {t('Show optional attributes')}
                      </Link>
                    </Box>
                  </CardContent>
                )}
                <Box sx={{textAlign: "left", mt: 0}}>
                  <Button variant="contained"
                      sx={{
                        m: 3
                      }}
                      onClick={()=>{
                        formik.values.sizes.push({
                          ean:'',
                          sizeId:'',
                          variantSize:'',
                        })
                        setSizeCount((prevState)=>(prevState.concat(prevState.length + 1)))
                      }}
                    >
                    {t('Add Another Size')}
                  </Button>
                </Box>
              </Card>

              <Box 
                sx={{
                  textAlign: "right", 
                  marginTop: "70px",
                  position: "fixed",
                  bottom: "20px",
                  right: "40px"
                  }}>
                <Button 
                  variant='outlined'
                  sx={{
                    marginRight: "40px",
                    color: (theme) => (
                      {
                        md: theme.palette.primary.main
                      }
                    ),
                    width: "200px"
                  }}
                  onClick={()=>setOpen(true)}
                > {t('PREVIEW')}
                </Button>
                <Button variant="contained"
                  sx={{
                    marginRight: "40px",
                  }}
                  type="submit"
                  // disabled={isSubmitting}
                  onClick = {handleAnotherVariantsChange}
                >
                  {t('Save & Add Another Variant')}
                </Button>
              </Box>
              <ProductModal open={open} setOpen={setOpen} submittedData={submittedData}/>
            </Box>
          </form>
        </Box>
        }
    </Box>
  );
};
