import { useState } from "react";
import type { ChangeEvent, FC } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";

import type { Order } from "@interfaces/order";

import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";

import { getMonthDay } from "@lib/date";

interface OrderDetailsProps {
  order: Order;
}

const statusOptions = ["Canceled", "Complete", "Pending", "Rejected"];

export const OrderSummary: FC<OrderDetailsProps> = (props) => {
  const { order, ...other } = props;
  const { t } = useTranslation();
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [status, setStatus] = useState<string>(statusOptions[0]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const align = smDown ? "vertical" : "horizontal";

  return (
    <Card {...other}>
      <CardHeader title={t("Basic info")} />
      <Divider />
      <PropertyList>
        <PropertyList>
          <PropertyListItem align={align} label="ID" value={order.id} />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Changed Date")}
            value={format(getMonthDay(order.changed), "dd/MM/yyyy HH:mm")}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Number")}
            value={order.number}
          />
          <Divider />
          <PropertyListItem align={align} label={t("Customer")}>
            <Typography color="primary" variant="body2">
              {`${order.customer.firstname} ${order.customer.lastname}`}
            </Typography>
            <Typography color="primary" variant="body2">
              {order.customer.email}
            </Typography>
          </PropertyListItem>
          <Divider />
          {order?.payment.name && (
            <>
              <PropertyListItem
                align={align}
                label={t("Payment")}
                value={order.payment.name}
              />
              <Divider />
            </>
          )}
          {order?.dispatch.name && (
            <>
              <PropertyListItem
                align={align}
                label={t("Dispatch")}
                value={order.dispatch.name}
              />
              <Divider />
            </>
          )}
          {order?.partnerId && (
            <>
              <PropertyListItem
                align={align}
                label={t("PartnerId")}
                value={order.partnerId}
              />
              <Divider />
            </>
          )}
          {order?.shop.name && (
            <>
              <PropertyListItem
                align={align}
                label={t("Shop")}
                value={order.shop.name}
              />
              <Divider />
            </>
          )}
          <PropertyListItem
            align={align}
            label={t("Invoice Amount")}
            value={order.invoiceAmount.toString()}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Invoice AmountNet")}
            value={order.invoiceAmountNet.toString()}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Invoice Shipping")}
            value={order.invoiceShipping}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Invoice Shipping Net")}
            value={order.invoiceShippingNet}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Invoice Shipping TaxRate")}
            value={order.invoiceShippingTaxRate}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Order Time")}
            value={format(getMonthDay(order.orderTime), "dd/MM/yyyy HH:mm")}
          />
          <Divider />
          {order?.transactionId && (
            <>
              <PropertyListItem
                align={align}
                label={t("TransactionId")}
                value={order.transactionId}
              />
              <Divider />
            </>
          )}
          {order?.comment && (
            <>
              <PropertyListItem
                align={align}
                label={t("Comment")}
                value={order.comment}
              />
              <Divider />
            </>
          )}
          <PropertyListItem
            align={align}
            label={t("Customer Comment")}
            value={order.customerComment}
          />
          <Divider />
          {order?.internalComment && (
            <>
              <PropertyListItem
                align={align}
                label={t("Internal Comment")}
                value={order.internalComment}
              />
              <Divider />
            </>
          )}
          <PropertyListItem align={align} label="Net" value={order.net} />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("TaxFree")}
            value={order.taxFree}
          />
          <Divider />
          {order?.temporaryId && (
            <>
              <PropertyListItem
                align={align}
                label={t("TemporaryId")}
                value={order.temporaryId}
              />
              <Divider />
            </>
          )}
          {order?.referer && (
            <>
              <PropertyListItem
                align={align}
                label={t("Referer")}
                value={order.referer}
              />
              <Divider />
            </>
          )}
          {order?.clearedDate && (
            <>
              <PropertyListItem
                align={align}
                label={t("Cleared Date")}
                value={order.clearedDate}
              />
              <Divider />
            </>
          )}
          {order?.trackingCode && (
            <>
              <PropertyListItem
                align={align}
                label={t("TrackingCode")}
                value={order.trackingCode}
              />
              <Divider />
            </>
          )}
          <PropertyListItem
            align={align}
            label={t("Language ISO")}
            value={order.languageIso}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Currency")}
            value={order.currency}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Currency Factor")}
            value={order.currencyFactor}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("RemoteAddress")}
            value={order.remoteAddress}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("DeviceType")}
            value={order.deviceType}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("ProportionalCalculation")}
            value={order.isProportionalCalculation ? "Yes" : "No"}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Payment Status Id")}
            value={order.paymentStatus.position.toString()}
          />
          <Divider />
          <PropertyListItem
            align={align}
            label={t("Status")}
            value={statusOptions[order?.orderStatus.position || 0]}
          />
        </PropertyList>
        <Divider />
        <PropertyListItem align={align} label={t("Status")}>
          <Box
            sx={{
              alignItems: {
                sm: "center",
              },
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              mx: -1,
            }}
          >
            <TextField
              label="Status"
              margin="normal"
              name="status"
              onChange={handleChange}
              select
              SelectProps={{ native: true }}
              sx={{
                flexGrow: 1,
                m: 1,
                minWidth: 150,
              }}
              value={status}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </TextField>
            <Button sx={{ m: 1 }} variant="contained">
              Save
            </Button>
            <Button sx={{ m: 1 }}>Cancel</Button>
          </Box>
        </PropertyListItem>
      </PropertyList>
    </Card>
  );
};

OrderSummary.propTypes = {
  // @ts-ignore
  order: PropTypes.object.isRequired,
};
