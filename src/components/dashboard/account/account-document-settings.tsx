import { useState, useEffect } from "react";
import type { FC, ChangeEvent, MouseEvent } from "react";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Button,
  TextField,
  TableHead,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useAsync } from "@hooks/use-async";

import { Scrollbar } from "../../scrollbar";
import { MultiSelect } from "../../multi-select";

import axios from "axios";

import { toast } from "react-hot-toast";

import { useTranslation } from "react-i18next";

import { useSettings } from "@hooks/use-settings";

type DocumentType = {
  customer: string;
  document: { id: string; label: string; key: string };
  isReturn: boolean;
  isShipping: boolean;
};

export const AccountDocumentSettings: FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const { run, status, value } = useAsync();
  const { t } = useTranslation();
  const [documentType, setDocumentTypes] = useState<DocumentType[]>();
  const { settings, saveSettings } = useSettings();

  const handleEdit = (): void => {
    setIsEditing(!isEditing);
  };

  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const getCustomerGroups = async () => {
    const documents = await axios(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/documentTypes`
    );

    const customers = await axios(
      `${process.env.NEXT_PUBLIC_HOST_URL}/api/customerGroups`
    );

    // BEGINS : this is hardcoded for test mode
    const getRandomValue = (max) => {
      return Math.floor(Math.random() * max);
    };
    const documentInitSetting = customers.data.data.map((customer) => {
      return {
        customer: customer.name,
        document: {
          id: documents.data.data[0].id,
          label: documents.data.data[0].name,
          key: documents.data.data[0].key,
        },
        isReturn: getRandomValue(2) === 1 ? true : false,
        isShipping: getRandomValue(2) === 1 ? true : false,
      };
    });
    setDocumentTypes(documentInitSetting);
    // ENDS
    return documents.data.data.map((document) => ({
      id: document.id,
      label: document.name,
      value: document.name,
    }));
  };

  useEffect(() => {
    run(getCustomerGroups());
  }, []);

  const handleSave = (): void => {
    saveSettings({ ...settings, documentType });
    toast.success(t("Successfully configured") as string);
  };

  const handleIsReturn = (customer) => {
    const newDocument = documentType.map(
      (document): DocumentType => ({
        ...document,
        isReturn:
          customer === document.customer
            ? !document.isReturn
            : document.isReturn,
      })
    );
    setDocumentTypes(newDocument);
  };

  const handleIsShipping = (customer) => {
    const newDocument = documentType.map(
      (document): DocumentType => ({
        ...document,
        isShipping:
          customer === document.customer
            ? !document.isShipping
            : document.isShipping,
      })
    );
    setDocumentTypes(newDocument);
  };

  const handleCategoryChange = (val, customer) => {
    const newDocument = documentType.map(
      (doc): DocumentType => ({
        ...doc,
        document:
          customer === doc.customer
            ? val[val.length - 1 || 0] || "Rechnung"
            : doc.document,
      })
    );
    setDocumentTypes(newDocument);
  };

  const categoryValues = (customer): unknown[] => {
    return documentType
      .filter((doc) => doc.customer === customer)
      .map((doc) => doc.document);
  };

  return (
    <>
      {status === "success" ? (
        <>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Group</TableCell>
                    <TableCell>Document Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentType.map((customer) => {
                    return (
                      <TableRow
                        key={customer.customer}
                        sx={{
                          borderBottom: "1px solid #2D3748",
                          ml: 2,
                        }}
                      >
                        <TableCell
                          sx={{
                            alignItems: "center",
                            border: "none",
                            width: "30%",
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle2">
                              {customer.customer}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            alignItems: "center",
                            border: "none",
                            width: "70%",
                          }}
                        >
                          <Box sx={{ width: "100%", display: "flex" }}>
                            <Box sx={{ width: "60%", mr: 4 }}>
                              <MultiSelect
                                label={customer.document.label}
                                onChange={(value) =>
                                  handleCategoryChange(value, customer.customer)
                                }
                                options={value}
                                value={categoryValues(customer.customer)}
                              />
                            </Box>
                            <Box sx={{ width: "40%" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="isReturn"
                                    checked={customer.isReturn}
                                    onChange={() => {
                                      handleIsReturn(customer.customer);
                                    }}
                                  />
                                }
                                label={t("Return")}
                              />
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="isShipping"
                                    checked={customer.isShipping}
                                    onChange={() => {
                                      handleIsShipping(customer.customer);
                                    }}
                                  />
                                }
                                label={t("Shipping")}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Button
            color="primary"
            onClick={handleSave}
            sx={{ mt: 3, float: "right" }}
            variant="contained"
          >
            {t("Save Settings")}
          </Button>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 20,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};
