import { useEffect } from "react";
import type { NextPage } from "next";
import NextLink from "next/link";
import Head from "next/head";

import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";

import { AuthGuard } from "@components/authentication/auth-guard";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { ProductCreateForm } from "@components/dashboard/product/product-create-form";

import { gtm } from "@lib/gtm";

const ProductCreate: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard: Product Create | Material Kit Pro</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl" sx={{height: '100%', paddingLeft: "0px !important", paddingRight: "0px !important"}}>
          <ProductCreateForm />
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default ProductCreate;
