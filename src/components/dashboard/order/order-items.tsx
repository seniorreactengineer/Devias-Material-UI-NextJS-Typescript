import type { FC } from "react";
import PropTypes from "prop-types";
import numeral from "numeral";
import { useTranslation } from "react-i18next";

import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import type { LineItem } from "@interfaces/order";

import { Scrollbar } from "../../scrollbar";

interface OrderItemsProps {
  orderItems: LineItem[];
}

export const OrderItems: FC<OrderItemsProps> = (props) => {
  const { orderItems, ...other } = props;
  const { t } = useTranslation();

  return (
    <Card {...other}>
      <CardHeader title={t("Line items")} />
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>{t("ArticleId")}</TableCell>
                <TableCell>{t("OrderNumber")}</TableCell>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("Quantity")}</TableCell>
                <TableCell>{t("Price")}</TableCell>
                <TableCell>{t("Status")}</TableCell>
                <TableCell>{t("Shipped")}</TableCell>
                <TableCell>{t("ShippedGroup")}</TableCell>
                <TableCell>{t("Modus")}</TableCell>
                <TableCell>{t("esdarticle")}</TableCell>
                <TableCell>{t("taxId")}</TableCell>
                <TableCell>{t("taxRate")}</TableCell>
                <TableCell>{t("ean")}</TableCell>
                <TableCell>{t("unit")}</TableCell>
                <TableCell>{t("ArticleDetailId")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="subtitle2">{item.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.articleId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{item.orderId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {item.articleName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{numeral(item.price).format("0,0.00")}</TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.statusId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.shipped}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.shippedGroup}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.mode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.esdArticle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.taxId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.taxRate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.ean}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{item.unit}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle2"
                      sx={{ textAlign: "center" }}
                    >
                      {item.articleDetailID}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={orderItems?.length}
        onPageChange={(): void => {}}
        onRowsPerPageChange={(): void => {}}
        page={0}
        rowsPerPage={5}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

OrderItems.propTypes = {
  orderItems: PropTypes.array.isRequired,
};
