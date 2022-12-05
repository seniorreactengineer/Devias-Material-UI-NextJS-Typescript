import { useState } from "react";
import type { FC, MutableRefObject } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import numeral from "numeral";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

import { X as XIcon } from "@icons/x";

import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";

import { Order } from "@interfaces/order";

import { Scrollbar } from "../../scrollbar";
import { getMonthDay } from "@lib/date";

interface OrderDrawerProps {
  containerRef?: MutableRefObject<HTMLDivElement>;
  open?: boolean;
  onClose?: () => void;
  order?: Order;
}

const OrderPreview = (props) => {
  const { lgUp, onApprove, onEdit, onReject, order } = props;
  const align = lgUp ? "horizontal" : "vertical";
  const { t } = useTranslation();

  const statusOptions = [
    {
      label: t("OPEN"),
      value: "open",
    },
    {
      label: t("COMPLETELY DELIVERED"),
      value: "completely delivered",
    },
    {
      label: t("RETURNED"),
      value: "returned",
    },
    {
      label: t("CANCELED"),
      value: "canceled",
    },
  ];

  return (
    <>
      {/* <Box
        sx={{
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography color="textSecondary" sx={{ mr: 2 }} variant="overline">
          Actions
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            m: -1,
            "& > button": {
              m: 1,
            },
          }}
        >
          <Button onClick={onApprove} size="small" variant="contained">
            Approve
          </Button>
          <Button onClick={onReject} size="small" variant="outlined">
            Reject
          </Button>
          <Button
            onClick={onEdit}
            size="small"
            startIcon={<EditIcon fontSize="small" />}
          >
            Edit
          </Button>
        </Box>
      </Box> */}
      <Typography sx={{ my: 3 }} variant="h6">
        {t("Basic info")}
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={order.id}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Changed Date")}
          value={format(getMonthDay(order.changed), "dd/MM/yyyy HH:mm")}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Number")}
          value={order.number}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Customer")}
          sx={{ p: 0 }}
        >
          <Typography color="primary" variant="body2">
            {`${order.customer.firstname} ${order.customer.lastname}`}
          </Typography>
          <Typography color="primary" variant="body2">
            {order.customer.email}
          </Typography>
        </PropertyListItem>
        {order?.payment.name && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Payment")}
            value={order.payment.name}
            sx={{ p: 0 }}
          />
        )}
        {order?.dispatch.name && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Dispatch")}
            value={order.dispatch.name}
            sx={{ p: 0 }}
          />
        )}
        {order?.partnerId && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("PartnerId")}
            value={order.partnerId}
            sx={{ p: 0 }}
          />
        )}
        {order?.shop.name && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Shop")}
            value={order.shop.name}
            sx={{ p: 0 }}
          />
        )}
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Invoice Amount")}
          value={order.invoiceAmount}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Invoice AmountNet")}
          value={order.invoiceAmountNet}
          sx={{ p: 0 }}
        />
        {order.invoiceShipping > 0 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Invoice Shipping")}
            value={order.invoiceShipping}
            sx={{ p: 0 }}
          />
        )}
        {order.invoiceShippingNet > 0 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Invoice Shipping Net")}
            value={order.invoiceShippingNet}
            sx={{ p: 0 }}
          />
        )}
        {order.invoiceShippingTaxRate > 0 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Invoice Shipping TaxRate")}
            value={order.invoiceShippingTaxRate}
            sx={{ p: 0 }}
          />
        )}
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Order Time")}
          value={format(getMonthDay(order.orderTime), "dd/MM/yyyy HH:mm")}
          sx={{ p: 0 }}
        />
        {order?.transactionId && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("TransactionId")}
            value={order.transactionId}
            sx={{ p: 0 }}
          />
        )}
        {order?.comment && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Comment")}
            value={order.comment}
            sx={{ p: 0 }}
          />
        )}
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Customer Comment")}
          value={order.customerComment}
          sx={{ p: 0 }}
        />
        {order?.internalComment && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Internal Comment")}
            value={order.internalComment}
            sx={{ p: 0 }}
          />
        )}
        {order.net > 0 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Net")}
            value={order.net}
            sx={{ p: 0 }}
          />
        )}
        {order.taxFree > 0 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("TaxFree")}
            value={order.taxFree}
            sx={{ p: 0 }}
          />
        )}
        {order?.temporaryId && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("TemporaryId")}
            value={order.temporaryId}
            sx={{ p: 0 }}
          />
        )}
        {order?.referer && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Referer")}
            value={order.referer}
            sx={{ p: 0 }}
          />
        )}
        {order?.clearedDate && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Cleared Date")}
            value={order.clearedDate}
            sx={{ p: 0 }}
          />
        )}
        {order?.trackingCode && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("TrackingCode")}
            value={order.trackingCode}
            sx={{
              p: 0,
              "& p": {
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "120px",
              },
            }}
          />
        )}
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Language ISO")}
          value={order.languageIso}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Currency")}
          value={order.currency}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Currency Factor")}
          value={order.currencyFactor}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("RemoteAddress")}
          value={order.remoteAddress}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("DeviceType")}
          value={order.deviceType}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("ProportionalCalculation")}
          value={order.isProportionalCalculation ? "Yes" : "No"}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Payment Status Id")}
          value={order.paymentStatusId}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Status")}
          value={statusOptions[order?.orderStatus.position % 4].label}
          sx={{ p: 0 }}
        />
      </PropertyList>
      <Divider sx={{ my: 3 }} />
      <Typography sx={{ my: 3 }} variant="h6">
        {t("Line items")}
      </Typography>
      <Scrollbar>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t("Name")}</TableCell>
              <TableCell>{t("Quantity")}</TableCell>
              <TableCell>{t("Price")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.details?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.articleName}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {item.quantity}
                </TableCell>
                <TableCell>
                  {numeral(item.price).format(`${item.currency}0,0.00`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Typography sx={{ my: 3 }} variant="h6">
        {t("Shipping Address")}
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={order.shipping.id}
          sx={{ p: 0 }}
        />
        {order.shipping?.company && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Company")}
            value={order.shipping.company}
            sx={{ p: 0 }}
          />
        )}
        {order.shipping?.department && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Department")}
            value={order.shipping.department}
            sx={{ p: 0 }}
          />
        )}
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Salutation")}
          value={order.shipping.salutation}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Name")}
          value={`${order.shipping.firstName} ${order.shipping.lastName}`}
          sx={{ p: 0 }}
        />
        {order.shipping?.phone && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Phone")}
            value={order.shipping.phone}
            sx={{ p: 0 }}
          />
        )}

        <PropertyListItem
          align={align}
          disableGutters
          label={t("Country")}
          value={order.shipping.country.name}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Invoice Shipping TaxRate")}
          value={order.shipping.city}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Invoice Shipping Net")}
          value={order.shipping.street}
          sx={{ p: 0 }}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label={t("Additional AddressLine1")}
          value={order.shipping.additionalAddressLine1}
          sx={{ p: 0 }}
        />
        {order.shipping?.additionalAddressLine2 && (
          <PropertyListItem
            align={align}
            disableGutters
            label={t("Additional AddressLine2")}
            value={order.shipping.additionalAddressLine2}
            sx={{ p: 0 }}
          />
        )}
      </PropertyList>
    </>
  );
};

const OrderForm = (props) => {
  const { onCancel, onSave, order } = props;
  const { t } = useTranslation();

  const statusOptions = [
    {
      label: t("OPEN"),
      value: "open",
    },
    {
      label: t("COMPLETELY DELIVERED"),
      value: "completely delivered",
    },
    {
      label: t("RETURNED"),
      value: "returned",
    },
    {
      label: t("CANCELED"),
      value: "canceled",
    },
  ];

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography variant="overline" sx={{ mr: 2 }} color="textSecondary">
          Order
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            m: -1,
            "& > button": {
              m: 1,
            },
          }}
        >
          <Button
            color="primary"
            onClick={onSave}
            size="small"
            variant="contained"
          >
            Save changes
          </Button>
          <Button onClick={onCancel} size="small" variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
      <Typography sx={{ my: 3 }} variant="h6">
        Details
      </Typography>
      <TextField
        disabled
        fullWidth
        label="ID"
        margin="normal"
        name="id"
        value={order.id}
      />
      <TextField
        disabled
        fullWidth
        label="Number"
        margin="normal"
        name="number"
        value={order.number}
      />
      <TextField
        disabled
        fullWidth
        label="Customer name"
        margin="normal"
        name="customer_name"
        value={order.customer.name}
      />
      <TextField
        disabled
        fullWidth
        label="Date"
        margin="normal"
        name="date"
        value={format(getMonthDay(order.changed), "dd/MM/yyyy HH:mm")}
      />
      <TextField
        fullWidth
        label="Address"
        margin="normal"
        name="address"
        value={order.customer.address1}
      />
      <TextField
        fullWidth
        label="Country"
        margin="normal"
        name="country"
        value={order.customer.country}
      />
      <TextField
        fullWidth
        label="State/Region"
        margin="normal"
        name="state_region"
        value={order.customer.city}
      />
      <TextField
        fullWidth
        label="Total Amount"
        margin="normal"
        name="amount"
        value={order.totalAmount}
      />
      <TextField
        fullWidth
        label="Status"
        margin="normal"
        name="status"
        select
        SelectProps={{ native: true }}
        value={order.status}
      >
        {statusOptions.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </TextField>
      <Button color="error" sx={{ mt: 3 }}>
        Delete order
      </Button>
    </>
  );
};

const OrderDrawerDesktop = styled(Drawer)({
  width: 500,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    position: "relative",
    width: 500,
  },
});

const OrderDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: "100%",
  height: "calc(100% - 64px)",
  width: 500,
  "& .MuiDrawer-paper": {
    height: "calc(100% - 64px)",
    maxWidth: "100%",
    top: 64,
    width: 500,
  },
});

export const OrderDrawer: FC<OrderDrawerProps> = (props) => {
  const { containerRef, onClose, open, order, ...other } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an order is not passed.
  const content = order ? (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Link href={`/dashboard/orders/${order.id}`}>
          <Typography color="inherit" variant="h6" sx={{ cursor: "pointer" }}>
            {order.number}
          </Typography>
        </Link>
        <IconButton color="inherit" onClick={onClose}>
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 4,
        }}
      >
        {!isEditing ? (
          <OrderPreview
            onApprove={onClose}
            onEdit={handleEdit}
            onReject={onClose}
            order={order}
            lgUp={lgUp}
          />
        ) : (
          <OrderForm
            onCancel={handleCancel}
            onSave={handleCancel}
            order={order}
          />
        )}
      </Box>
    </>
  ) : null;

  if (lgUp) {
    return (
      <OrderDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </OrderDrawerDesktop>
    );
  }

  return (
    <OrderDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </OrderDrawerMobile>
  );
};

OrderDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  // @ts-ignore
  order: PropTypes.object,
};
