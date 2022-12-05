import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { NextPage } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  Box,
  Container,
  Link,
  Typography,
  Button,
  TextField,
} from "@mui/material";

import { ShopDetailsItem } from "@interfaces/account";

import { AuthGuard } from "@components/authentication/auth-guard";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { AccountSettingsShopsDetails } from "@components/dashboard/account/account-settings-shops-details";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const initialShopDetails = [
  {
    host: "https://www.kindsgut.de/shop/test2/api/",
    name: "matthias",
    apiKey: "6P1TulAufDqxd8MCP9PDi4qi8f2khzZPeA5XVfgZ",
  },
  {
    host: "https://www.kindsgut.de/shop/api/",
    name: "admin",
    apiKey: "aBhrwqrM2s3vATmU62WzlPWkgXtdOAI0Lg382Bao",
  },
];

export const AccountSettingsShops = (props) => {
  const [shopDetails, setShopDetails] =
    useState<ShopDetailsItem[]>(initialShopDetails);

  const handleAddChange = (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      elements: {
        hosturl: { value: string };
        fullname: { value: string };
        apiKey: { value: string };
      };
    };

    if (
      !shopDetails.filter(
        (item) =>
          item.host === target.elements.hosturl.value &&
          item.name === target.elements.fullname.value &&
          item.apiKey === target.elements.apiKey.value
      ).length
    ) {
      setShopDetails((prev) =>
        prev.concat({
          host: target.elements.hosturl.value,
          name: target.elements.fullname.value,
          apiKey: target.elements.apiKey.value,
        })
      );
      target.elements.hosturl.value = "";
      target.elements.fullname.value = "";
      target.elements.apiKey.value = "";
    }
  };
  const handleDeleteChange = (name: string): void => {
    setShopDetails((prev) => prev.filter((item) => item.name !== name));
  };

  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleAddChange}>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <TextField
                // helperText={formik.touched.name && formik.errors.name}
                name="hosturl"
                label="Host"
                required
                sx={{ mr: 2 }}
              />
              <TextField
                // helperText={formik.touched.name && formik.errors.name}
                name="fullname"
                label="Full Name"
                required
                sx={{ mr: 2 }}
              />
              <TextField
                // helperText={formik.touched.name && formik.errors.name}
                name="apiKey"
                label="ApiKey"
                required
                sx={{ mr: 2 }}
              />
            </Box>
            <Button sx={{ m: 1 }} type="submit" variant="contained">
              Add
            </Button>
          </Box>
        </form>
        <AccountSettingsShopsDetails
          shopDetails={shopDetails}
          handleDelete={handleDeleteChange}
        />
      </CardContent>
    </Card>
  );
};

AccountSettingsShops.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default AccountSettingsShops;
