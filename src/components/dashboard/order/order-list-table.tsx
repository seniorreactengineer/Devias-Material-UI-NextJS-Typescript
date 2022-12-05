import { useState, useEffect } from "react";
import type { ChangeEvent, FC, MouseEvent } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import numeral from "numeral";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  Box,
  Checkbox,
  Button,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { Order } from "@interfaces/order";

import { SeverityPill } from "../../severity-pill";
import type { SeverityPillColor } from "../../severity-pill";

import { getMonthDay } from "@lib/date";

import { useSettings } from "@hooks/use-settings";

interface OrderListTableProps {
  onOpenDrawer?: (orderId: string) => void;
  onPageChange?: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  orders: Order[];
  ordersCount: number;
  page: number;
  rowsPerPage: number;
}

const severityMap = (state) => {
  const id = state % 4;
  switch (id) {
    case 0:
      return { color: "info", state: "open" };
    case 1:
      return { color: "success", state: "completely delivered" };
    case 2:
      return { color: "warning", state: "returned" };
    case 3:
      return { color: "error", state: "canceled" };
  }
};
const severityMapPayment = (state) => {
  switch (state) {
    case 0:
      return { color: "info", state: "open" };
    case 1:
      return { color: "success", state: "completely paid" };
    case 2:
      return { color: "warning", state: "partly invoiced" };
    case 3:
      return { color: "error", state: "completely invoiced" };
  }
};

export const OrderListTable: FC<OrderListTableProps> = (props) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    orders,
    ordersCount,
    page,
    rowsPerPage,
    ...other
  } = props;
  const { settings } = useSettings();
  const documentTypeConfig = settings?.documentType;

  useEffect(
    () => {
      if (selectedOrders.length) {
        setSelectedOrders([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders]
  );

  const handleSelectAllOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedOrders(event.target.checked ? orders : []);
  };

  const handleSelectOneOrder = (
    event: ChangeEvent<HTMLInputElement>,
    order
  ): void => {
    if (!selectedOrders.find((selOrder) => selOrder.id === order.id)) {
      setSelectedOrders((prevSelected) => [...prevSelected, order]);
    } else {
      setSelectedOrders((prevSelected) =>
        prevSelected.filter((id) => id.id !== order.id)
      );
    }
  };

  const enableBulkActions = selectedOrders.length > 0;
  const selectedSomeOrders =
    selectedOrders.length > 0 && selectedOrders.length < orders.length;
  const selectedAllOrders = selectedOrders.length === orders.length;

  const handlePrint = async () => {
    if (documentTypeConfig.length <= 0) {
      toast.error("Check and Save Document Type from Settings/Document");
      return;
    }

    const pdfContentType =
      "JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAgL1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAwMDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G";

    setIsLoading(true);
    const pdf = await Promise.all(
      selectedOrders.map(async (selOrder) => {
        const selDocument = documentTypeConfig.find(
          (document) =>
            document.customer === selOrder.dispatch.customerGroupName
        );

        const pdfFile = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST_URL}/api/document`,
          { type: selDocument.document.id, orderId: selOrder.id }
        );

        let pdfContent = pdfFile.data.data.substring(
          pdfFile.data.data.search("%PDF-1.4")
        );

        const ret = Buffer.from(pdfContent).toString("base64");
        return ret;
      })
    );

    let iframeData = "";
    pdf.map((pdfBase64) => {
      iframeData +=
        "<iframe title='Invoice File'  width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(pdfContentType) +
        "'></iframe>";
    });

    var pdf_newTab = window.open("");

    setIsLoading(false);

    pdf_newTab.document.write(
      "<html><head><title>Print PDF Invoice</title></head><body>" +
        iframeData +
        "</body></html>"
    );
  };

  return (
    <div {...other}>
      <Table>
        <TableBody>
          {orders.map((order) => {
            const isOrderSelected = selectedOrders.find(
              (selOrder) => selOrder.id === order.id
            )
              ? true
              : false;
            return (
              <TableRow
                hover
                key={order.id}
                onClick={() => onOpenDrawer?.(order.id)}
                sx={{ cursor: "pointer", borderBottom: "1px solid #2D3748" }}
              >
                <TableCell padding="checkbox" sx={{ border: "none" }}>
                  <Checkbox
                    checked={isOrderSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(event) => handleSelectOneOrder(event, order)}
                    value={isOrderSelected}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    border: "none",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "neutral.800"
                          : "neutral.200",
                      borderRadius: 2,
                      maxWidth: "fit-content",
                      // ml: 3,
                      p: 1,
                    }}
                  >
                    <Typography align="center" variant="subtitle2">
                      {format(getMonthDay(order.changed), "LLL").toUpperCase()}
                    </Typography>
                    <Typography align="center" variant="h6">
                      {format(getMonthDay(order.changed), "d")}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 2 }}>
                    <Typography color="textSecondary" variant="body2">
                      {order.number}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {order.id}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                      width: "120px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        width: "100px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.dispatch.customerGroupName}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{
                        width: "100px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.payment.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                      width: "150px",
                      maxWidth: "150px",
                    }}
                  >
                    <Typography variant="subtitle2">
                      {order.shipping.company}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{
                        width: "130px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.shipping.firstName} {order.shipping.lastName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                      width: "100px",
                      maxWidth: "100px",
                    }}
                  >
                    <Typography variant="subtitle2">
                      {order.shipping.country.isoName}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{
                        width: "100px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${order.dispatchId} ${order.trackingCode}`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      ml: 2,
                      width: "200px",
                      maxWidth: "200px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        width: "180px",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.details?.map((item) => (
                        <span> {item.orderId}</span>
                      ))}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ border: "none" }}>
                  <Box
                    sx={{
                      mb: 1,
                    }}
                  >
                    <SeverityPill
                      color={
                        (severityMap(order.orderStatus.position % 4)
                          ?.color as SeverityPillColor) || "warning"
                      }
                    >
                      {severityMap(order.orderStatus.position % 4)?.state}
                    </SeverityPill>
                  </Box>
                  <Box>
                    <SeverityPill
                      color={
                        (severityMapPayment(order.paymentStatus.position % 4)
                          ?.color as SeverityPillColor) || "warning"
                      }
                    >
                      {
                        severityMapPayment(order.paymentStatus.position % 4)
                          ?.state
                      }{" "}
                    </SeverityPill>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: !enableBulkActions && "none",
          px: 2,
          py: 0.5,
        }}
      >
        <Checkbox
          checked={selectedAllOrders}
          indeterminate={selectedSomeOrders}
          onChange={handleSelectAllOrders}
        />
        <Button
          size="small"
          sx={{ ml: 3 }}
          onClick={handlePrint}
          disabled={isLoading}
        >
          Print PDF Invoice
        </Button>
      </Box>
      <TablePagination
        component="div"
        count={ordersCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 15, 25, 50, 75, 100, 150, 200, 250, 500]}
      />
    </div>
  );
};

OrderListTable.propTypes = {
  onOpenDrawer: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  orders: PropTypes.array.isRequired,
  ordersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
